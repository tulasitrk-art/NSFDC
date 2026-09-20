import os
import json
from typing import Dict, Any, List

# Statutory Default Income Ceiling
INCOME_CEILING_INR = 500000.00

# Category-Specific Statutory Income Ceilings (INR)
CATEGORY_INCOME_CEILINGS: Dict[str, float] = {
    "SC": 500000.00,
    "ST": 600000.00,
    "OBC": 800000.00,
    "OBC_NCL": 800000.00,
    "OBC_CL": 1500000.00,
    "EWS": 800000.00,
    "GEN": 1200000.00,
    "EBC": 500000.00,
    "DNT": 500000.00,
    "NT": 500000.00,
    "SNT": 500000.00,
    "PWD": 600000.00,
    "MIN_MUS": 600000.00,
    "MIN_CHR": 600000.00,
    "MIN_SIK": 600000.00,
    "MIN_BUD": 600000.00,
    "MIN_JAI": 600000.00,
    "MIN_PAR": 600000.00,
}

# Core Statutory Schemes across Apex Corporations & National Welfare Programs
CORE_STATUTORY_SCHEMES: Dict[str, Dict[str, Any]] = {
    # --- NSFDC (Scheduled Castes) ---
    "NSFDC_MCF": {
        "scheme_id": "NSFDC_MCF",
        "scheme_name": "Micro Credit Finance Scheme (MCF)",
        "category": "MICRO",
        "target_caste": "SC",
        "apex_corp": "NSFDC",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.50,
        "interest_rate_female": 5.50,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Small retail, vegetable vending, tea shop, artisan trade for SC beneficiaries."
    },
    "NSFDC_MSY": {
        "scheme_id": "NSFDC_MSY",
        "scheme_name": "Mahila Samriddhi Yojana (MSY)",
        "category": "MICRO_WOMEN",
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
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
        "target_caste": "SC",
        "apex_corp": "NSFDC",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Handloom, terracotta, metal craft, and traditional SC artisans."
    },
    "NSFDC_MKY": {
        "scheme_id": "NSFDC_MKY",
        "scheme_name": "Mahila Kisan Yojana",
        "category": "AGRI_WOMEN",
        "target_caste": "SC",
        "apex_corp": "NSFDC",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Agriculture, goat rearing, floriculture exclusively for SC women farmers."
    },

    # --- NSTFDC (Scheduled Tribes) ---
    "NSTFDC_AMSY": {
        "scheme_id": "NSTFDC_AMSY",
        "scheme_name": "Adivasi Mahila Sashaktikaran Yojana (AMSY)",
        "category": "MICRO_WOMEN",
        "target_caste": "ST",
        "apex_corp": "NSTFDC",
        "max_project_cost": 200000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 4.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Highly concessional credit of up to ₹2.00 Lakh at 4% interest exclusively for Scheduled Tribe women."
    },
    "NSTFDC_TL": {
        "scheme_id": "NSTFDC_TL",
        "scheme_name": "NSTFDC Term Loan Scheme for ST Beneficiaries",
        "category": "TERM",
        "target_caste": "ST",
        "apex_corp": "NSTFDC",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 6,
        "max_tenure_years": 7,
        "description": "Term loan for viable income-generating projects in agriculture, agro-processing, and transport for ST individuals."
    },
    "NSTFDC_MICRO": {
        "scheme_id": "NSTFDC_MICRO",
        "scheme_name": "NSTFDC Micro-Credit Scheme for Tribal SHGs",
        "category": "MICRO",
        "target_caste": "ST",
        "apex_corp": "NSTFDC",
        "max_project_cost": 500000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Micro-finance for small business, minor forest produce trade, and handicraft SHGs for ST members."
    },

    # --- NBCFDC (OBC, OBC-NCL, EBC, DNT) ---
    "NBCFDC_SWARNIMA": {
        "scheme_id": "NBCFDC_SWARNIMA",
        "scheme_name": "New Swarnima Special Scheme for OBC / OBC-NCL Women",
        "category": "MICRO_WOMEN",
        "target_caste": "OBC_NCL",
        "apex_corp": "NBCFDC",
        "max_project_cost": 200000.00,
        "govt_share_percent": 95.00,
        "beneficiary_margin_percent": 5.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Financial assistance to women belonging to OBC/OBC-NCL categories living below double poverty line."
    },
    "NBCFDC_SAKSHAM": {
        "scheme_id": "NBCFDC_SAKSHAM",
        "scheme_name": "NBCFDC Saksham Scheme for Young Professionals (OBC / EBC)",
        "category": "SMALL_BUSINESS",
        "target_caste": "OBC",
        "apex_corp": "NBCFDC",
        "max_project_cost": 1500000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.50,
        "interest_rate_female": 5.50,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Business establishment finance for OBC/EBC graduates and certified professionals."
    },
    "NBCFDC_SHILP": {
        "scheme_id": "NBCFDC_SHILP",
        "scheme_name": "Shilp Sampada Artisanal Finance Scheme (OBC / EBC)",
        "category": "ARTISAN",
        "target_caste": "OBC_NCL",
        "apex_corp": "NBCFDC",
        "max_project_cost": 1000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Upgrading technical skills and credit for traditional OBC/EBC artisan clusters."
    },

    # --- NHFDC (PwD / Divyangjan) ---
    "NHFDC_SWAVALAMBAN": {
        "scheme_id": "NHFDC_SWAVALAMBAN",
        "scheme_name": "Divyangjan Swavalamban Yojana (PwD Concessional Credit)",
        "category": "TERM",
        "target_caste": "PWD",
        "apex_corp": "NHFDC",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 5.00,
        "interest_rate_female": 4.50,
        "moratorium_months": 9,
        "max_tenure_years": 7,
        "description": "Concessional credit for self-employment, service units, and transport for persons with 40%+ benchmark disability."
    },
    "NHFDC_VISHESH": {
        "scheme_id": "NHFDC_VISHESH",
        "scheme_name": "NHFDC Vishesh Microcredit Scheme for Divyangjan",
        "category": "MICRO",
        "target_caste": "PWD",
        "apex_corp": "NHFDC",
        "max_project_cost": 100000.00,
        "govt_share_percent": 95.00,
        "beneficiary_margin_percent": 5.00,
        "interest_rate_male": 4.50,
        "interest_rate_female": 4.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Direct micro-finance for small kiosks, vending, and digital service points for PwD beneficiaries."
    },

    # --- NMDFC (National Minorities: MUS, CHR, SIK, BUD, JAI, PAR) ---
    "NMDFC_VIRASAT": {
        "scheme_id": "NMDFC_VIRASAT",
        "scheme_name": "Virasat Scheme for Minority Artisans & Craftspersons",
        "category": "ARTISAN",
        "target_caste": "MIN_MUS",
        "apex_corp": "NMDFC",
        "max_project_cost": 1000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 5.00,
        "interest_rate_female": 4.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Concessional credit for artisans from notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)."
    },
    "NMDFC_MAHILA_SAMRIDDHI": {
        "scheme_id": "NMDFC_MAHILA_SAMRIDDHI",
        "scheme_name": "Mahila Samriddhi Yojana for Minority Women",
        "category": "MICRO_WOMEN",
        "target_caste": "MIN_MUS",
        "apex_corp": "NMDFC",
        "max_project_cost": 140000.00,
        "govt_share_percent": 95.00,
        "beneficiary_margin_percent": 5.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 4.50,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "description": "Micro-finance linked with skill training for female members of notified minority communities."
    },
    "NMDFC_TL": {
        "scheme_id": "NMDFC_TL",
        "scheme_name": "NMDFC Term Loan General Scheme for Minorities",
        "category": "TERM",
        "target_caste": "MIN_MUS",
        "apex_corp": "NMDFC",
        "max_project_cost": 3000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.50,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Individual term loans for commercial ventures, agro-allied, and transport for minority beneficiaries."
    },

    # --- DNT / NT / SNT (SEED Scheme) ---
    "SEED_LIVELIHOOD": {
        "scheme_id": "SEED_LIVELIHOOD",
        "scheme_name": "SEED Scheme for Economic Empowerment of DNT / NT / SNT",
        "category": "SMALL_BUSINESS",
        "target_caste": "DNT",
        "apex_corp": "DWBDNC",
        "max_project_cost": 500000.00,
        "govt_share_percent": 95.00,
        "beneficiary_margin_percent": 5.00,
        "interest_rate_male": 5.00,
        "interest_rate_female": 4.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "description": "Central SEED welfare financing for De-notified, Nomadic, and Semi-Nomadic communities."
    },

    # --- EWS & GEN / Open Category (National Central Welfare) ---
    "PMEGP_SUBSIDY": {
        "scheme_id": "PMEGP_SUBSIDY",
        "scheme_name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "category": "TERM",
        "target_caste": "GEN",
        "apex_corp": "KVIC / MSME",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.50,
        "moratorium_months": 6,
        "max_tenure_years": 7,
        "description": "Credit-linked subsidy program with up to 25% (urban) to 35% (rural/special category) government margin subsidy."
    },
    "PM_MUDRA_TARUN": {
        "scheme_id": "PM_MUDRA_TARUN",
        "scheme_name": "Pradhan Mantri MUDRA Yojana (Tarun / Kishore Category)",
        "category": "SMALL_BUSINESS",
        "target_caste": "GEN",
        "apex_corp": "MUDRA / SIDBI",
        "max_project_cost": 1000000.00,
        "govt_share_percent": 85.00,
        "beneficiary_margin_percent": 15.00,
        "interest_rate_male": 7.50,
        "interest_rate_female": 7.00,
        "moratorium_months": 3,
        "max_tenure_years": 5,
        "description": "Collateral-free institutional credit up to ₹10.00 Lakh for micro and small non-farm enterprises."
    },
    "PM_SVANIDHI": {
        "scheme_id": "PM_SVANIDHI",
        "scheme_name": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
        "category": "MICRO",
        "target_caste": "EWS",
        "apex_corp": "MoHUA / SIDBI",
        "max_project_cost": 50000.00,
        "govt_share_percent": 100.00,
        "beneficiary_margin_percent": 0.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 7.00,
        "moratorium_months": 1,
        "max_tenure_years": 2,
        "description": "Working capital loan with 7% interest subsidy for urban street vendors and micro traders."
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
