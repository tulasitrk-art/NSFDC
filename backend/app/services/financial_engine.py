import math
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from app.core.constants import STATUTORY_SCHEMES, INCOME_CEILING_INR, CATEGORY_INCOME_CEILINGS

def calculate_amortization(
    project_cost: float,
    annual_family_income: float,
    gender: str,
    scheme_id: str,
    custom_scheme: Dict[str, Any] = None,
    caste_category: Optional[str] = "SC"
) -> Dict[str, Any]:
    """
    Computes Concessional Loan Amortization Schedule.
    Enforces Statutory Hard Gate based on scheme / caste category statutory ceilings.
    """
    target_scheme = custom_scheme or STATUTORY_SCHEMES.get(scheme_id) or STATUTORY_SCHEMES["NSFDC_MCF"]
    target_caste = target_scheme.get("target_caste", caste_category or "SC")
    
    statutory_ceiling = CATEGORY_INCOME_CEILINGS.get(target_caste, INCOME_CEILING_INR)
    
    # 1. STATUTORY HARD GATE ENFORCEMENT
    if annual_family_income > statutory_ceiling:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "STATUTORY_INELIGIBILITY_INCOME_EXCEEDED",
                "message": f"Annual family income ₹{annual_family_income:,.2f} exceeds ₹{statutory_ceiling:,.2f} statutory limit for {target_scheme['scheme_name']}.",
                "statutory_ceiling": statutory_ceiling,
                "submitted_income": annual_family_income
            }
        )

    g = gender.upper()

    # Select Concessional Interest Rate by Gender
    if g == "FEMALE":
        applied_interest_rate = float(target_scheme["interest_rate_female"])
    else:
        applied_interest_rate = float(target_scheme["interest_rate_male"])

    govt_share_pct = float(target_scheme["govt_share_percent"]) / 100.0
    beneficiary_margin_pct = float(target_scheme["beneficiary_margin_percent"]) / 100.0
    max_cap = float(target_scheme["max_project_cost"])

    # Principal Loan P = min(C * S_govt, C_max)
    calculated_govt_loan = project_cost * govt_share_pct
    principal_loan_amount = min(calculated_govt_loan, max_cap)

    # Margin Money = C - P
    beneficiary_margin_money = max(0.0, project_cost - principal_loan_amount)

    moratorium_months = int(target_scheme["moratorium_months"])
    total_tenure_years = int(target_scheme["max_tenure_years"])
    
    total_months = total_tenure_years * 12
    active_repayment_months = max(1, total_months - moratorium_months)

    monthly_interest_rate = (applied_interest_rate / 100.0) / 12.0

    if monthly_interest_rate > 0 and applied_interest_rate < 90:
        pow_factor = math.pow(1 + monthly_interest_rate, active_repayment_months)
        monthly_emi = principal_loan_amount * (monthly_interest_rate * pow_factor) / (pow_factor - 1)
    else:
        monthly_emi = principal_loan_amount / active_repayment_months

    total_repayment = monthly_emi * active_repayment_months

    return {
        "scheme_id": target_scheme["scheme_id"],
        "scheme_name": target_scheme["scheme_name"],
        "project_cost": round(project_cost, 2),
        "annual_family_income": round(annual_family_income, 2),
        "principal_loan_amount": round(principal_loan_amount, 2),
        "beneficiary_margin_money": round(beneficiary_margin_money, 2),
        "govt_share_percent": int(round(govt_share_pct * 100)),
        "beneficiary_margin_percent": int(round(beneficiary_margin_pct * 100)),
        "applied_interest_rate": round(applied_interest_rate, 2),
        "moratorium_months": moratorium_months,
        "total_tenure_years": total_tenure_years,
        "active_repayment_months": active_repayment_months,
        "monthly_emi": round(monthly_emi, 2),
        "total_repayment": round(total_repayment, 2),
        "statutory_eligible": True,
        "target_caste": target_caste,
        "apex_corporation": target_scheme.get("apex_corp", "NSFDC")
    }
