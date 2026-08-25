import pytest
from fastapi import HTTPException
from app.services.financial_engine import calculate_amortization, INCOME_CEILING_INR
from app.schemas.payload import UserGender

def test_income_hard_gate_exceeded():
    """Verify HTTP 422 raised when annual income > 500,000 INR"""
    with pytest.raises(HTTPException) as exc_info:
        calculate_amortization(
            project_cost=100000.0,
            annual_family_income=550000.0, # Exceeds 500k limit
            gender=UserGender.MALE,
            scheme_id="NSFDC_MCF"
        )
    assert exc_info.value.status_code == 422
    assert exc_info.value.detail["error"] == "STATUTORY_INELIGIBILITY_INCOME_EXCEEDED"

def test_mcf_female_concessional_rate():
    """Verify MCF scheme female concessional interest rate (5.50%) and 90% loan share"""
    result = calculate_amortization(
        project_cost=100000.0,
        annual_family_income=180000.0,
        gender=UserGender.FEMALE,
        scheme_id="NSFDC_MCF"
    )
    assert result["principal_loan_amount"] == 90000.0
    assert result["beneficiary_margin_money"] == 10000.0
    assert result["applied_interest_rate"] == 5.50
    assert result["moratorium_months"] == 3
    assert result["active_repayment_months"] == 33
    assert result["monthly_emi"] > 0

def test_term_loan_male_rate():
    """Verify Term Loan male interest rate (7.50%)"""
    result = calculate_amortization(
        project_cost=500000.0,
        annual_family_income=300000.0,
        gender=UserGender.MALE,
        scheme_id="NSFDC_TL"
    )
    assert result["principal_loan_amount"] == 450000.0
    assert result["applied_interest_rate"] == 7.50
    assert result["moratorium_months"] == 6
    assert result["active_repayment_months"] == 54
