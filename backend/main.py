import os
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from database import get_db, init_db
from seed_data import seed_database
from ocr_engine import DocumentIntelligenceEngine
from verification_adapters import VERIFICATION_ADAPTERS
from rule_engine import ComplianceRuleEngine

app = FastAPI(
    title="TenderIQ API",
    description="AI-Powered Integrated Bid Compliance Verification Platform for GeM-style Tender Evaluation",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup: Initialize DB and Seed Data
@app.on_event("startup")
def on_startup():
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM tenders")
    count = cursor.fetchone()[0]
    conn.close()
    if count == 0:
        seed_database()

# Pydantic models for requests
class TenderCreateRequest(BaseModel):
    id: str
    title: str
    department: str
    category: str
    estimated_value: float
    submission_deadline: str
    closing_date: Optional[str] = None
    description: Optional[str] = None
    eligibility_requirements: List[str]
    required_documents: List[str]
    rules: List[Dict[str, Any]]

class OfficerDecisionRequest(BaseModel):
    bidder_id: str
    tender_id: str
    decision: str  # "Qualified", "Disqualified", "Clarification Requested", "Conditionally Qualified"
    remarks: str
    officer_name: Optional[str] = "Procurement Officer (Admin)"
    officer_role: Optional[str] = "Senior GeM Evaluator"

class ReverifyRequest(BaseModel):
    bidder_id: str
    source_key: str

# -------------------------------------------------------------
# 1. HEALTH & DEMO RESET
# -------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "TenderIQ Core Compliance Engine", "mode": "DEMO_MODE"}

@app.post("/api/reset-demo")
def reset_demo():
    seed_database()
    return {"status": "success", "message": "Demo data refreshed successfully."}

# -------------------------------------------------------------
# 2. DASHBOARD STATS & RECENT ACTIVITY
# -------------------------------------------------------------
@app.get("/api/stats")
def get_dashboard_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM tenders WHERE status = 'Active'")
    active_tenders = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM bidders WHERE compliance_status = 'Needs Review'")
    under_review = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM bidders WHERE compliance_status = 'Compliant'")
    verified_bids = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM bidders WHERE compliance_status = 'Non-Compliant'")
    flagged_bids = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM bidders WHERE risk_level IN ('HIGH', 'CRITICAL')")
    high_risk_cases = cursor.fetchone()[0]
    
    # Recent activity
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 6")
    recent_activity = [dict(row) for row in cursor.fetchall()]
    
    # Risk alerts
    cursor.execute("SELECT * FROM discrepancies ORDER BY severity ASC LIMIT 4")
    risk_alerts = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "active_tenders": active_tenders,
        "bids_under_review": under_review,
        "verified_bids": verified_bids,
        "flagged_bids": flagged_bids,
        "high_risk_cases": high_risk_cases,
        "recent_activity": recent_activity,
        "risk_alerts": risk_alerts
    }

# -------------------------------------------------------------
# 3. TENDERS APIS
# -------------------------------------------------------------
@app.get("/api/tenders")
def get_tenders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tenders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    
    tenders = []
    for r in rows:
        t = dict(r)
        t["eligibility_requirements"] = json.loads(t["eligibility_requirements"]) if t["eligibility_requirements"] else []
        t["required_documents"] = json.loads(t["required_documents"]) if t["required_documents"] else []
        t["rules"] = json.loads(t["rules"]) if t["rules"] else []
        
        # Count bidders for this tender
        cursor.execute("SELECT COUNT(*) FROM bidders WHERE tender_id = ?", (t["id"],))
        t["bidders_count"] = cursor.fetchone()[0]
        
        # Calculate verification progress %
        cursor.execute("SELECT COUNT(*) FROM bidders WHERE tender_id = ? AND compliance_status != 'Processing'", (t["id"],))
        evaluated = cursor.fetchone()[0]
        t["verification_progress"] = int((evaluated / max(1, t["bidders_count"])) * 100) if t["bidders_count"] > 0 else 0
        
        tenders.append(t)
        
    conn.close()
    return tenders

@app.get("/api/tenders/{tender_id}")
def get_tender_detail(tender_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tenders WHERE id = ?", (tender_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Tender not found")
        
    t = dict(row)
    t["eligibility_requirements"] = json.loads(t["eligibility_requirements"]) if t["eligibility_requirements"] else []
    t["required_documents"] = json.loads(t["required_documents"]) if t["required_documents"] else []
    t["rules"] = json.loads(t["rules"]) if t["rules"] else []
    
    # Get bidders for this tender
    cursor.execute("SELECT * FROM bidders WHERE tender_id = ?", (tender_id,))
    t["bidders"] = [dict(b) for b in cursor.fetchall()]
    
    conn.close()
    return t

@app.post("/api/tenders")
def create_tender(tender: TenderCreateRequest):
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    
    cursor.execute("""
    INSERT INTO tenders (id, title, department, category, estimated_value, submission_deadline, closing_date, status, description, eligibility_requirements, required_documents, rules, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tender.id, tender.title, tender.department, tender.category, tender.estimated_value,
        tender.submission_deadline, tender.closing_date, "Active", tender.description,
        json.dumps(tender.eligibility_requirements), json.dumps(tender.required_documents),
        json.dumps(tender.rules), now
    ))
    
    # Add audit log
    cursor.execute("""
    INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, tender_id, verification_type, result, details, ip_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f"AUD-{int(time.time())}", now, "Procurement Officer (Admin)", "Senior GeM Evaluator",
        "Created New Tender & Published Compliance Rules", tender.id, "Tender Configuration",
        "Published", f"Configured {len(tender.rules)} automated compliance rules and {len(tender.required_documents)} required documents.",
        "192.168.1.42"
    ))
    
    conn.commit()
    conn.close()
    return {"status": "success", "id": tender.id, "message": "Tender created successfully"}

# -------------------------------------------------------------
# 4. BIDDERS APIS
# -------------------------------------------------------------
@app.get("/api/bidders")
def get_bidders(tender_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    
    if tender_id:
        cursor.execute("SELECT * FROM bidders WHERE tender_id = ?", (tender_id,))
    else:
        cursor.execute("SELECT * FROM bidders")
        
    bidders = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return bidders

@app.get("/api/bidders/{bidder_id}")
def get_bidder_detail(bidder_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM bidders WHERE id = ?", (bidder_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Bidder not found")
        
    bidder = dict(row)
    
    # Get associated tender info
    cursor.execute("SELECT * FROM tenders WHERE id = ?", (bidder["tender_id"],))
    tender_row = cursor.fetchone()
    if tender_row:
        tender_dict = dict(tender_row)
        tender_dict["rules"] = json.loads(tender_dict["rules"]) if tender_dict["rules"] else []
        tender_dict["eligibility_requirements"] = json.loads(tender_dict["eligibility_requirements"]) if tender_dict["eligibility_requirements"] else []
        tender_dict["required_documents"] = json.loads(tender_dict["required_documents"]) if tender_dict["required_documents"] else []
        bidder["tender"] = tender_dict
        
    # Get document count
    cursor.execute("SELECT COUNT(*) FROM documents WHERE bidder_id = ?", (bidder_id,))
    bidder["documents_count"] = cursor.fetchone()[0]
    
    # Get discrepancy count
    cursor.execute("SELECT COUNT(*) FROM discrepancies WHERE bidder_id = ?", (bidder_id,))
    bidder["discrepancies_count"] = cursor.fetchone()[0]
    
    conn.close()
    return bidder

# -------------------------------------------------------------
# 5. DOCUMENTS & AI OCR INTELLIGENCE APIS
# -------------------------------------------------------------
@app.get("/api/documents")
def get_documents(bidder_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents WHERE bidder_id = ? ORDER BY upload_timestamp DESC", (bidder_id,))
    rows = cursor.fetchall()
    
    docs = []
    for r in rows:
        d = dict(r)
        d["extracted_data"] = json.loads(d["extracted_data"]) if d["extracted_data"] else {}
        d["extracted_fields_list"] = json.loads(d["extracted_fields_list"]) if d["extracted_fields_list"] else []
        docs.append(d)
        
    conn.close()
    return docs

@app.post("/api/documents/upload")
async def upload_document(
    bidder_id: str = Form(...),
    tender_id: str = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...)
):
    # Simulate processing pipeline with AI Document Intelligence Engine
    processed_result = DocumentIntelligenceEngine.process_document(file.filename, doc_type)
    
    doc_id = f"DOC-{int(time.time())}-{random_suffix()}"
    now = datetime.now(timezone.utc).isoformat()
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO documents (id, bidder_id, tender_id, doc_type, file_name, file_size_kb, upload_timestamp, processing_status, ocr_confidence, classification, extracted_data, extracted_fields_list, file_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        doc_id, bidder_id, tender_id, processed_result["doc_type"], file.filename,
        round(random.uniform(250.0, 950.0), 1), now, "Processed",
        processed_result["ocr_confidence"], processed_result["classification"],
        json.dumps(processed_result["extracted_data"]),
        json.dumps(processed_result["extracted_fields_list"]),
        f"/api/documents/{doc_id}/preview"
    ))
    
    # Add audit log
    cursor.execute("""
    INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, bidder_id, tender_id, verification_type, result, details, ip_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f"AUD-{int(time.time())}", now, "Procurement Officer", "Senior GeM Evaluator",
        f"Uploaded & Extracted: {processed_result['doc_type']}", bidder_id, tender_id,
        "Document Ingestion & OCR", f"Confidence: {processed_result['ocr_confidence']}%",
        f"File '{file.filename}' classified as {processed_result['classification']}.",
        "192.168.1.42"
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "doc_id": doc_id,
        "processed_data": processed_result
    }

def random_suffix():
    import random, string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))

# -------------------------------------------------------------
# 6. VERIFICATION SOURCES APIS (MODULAR ADAPTERS)
# -------------------------------------------------------------
@app.get("/api/verification")
def get_verification_sources(bidder_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM verification_sources WHERE bidder_id = ?", (bidder_id,))
    rows = cursor.fetchall()
    
    sources = []
    for r in rows:
        s = dict(r)
        s["raw_response"] = json.loads(s["raw_response"]) if s["raw_response"] else {}
        sources.append(s)
        
    conn.close()
    return sources

@app.post("/api/verification/reverify")
def reverify_source(req: ReverifyRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM bidders WHERE id = ?", (req.bidder_id,))
    bidder_row = cursor.fetchone()
    if not bidder_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Bidder not found")
        
    bidder = dict(bidder_row)
    adapter = VERIFICATION_ADAPTERS.get(req.source_key, VERIFICATION_ADAPTERS["GST"])
    
    result = adapter.verify({
        "gstin": bidder["gstin"],
        "pan": bidder["pan"],
        "udyam_number": bidder["udyam_number"],
        "legal_name": bidder["legal_name"]
    })
    
    now = datetime.now(timezone.utc).isoformat()
    
    cursor.execute("""
    UPDATE verification_sources
    SET verification_status = ?, last_checked = ?, evidence_summary = ?, raw_response = ?
    WHERE bidder_id = ? AND source_key = ?
    """, (
        result["status"], now, result["evidence"], json.dumps(result["data"]),
        req.bidder_id, req.source_key
    ))
    
    # Audit log
    cursor.execute("""
    INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, bidder_id, bidder_name, verification_type, result, details, ip_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f"AUD-{int(time.time())}", now, "TenderIQ Verification Bridge", "Automated Registry Adapter",
        f"Live Adapter Re-Check: {result['source']}", req.bidder_id, bidder["company_name"],
        "Registry Cross-Check", result["status"], result["evidence"], "Adapter [Sandbox-Direct]"
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "result": result,
        "timestamp": now
    }

# -------------------------------------------------------------
# 7. COMPLIANCE ENGINE & "WHY THIS RESULT?" APIS
# -------------------------------------------------------------
@app.get("/api/compliance")
def get_compliance_matrix(bidder_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM compliance_evaluations WHERE bidder_id = ?", (bidder_id,))
    rows = cursor.fetchall()
    
    evaluations = []
    for r in rows:
        e = dict(r)
        e["why_explanation"] = json.loads(e["why_explanation"]) if e["why_explanation"] else {}
        evaluations.append(e)
        
    # Get bidder score & risk
    cursor.execute("SELECT overall_score, risk_level, compliance_status FROM bidders WHERE id = ?", (bidder_id,))
    b = cursor.fetchone()
    
    conn.close()
    
    return {
        "bidder_id": bidder_id,
        "overall_score": b["overall_score"] if b else 0,
        "risk_level": b["risk_level"] if b else "MEDIUM",
        "compliance_status": b["compliance_status"] if b else "Processing",
        "evaluations": evaluations
    }

@app.get("/api/compliance/why/{evaluation_id}")
def get_why_explanation(evaluation_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM compliance_evaluations WHERE id = ?", (evaluation_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Compliance evaluation not found")
        
    e = dict(row)
    e["why_explanation"] = json.loads(e["why_explanation"]) if e["why_explanation"] else {}
    return e

# -------------------------------------------------------------
# 8. DISCREPANCIES APIS
# -------------------------------------------------------------
@app.get("/api/discrepancies")
def get_discrepancies(bidder_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if bidder_id:
        cursor.execute("SELECT * FROM discrepancies WHERE bidder_id = ?", (bidder_id,))
    else:
        cursor.execute("SELECT * FROM discrepancies")
        
    discrepancies = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return discrepancies

# -------------------------------------------------------------
# 9. AUDIT TRAIL APIS
# -------------------------------------------------------------
@app.get("/api/audit")
def get_audit_trail(bidder_id: Optional[str] = None, tender_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM audit_logs WHERE 1=1"
    params = []
    
    if bidder_id:
        query += " AND bidder_id = ?"
        params.append(bidder_id)
    if tender_id:
        query += " AND tender_id = ?"
        params.append(tender_id)
        
    query += " ORDER BY timestamp DESC LIMIT 50"
    cursor.execute(query, params)
    
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return logs

# -------------------------------------------------------------
# 10. PROCUREMENT OFFICER DECISION API
# -------------------------------------------------------------
@app.post("/api/decisions")
def record_officer_decision(req: OfficerDecisionRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM bidders WHERE id = ?", (req.bidder_id,))
    bidder_row = cursor.fetchone()
    if not bidder_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Bidder not found")
        
    bidder = dict(bidder_row)
    now = datetime.now(timezone.utc).isoformat()
    
    # Map decision to compliance status
    status_map = {
        "Qualified": "Compliant",
        "Disqualified": "Non-Compliant",
        "Clarification Requested": "Needs Review",
        "Conditionally Qualified": "Compliant"
    }
    new_compliance_status = status_map.get(req.decision, bidder["compliance_status"])
    
    cursor.execute("""
    UPDATE bidders
    SET officer_decision = ?, decision_remarks = ?, decision_timestamp = ?, compliance_status = ?
    WHERE id = ?
    """, (req.decision, req.remarks, now, new_compliance_status, req.bidder_id))
    
    # Record in immutable Audit Trail
    cursor.execute("""
    INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, bidder_id, bidder_name, tender_id, verification_type, result, details, ip_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f"AUD-{int(time.time())}", now, req.officer_name, req.officer_role,
        f"Officer Final Evaluation Decision: {req.decision}", req.bidder_id, bidder["company_name"],
        req.tender_id, "Evaluation Decision", req.decision,
        f"Remarks: {req.remarks}", "192.168.1.42 [Officer Digital Signoff]"
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "decision": req.decision,
        "new_status": new_compliance_status,
        "timestamp": now,
        "message": f"Officer decision '{req.decision}' recorded to tamper-evident audit trail."
    }
