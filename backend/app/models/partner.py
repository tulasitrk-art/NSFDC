from sqlalchemy import Column, Integer, String, Numeric, Boolean, Enum as SQLEnum
from geoalchemy2 import Geometry
import enum
from app.db.base import Base

class PartnerTier(str, enum.Enum):
    SCA = "SCA"
    PSB = "PSB"
    RRB = "RRB"
    NBFC_MFI = "NBFC_MFI"

class ChannelPartner(Base):
    __tablename__ = "channel_partners"

    partner_id = Column(Integer, primary_key=True, autoincrement=True)
    partner_name = Column(String(255), nullable=False)
    partner_type = Column(SQLEnum(PartnerTier), nullable=False)
    branch_name = Column(String(255), nullable=False)
    location = Column(Geometry('POINT', srid=4326), nullable=False)
    allocated_quota = Column(Numeric(14, 2), nullable=False)
    utilized_quota = Column(Numeric(14, 2), nullable=False)
    npa_percentage = Column(Numeric(5, 2), nullable=False)
    officer_name = Column(String(128), nullable=True)
    officer_contact = Column(String(32), nullable=True)
    is_active = Column(Boolean, default=True)
