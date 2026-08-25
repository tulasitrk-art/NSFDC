from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def get_auth_status():
    return {"status": "ok", "service": "NSFDC Authentication API Gateway"}
