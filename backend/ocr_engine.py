import time
import random
import json
from typing import Dict, Any

class DocumentIntelligenceEngine:
    """
    Simulated AI Document Intelligence & OCR Extraction Engine.
    Performs document classification, layout parsing, key-value extraction,
    and confidence scoring with realistic government document templates.
    """
    
    DOCUMENT_TEMPLATES = {
        "GST Certificate (Form REG-06)": {
            "classification": "Statutory / Indirect Tax Registration",
            "confidence_range": (96.5, 99.2),
            "fields": [
                {"field": "GSTIN", "pattern": "29ABCDE1234F1Z5", "confidence": 99.4, "status": "MATCHED"},
                {"field": "Legal Name", "pattern": "ABC Technology Private Limited", "confidence": 98.1, "status": "MINOR_NAME_DELTA"},
                {"field": "Trade Name", "pattern": "ABC Technologies", "confidence": 97.5, "status": "MATCHED"},
                {"field": "Registration Type", "pattern": "Regular Taxpayer", "confidence": 99.0, "status": "MATCHED"},
                {"field": "Date of Issue", "pattern": "12/04/2018", "confidence": 96.8, "status": "MATCHED"}
            ],
            "raw_data": {
                "gstin": "29ABCDE1234F1Z5",
                "legal_name": "ABC Technology Private Limited",
                "trade_name": "ABC Technologies",
                "constitution_of_business": "Private Limited Company",
                "type_of_registration": "Regular Taxpayer",
                "principal_place_of_business": "Plot 42, Electronics City Phase 1, Bengaluru, Karnataka - 560100"
            }
        },
        "Udyam MSME Certificate": {
            "classification": "SME / MSME Classification",
            "confidence_range": (97.0, 99.5),
            "fields": [
                {"field": "Udyam Number", "pattern": "UDYAM-KR-03-0019284", "confidence": 99.8, "status": "MATCHED"},
                {"field": "Enterprise Type", "pattern": "Medium", "confidence": 98.6, "status": "MATCHED"},
                {"field": "Major Activity", "pattern": "IT Hardware / Services", "confidence": 97.2, "status": "MATCHED"},
                {"field": "Status", "pattern": "Active", "confidence": 98.0, "status": "MATCHED"}
            ],
            "raw_data": {
                "udyam_reg_number": "UDYAM-KR-03-0019284",
                "name_of_enterprise": "ABC TECHNOLOGIES PRIVATE LIMITED",
                "enterprise_type": "Medium Enterprise",
                "major_activity": "Services and IT Manufacturing Integration",
                "date_of_incorporation": "2018-03-15"
            }
        },
        "PAN & 3Y ITR Acknowledgement": {
            "classification": "Income Tax / Direct Tax Filing",
            "confidence_range": (95.0, 98.5),
            "fields": [
                {"field": "PAN Number", "pattern": "ABCDE1234F", "confidence": 99.5, "status": "MATCHED"},
                {"field": "Average 3Y Turnover", "pattern": "₹ 4.19 Cr", "confidence": 95.8, "status": "PASS"},
                {"field": "Filing Status", "pattern": "e-Verified", "confidence": 98.2, "status": "PASS"},
                {"field": "Form Type", "pattern": "ITR-6", "confidence": 97.0, "status": "PASS"}
            ],
            "raw_data": {
                "pan": "ABCDE1234F",
                "assessment_years": ["2023-24", "2024-25", "2025-26"],
                "gross_turnover_ay25": "₹ 4,85,50,000",
                "average_3y_turnover": "₹ 4.19 Cr",
                "e_verification_ack_no": "90812344556601"
            }
        },
        "OEM Authorization (MAF)": {
            "classification": "Manufacturer Authorization Form",
            "confidence_range": (84.0, 93.5),
            "fields": [
                {"field": "OEM Brand", "pattern": "CyberEnterprise Global Systems", "confidence": 94.2, "status": "MATCHED"},
                {"field": "Tender Reference", "pattern": "GEM/2026/B/901248", "confidence": 96.0, "status": "MATCHED"},
                {"field": "Warranty Commitment", "pattern": "5 Years On-site", "confidence": 93.5, "status": "MATCHED"},
                {"field": "Authorized Seal & Signature", "pattern": "Signature Present / Ink Stamp Indistinct", "confidence": 84.1, "status": "REVIEW_FLAG"}
            ],
            "raw_data": {
                "oem_name": "CyberEnterprise Global Systems India Pvt. Ltd.",
                "tender_ref_cited": "GEM/2026/B/901248",
                "validity_period": "Till 31st March 2027",
                "signatory_stamp_detected": "Partially Blurred / Missing Ink Seal"
            }
        },
        "Make in India (MII) Declaration": {
            "classification": "Statutory / DPIIT Public Procurement Order",
            "confidence_range": (98.0, 99.5),
            "fields": [
                {"field": "Supplier Category", "pattern": "Class-I Local Supplier", "confidence": 99.1, "status": "PASS"},
                {"field": "Local Content %", "pattern": "64.50%", "confidence": 98.7, "status": "PASS"},
                {"field": "Location of Value Addition", "pattern": "Peenya, Bengaluru", "confidence": 97.4, "status": "VERIFIED"}
            ],
            "raw_data": {
                "classification_category": "Class-I Local Supplier",
                "claimed_local_content_pct": "64.50%",
                "location_of_local_value_addition": "Plot 19B, Peenya Industrial Area, Bengaluru, Karnataka"
            }
        },
        "EPFO ECR / ESIC Challan": {
            "classification": "Labor Law Compliance",
            "confidence_range": (96.0, 99.0),
            "fields": [
                {"field": "Establishment Code", "pattern": "KN/BNG/0045982/000", "confidence": 98.8, "status": "MATCHED"},
                {"field": "Active Employees", "pattern": "68 Personnel", "confidence": 97.5, "status": "PASS"},
                {"field": "Challan Payment Status", "pattern": "Confirmed", "confidence": 99.0, "status": "PASS"}
            ],
            "raw_data": {
                "establishment_id": "KN/BNG/0045982/000",
                "wage_month": "August 2026",
                "total_contributing_members": "68",
                "total_amount_paid": "₹ 3,42,890"
            }
        }
    }

    @classmethod
    def process_document(cls, filename: str, doc_type: str = None) -> Dict[str, Any]:
        """
        Simulate real-time 6-stage document processing pipeline:
        1. Uploaded
        2. OCR Processing
        3. Classification
        4. Key-Value Extraction
        5. Verification
        6. Compliance Evaluation
        """
        # Pick matching template or best guess
        selected_template_key = None
        for key in cls.DOCUMENT_TEMPLATES.keys():
            if doc_type and doc_type.lower() in key.lower():
                selected_template_key = key
                break
            if key.split()[0].lower() in filename.lower():
                selected_template_key = key
                break
                
        if not selected_template_key:
            selected_template_key = "GST Certificate (Form REG-06)"
            
        template = cls.DOCUMENT_TEMPLATES[selected_template_key]
        avg_conf = round(random.uniform(template["confidence_range"][0], template["confidence_range"][1]), 1)
        
        return {
            "doc_type": selected_template_key,
            "file_name": filename,
            "classification": template["classification"],
            "ocr_confidence": avg_conf,
            "processing_status": "Processed",
            "extracted_fields_list": template["fields"],
            "extracted_data": template["raw_data"],
            "bounding_boxes": [
                {"field": "Header", "box": [40, 20, 520, 60], "label": "Document Header / Emblems"},
                {"field": "Identity / Reg No", "box": [40, 110, 300, 150], "label": "Registration / Statutory ID"},
                {"field": "Entity Details", "box": [40, 180, 500, 240], "label": "Legal Name & Address"},
                {"field": "Auth Signatory", "box": [340, 680, 520, 750], "label": "Digital Signature / Seal"}
            ]
        }
