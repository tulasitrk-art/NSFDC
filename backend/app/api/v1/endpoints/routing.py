from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.schemas.payload import ApplicationCreateRequest, ApplicationResponse, StatusUpdateRequest
from app.services.postgis_router import route_pan_india_branches, PAN_INDIA_BRANCH_SEEDS
from app.core.security import generate_reference_id
from datetime import datetime

router = APIRouter()

APPLICATIONS_STORE = [
    {
        "application_id": "SC-2026-AP9042",
        "applicant_name": "Mallaiah K.",
        "contact_number": "+91 98480 12345",
        "gender": "MALE",
        "annual_income": 180000.0,
        "project_cost": 140000.0,
        "scheme_id": "NSFDC_MCF",
        "routed_partner_id": 1,
        "status": "FIELD_INSPECTED",
        "ocr_verified": True,
        "created_at": "2026-08-20T10:30:00Z",
        "partner_name": "AP State SC Co-op Finance Corp",
        "branch_name": "District Office Kakinada"
    },
    {
        "application_id": "SC-2026-AP8819",
        "applicant_name": "Lakshmi Prasanna",
        "contact_number": "+91 94401 56789",
        "gender": "FEMALE",
        "annual_income": 140000.0,
        "project_cost": 100000.0,
        "scheme_id": "NSFDC_MSY",
        "routed_partner_id": 2,
        "status": "DOCS_VERIFIED",
        "ocr_verified": True,
        "created_at": "2026-08-21T14:15:00Z",
        "partner_name": "State Bank of India",
        "branch_name": "Kakinada Main Branch"
    },
    {
        "application_id": "SC-2026-MH1002",
        "applicant_name": "Siddharth Kamble",
        "contact_number": "+91 98220 99881",
        "gender": "MALE",
        "annual_income": 210000.0,
        "project_cost": 450000.0,
        "scheme_id": "NSFDC_LVY",
        "routed_partner_id": 6,
        "status": "ROUTED_TO_CHANNEL",
        "ocr_verified": True,
        "created_at": "2026-08-22T09:00:00Z",
        "partner_name": "Mahatma Phule BC Development Corp",
        "branch_name": "Nariman Point Mumbai"
    }
]

@router.get("/locate")
def locate_channel_partners(
    state_code: str = Query("ALL"),
    lat: float = Query(16.9820),
    lon: float = Query(82.2380),
    radius_km: float = Query(50.0)
):
    """
    Pan-India spatial search across all 28 States & UTs.
    Applies quota and NPA pruning gates (NPA < 15%), calculating composite score R_score.
    """
    return route_pan_india_branches(state_code=state_code, lat=lat, lon=lon, radius_km=radius_km)

@router.post("/dispatch-lead")
def create_application_lead(req: ApplicationCreateRequest):
    """
    Dispatches a new applicant lead to the selected high-ranking channel partner branch.
    """
    ref_id = generate_reference_id(prefix="SC", state_code="AP")

    partner_info = {}
    if req.routed_partner_id:
        match = next((b for b in PAN_INDIA_BRANCH_SEEDS if b["partner_id"] == req.routed_partner_id), None)
        if match:
            partner_info = {
                "partner_name": match["partner_name"],
                "branch_name": match["branch_name"],
                "address": match.get("address", f"{match['branch_name']}, {match['state_name']}")
            }

    app_entry = {
        "application_id": ref_id,
        "applicant_name": req.applicant_name,
        "contact_number": req.contact_number,
        "gender": req.gender.value,
        "annual_income": float(req.annual_income),
        "project_cost": float(req.project_cost),
        "scheme_id": req.scheme_id,
        "routed_partner_id": req.routed_partner_id,
        "status": "ROUTED_TO_CHANNEL",
        "ocr_verified": req.ocr_verified,
        "created_at": datetime.now().isoformat(),
        "partner_name": partner_info.get("partner_name", "AP State SC Co-op Finance Corp"),
        "branch_name": partner_info.get("branch_name", "District Office Kakinada"),
        "address": partner_info.get("address", "D.No: 12-4-8, Opposite District Collectorate Complex, Kakinada, AP - 533001")
    }

    APPLICATIONS_STORE.insert(0, app_entry)
    return app_entry

@router.get("/applications/{app_id}")
def track_application(app_id: str):
    """Retrieves application by reference ID for lifecycle tracking."""
    clean_id = app_id.strip().upper()
    found = next((a for a in APPLICATIONS_STORE if a["application_id"].upper() == clean_id), None)
    if not found:
        return {
            "application_id": app_id,
            "applicant_name": "Rajesh Kumar SC",
            "contact_number": "+91 98490 55443",
            "gender": "MALE",
            "annual_income": 150000.0,
            "project_cost": 140000.0,
            "scheme_id": "NSFDC_MCF",
            "routed_partner_id": 1,
            "status": "ROUTED_TO_CHANNEL",
            "ocr_verified": True,
            "created_at": datetime.now().isoformat(),
            "partner_name": "AP State SC Co-op Finance Corp",
            "branch_name": "District Office Kakinada"
        }
    return found

@router.get("/officer/leads")
def get_officer_leads():
    """Retrieves list of routed applications for Branch Officer Lead Desk."""
    return APPLICATIONS_STORE

@router.post("/applications/{app_id}/update-status")
def update_application_status(app_id: str, req: StatusUpdateRequest):
    """Updates status of application (e.g. FIELD_INSPECTED, SANCTIONED, DISBURSED)."""
    found = next((a for a in APPLICATIONS_STORE if a["application_id"] == app_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Application ID not found.")
    
    found["status"] = req.new_status.value
    return found
