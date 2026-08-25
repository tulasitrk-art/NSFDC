from sqlalchemy import Column, String, Numeric, Integer, Text, Enum as SQLEnum
import enum
from app.db.base import Base

class SchemeCategory(str, enum.Enum):
    MICRO = "MICRO"
    TERM = "TERM"
    EDU_DOMESTIC = "EDU_DOMESTIC"
    EDU_ABROAD = "EDU_ABROAD"

class Scheme(Base):
    __tablename__ = "schemes"

    scheme_id = Column(String(64), primary_key=True)
    scheme_name = Column(String(255), nullable=False)
    category = Column(SQLEnum(SchemeCategory), nullable=False)
    max_project_cost = Column(Numeric(14, 2), nullable=False)
    govt_share_percent = Column(Numeric(5, 2), nullable=False)
    beneficiary_margin_percent = Column(Numeric(5, 2), nullable=False)
    interest_rate_male = Column(Numeric(4, 2), nullable=False)
    interest_rate_female = Column(Numeric(4, 2), nullable=False)
    moratorium_months = Column(Integer, nullable=False)
    max_tenure_years = Column(Integer, nullable=False)
    guideline_url = Column(Text, nullable=True)
