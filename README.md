# TenderIQ — AI-Powered Integrated Bid Compliance Verification Platform
> **Smart India Hackathon (SIH 2026) Prototype**
> *"Verify. Analyze. Comply."*

TenderIQ is an AI-assisted procurement compliance platform for GeM-style government tender evaluation. It helps Procurement Officers upload and analyze bidder documents, extract important information using deterministic OCR layout analysis, cross-check it against 8 national statutory verification registries, apply tender-specific compliance rules, detect discrepancies, calculate risk, and generate an evidence-backed compliance report with an immutable audit trail.

---

## 🏛️ System Architecture & Workflow

```
Tender Selection
        ↓
Bidder Document Upload
        ↓
AI Document Processing (OCR & Layout Analysis)
        ↓
Information Extraction (GSTIN, CIN, Turnover, MII %)
        ↓
Registry Verification (GSTN, MSME, CBDT, MCA21, EPFO, Debarment)
        ↓
Tender-Specific Compliance Rules
        ↓
Risk & Discrepancy Detection (Delta Comparison)
        ↓
Evidence-Backed Compliance Report (PDF & Print Dossier)
        ↓
Procurement Officer Review & Decision
        ↓
Immutable Audit Trail Ledger
```

---

## 🌟 Key Features

1. **AI Document Intelligence**:
   - Layout segmentation & key-value extraction for GST REG-06, Udyam MSME, PAN/ITR-6, OEM Authorization (MAF), Make in India declarations, and EPFO ECR challans.
   - Per-field optical confidence scoring with interactive visual certificate bounding box inspector.

2. **Tender-Aware Configurable Rules Engine**:
   - Allows Procurement Officers to define custom tender rules (e.g. `GST Status = ACTIVE`, `Udyam = REQUIRED`, `Min 3Y Turnover >= ₹2.5 Cr`, `Make in India Local Content >= 50%`, `Debarment Check = MUST NOT BE BLACKLISTED`).
   - Dynamic compliance score calculation (0–100) with 4-pillar breakdown (Statutory Tax, Financial Turnover, Technical/OEM, Integrity).

3. **Modular Verification Adapters (8 Government Sources)**:
   - GST Common Portal (GSTN)
   - Udyam MSME National Registry
   - Income Tax Department (CBDT e-Filing API)
   - Ministry of Corporate Affairs (MCA21 V3)
   - EPFO & ESIC Shram Suvidha Hub
   - Make in India (DPIIT) Public Procurement Registry
   - Central Debarment & GeM Incident Register
   - DigiLocker PKI Digital Signature Service

4. **Novel Feature — "Why This Result?" (6-Factor Explainability)**:
   - 1-click explainability breakdown explaining:
     1. What was submitted
     2. What was verified
     3. What rule was applied
     4. What mismatch / delta was found
     5. Evidence used & document citations
     6. Recommended Procurement Officer action

5. **Evidence-Backed Compliance Report & Export**:
   - Formal evaluation dossier with functional client-side **Export to PDF** (via `jsPDF`), print layout, and executive summary copying.

6. **Procurement Officer Final Authority & Decision Interface**:
   - Statutory compliance with GFR 2017: AI assists verification, while the final qualification/disqualification decision remains strictly with the Procurement Officer.
   - Direct integration into a tamper-evident, chronological **Audit Trail**.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup (FastAPI + SQLite)
```bash
cd backend
python -m pip install -r requirements.txt # or install fastapi uvicorn pydantic python-multipart
python seed_data.py                      # Initialize SQLite database with SIH 2026 demo data
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (React + Tailwind CSS + Vite)
```bash
cd frontend
npm install
npm run dev
```
Web application will be accessible at `http://127.0.0.1:5173/`.

---

## 🛡️ License
Built for Smart India Hackathon (SIH 2026).
