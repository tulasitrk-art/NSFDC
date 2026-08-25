import pytest
import io
from PIL import Image, ImageDraw, ImageFont
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_dummy_image(text: str) -> bytes:
    """Helper to generate an image in-memory with custom text rendered."""
    img = Image.new("RGB", (600, 200), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), text, fill=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def test_ocr_verify_non_image_type():
    """Verify 400 error when uploading a non-image file."""
    response = client.post(
        "/api/v1/ocr/verify-certificate",
        files={"file": ("doc.txt", b"Hello World", "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]
