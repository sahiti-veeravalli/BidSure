import sqlite3
import json
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "tenderiq.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Tenders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tenders (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        category TEXT NOT NULL,
        estimated_value REAL,
        submission_deadline TEXT NOT NULL,
        closing_date TEXT,
        status TEXT NOT NULL,
        description TEXT,
        eligibility_requirements TEXT,
        required_documents TEXT,
        rules TEXT,
        created_at TEXT NOT NULL
    )
    """)
    
    # Bidders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bidders (
        id TEXT PRIMARY KEY,
        tender_id TEXT NOT NULL,
        company_name TEXT NOT NULL,
        legal_name TEXT NOT NULL,
        cin TEXT,
        pan TEXT NOT NULL,
        gstin TEXT NOT NULL,
        udyam_number TEXT,
        epfo_code TEXT,
        contact_person TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        overall_score INTEGER DEFAULT 0,
        risk_level TEXT DEFAULT 'MEDIUM',
        compliance_status TEXT DEFAULT 'Processing',
        officer_decision TEXT DEFAULT 'Pending Review',
        decision_remarks TEXT,
        decision_timestamp TEXT,
        FOREIGN KEY (tender_id) REFERENCES tenders (id)
    )
    """)
    
    # Documents table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        bidder_id TEXT NOT NULL,
        tender_id TEXT NOT NULL,
        doc_type TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_size_kb REAL,
        upload_timestamp TEXT NOT NULL,
        processing_status TEXT NOT NULL,
        ocr_confidence REAL,
        classification TEXT,
        extracted_data TEXT,
        extracted_fields_list TEXT,
        file_url TEXT,
        FOREIGN KEY (bidder_id) REFERENCES bidders (id),
        FOREIGN KEY (tender_id) REFERENCES tenders (id)
    )
    """)
    
    # Verification sources table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verification_sources (
        id TEXT PRIMARY KEY,
        bidder_id TEXT NOT NULL,
        source_key TEXT NOT NULL,
        source_name TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        last_checked TEXT NOT NULL,
        evidence_summary TEXT,
        raw_response TEXT,
        is_mock BOOLEAN DEFAULT 1,
        FOREIGN KEY (bidder_id) REFERENCES bidders (id)
    )
    """)
    
    # Compliance rules evaluation results table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS compliance_evaluations (
        id TEXT PRIMARY KEY,
        bidder_id TEXT NOT NULL,
        tender_id TEXT NOT NULL,
        requirement_title TEXT NOT NULL,
        category TEXT NOT NULL,
        rule_condition TEXT NOT NULL,
        source_adapter TEXT NOT NULL,
        result TEXT NOT NULL, -- PASS, FAIL, REVIEW_REQUIRED
        evidence_snippet TEXT,
        risk_level TEXT,
        recommendation TEXT,
        why_explanation TEXT,
        FOREIGN KEY (bidder_id) REFERENCES bidders (id),
        FOREIGN KEY (tender_id) REFERENCES tenders (id)
    )
    """)
    
    # Discrepancies table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS discrepancies (
        id TEXT PRIMARY KEY,
        bidder_id TEXT NOT NULL,
        tender_id TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        severity TEXT NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
        submitted_data TEXT NOT NULL,
        verified_data TEXT NOT NULL,
        status TEXT NOT NULL,
        evidence TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        rule_violated TEXT,
        FOREIGN KEY (bidder_id) REFERENCES bidders (id)
    )
    """)
    
    # Audit trail table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_role TEXT NOT NULL,
        action TEXT NOT NULL,
        bidder_id TEXT,
        bidder_name TEXT,
        tender_id TEXT,
        verification_type TEXT,
        result TEXT,
        details TEXT,
        ip_hash TEXT
    )
    """)
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
