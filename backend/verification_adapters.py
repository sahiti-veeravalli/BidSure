import time
import json
from typing import Dict, Any

class BaseVerificationAdapter:
    """Base interface for government verification adapters."""
    def __init__(self, source_name: str, source_key: str):
        self.source_name = source_name
        self.source_key = source_key
        self.is_mock = True

    def verify(self, query_params: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

class GSTVerificationAdapter(BaseVerificationAdapter):
    def __init__(self):
        super().__init__("GST Common Portal (GSTN)", "GST")

    def verify(self, query_params: Dict[str, Any]) -> Dict[str, Any]:
        gstin = query_params.get("gstin", "29ABCDE1234F1Z5")
        time.sleep(0.3)  # simulate API roundtrip
        
        if "9999" in gstin:  # high risk simulation
            return {
                "source": self.source_name,
                "status": "FLAGGED_DELINQUENT",
                "verified": False,
                "evidence": f"GSTIN {gstin} is ACTIVE but GSTR-3B filings are delayed by > 180 days.",
                "data": {
                    "gstin": gstin,
                    "legalName": query_params.get("legal_name", "Bharat Digital Systems LLP"),
                    "status": "Active (Non-Filer Notice Issued)",
                    "complianceRating": "4/10",
                    "eWayBillBlocked": True,
                    "filingDefaultQuarters": 2
                }
            }
        
        return {
            "source": self.source_name,
            "status": "VERIFIED_ACTIVE",
            "verified": True,
            "evidence": f"GSTIN {gstin} is ACTIVE and Regular Taxpayer. 100% on-time return compliance.",
            "data": {
                "gstin": gstin,
                "legalName": "ABC TECHNOLOGY PRIVATE LIMITED",
                "tradeName": "ABC TECHNOLOGIES",
                "status": "Active",
                "taxpayerType": "Regular",
                "stateJurisdiction": "Ward-3, Bengaluru Central, Karnataka",
                "complianceRating": "10/10",
                "eWayBillBlocked": False,
                "lastReturnFiled": "GSTR-3B (July 2026)"
            }
        }

class UdyamVerificationAdapter(BaseVerificationAdapter):
    def __init__(self):
        super().__init__("Udyam MSME National Registry", "UDYAM")

    def verify(self, query_params: Dict[str, Any]) -> Dict[str, Any]:
        udyam_no = query_params.get("udyam_number", "UDYAM-KR-03-0019284")
        time.sleep(0.3)
        return {
            "source": self.source_name,
            "status": "VERIFIED_ACTIVE",
            "verified": True,
            "evidence": f"Udyam registration {udyam_no} verified as Medium Enterprise under NIC 62011 & 26201.",
            "data": {
                "udyamNumber": udyam_no,
                "enterpriseName": "ABC TECHNOLOGY PRIVATE LIMITED",
                "classification": "Medium Enterprise",
                "majorActivity": "Services / IT Manufacturing Integration",
                "status": "Active & Valid"
            }
        }

class IncomeTaxVerificationAdapter(BaseVerificationAdapter):
    def __init__(self):
        super().__init__("Income Tax Department e-Filing API", "INCOME_TAX")

    def verify(self, query_params: Dict[str, Any]) -> Dict[str, Any]:
        pan = query_params.get("pan", "ABCDE1234F")
        time.sleep(0.3)
        return {
            "source": self.source_name,
            "status": "VERIFIED_COMPLIANT",
            "verified": True,
            "evidence": f"PAN {pan} active. Form ITR-6 filed for FY23, FY24, FY25. 3-year avg turnover: ₹4.19 Cr.",
            "data": {
                "pan": pan,
                "panStatus": "Active",
                "itrFilingHistory": ["AY 2025-26 (Verified)", "AY 2024-25 (Verified)", "AY 2023-24 (Verified)"],
                "threeYearAvgTurnoverCr": 4.19,
                "sec206AB_Compliance": "Compliant"
            }
        }

class DebarmentVerificationAdapter(BaseVerificationAdapter):
    def __init__(self):
        super().__init__("Central Debarment & GeM Incident Register", "CENTRAL_BLACKLIST")

    def verify(self, query_params: Dict[str, Any]) -> Dict[str, Any]:
        pan = query_params.get("pan", "ABCDE1234F")
        time.sleep(0.2)
        if "9999" in pan:
            return {
                "source": self.source_name,
                "status": "FLAGGED_DEBARRED",
                "verified": False,
                "evidence": f"Entity associated with PAN {pan} has an active warning / debarment notice under GeM Incident ID #INC-2025-8819.",
                "data": {
                    "pan": pan,
                    "isBlacklisted": True,
                    "incidentId": "INC-2025-8819",
                    "reason": "Default in contract delivery terms"
                }
            }
        return {
            "source": self.source_name,
            "status": "VERIFIED_CLEAN",
            "verified": True,
            "evidence": "Clean record. Zero incidents, zero debarment or suspension entries found across all national portals.",
            "data": {
                "pan": pan,
                "isBlacklisted": False,
                "debarmentStatus": "CLEAN",
                "gemIncidents": 0
            }
        }

# Factory for all verification adapters
VERIFICATION_ADAPTERS = {
    "GST": GSTVerificationAdapter(),
    "UDYAM": UdyamVerificationAdapter(),
    "INCOME_TAX": IncomeTaxVerificationAdapter(),
    "CENTRAL_BLACKLIST": DebarmentVerificationAdapter()
}
