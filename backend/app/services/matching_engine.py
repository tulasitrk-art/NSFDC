from typing import Dict, Any, Optional
from app.core.constants import STATUTORY_SCHEMES

def recommend_scheme(
    gender: str = "FEMALE",
    project_cost: float = 140000.0,
    activity_purpose: str = "RETAIL",
    beneficiary_type: str = "INDIVIDUAL",
    state_code: Optional[str] = None
) -> Dict[str, Any]:
    """
    Automated Multi-Factor Matching Engine:
    Maps beneficiary profile, loan cost, sector activity, and state to the optimal scheme across 330+ schemes.
    Preserves exact 100% backward compatibility with core NSFDC statutory fallbacks.
    """
    g = (gender or "FEMALE").upper()
    act = (activity_purpose or "RETAIL").upper()
    cost = float(project_cost or 140000.0)
    st = (state_code or "").upper()

    # 1. State-specific SCDC check if state_code is provided
    if st and st != "ALL":
        target_sector_code = None
        if "SANITATION" in act or "SWACHHTA" in act or "CLEANING" in act or "SAFAI" in act:
            target_sector_code = "SAN"
        elif "GREEN" in act or "SOLAR" in act or "RICKSHAW" in act or "E-VEHICLE" in act or "EV" in act:
            target_sector_code = "GREEN"
        elif "EDUCATION" in act or "COLLEGE" in act or "DEGREE" in act or "STUDY" in act:
            target_sector_code = "EDU"
        elif "ARTISAN" in act or "HANDLOOM" in act or "POTTERY" in act or "CRAFT" in act or "WEAVING" in act:
            target_sector_code = "CRAFT"
        elif "DAIRY" in act or "COW" in act or "BUFFALO" in act or "MILK" in act or "ANIMAL" in act or "POULTRY" in act:
            target_sector_code = "DAIRY"
        elif "AGRI" in act or "FARMING" in act or "GOAT" in act or "FLORICULTURE" in act or "CROP" in act:
            target_sector_code = "AGRI"
        elif "MFG" in act or "WORKSHOP" in act or "FABRICATION" in act or "INDUSTRY" in act or "PLANT" in act:
            target_sector_code = "MFG"
        elif "TRANS" in act or "VEHICLE" in act or "CARGO" in act or "LOGISTICS" in act or "AUTO" in act:
            target_sector_code = "TRANS"
        elif g == "FEMALE" and ("WOMEN" in act or "SHG" in act or "TAILORING" in act or "BEAUTY" in act):
            target_sector_code = "WOMEN"
        elif "RETAIL" in act or "SHOP" in act or "STORE" in act or "VENDOR" in act or "TEA" in act:
            target_sector_code = "RETAIL"

        if target_sector_code:
            state_scheme_id = f"SCDC_{st}_{target_sector_code}"
            if state_scheme_id in STATUTORY_SCHEMES:
                return STATUTORY_SCHEMES[state_scheme_id]

    # 2. National Core NSFDC Scheme Matching
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
