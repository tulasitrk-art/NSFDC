import pytest
import io
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient
from app.main import app
from app.services.ocr_service import detect_certificate_category, check_certificate_expiry, extract_certificate_data

client = TestClient(app)

def test_ocr_verify_non_image_type():
    """Verify 400 error when uploading a non-image file."""
    response = client.post(
        "/api/v1/ocr/verify-certificate",
        files={"file": ("doc.txt", b"Hello World", "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_check_certificate_expiry_valid():
    text = "GOVERNMENT OF ANDHRA PRADESH REVENUE DEPARTMENT SCHEDULED CASTE CERTIFICATE VALID UPTO 31/12/2030"
    res = check_certificate_expiry(text)
    assert res["has_expiry"] is True
    assert res["is_expired"] is False
    assert res["validity_status"] == "VALID"
    assert res["expiry_date"] == "31/12/2030"

def test_check_certificate_expiry_expired():
    text = "COMMUNITY CERTIFICATE TAHSILDAR SUB-DIVISIONAL OFFICER EXPIRY DATE: 15/08/2020"
    res = check_certificate_expiry(text)
    assert res["has_expiry"] is True
    assert res["is_expired"] is True
    assert res["validity_status"] == "EXPIRED"
    assert res["expiry_date"] == "15/08/2020"

def test_check_certificate_expiry_lifetime():
    text = "REVENUE DEPARTMENT TAHSILDAR CASTE CERTIFICATE SCHEDULED CASTE NO EXPIRY MENTIONED"
    res = check_certificate_expiry(text)
    assert res["has_expiry"] is False
    assert res["is_expired"] is False
    assert res["validity_status"] == "LIFETIME_VALID"

def test_detect_category_sc():
    text = "OFFICE OF THE TAHSILDAR COMMUNITY CERTIFICATE SCHEDULED CASTE CERTIFICATE UNDER THE CONSTITUTION (SCHEDULED CASTES) ORDER 1950"
    det = detect_certificate_category(text, "SC")
    assert det["detected_category"] == "SC"
    assert det["has_category_match"] is True

def test_detect_category_st():
    text = "GOVERNMENT OF ODISHA REVENUE DEPARTMENT SCHEDULED TRIBE CERTIFICATE ADIVASI TRIBAL WELFARE ITDA"
    det = detect_certificate_category(text, "ST")
    assert det["detected_category"] == "ST"
    assert det["has_category_match"] is True

def test_detect_category_obc_ncl():
    text = "GOVERNMENT OF RAJASTHAN OTHER BACKWARD CLASS CERTIFICATE NON CREAMY LAYER CERTIFICATE ANNUAL INCOME LESS THAN EIGHT LAKH"
    det = detect_certificate_category(text, "OBC_NCL")
    assert det["detected_category"] == "OBC_NCL"
    assert det["has_category_match"] is True

def test_detect_category_ews():
    text = "INCOME AND ASSET CERTIFICATE TO BE PRODUCED BY ECONOMICALLY WEAKER SECTIONS EWS TEHSILDAR"
    det = detect_certificate_category(text, "EWS")
    assert det["detected_category"] == "EWS"
    assert det["has_category_match"] is True

def test_detect_category_pwd():
    text = "UNIQUE DISABILITY ID UDID CARD MEDICAL BOARD DISABILITY CERTIFICATE PERSON WITH DISABILITIES DIVYANGJAN"
    det = detect_certificate_category(text, "PWD")
    assert det["detected_category"] == "PWD"
    assert det["has_category_match"] is True

def test_detect_category_minority():
    text = "NATIONAL MINORITY DECLARATION MUSLIM MINORITY COMMUNITY WELFARE STATE MINORITIES FINANCE CORPORATION"
    det = detect_certificate_category(text, "MIN_MUS")
    assert det["detected_category"] == "MIN_MUS"
    assert det["has_category_match"] is True
