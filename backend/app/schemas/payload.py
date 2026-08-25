from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class UserGender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    TRANSGENDER = "TRANSGENDER"

class PartnerTier(str, Enum):
    SCA = "SCA"
    PSB = "PSB"
    RRB = "RRB"
    NBFC_MFI = "NBFC_MFI"

class ApplicationStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    DOCS_VERIFIED = "DOCS_VERIFIED"
    ROUTED_TO_CHANNEL = "ROUTED_TO_CHANNEL"
    FIELD_INSPECTED = "FIELD_INSPECTED"
    SANCTIONED = "SANCTIONED"
    DISBURSED = "DISBURSED"
    REJECTED = "REJECTED"

# --- Financial Schemas ---
class FinancialCalculationRequest(BaseModel):
    project_cost: float = Field(..., gt=0, description="Total project cost in INR")
    annual_family_income: float = Field(..., description="Annual family income in INR")
    gender: UserGender = Field(..., description="Gender of applicant")
    scheme_id: str = Field(..., description="Target NSFDC scheme ID")

class FinancialCalculationResponse(BaseModel):
    scheme_id: str
    scheme_name: str
    project_cost: float
    annual_family_income: float
    principal_loan_amount: float
    beneficiary_margin_money: float
    govt_share_percent: float
    beneficiary_margin_percent: float
    applied_interest_rate: float
    moratorium_months: int
    total_tenure_years: int
    active_repayment_months: int
    monthly_emi: float
    total_repayment: float
    statutory_eligible: bool = True

# --- OCR Schemas ---
class OCRVerificationResponse(BaseModel):
    confidence_score: float
    extracted_certificate_number: Optional[str] = None
    issuing_authority: Optional[str] = None
    community_match: bool
    extracted_keywords: List[str]
    raw_text_preview: str

# --- Routing Schemas ---
class SpatialRoutingRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(default=25.0, gt=0)

class ChannelPartnerResponse(BaseModel):
    partner_id: int
    partner_name: str
    partner_type: str
    branch_name: str
    lat: float
    lon: float
    distance_km: float
    allocated_quota: float
    utilized_quota: float
    remaining_quota: float
    npa_percentage: float
    r_score: float
    officer_name: Optional[str] = None
    officer_contact: Optional[str] = None
    pin_status: str # GREEN, YELLOW, RED_PRUNED

class SpatialRoutingResponse(BaseModel):
    applicant_lat: float
    applicant_lon: float
    total_found: int
    valid_routes: int
    branches: List[ChannelPartnerResponse]

# --- Application & Lead Schemas ---
class ApplicationCreateRequest(BaseModel):
    applicant_name: str
    contact_number: str
    gender: UserGender
    annual_income: float
    project_cost: float
    scheme_id: str
    routed_partner_id: Optional[int] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    ocr_verified: bool = False

class ApplicationResponse(BaseModel):
    application_id: str
    applicant_name: str
    contact_number: str
    gender: str
    annual_income: float
    project_cost: float
    scheme_id: Optional[str]
    routed_partner_id: Optional[int]
    status: str
    ocr_verified: bool
    created_at: str
    partner_name: Optional[str] = None
    branch_name: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    new_status: ApplicationStatus
    officer_notes: Optional[str] = None
