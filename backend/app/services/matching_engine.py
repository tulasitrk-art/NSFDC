from typing import Dict, Any
from app.core.constants import STATUTORY_SCHEMES

def recommend_scheme(
    gender: str,
    project_cost: float,
    activity_purpose: str,
    beneficiary_type: str = "INDIVIDUAL"
) -> Dict[str, Any]:
    """
    Automated Matching Engine Heuristics:
    Maps beneficiary profile, cost, and project activity to statutory NSFDC schemes.
    """
    g = gender.upper()
    act = activity_purpose.upper()
    cost = float(project_cost)

    matched_scheme_id = "NSFDC_MCF" # Default fallback

    if "SANITATION" in act or "SWACHHTA" in act or "CLEANING" in act or "SAFAI" in act:
        matched_scheme_id = "NSFDC_SUY"
    elif "GREEN" in act or "SOLAR" in act or "RICKSHAW" in act or "E-VEHICLE" in act:
        matched_scheme_id = "NSFDC_GBS"
    elif "ABROAD" in act or "OVERSEAS" in act or "FOREIGN" in act:
        matched_scheme_id = "NSFDC_ELS_O"
    elif "EDUCATION" in act or "COLLEGE" in act or "DOMESTIC" in act or "DEGREE" in act:
        matched_scheme_id = "NSFDC_ELS_D"
    elif "ARTISAN" in act or "HANDLOOM" in act or "POTTERY" in act or "CRAFT" in act:
        matched_scheme_id = "NSFDC_SSY"
    elif g == "FEMALE" and ("AGRI" in act or "FARMING" in act or "GOAT" in act or "FLORICULTURE" in act):
        matched_scheme_id = "NSFDC_MKY"
    elif g == "FEMALE" and cost <= 140000.0:
        matched_scheme_id = "NSFDC_MSY"
    elif cost > 140000.0 and cost <= 500000.0:
        matched_scheme_id = "NSFDC_LVY"
    elif cost > 500000.0:
        matched_scheme_id = "NSFDC_TL"
    else:
        matched_scheme_id = "NSFDC_MCF"

    scheme_def = STATUTORY_SCHEMES.get(matched_scheme_id, STATUTORY_SCHEMES["NSFDC_MCF"])
    return scheme_def
