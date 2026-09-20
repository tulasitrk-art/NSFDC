from typing import Dict, Any, Optional
from app.core.constants import STATUTORY_SCHEMES

def recommend_scheme(
    gender: str = "FEMALE",
    project_cost: float = 140000.0,
    activity_purpose: str = "RETAIL",
    beneficiary_type: str = "INDIVIDUAL",
    state_code: Optional[str] = None,
    caste_category: Optional[str] = "SC"
) -> Dict[str, Any]:
    """
    Automated Multi-Factor Matching Engine:
    Maps beneficiary social category, loan cost, sector activity, and state across India's 5,000+ welfare schemes.
    Supports SC, ST, OBC, OBC-NCL, EWS, GEN, EBC, DNT, NT, SNT, PwD, and Minorities (MUS, CHR, SIK, BUD, JAI, PAR).
    """
    g = (gender or "FEMALE").upper()
    act = (activity_purpose or "RETAIL").upper()
    cost = float(project_cost or 140000.0)
    st = (state_code or "").upper()
    caste = (caste_category or "SC").upper()

    # 1. Category Specific Scheme Matching

    # --- Scheduled Tribes (ST - NSTFDC) ---
    if caste == "ST":
        if g == "FEMALE" and cost <= 200000.0:
            matched_scheme_id = "NSTFDC_AMSY"
        elif cost <= 500000.0:
            matched_scheme_id = "NSTFDC_MICRO"
        else:
            matched_scheme_id = "NSTFDC_TL"
        return STATUTORY_SCHEMES.get(matched_scheme_id, STATUTORY_SCHEMES["NSFDC_MCF"])

    # --- OBC / OBC-NCL / EBC (NBCFDC) ---
    elif caste in ["OBC", "OBC_NCL", "EBC"]:
        if g == "FEMALE" and cost <= 200000.0:
            matched_scheme_id = "NBCFDC_SWARNIMA"
        elif "ARTISAN" in act or "CRAFT" in act or "HANDLOOM" in act:
            matched_scheme_id = "NBCFDC_SHILP"
        else:
            matched_scheme_id = "NBCFDC_SAKSHAM"
        return STATUTORY_SCHEMES.get(matched_scheme_id, STATUTORY_SCHEMES["NSFDC_MCF"])

    # --- Persons with Disabilities (PwD / Divyangjan - NHFDC) ---
    elif caste == "PWD":
        if cost <= 100000.0:
            matched_scheme_id = "NHFDC_VISHESH"
        else:
            matched_scheme_id = "NHFDC_SWAVALAMBAN"
        return STATUTORY_SCHEMES.get(matched_scheme_id, STATUTORY_SCHEMES["NSFDC_MCF"])

    # --- Minorities (NMDFC: MUS, CHR, SIK, BUD, JAI, PAR) ---
    elif caste.startswith("MIN_") or caste in ["MUS", "CHR", "SIK", "BUD", "JAI", "PAR"]:
        if "ARTISAN" in act or "CRAFT" in act:
            matched_scheme_id = "NMDFC_VIRASAT"
        elif g == "FEMALE" and cost <= 140000.0:
            matched_scheme_id = "NMDFC_MAHILA_SAMRIDDHI"
        else:
            matched_scheme_id = "NMDFC_TL"
        return STATUTORY_SCHEMES.get(matched_scheme_id, STATUTORY_SCHEMES["NSFDC_MCF"])

    # --- De-notified & Nomadic Tribes (DNT / NT / SNT - SEED) ---
    elif caste in ["DNT", "NT", "SNT"]:
        return STATUTORY_SCHEMES.get("SEED_LIVELIHOOD", STATUTORY_SCHEMES["NSFDC_MCF"])

    # --- EWS & GEN / Open Category & OBC-CL (Central Welfare Programs) ---
    elif caste in ["EWS", "GEN", "OBC_CL"]:
        if cost <= 50000.0 and ("STREET" in act or "VENDOR" in act or "RETAIL" in act or "TEA" in act):
            matched_scheme_id = "PM_SVANIDHI"
        elif cost <= 1000000.0:
            matched_scheme_id = "PM_MUDRA_TARUN"
        else:
            matched_scheme_id = "PMEGP_SUBSIDY"
        return STATUTORY_SCHEMES.get(matched_scheme_id, STATUTORY_SCHEMES["NSFDC_MCF"])

    # 2. State-specific SCDC check for Scheduled Castes
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

    # 3. National Core NSFDC Scheme Matching
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
