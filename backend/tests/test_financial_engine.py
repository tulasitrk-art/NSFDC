import pytest
from fastapi import HTTPException
from app.services.financial_engine import calculate_amortization
from app.core.constants import CATEGORY_INCOME_CEILINGS
from app.schemas.payload import UserGender, CasteCategory

def test_income_hard_gate_exceeded_sc():
    """Verify HTTP 422 raised when annual income > 500,000 INR for SC category"""
    with pytest.raises(HTTPException) as exc_info:
        calculate_amortization(
            project_cost=100000.0,
            annual_family_income=550000.0, # Exceeds 500k SC limit
            gender=UserGender.MALE.value,
            scheme_id="NSFDC_MCF",
            caste_category=CasteCategory.SC.value
        )
    assert exc_info.value.status_code == 422
    assert exc_info.value.detail["error"] == "STATUTORY_INELIGIBILITY_INCOME_EXCEEDED"

def test_st_higher_income_ceiling():
    """Verify ST category allows up to 600,000 INR annual income"""
    result = calculate_amortization(
        project_cost=200000.0,
        annual_family_income=550000.0, # Passes 600k ST ceiling
        gender=UserGender.FEMALE.value,
        scheme_id="NSTFDC_AMSY",
        caste_category=CasteCategory.ST.value
    )
    assert result["principal_loan_amount"] == 180000.0 # 90%
    assert result["applied_interest_rate"] == 4.00 # 4% AMSY concessional rate
    assert result["monthly_emi"] > 0

def test_obc_ncl_income_ceiling_and_swarnima():
    """Verify OBC_NCL allows up to 800,000 INR income and applies New Swarnima 5.0% rate"""
    result = calculate_amortization(
        project_cost=200000.0,
        annual_family_income=750000.0, # Passes 800k OBC-NCL ceiling
        gender=UserGender.FEMALE.value,
        scheme_id="NBCFDC_SWARNIMA",
        caste_category=CasteCategory.OBC_NCL.value
    )
    assert result["principal_loan_amount"] == 190000.0 # 95%
    assert result["applied_interest_rate"] == 5.00
    assert result["moratorium_months"] == 6

def test_nmdfc_minority_scheme():
    """Verify NMDFC Virasat scheme for minorities (4.0% female, 5.0% male)"""
    result = calculate_amortization(
        project_cost=500000.0,
        annual_family_income=400000.0,
        gender=UserGender.FEMALE.value,
        scheme_id="NMDFC_VIRASAT",
        caste_category=CasteCategory.MIN_MUS.value
    )
    assert result["principal_loan_amount"] == 450000.0 # 90%
    assert result["applied_interest_rate"] == 4.00

def test_general_pmegp_scheme():
    """Verify PMEGP general enterprise subsidy calculation"""
    result = calculate_amortization(
        project_cost=1000000.0,
        annual_family_income=900000.0,
        gender=UserGender.MALE.value,
        scheme_id="PMEGP_SUBSIDY",
        caste_category=CasteCategory.GEN.value
    )
    assert result["principal_loan_amount"] == 900000.0 # 90%
    assert result["applied_interest_rate"] == 7.00

def test_mcf_female_concessional_rate():
    """Verify NSFDC MCF scheme female concessional interest rate (5.50%) and 90% loan share"""
    result = calculate_amortization(
        project_cost=100000.0,
        annual_family_income=180000.0,
        gender=UserGender.FEMALE.value,
        scheme_id="NSFDC_MCF",
        caste_category=CasteCategory.SC.value
    )
    assert result["principal_loan_amount"] == 90000.0
    assert result["applied_interest_rate"] == 5.50
    assert result["moratorium_months"] == 3
    assert result["active_repayment_months"] == 33
    assert result["monthly_emi"] > 0
