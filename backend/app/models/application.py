from sqlalchemy import Column, String, Numeric, Integer, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import enum
from app.db.base import Base
from app.models.applicant import UserGender

class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    DOCS_VERIFIED = "DOCS_VERIFIED"
    ROUTED_TO_CHANNEL = "ROUTED_TO_CHANNEL"
    FIELD_INSPECTED = "FIELD_INSPECTED"
    SANCTIONED = "SANCTIONED"
    DISBURSED = "DISBURSED"
    REJECTED = "REJECTED"

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(String(64), primary_key=True)
    applicant_name = Column(String(128), nullable=False)
    contact_number = Column(String(16), nullable=False)
    gender = Column(SQLEnum(UserGender), nullable=False)
    annual_income = Column(Numeric(12, 2), nullable=False)
    project_cost = Column(Numeric(14, 2), nullable=False)
    scheme_id = Column(String(64), ForeignKey("schemes.scheme_id"), nullable=True)
    routed_partner_id = Column(Integer, ForeignKey("channel_partners.partner_id"), nullable=True)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.SUBMITTED)
    applicant_location = Column(Geometry('POINT', srid=4326), nullable=True)
    ocr_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
