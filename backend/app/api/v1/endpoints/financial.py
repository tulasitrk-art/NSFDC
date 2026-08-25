from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
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
    Matches applicant activity, cost, and gender to recommended NSFDC scheme.
    """
    gender = payload.get("gender", "FEMALE")
    cost = float(payload.get("project_cost", 140000.0))
    activity = payload.get("activity_purpose", "RETAIL")
    
    scheme_data = recommend_scheme(gender, cost, activity)
    return scheme_data

@router.get("/schemes")
def get_all_statutory_schemes():
    """Returns directory of all 10 official NSFDC concessional schemes."""
    return list(STATUTORY_SCHEMES.values())

@router.get("/states")
def get_all_indian_states():
    """Returns directory of all 28 Indian States & UTs."""
    return INDIAN_STATES
