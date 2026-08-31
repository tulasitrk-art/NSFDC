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
    Computes NSFDC Concessional Loan Amortization Schedule.
    Enforces Statutory Hard Gate: annual_family_income <= 500,000.00 INR.
    """
    result = calculate_amortization(
        project_cost=req.project_cost,
        annual_family_income=req.annual_family_income,
        gender=req.gender,
        scheme_id=req.scheme_id
    )
    return result

@router.post("/recommend-scheme")
def match_beneficiary_scheme(payload: Dict[str, Any]):
    """
    Matches applicant activity, cost, gender, and state to recommended scheme.
    """
    gender = payload.get("gender", "FEMALE")
    cost = float(payload.get("project_cost", 140000.0))
    activity = payload.get("activity_purpose", "RETAIL")
    state_code = payload.get("state_code")
    
    scheme_data = recommend_scheme(
        gender=gender,
        project_cost=cost,
        activity_purpose=activity,
        state_code=state_code
    )
    return scheme_data

@router.get("/schemes")
def get_all_statutory_schemes(
    category: Optional[str] = None,
    state_code: Optional[str] = None,
    search: Optional[str] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = 0
):
    """
    Returns directory of statutory schemes (over 330 schemes across Central Apex and State SCDCs).
    Supports optional filtering by category, state, and search query.
    """
    all_schemes = list(STATUTORY_SCHEMES.values())

    filtered = all_schemes
    if state_code and state_code.upper() != "ALL":
        st = state_code.upper()
        filtered = [
            s for s in filtered
            if s.get("state_code", "ALL") in ["ALL", st]
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
