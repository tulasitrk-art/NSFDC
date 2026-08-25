import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NSFDC Concessional Loan Portal API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://nsfdc_admin:nsfdc_secure_password@localhost:5432/nsfdc_portal_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nsfdc_secret_key_gov_india_prod_2026")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    class Config:
        case_sensitive = True

settings = Settings()
