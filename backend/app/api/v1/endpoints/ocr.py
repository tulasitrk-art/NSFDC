from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.ocr_service import extract_certificate_data

router = APIRouter()

@router.post("/verify-certificate")
async def verify_certificate(
    file: UploadFile = File(...),
    target_caste: Optional[str] = Form(None)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a clear image (PNG/JPEG/WEBP).")

    image_bytes = await file.read()
    return extract_certificate_data(
        image_bytes=image_bytes,
        content_type=file.content_type,
        target_caste=target_caste
    )
