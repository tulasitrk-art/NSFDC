import os
import json
from typing import Dict, Any, List

# Statutory NSFDC Constants & Comprehensive Scheme Directory (330 Schemes)
INCOME_CEILING_INR = 500000.00

# Base fallback dictionary for 10 Core NSFDC Schemes
CORE_STATUTORY_SCHEMES: Dict[str, Dict[str, Any]] = {
    "NSFDC_MCF": {
        "scheme_id": "NSFDC_MCF",
        "scheme_name": "Micro Credit Finance Scheme (MCF)",
        "category": "MICRO",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.50,
        "interest_rate_female": 5.50,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Small retail, vegetable vending, tea shop, artisan trade."
    },
    "NSFDC_MSY": {
        "scheme_id": "NSFDC_MSY",
        "scheme_name": "Mahila Samriddhi Yojana (MSY)",
        "category": "MICRO_WOMEN",
        "max_project_cost": 140000.00,
        "govt_share_percent": 95.00,
        "beneficiary_margin_percent": 5.00,
        "interest_rate_male": 99.00, # Female beneficiary exclusive
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Specialized concessional micro finance for SC women entrepreneurs and SHGs."
    },
    "NSFDC_TL": {
        "scheme_id": "NSFDC_TL",
        "scheme_name": "Term Loan General Scheme",
        "category": "TERM",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.50,
        "interest_rate_female": 7.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Medium capital for dairy farms, commercial transport, and small manufacturing."
    },
    "NSFDC_ELS_D": {
        "scheme_id": "NSFDC_ELS_D",
        "scheme_name": "Educational Loan Scheme (Domestic)",
        "category": "EDU_DOMESTIC",
        "max_project_cost": 2000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.00,
        "moratorium_months": 12,
        "max_tenure_years": 5,
        "description": "Professional & technical degrees in India (Engineering, Medical, Law)."
    },
    "NSFDC_ELS_O": {
        "scheme_id": "NSFDC_ELS_O",
        "scheme_name": "Educational Loan Scheme (Abroad)",
        "category": "EDU_ABROAD",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.50,
        "interest_rate_female": 6.50,
        "moratorium_months": 12,
        "max_tenure_years": 7,
        "description": "Higher studies in accredited foreign universities."
    },
    "NSFDC_GBS": {
        "scheme_id": "NSFDC_GBS",
        "scheme_name": "Green Business Scheme",
        "category": "GREEN_ENERGY",
        "max_project_cost": 3000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.50,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Financing for battery e-Rickshaws, solar polyhouse, and eco-friendly machinery."
    },
    "NSFDC_LVY": {
        "scheme_id": "NSFDC_LVY",
        "scheme_name": "Laghu Vyavsay Yojana",
        "category": "SMALL_BUSINESS",
        "max_project_cost": 500000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.50,
        "moratorium_months": 6,
        "max_tenure_years": 4,
        "description": "Rural workshops, tailoring centers, and repair centers."
    },
    "NSFDC_SUY": {
        "scheme_id": "NSFDC_SUY",
        "scheme_name": "Swachhta Udyami Yojana",
        "category": "SANITATION",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.50,
        "moratorium_months": 6,
        "max_tenure_years": 7,
        "description": "Mechanized cleaning machinery and sanitation transport vehicles for safai karamcharis."
    },
    "NSFDC_SSY": {
        "scheme_id": "NSFDC_SSY",
        "scheme_name": "Shilpi Samriddhi Yojana",
        "category": "ARTISAN",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Handloom, terracotta, metal craft, and traditional artisans."
    },
    "NSFDC_MKY": {
        "scheme_id": "NSFDC_MKY",
        "scheme_name": "Mahila Kisan Yojana",
        "category": "AGRI_WOMEN",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Agriculture, goat rearing, floriculture exclusively for SC women farmers."
    }
}

def _load_all_schemes() -> Dict[str, Dict[str, Any]]:
    """Loads all 330+ schemes from schemes_catalog.json and merges with CORE schemes."""
    schemes_dict = dict(CORE_STATUTORY_SCHEMES)
    catalog_file = os.path.join(os.path.dirname(__file__), "schemes_catalog.json")
    if os.path.exists(catalog_file):
        try:
            with open(catalog_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    s_id = item.get("scheme_id")
                    if s_id:
                        schemes_dict[s_id] = item
        except Exception as e:
            print(f"Warning: Failed to load schemes_catalog.json: {e}")
    return schemes_dict

STATUTORY_SCHEMES: Dict[str, Dict[str, Any]] = _load_all_schemes()

INDIAN_STATES = [
    {"code": "AP", "name": "Andhra Pradesh"},
    {"code": "AR", "name": "Arunachal Pradesh"},
    {"code": "AS", "name": "Assam"},
    {"code": "BR", "name": "Bihar"},
    {"code": "CG", "name": "Chhattisgarh"},
    {"code": "GA", "name": "Goa"},
    {"code": "GJ", "name": "Gujarat"},
    {"code": "HR", "name": "Haryana"},
    {"code": "HP", "name": "Himachal Pradesh"},
    {"code": "JH", "name": "Jharkhand"},
    {"code": "KA", "name": "Karnataka"},
    {"code": "KL", "name": "Kerala"},
    {"code": "MP", "name": "Madhya Pradesh"},
    {"code": "MH", "name": "Maharashtra"},
    {"code": "MN", "name": "Manipur"},
    {"code": "ML", "name": "Meghalaya"},
    {"code": "MZ", "name": "Mizoram"},
    {"code": "NL", "name": "Nagaland"},
    {"code": "OD", "name": "Odisha"},
    {"code": "PB", "name": "Punjab"},
    {"code": "RJ", "name": "Rajasthan"},
    {"code": "SK", "name": "Sikkim"},
    {"code": "TN", "name": "Tamil Nadu"},
    {"code": "TS", "name": "Telangana"},
    {"code": "TR", "name": "Tripura"},
    {"code": "UP", "name": "Uttar Pradesh"},
    {"code": "UK", "name": "Uttarakhand"},
    {"code": "WB", "name": "West Bengal"},
    {"code": "DL", "name": "Delhi NCR"},
    {"code": "JK", "name": "Jammu & Kashmir"}
]
