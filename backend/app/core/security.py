import secrets
from datetime import datetime, timedelta
from typing import Optional

def generate_reference_id(prefix: str = "SC", state_code: str = "AP") -> str:
    """Generate a unique Gov application reference number like #SC-2026-AP9042"""
    year = datetime.now().year
    random_digits = secrets.randbelow(9000) + 1000
    return f"{prefix}-{year}-{state_code}{random_digits}"
