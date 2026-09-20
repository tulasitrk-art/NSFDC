from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from app.schemas.payload import FinancialCalculationRequest, FinancialCalculationResponse
from app.services.financial_engine import calculate_amortization
from app.services.matching_engine import recommend_scheme
from app.core.constants import STATUTORY_SCHEMES, INDIAN_STATES

router = APIRouter()

@router.post("/calculate", response_model=FinancialCalculationResponse)
def compute_amortization_schedule(req: FinancialCalculationRequest):
    """
    Computes Concessional Loan Amortization Schedule across all welfare categories.
    Enforces category-specific statutory income ceilings.
    """
    result = calculate_amortization(
        project_cost=req.project_cost,
        annual_family_income=req.annual_family_income,
        gender=req.gender,
        scheme_id=req.scheme_id,
        caste_category=req.caste_category
    )
    return result

@router.post("/recommend-scheme")
def match_beneficiary_scheme(payload: Dict[str, Any]):
    """
    Matches applicant social category, activity, cost, gender, and state to recommended scheme.
    """
    gender = payload.get("gender", "FEMALE")
    cost = float(payload.get("project_cost", 140000.0))
    activity = payload.get("activity_purpose", "RETAIL")
    state_code = payload.get("state_code")
    caste_category = payload.get("caste_category", "SC")
    
    scheme_data = recommend_scheme(
        gender=gender,
        project_cost=cost,
        activity_purpose=activity,
        state_code=state_code,
        caste_category=caste_category
    )
    return scheme_data

@router.get("/schemes")
def get_all_statutory_schemes(
    category: Optional[str] = None,
    target_caste: Optional[str] = None,
    state_code: Optional[str] = None,
    search: Optional[str] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = 0
):
    """
    Returns directory of statutory schemes (over 330 schemes across Central Apex and State SCDCs).
    Supports optional filtering by category, target_caste, state, and search query.
    """
    all_schemes = list(STATUTORY_SCHEMES.values())

    filtered = all_schemes
    if state_code and state_code.upper() != "ALL":
        st = state_code.upper()
        filtered = [
            s for s in filtered
            if s.get("state_code", "ALL") in ["ALL", st]
        ]

    if target_caste and target_caste.upper() != "ALL":
        tc = target_caste.upper()
        filtered = [
            s for s in filtered
            if s.get("target_caste", "SC").upper() == tc or s.get("target_caste", "ALL").upper() == "ALL"
        ]

    if category and category.upper() != "ALL":
        cat = category.upper()
        filtered = [
            s for s in filtered
            if s.get("category", "").upper() == cat
        ]

    if search:
        q = search.lower()
        filtered = [
            s for s in filtered
            if q in s.get("scheme_name", "").lower()
            or q in s.get("scheme_id", "").lower()
            or q in s.get("description", "").lower()
            or q in s.get("sector_name", "").lower()
        ]

    if limit is not None and limit > 0:
        start = offset or 0
        return filtered[start:start + limit]

    return filtered

@router.get("/states")
def get_all_indian_states():
    """Returns directory of all 28 Indian States & UTs."""
    return INDIAN_STATES
