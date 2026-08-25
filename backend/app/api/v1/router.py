from fastapi import APIRouter
from app.api.v1.endpoints import auth, ocr, financial, routing, voice

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(financial.router, prefix="/financial", tags=["financial"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["ocr"])
api_router.include_router(routing.router, prefix="/routing", tags=["routing"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])

