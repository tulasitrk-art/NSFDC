from sqlalchemy import Column, String, Numeric, Enum as SQLEnum
import enum
from app.db.base import Base

class UserGender(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    TRANSGENDER = "TRANSGENDER"

class Applicant(Base):
    __tablename__ = "applicants"

    applicant_id = Column(String(64), primary_key=True)
    applicant_name = Column(String(128), nullable=False)
    contact_number = Column(String(16), nullable=False)
    gender = Column(SQLEnum(UserGender), nullable=False)
    annual_income = Column(Numeric(12, 2), nullable=False)
