import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from database import get_db, init_db

def seed_database():
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if tenders already exist
    cursor.execute("SELECT COUNT(*) FROM tenders")
    if cursor.fetchone()[0] > 0:
        print("Database already contains data. Refreshing seed data...")
        cursor.execute("DELETE FROM tenders")
        cursor.execute("DELETE FROM bidders")
        cursor.execute("DELETE FROM documents")
        cursor.execute("DELETE FROM verification_sources")
        cursor.execute("DELETE FROM compliance_evaluations")
        cursor.execute("DELETE FROM discrepancies")
        cursor.execute("DELETE FROM audit_logs")
    
    now = datetime.now(timezone.utc).isoformat()
    
    # -------------------------------------------------------------
    # 1. TENDERS
    # -------------------------------------------------------------
    tenders = [
        {
            "id": "GEM/2026/B/901248",
            "title": "Procurement of High-Performance Scalable Cloud Server Hardware & Virtualization Cluster",
            "department": "Ministry of Electronics & Information Technology (MeitY)",
            "category": "Goods / IT Hardware",
            "estimated_value": 45000000.0,
            "submission_deadline": "2026-10-15T17:00:00Z",
            "closing_date": "2026-10-18T18:00:00Z",
            "status": "Active",
            "description": "Supply, installation, and 5-year comprehensive on-site OEM warranty for blade servers, SAN storage array, and hyperconverged infrastructure for National Data Center.",
            "eligibility_requirements": json.dumps([
                "Bidder must have valid GST registration with active filing status",
                "Bidder must have valid Udyam Registration (Micro/Small/Medium)",
                "Minimum average annual financial turnover of ₹2.50 Cr for last 3 financial years",
                "Make in India (MII) Class-I local content minimum 50%",
                "OEM Authorization letter with registered serial authorization number",
                "Bidder must not be debarred or blacklisted on GeM or any Central/State Ministry",
                "EPFO and ESIC active compliance with minimum 25 on-roll personnel"
            ]),
            "required_documents": json.dumps([
                "GST Registration Certificate (Form REG-06)",
                "Udyam MSME Registration Certificate",
                "PAN Card & 3 Years ITR Acknowledgement",
                "OEM Authorization Certificate & Undertaking",
                "Make in India (Class-I) Self-Declaration Certificate",
                "CA Certified Turnover Certificate with UDIN",
                "EPFO Electronic Challan Return (ECR) & ESIC Receipt",
                "Non-Debarment and Solvency Affidavit"
            ]),
            "rules": json.dumps([
                {"rule_id": "RUL-GST-01", "name": "GST Active Status", "field": "gstin_status", "operator": "EQUALS", "value": "ACTIVE", "mandatory": True, "weight": 15},
                {"rule_id": "RUL-UDY-02", "name": "Udyam Registration", "field": "udyam_status", "operator": "EQUALS", "value": "ACTIVE", "mandatory": True, "weight": 15},
                {"rule_id": "RUL-TUR-03", "name": "Minimum Annual Turnover", "field": "turnover_cr", "operator": "GREATER_THAN_OR_EQUAL", "value": 2.5, "mandatory": True, "weight": 20},
                {"rule_id": "RUL-MII-04", "name": "Make in India Local Content", "field": "local_content_pct", "operator": "GREATER_THAN_OR_EQUAL", "value": 50, "mandatory": True, "weight": 15},
                {"rule_id": "RUL-OEM-05", "name": "OEM Authorization Valid", "field": "oem_auth_valid", "operator": "EQUALS", "value": True, "mandatory": True, "weight": 15},
                {"rule_id": "RUL-DEB-06", "name": "Non-Debarment Clearance", "field": "is_blacklisted", "operator": "EQUALS", "value": False, "mandatory": True, "weight": 10},
                {"rule_id": "RUL-EPF-07", "name": "EPFO/ESIC Compliance", "field": "epfo_active", "operator": "EQUALS", "value": True, "mandatory": False, "weight": 10}
            ]),
            "created_at": "2026-09-10T10:00:00Z"
        },
        {
            "id": "GEM/2026/B/774129",
            "title": "Deployment of Smart City Environmental IoT Sensor Network & Central Command Dashboard",
            "department": "Ministry of Housing and Urban Affairs (MoHUA)",
            "category": "Works & Turnkey IT Services",
            "estimated_value": 28000000.0,
            "submission_deadline": "2026-10-22T15:00:00Z",
            "closing_date": "2026-10-25T17:00:00Z",
            "status": "Active",
            "description": "City-wide deployment of 250 PM2.5/PM10 air quality and noise monitoring stations with solar backup, cloud ingestion APIs, and command center visualization.",
            "eligibility_requirements": json.dumps([
                "Valid GSTIN and PAN",
                "ISO 9001 and ISO 27001 Certification",
                "Minimum 3 years past experience in municipal IoT deployments",
                "Turnover >= ₹1.5 Cr",
                "No past arbitration default"
            ]),
            "required_documents": json.dumps([
                "GST Certificate", "PAN Card", "Work Experience Certificates", "ISO Certificates", "Turnover Balance Sheets"
            ]),
            "rules": json.dumps([
                {"rule_id": "RUL-GST-01", "name": "GST Active", "field": "gstin_status", "operator": "EQUALS", "value": "ACTIVE", "mandatory": True, "weight": 25},
                {"rule_id": "RUL-TUR-01", "name": "Turnover >= 1.5 Cr", "field": "turnover_cr", "operator": "GREATER_THAN_OR_EQUAL", "value": 1.5, "mandatory": True, "weight": 25},
                {"rule_id": "RUL-ISO-01", "name": "ISO 27001 Valid", "field": "iso_certified", "operator": "EQUALS", "value": True, "mandatory": True, "weight": 25},
                {"rule_id": "RUL-DEB-01", "name": "No Debarment", "field": "is_blacklisted", "operator": "EQUALS", "value": False, "mandatory": True, "weight": 25}
            ]),
            "created_at": "2026-09-12T11:30:00Z"
        },
        {
            "id": "GEM/2026/B/551982",
            "title": "Automated Digital Train Control and Fail-Safe Signalling Sub-Systems",
            "department": "Ministry of Railways (RDSO Certified)",
            "category": "Goods / Railway Engineering",
            "estimated_value": 120000000.0,
            "submission_deadline": "2026-11-05T14:00:00Z",
            "closing_date": "2026-11-08T16:00:00Z",
            "status": "Active",
            "description": "Supply of SIL-4 compliant Electronic Interlocking systems and Kavach-ready on-board loco safety equipment.",
            "eligibility_requirements": json.dumps([
                "RDSO Approved vendor registration",
                "SIL-4 Safety Certificate",
                "Class-I MII Local Content >= 60%",
                "Turnover >= ₹10.0 Cr"
            ]),
            "required_documents": json.dumps([
                "RDSO Approval Copy", "SIL-4 Certification", "GST & PAN", "MII Declaration", "CA Audit Report"
            ]),
            "rules": json.dumps([
                {"rule_id": "RUL-RDSO-01", "name": "RDSO Approval", "field": "rdso_approved", "operator": "EQUALS", "value": True, "mandatory": True, "weight": 40},
                {"rule_id": "RUL-MII-01", "name": "Local Content >= 60%", "field": "local_content_pct", "operator": "GREATER_THAN_OR_EQUAL", "value": 60, "mandatory": True, "weight": 30},
                {"rule_id": "RUL-GST-01", "name": "Active GSTIN", "field": "gstin_status", "operator": "EQUALS", "value": "ACTIVE", "mandatory": True, "weight": 30}
            ]),
            "created_at": "2026-09-15T09:00:00Z"
        },
        {
            "id": "GEM/2026/B/332190",
            "title": "Facility Management & Cyber Threat Intelligence Managed Services",
            "department": "Department of Defence Production",
            "category": "Services",
            "estimated_value": 15000000.0,
            "submission_deadline": "2026-10-30T16:00:00Z",
            "closing_date": "2026-11-02T17:00:00Z",
            "status": "Active",
            "description": "24x7 Security Operations Center (SOC) monitoring, SIEM log analysis, and incident response personnel.",
            "eligibility_requirements": json.dumps([
                "CERT-In Empanelled Information Security Auditing Organization",
                "CMMI Level 3 or higher",
                "Turnover >= ₹2.0 Cr"
            ]),
            "required_documents": json.dumps(["CERT-In Empanelment", "CMMI Certificate", "GST & PAN", "Security Clearance Undertaking"]),
            "rules": json.dumps([
                {"rule_id": "RUL-CERT-01", "name": "CERT-In Empanelled", "field": "cert_in_empanelled", "operator": "EQUALS", "value": True, "mandatory": True, "weight": 50},
                {"rule_id": "RUL-GST-01", "name": "GST Active", "field": "gstin_status", "operator": "EQUALS", "value": "ACTIVE", "mandatory": True, "weight": 50}
            ]),
            "created_at": "2026-09-18T14:20:00Z"
        }
    ]
    
    for t in tenders:
        cursor.execute("""
        INSERT INTO tenders (id, title, department, category, estimated_value, submission_deadline, closing_date, status, description, eligibility_requirements, required_documents, rules, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t["id"], t["title"], t["department"], t["category"], t["estimated_value"],
            t["submission_deadline"], t["closing_date"], t["status"], t["description"],
            t["eligibility_requirements"], t["required_documents"], t["rules"], t["created_at"]
        ))
        
    # -------------------------------------------------------------
    # 2. BIDDERS (for main tender GEM/2026/B/901248)
    # -------------------------------------------------------------
    bidders = [
        {
            "id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "company_name": "ABC Technologies Pvt. Ltd.",
            "legal_name": "ABC Technology Private Limited",
            "cin": "U72200KA2018PTC112345",
            "pan": "ABCDE1234F",
            "gstin": "29ABCDE1234F1Z5",
            "udyam_number": "UDYAM-KR-03-0019284",
            "epfo_code": "KN/BNG/0045982/000",
            "contact_person": "Vikramaditya Sharma (Director of Bid Strategy)",
            "email": "procurement-bids@abctechnologies-india.com",
            "phone": "+91 98450 12890",
            "address": "Plot 42, Electronics City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100",
            "overall_score": 92,
            "risk_level": "MEDIUM",
            "compliance_status": "Needs Review",
            "officer_decision": "Pending Review",
            "decision_remarks": "Entity name matches closely with MCA incorporation record; requires clarification on OEM authorized signatory stamp.",
            "decision_timestamp": None
        },
        {
            "id": "BID-NOVA-02",
            "tender_id": "GEM/2026/B/901248",
            "company_name": "Nova Infra Solutions Ltd.",
            "legal_name": "Nova Infra Solutions Limited",
            "cin": "L45200MH2015PLC267890",
            "pan": "AAACN1234K",
            "gstin": "27AAACN1234K1ZV",
            "udyam_number": "UDYAM-MH-01-0087654",
            "epfo_code": "MH/PUN/0089123/000",
            "contact_person": "Pooja Deshmukh (Head of Govt Verticals)",
            "email": "tenders@novainfra.co.in",
            "phone": "+91 98220 99411",
            "address": "Nova Towers, Senapati Bapat Marg, Shivaji Nagar, Pune, Maharashtra - 411016",
            "overall_score": 98,
            "risk_level": "LOW",
            "compliance_status": "Compliant",
            "officer_decision": "Qualified",
            "decision_remarks": "All 8 statutory document checks passed without discrepancy. Local content verified at 68%. Recommended for commercial opening.",
            "decision_timestamp": "2026-09-24T14:30:00Z"
        },
        {
            "id": "BID-BHARAT-03",
            "tender_id": "GEM/2026/B/901248",
            "company_name": "Bharat Digital Systems LLP",
            "legal_name": "Bharat Digital Systems LLP",
            "cin": "AAY-9876",
            "pan": "AABCB9999M",
            "gstin": "07AABCB9999M1ZQ",
            "udyam_number": "UDYAM-DL-02-0045612",
            "epfo_code": "DL/CPM/0034120/000",
            "contact_person": "Rajeshwar Aggarwal (Managing Partner)",
            "email": "tenders@bharatdigital-systems.in",
            "phone": "+91 98110 54321",
            "address": "B-14, Barakhamba Road, Connaught Place, New Delhi - 110001",
            "overall_score": 54,
            "risk_level": "HIGH",
            "compliance_status": "High Risk",
            "officer_decision": "Disqualified",
            "decision_remarks": "Bidder flagged in Central Debarment database for contract non-performance in state tender; GST filings non-compliant for last 2 quarters.",
            "decision_timestamp": "2026-09-23T11:15:00Z"
        },
        {
            "id": "BID-VERTEX-04",
            "tender_id": "GEM/2026/B/901248",
            "company_name": "Vertex Engineering Pvt. Ltd.",
            "legal_name": "Vertex Engineering Private Limited",
            "cin": "U29100TN2012PTC087123",
            "pan": "AABCV5555L",
            "gstin": "33AABCV5555L1Z8",
            "udyam_number": "UDYAM-TN-02-0099123",
            "epfo_code": "TN/MAS/0067431/000",
            "contact_person": "Karthik Subramanian (COO)",
            "email": "gem-desk@vertexengineering.in",
            "phone": "+91 94440 88712",
            "address": "5/12 Mount Road, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032",
            "overall_score": 42,
            "risk_level": "CRITICAL",
            "compliance_status": "Non-Compliant",
            "officer_decision": "Pending Review",
            "decision_remarks": None,
            "decision_timestamp": None
        }
    ]
    
    for b in bidders:
        cursor.execute("""
        INSERT INTO bidders (id, tender_id, company_name, legal_name, cin, pan, gstin, udyam_number, epfo_code, contact_person, email, phone, address, overall_score, risk_level, compliance_status, officer_decision, decision_remarks, decision_timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            b["id"], b["tender_id"], b["company_name"], b["legal_name"], b["cin"], b["pan"],
            b["gstin"], b["udyam_number"], b["epfo_code"], b["contact_person"], b["email"],
            b["phone"], b["address"], b["overall_score"], b["risk_level"], b["compliance_status"],
            b["officer_decision"], b["decision_remarks"], b["decision_timestamp"]
        ))
        
    # -------------------------------------------------------------
    # 3. DOCUMENTS (for ABC Technologies BID-ABC-01)
    # -------------------------------------------------------------
    documents = [
        {
            "id": "DOC-ABC-GST",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "doc_type": "GST Certificate (REG-06)",
            "file_name": "GST_REG06_Certificate_ABC_Tech.pdf",
            "file_size_kb": 348.5,
            "upload_timestamp": "2026-09-20T10:14:22Z",
            "processing_status": "Processed",
            "ocr_confidence": 97.8,
            "classification": "Statutory / Indirect Tax Registration",
            "extracted_data": json.dumps({
                "gstin": "29ABCDE1234F1Z5",
                "legal_name": "ABC Technology Private Limited",
                "trade_name": "ABC Technologies",
                "constitution_of_business": "Private Limited Company",
                "date_of_liability": "2018-04-01",
                "period_of_validity": "From 01/04/2018 To Perpetual",
                "type_of_registration": "Regular Taxpayer",
                "principal_place_of_business": "Plot 42, Electronics City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100",
                "approving_authority": "Assistant Commissioner, Bengaluru Ward-3",
                "date_of_issue": "2018-04-12"
            }),
            "extracted_fields_list": json.dumps([
                {"field": "GSTIN", "value": "29ABCDE1234F1Z5", "confidence": 99.4, "status": "MATCHED"},
                {"field": "Legal Name", "value": "ABC Technology Private Limited", "confidence": 98.1, "status": "MINOR_NAME_DELTA"},
                {"field": "Trade Name", "value": "ABC Technologies", "confidence": 97.5, "status": "MATCHED"},
                {"field": "Registration Type", "value": "Regular Taxpayer", "confidence": 99.0, "status": "MATCHED"},
                {"field": "Registration Date", "value": "12/04/2018", "confidence": 96.8, "status": "MATCHED"}
            ]),
            "file_url": "/api/documents/DOC-ABC-GST/preview"
        },
        {
            "id": "DOC-ABC-UDYAM",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "doc_type": "Udyam MSME Certificate",
            "file_name": "Udyam_Registration_Certificate_2026.pdf",
            "file_size_kb": 412.0,
            "upload_timestamp": "2026-09-20T10:15:05Z",
            "processing_status": "Processed",
            "ocr_confidence": 98.4,
            "classification": "SME / MSME Classification",
            "extracted_data": json.dumps({
                "udyam_reg_number": "UDYAM-KR-03-0019284",
                "name_of_enterprise": "ABC TECHNOLOGIES PRIVATE LIMITED",
                "enterprise_type": "Medium Enterprise",
                "major_activity": "Services and IT Manufacturing Integration",
                "nic_5_digit_codes": ["62011 - Writing, modifying, testing computer program", "26201 - Manufacture of micro/mini/mainframe computers"],
                "date_of_incorporation": "2018-03-15",
                "date_of_udyam_reg": "2020-08-20",
                "dic_name": "BENGALURU URBAN"
            }),
            "extracted_fields_list": json.dumps([
                {"field": "Udyam Number", "value": "UDYAM-KR-03-0019284", "confidence": 99.8, "status": "MATCHED"},
                {"field": "Enterprise Type", "value": "Medium", "confidence": 98.6, "status": "MATCHED"},
                {"field": "Major Activity", "value": "IT Hardware / Services", "confidence": 97.2, "status": "MATCHED"},
                {"field": "Status", "value": "Active", "confidence": 98.0, "status": "MATCHED"}
            ]),
            "file_url": "/api/documents/DOC-ABC-UDYAM/preview"
        },
        {
            "id": "DOC-ABC-PAN",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "doc_type": "PAN & 3Y ITR Acknowledgement",
            "file_name": "ITR_V_Acknowledgement_FY23_24_25.pdf",
            "file_size_kb": 890.2,
            "upload_timestamp": "2026-09-20T10:16:10Z",
            "processing_status": "Processed",
            "ocr_confidence": 96.1,
            "classification": "Income Tax / Direct Tax Filing",
            "extracted_data": json.dumps({
                "pan": "ABCDE1234F",
                "assessing_officer": "IT Circle 2(1) Bengaluru",
                "assessment_years": ["2023-24", "2024-25", "2025-26"],
                "form_type": "ITR-6 (Companies other than claiming exemption u/s 11)",
                "total_income_ay25": "₹ 1,42,80,000",
                "gross_turnover_ay25": "₹ 4,85,50,000",
                "gross_turnover_ay24": "₹ 4,12,00,000",
                "gross_turnover_ay23": "₹ 3,60,00,000",
                "average_3y_turnover": "₹ 4.19 Cr",
                "e_verification_ack_no": "90812344556601"
            }),
            "extracted_fields_list": json.dumps([
                {"field": "PAN Number", "value": "ABCDE1234F", "confidence": 99.5, "status": "MATCHED"},
                {"field": "Average 3Y Turnover", "value": "₹ 4.19 Cr", "confidence": 95.8, "status": "PASS (Req: ₹2.5 Cr)"},
                {"field": "Filing Status", "value": "e-Verified", "confidence": 98.2, "status": "PASS"},
                {"field": "Section 206AB Compliance", "value": "Compliant (Non-Specified)", "confidence": 96.0, "status": "PASS"}
            ]),
            "file_url": "/api/documents/DOC-ABC-PAN/preview"
        },
        {
            "id": "DOC-ABC-OEM",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "doc_type": "OEM Authorization (MAF)",
            "file_name": "OEM_Authorization_Letter_CyberEnterprise_Hardware.pdf",
            "file_size_kb": 520.4,
            "upload_timestamp": "2026-09-20T10:17:40Z",
            "processing_status": "Processed",
            "ocr_confidence": 91.2,
            "classification": "Manufacturer Authorization Form",
            "extracted_data": json.dumps({
                "oem_name": "CyberEnterprise Global Systems India Pvt. Ltd.",
                "tender_ref_cited": "GEM/2026/B/901248",
                "authorized_partner": "ABC Technologies Pvt. Ltd.",
                "validity_period": "Till 31st March 2027",
                "support_warranty_commitment": "5 Years On-site 24x7 4Hr Response",
                "signatory_name": "Sunil Varma (VP Enterprise Sales)",
                "signatory_stamp_detected": "Partially Blurred / Missing Ink Seal",
                "oem_cin": "U30007DL2010PTC201889"
            }),
            "extracted_fields_list": json.dumps([
                {"field": "OEM Brand", "value": "CyberEnterprise Global Systems", "confidence": 94.2, "status": "MATCHED"},
                {"field": "Tender Reference", "value": "GEM/2026/B/901248", "confidence": 96.0, "status": "MATCHED"},
                {"field": "Warranty Commitment", "value": "5 Years On-site", "confidence": 93.5, "status": "MATCHED"},
                {"field": "Authorized Seal & Signature", "value": "Signature Present / Ink Stamp Indistinct", "confidence": 84.1, "status": "REVIEW_FLAG"}
            ]),
            "file_url": "/api/documents/DOC-ABC-OEM/preview"
        },
        {
            "id": "DOC-ABC-MII",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "doc_type": "Make in India (MII) Declaration",
            "file_name": "MII_Class1_Local_Content_Self_Declaration.pdf",
            "file_size_kb": 290.0,
            "upload_timestamp": "2026-09-20T10:18:25Z",
            "processing_status": "Processed",
            "ocr_confidence": 98.9,
            "classification": "Statutory / DPIIT Public Procurement Order",
            "extracted_data": json.dumps({
                "classification_category": "Class-I Local Supplier",
                "claimed_local_content_pct": "64.50%",
                "tender_requirement": "50.00%",
                "location_of_local_value_addition": "Plot 19B, Peenya Industrial Area, Bengaluru, Karnataka",
                "certifying_authority": "Chartered Engineer & Authorized Director"
            }),
            "extracted_fields_list": json.dumps([
                {"field": "Supplier Category", "value": "Class-I Local Supplier", "confidence": 99.1, "status": "PASS"},
                {"field": "Local Content %", "value": "64.50%", "confidence": 98.7, "status": "PASS (Req: >=50%)"},
                {"field": "Location of Value Addition", "value": "Peenya, Bengaluru", "confidence": 97.4, "status": "VERIFIED"}
            ]),
            "file_url": "/api/documents/DOC-ABC-MII/preview"
        },
        {
            "id": "DOC-ABC-EPF",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "doc_type": "EPFO ECR / ESIC Challan",
            "file_name": "EPFO_ECR_Receipt_August_2026.pdf",
            "file_size_kb": 315.7,
            "upload_timestamp": "2026-09-20T10:19:15Z",
            "processing_status": "Processed",
            "ocr_confidence": 97.3,
            "classification": "Labor Law Compliance",
            "extracted_data": json.dumps({
                "establishment_id": "KN/BNG/0045982/000",
                "wage_month": "August 2026",
                "total_contributing_members": "68",
                "total_amount_paid": "₹ 3,42,890",
                "transaction_status": "Payment Confirmed via SBI e-Pay",
                "crn_number": "08260019284"
            }),
            "extracted_fields_list": json.dumps([
                {"field": "Establishment Code", "value": "KN/BNG/0045982/000", "confidence": 98.8, "status": "MATCHED"},
                {"field": "Active Employees", "value": "68 Personnel", "confidence": 97.5, "status": "PASS (Req: >=25)"},
                {"field": "Challan Payment Status", "value": "Confirmed", "confidence": 99.0, "status": "PASS"}
            ]),
            "file_url": "/api/documents/DOC-ABC-EPF/preview"
        }
    ]
    
    for d in documents:
        cursor.execute("""
        INSERT INTO documents (id, bidder_id, tender_id, doc_type, file_name, file_size_kb, upload_timestamp, processing_status, ocr_confidence, classification, extracted_data, extracted_fields_list, file_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            d["id"], d["bidder_id"], d["tender_id"], d["doc_type"], d["file_name"], d["file_size_kb"],
            d["upload_timestamp"], d["processing_status"], d["ocr_confidence"], d["classification"],
            d["extracted_data"], d["extracted_fields_list"], d["file_url"]
        ))
        
    # -------------------------------------------------------------
    # 4. VERIFICATION SOURCES DATA (8 Sources for ABC Technologies)
    # -------------------------------------------------------------
    verification_sources = [
        {
            "id": "VS-ABC-GST",
            "bidder_id": "BID-ABC-01",
            "source_key": "GST",
            "source_name": "GST Common Portal (GSTN)",
            "verification_status": "VERIFIED_ACTIVE",
            "last_checked": "2026-09-21T08:30:12Z",
            "evidence_summary": "GSTIN 29ABCDE1234F1Z5 is ACTIVE. Taxpayer type: Regular. GSTR-3B & GSTR-1 filed consistently without delay up to July 2026.",
            "raw_response": json.dumps({
                "gstin": "29ABCDE1234F1Z5",
                "legalName": "ABC TECHNOLOGY PRIVATE LIMITED",
                "tradeName": "ABC TECHNOLOGIES",
                "status": "Active",
                "taxpayerType": "Regular",
                "stateJurisdiction": "Ward-3, Bengaluru Central, Karnataka",
                "complianceRating": "10/10",
                "einvoiceEnabled": True,
                "eWayBillBlocked": False,
                "last3Returns": [
                    {"returnType": "GSTR3B", "period": "072026", "status": "Filed", "filedDate": "2026-08-18"},
                    {"returnType": "GSTR1", "period": "072026", "status": "Filed", "filedDate": "2026-08-10"},
                    {"returnType": "GSTR3B", "period": "062026", "status": "Filed", "filedDate": "2026-07-19"}
                ]
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-UDYAM",
            "bidder_id": "BID-ABC-01",
            "source_key": "UDYAM",
            "source_name": "Udyam MSME Registry (Ministry of MSME)",
            "verification_status": "VERIFIED_ACTIVE",
            "last_checked": "2026-09-21T08:30:15Z",
            "evidence_summary": "UDYAM-KR-03-0019284 verified. Classification: Medium Enterprise. Major Activity: Services & Manufacturing. DIC: Bengaluru Urban.",
            "raw_response": json.dumps({
                "udyamNumber": "UDYAM-KR-03-0019284",
                "enterpriseName": "ABC TECHNOLOGY PRIVATE LIMITED",
                "classification": "Medium",
                "majorActivity": "Services / IT Manufacturing",
                "validity": "Active & Valid",
                "womenOwned": False,
                "scstOwned": False,
                "registeredAddress": "Plot 42, Electronics City Phase 1, Hosur Road, Bengaluru",
                "appliedDate": "2020-08-20"
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-PAN",
            "bidder_id": "BID-ABC-01",
            "source_key": "INCOME_TAX",
            "source_name": "Income Tax Department (e-Filing API)",
            "verification_status": "VERIFIED_COMPLIANT",
            "last_checked": "2026-09-21T08:30:18Z",
            "evidence_summary": "PAN ABCDE1234F is ACTIVE and linked with Aadhaar/CIN. 3 Years ITR filed under Form ITR-6. Section 206AB Higher TDS check: Non-specified (Compliant).",
            "raw_response": json.dumps({
                "pan": "ABCDE1234F",
                "panStatus": "Active & In Use",
                "nameOnPan": "ABC TECHNOLOGY PRIVATE LIMITED",
                "panCategory": "Company",
                "itrFilingHistory": [
                    {"ay": "2025-26", "form": "ITR-6", "grossTurnover": 48550000, "ackDate": "2026-07-28"},
                    {"ay": "2024-25", "form": "ITR-6", "grossTurnover": 41200000, "ackDate": "2025-08-14"},
                    {"ay": "2023-24", "form": "ITR-6", "grossTurnover": 36000000, "ackDate": "2024-09-02"}
                ],
                "averageTurnover": 41916666.67,
                "sec206AB_Applicable": False
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-MCA",
            "bidder_id": "BID-ABC-01",
            "source_key": "MCA21",
            "source_name": "Ministry of Corporate Affairs (MCA21)",
            "verification_status": "VERIFIED_ACTIVE",
            "last_checked": "2026-09-21T08:30:22Z",
            "evidence_summary": "CIN U72200KA2018PTC112345 active. Paid-up capital ₹1.00 Cr. Authorized capital ₹2.00 Cr. Active Directors DIN verified.",
            "raw_response": json.dumps({
                "cin": "U72200KA2018PTC112345",
                "companyName": "ABC TECHNOLOGY PRIVATE LIMITED",
                "roc": "RoC Bangalore",
                "companyCategory": "Company limited by Shares",
                "companySubCategory": "Non-govt company",
                "classOfCompany": "Private",
                "dateOfIncorporation": "2018-03-15",
                "authorizedCapital": 20000000,
                "paidUpCapital": 10000000,
                "companyStatus": "Active",
                "directors": [
                    {"din": "08123456", "name": "VIKRAMADITYA SHARMA", "designation": "Director", "dinStatus": "Approved"},
                    {"din": "08123457", "name": "MEERA SUNDARAM", "designation": "Director", "dinStatus": "Approved"}
                ]
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-EPFO",
            "bidder_id": "BID-ABC-01",
            "source_key": "EPFO_ESIC",
            "source_name": "EPFO & ESIC Shram Suvidha Portal",
            "verification_status": "VERIFIED_COMPLIANT",
            "last_checked": "2026-09-21T08:30:26Z",
            "evidence_summary": "Establishment KN/BNG/0045982/000 registered and active. August 2026 ECR paid for 68 contributing employees. Zero default notices.",
            "raw_response": json.dumps({
                "establishmentCode": "KN/BNG/0045982/000",
                "establishmentName": "ABC TECHNOLOGY PRIVATE LIMITED",
                "status": "Live",
                "coverageDate": "2018-05-01",
                "activeEmployees": 68,
                "lastChallanDate": "2026-08-15",
                "defaultStatus": "NIL"
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-MII",
            "bidder_id": "BID-ABC-01",
            "source_key": "MII_DPIIT",
            "source_name": "Make in India / DPIIT Public Procurement Registry",
            "verification_status": "VERIFIED_COMPLIANT",
            "last_checked": "2026-09-21T08:30:29Z",
            "evidence_summary": "Class-I Local Supplier self-declaration validated against domestic value addition norms. Declared local content 64.5% (Tender cutoff: 50%).",
            "raw_response": json.dumps({
                "declarationId": "MII-2026-BLR-8910",
                "supplierCategory": "Class-I Local Supplier",
                "declaredPercentage": 64.5,
                "thresholdRequired": 50.0,
                "factoryLocation": "Peenya, Bengaluru",
                "charteredEngineerCertificateRef": "CE/2026/KA/1098"
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-DEB",
            "bidder_id": "BID-ABC-01",
            "source_key": "CENTRAL_BLACKLIST",
            "source_name": "GeM Incident Management & Central Debarment Database",
            "verification_status": "VERIFIED_CLEAN",
            "last_checked": "2026-09-21T08:30:33Z",
            "evidence_summary": "No debarment, suspension, or blacklisting records found across GeM, CPPP, or Central Public Sector Undertakings.",
            "raw_response": json.dumps({
                "entityChecked": "ABC TECHNOLOGY PRIVATE LIMITED",
                "pan": "ABCDE1234F",
                "cin": "U72200KA2018PTC112345",
                "gemIncidentCount": 0,
                "isBlacklisted": False,
                "debarmentStatus": "CLEAN",
                "watchlistFlag": False
            }),
            "is_mock": True
        },
        {
            "id": "VS-ABC-DIGI",
            "bidder_id": "BID-ABC-01",
            "source_key": "DIGILOCKER",
            "source_name": "DigiLocker Verifiable Credential Repository",
            "verification_status": "VERIFIED_AUTHENTIC",
            "last_checked": "2026-09-21T08:30:36Z",
            "evidence_summary": "Digital signatures on GST and Udyam certificates match the DigiLocker public key certificate authority (PKI Verified).",
            "raw_response": json.dumps({
                "pkiVerified": True,
                "hashMatch": True,
                "issuerCA": "e-Mudhra Sub-CA 2022",
                "timestampValid": True
            }),
            "is_mock": True
        }
    ]
    
    for vs in verification_sources:
        cursor.execute("""
        INSERT INTO verification_sources (id, bidder_id, source_key, source_name, verification_status, last_checked, evidence_summary, raw_response, is_mock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            vs["id"], vs["bidder_id"], vs["source_key"], vs["source_name"], vs["verification_status"],
            vs["last_checked"], vs["evidence_summary"], vs["raw_response"], vs["is_mock"]
        ))
        
    # -------------------------------------------------------------
    # 5. COMPLIANCE EVALUATION MATRIX (for ABC Technologies)
    # -------------------------------------------------------------
    compliance_rules = [
        {
            "id": "COMP-ABC-01",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "Valid & Active GST Registration",
            "category": "Statutory Eligibility",
            "rule_condition": "GSTIN status must equal ACTIVE with regular taxpayer category",
            "source_adapter": "GST Common Portal API",
            "result": "PASS",
            "evidence_snippet": "GSTIN 29ABCDE1234F1Z5 active in Karnataka; all GSTR-3B filings up to date.",
            "risk_level": "LOW",
            "recommendation": "Compliant with Clause 3.1. Proceed.",
            "why_explanation": json.dumps({
                "submitted": "GSTIN 29ABCDE1234F1Z5 in uploaded REG-06 document",
                "verified": "GST Common Portal returns Status: Active, Type: Regular Taxpayer",
                "rule_applied": "Clause 3.1: Bidder must possess an active GSTIN with timely return filings",
                "mismatch_found": "None. Perfect match between submitted document and live registry.",
                "evidence_used": "Cryptographically cross-checked REG-06 PDF metadata against GSTN record hash.",
                "recommended_action": "Mark statutory tax compliance as passed."
            })
        },
        {
            "id": "COMP-ABC-02",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "Valid Udyam MSME Registration",
            "category": "SME Preference Eligibility",
            "rule_condition": "Udyam Registration must be ACTIVE and category Medium/Small/Micro",
            "source_adapter": "Ministry of MSME Udyam Portal",
            "result": "PASS",
            "evidence_snippet": "UDYAM-KR-03-0019284 verified. Enterprise category: Medium Enterprise.",
            "risk_level": "LOW",
            "recommendation": "Eligible for MSME tender preference benefits under Public Procurement Policy.",
            "why_explanation": json.dumps({
                "submitted": "UDYAM-KR-03-0019284 uploaded by bidder",
                "verified": "National MSME database confirms enterprise status is Active & valid",
                "rule_applied": "Clause 3.2: MSME exemptions/preferences require authenticated Udyam number",
                "mismatch_found": "None.",
                "evidence_used": "Verified with Ministry of MSME registry checksum.",
                "recommended_action": "Accept MSME status."
            })
        },
        {
            "id": "COMP-ABC-03",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "Minimum Average Annual Turnover (₹2.50 Cr)",
            "category": "Financial Capability",
            "rule_condition": "Average gross turnover for last 3 financial years >= ₹2,50,00,000",
            "source_adapter": "Income Tax Department ITR-6 & CA Certificate",
            "result": "PASS",
            "evidence_snippet": "Verified 3-year average turnover is ₹4.19 Cr (FY23: ₹3.60Cr, FY24: ₹4.12Cr, FY25: ₹4.85Cr).",
            "risk_level": "LOW",
            "recommendation": "Exceeds tender turnover threshold by 67.6%. Financially qualified.",
            "why_explanation": json.dumps({
                "submitted": "Turnover claimed: ₹4.19 Cr average based on CA Certificate with UDIN",
                "verified": "Income Tax Form ITR-6 acknowledgements confirm exact turnover matching submitted figures",
                "rule_applied": "Clause 4.1: Average 3Y turnover must equal or exceed ₹2.50 Crore",
                "mismatch_found": "None. Verified average ₹4.19 Cr > ₹2.50 Cr required.",
                "evidence_used": "3 years of Form ITR-6 gross receipts cross-checked with CA UDIN verification.",
                "recommended_action": "Pass financial threshold criterion."
            })
        },
        {
            "id": "COMP-ABC-04",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "Make in India (Class-I Local Supplier >= 50%)",
            "category": "National Policy Compliance",
            "rule_condition": "Local content percentage must be >= 50.00%",
            "source_adapter": "DPIIT Local Content Validation Adapter",
            "result": "PASS",
            "evidence_snippet": "Self-declaration confirmed 64.50% domestic value addition at Bengaluru manufacturing facility.",
            "risk_level": "LOW",
            "recommendation": "Class-I Local Supplier preference granted.",
            "why_explanation": json.dumps({
                "submitted": "64.50% local content self-declaration certified by Director",
                "verified": "Meets Class-I classification requirements (> 50%)",
                "rule_applied": "Clause 5.1: Preference to Make in India Order 2017 (Revision 2020)",
                "mismatch_found": "None.",
                "evidence_used": "Bill of Materials local sub-component audit breakdown.",
                "recommended_action": "Confirm Class-I preference."
            })
        },
        {
            "id": "COMP-ABC-05",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "OEM Authorization (MAF) with Ink Signature & Stamp",
            "category": "Technical Authorization",
            "rule_condition": "Manufacturer Authorization Form must cite Tender ID with clear authorized corporate seal",
            "source_adapter": "Document Intelligence OCR & Visual Stamp Classifier",
            "result": "REVIEW_REQUIRED",
            "evidence_snippet": "OEM Authorization letter cites tender GEM/2026/B/901248, but physical ink stamp is indistinct/blurred.",
            "risk_level": "MEDIUM",
            "recommendation": "Procurement Officer should request re-upload of crisp high-resolution stamped OEM letter via GeM clarification window.",
            "why_explanation": json.dumps({
                "submitted": "CyberEnterprise Global Systems OEM Authorization letter uploaded",
                "verified": "Tender ID and warranty terms match, but OCR stamp confidence is low (84.1%) due to faint ink impression",
                "rule_applied": "Clause 6.3: OEM Authorization must bear unequivocal company seal and signatory designation",
                "mismatch_found": "Visual stamp border clarity does not meet high-confidence threshold",
                "evidence_used": "AI Document OCR scan detected signature but marked corporate seal as 'Indistinct'",
                "recommended_action": "Do NOT disqualify immediately. Issue a 48-hour clarification notice to the bidder requesting high-res OEM confirmation."
            })
        },
        {
            "id": "COMP-ABC-06",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "Legal Entity Name Consistency",
            "category": "Entity Verification",
            "rule_condition": "Bidder profile name must match official legal entity registered in MCA & GST",
            "source_adapter": "MCA21 & GST Cross-Reference Engine",
            "result": "REVIEW_REQUIRED",
            "evidence_snippet": "Bidder submitted profile as 'ABC Technologies Pvt. Ltd.' while MCA & GST registry records 'ABC Technology Private Limited'.",
            "risk_level": "MEDIUM",
            "recommendation": "Discrepancy is syntactic (Plural 'Technologies' vs Singular 'Technology' + 'Pvt. Ltd.' vs 'Private Limited'). Request standard name alignment undertaking.",
            "why_explanation": json.dumps({
                "submitted": "Bid Profile: 'ABC Technologies Pvt. Ltd.'",
                "verified": "MCA CIN record & GSTIN 29ABCDE1234F1Z5 legal name: 'ABC Technology Private Limited'",
                "rule_applied": "Clause 2.1: Legal identity of the contracting entity must be unambiguous across all bid submissions",
                "mismatch_found": "Minor syntactic name variation between trade name abbreviation and legal entity name",
                "evidence_used": "MCA21 CIN U72200KA2018PTC112345 match confirming same PAN ABCDE1234F and registered address",
                "recommended_action": "Procurement Officer can accept with an administrative note confirming PAN & CIN identity match."
            })
        },
        {
            "id": "COMP-ABC-07",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "Non-Debarment & Integrity Clearance",
            "category": "Integrity Assessment",
            "rule_condition": "Entity and its Directors must not be on any Central/State debarment list",
            "source_adapter": "Central Debarment & GeM Incident Register",
            "result": "PASS",
            "evidence_snippet": "Clean record. Zero incidents, zero blacklisting notices found across all national portals.",
            "risk_level": "LOW",
            "recommendation": "Fully cleared on integrity check.",
            "why_explanation": json.dumps({
                "submitted": "Non-Debarment Affidavit on Non-Judicial Stamp Paper",
                "verified": "Central Debarment Database returns 0 matching records for PAN ABCDE1234F",
                "rule_applied": "Clause 7.1: Strict exclusion of blacklisted/debarred bidders",
                "mismatch_found": "None.",
                "evidence_used": "Real-time query across CPPP and GeM incident database.",
                "recommended_action": "Pass integrity criterion."
            })
        },
        {
            "id": "COMP-ABC-08",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "requirement_title": "EPFO & Statutory Labor Law Compliance",
            "category": "Statutory Eligibility",
            "rule_condition": "Active EPFO registration with minimum 25 on-roll contributing personnel",
            "source_adapter": "EPFO Unified Shram Suvidha Portal",
            "result": "PASS",
            "evidence_snippet": "68 active contributing employees verified in latest monthly ECR challan.",
            "risk_level": "LOW",
            "recommendation": "Passed labor statutory compliance.",
            "why_explanation": json.dumps({
                "submitted": "August 2026 ECR payment receipt",
                "verified": "EPFO database confirms establishment KN/BNG/0045982/000 is active with 68 contributing employees",
                "rule_applied": "Clause 8.1: Minimum 25 personnel on statutory rolls",
                "mismatch_found": "None (68 > 25).",
                "evidence_used": "Shram Suvidha monthly challan reconciliation.",
                "recommended_action": "Mark passed."
            })
        }
    ]
    
    for c in compliance_rules:
        cursor.execute("""
        INSERT INTO compliance_evaluations (id, bidder_id, tender_id, requirement_title, category, rule_condition, source_adapter, result, evidence_snippet, risk_level, recommendation, why_explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c["id"], c["bidder_id"], c["tender_id"], c["requirement_title"], c["category"],
            c["rule_condition"], c["source_adapter"], c["result"], c["evidence_snippet"],
            c["risk_level"], c["recommendation"], c["why_explanation"]
        ))
        
    # -------------------------------------------------------------
    # 6. DISCREPANCIES (for ABC Technologies)
    # -------------------------------------------------------------
    discrepancies = [
        {
            "id": "DISC-ABC-01",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "title": "Company Legal Name Variation Between Bid Submission & Registry",
            "category": "Identity & Registration Mismatch",
            "severity": "MEDIUM",
            "submitted_data": "ABC Technologies Pvt Ltd (Submitted in Bid Header & Portal Profile)",
            "verified_data": "ABC Technology Private Limited (Official Legal Name in MCA21 & GST Portal)",
            "status": "REVIEW REQUIRED",
            "evidence": "GST REG-06 Certificate #29ABCDE1234F1Z5 & MCA CIN Record #U72200KA2018PTC112345",
            "recommendation": "Officer may accept upon confirming PAN and CIN match, or request standard letterhead name clarification.",
            "rule_violated": "Clause 2.1: Legal identity must be strictly consistent across contract execution documents."
        },
        {
            "id": "DISC-ABC-02",
            "bidder_id": "BID-ABC-01",
            "tender_id": "GEM/2026/B/901248",
            "title": "OEM Manufacturer Authorization Seal Quality & Resolution",
            "category": "Technical Authorization Verification",
            "severity": "MEDIUM",
            "submitted_data": "OEM Authorization Letter from CyberEnterprise Global Systems India Pvt. Ltd.",
            "verified_data": "Tender ID matches correctly; however corporate ink seal impression has low OCR clarity (< 85%).",
            "status": "REVIEW REQUIRED",
            "evidence": "Document DOC-ABC-OEM visual bounding box scan at page 1 footer.",
            "recommendation": "Trigger 48-hour GeM Clarification notice for high-definition copy or direct OEM email confirmation.",
            "rule_violated": "Clause 6.3: OEM Authorization Form must have unambiguous authorized signatory stamp."
        }
    ]
    
    for d in discrepancies:
        cursor.execute("""
        INSERT INTO discrepancies (id, bidder_id, tender_id, title, category, severity, submitted_data, verified_data, status, evidence, recommendation, rule_violated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            d["id"], d["bidder_id"], d["tender_id"], d["title"], d["category"],
            d["severity"], d["submitted_data"], d["verified_data"], d["status"],
            d["evidence"], d["recommendation"], d["rule_violated"]
        ))
        
    # -------------------------------------------------------------
    # 7. AUDIT TRAIL LOGS
    # -------------------------------------------------------------
    audit_logs = [
        {
            "id": "AUD-1001",
            "timestamp": "2026-09-20T10:14:22Z",
            "user_name": "Procurement Officer (Admin)",
            "user_role": "Senior GeM Evaluator",
            "action": "Uploaded Bid Document Package",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "Document Ingestion",
            "result": "6 Documents Queued",
            "details": "Batch upload of GST, Udyam, PAN, OEM Auth, MII Declaration, and EPFO challan.",
            "ip_hash": "192.168.1.42 [Verified GeM Intranet]"
        },
        {
            "id": "AUD-1002",
            "timestamp": "2026-09-20T10:19:40Z",
            "user_name": "TenderIQ AI Engine",
            "user_role": "Automated OCR & Layout Pipeline",
            "action": "Completed OCR & Key-Value Extraction",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "AI Document Intelligence",
            "result": "Extraction Complete (Avg Confidence 96.6%)",
            "details": "Extracted GSTIN, Legal Names, Financial Turnover figures, Local Content %, and EPFO Challans.",
            "ip_hash": "System Internal Service"
        },
        {
            "id": "AUD-1003",
            "timestamp": "2026-09-21T08:30:12Z",
            "user_name": "TenderIQ Verification Bridge",
            "user_role": "Synthetic Registry Adapter",
            "action": "Queried GST Common Portal (GSTN)",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "GST Verification",
            "result": "VERIFIED ACTIVE",
            "details": "GSTIN 29ABCDE1234F1Z5 verified active with 100% on-time filing history.",
            "ip_hash": "Adapter [GSTN-Sandbox-Mock]"
        },
        {
            "id": "AUD-1004",
            "timestamp": "2026-09-21T08:30:15Z",
            "user_name": "TenderIQ Verification Bridge",
            "user_role": "Synthetic Registry Adapter",
            "action": "Queried Udyam MSME National Portal",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "MSME Verification",
            "result": "VERIFIED ACTIVE",
            "details": "UDYAM-KR-03-0019284 verified as Medium Enterprise under NIC 62011.",
            "ip_hash": "Adapter [Udyam-Sandbox-Mock]"
        },
        {
            "id": "AUD-1005",
            "timestamp": "2026-09-21T08:30:18Z",
            "user_name": "TenderIQ Verification Bridge",
            "user_role": "Synthetic Registry Adapter",
            "action": "Queried Income Tax 3Y ITR Repository",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "Direct Tax Verification",
            "result": "VERIFIED COMPLIANT",
            "details": "Verified 3-year turnover average of ₹4.19 Cr exceeding ₹2.50 Cr tender requirement.",
            "ip_hash": "Adapter [ITD-eFiling-Mock]"
        },
        {
            "id": "AUD-1006",
            "timestamp": "2026-09-21T08:30:33Z",
            "user_name": "TenderIQ Verification Bridge",
            "user_role": "Synthetic Registry Adapter",
            "action": "Queried Central Debarment & GeM Incident Register",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "Integrity Check",
            "result": "CLEAN",
            "details": "Zero debarment entries found across central & state registries.",
            "ip_hash": "Adapter [Debarment-Registry-Mock]"
        },
        {
            "id": "AUD-1007",
            "timestamp": "2026-09-21T08:31:00Z",
            "user_name": "TenderIQ Compliance Engine",
            "user_role": "Rule Evaluator",
            "action": "Evaluated Tender Specific Rules",
            "bidder_id": "BID-ABC-01",
            "bidder_name": "ABC Technologies Pvt. Ltd.",
            "tender_id": "GEM/2026/B/901248",
            "verification_type": "Rules Evaluation",
            "result": "Score 92/100 (Needs Review)",
            "details": "6 Rules Passed, 2 Rules Flagged for Review (Entity Name variation & OEM Stamp Clarity).",
            "ip_hash": "System Rule Engine"
        }
    ]
    
    for a in audit_logs:
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, bidder_id, bidder_name, tender_id, verification_type, result, details, ip_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            a["id"], a["timestamp"], a["user_name"], a["user_role"], a["action"],
            a["bidder_id"], a["bidder_name"], a["tender_id"], a["verification_type"],
            a["result"], a["details"], a["ip_hash"]
        ))
        
    conn.commit()
    conn.close()
    print("Database seeded successfully with comprehensive SIH 2026 demo data!")

if __name__ == "__main__":
    seed_database()
