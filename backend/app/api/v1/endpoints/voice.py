from fastapi import APIRouter, Query, Response, HTTPException
import io
import re
import urllib.parse
import urllib.request

router = APIRouter()

SUPPORTED_VOICE_LANGS = {
    "en": "en",
    "hi": "hi",
    "te": "te",
    "ta": "ta",
    "kn": "kn",
    "mr": "mr",
    "bn": "bn",
    "gu": "gu"
}

def clean_text_for_speech(raw: str) -> str:
    cleaned = re.sub(r'[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf\ufe00-\ufe0f]', ' ', raw)
    cleaned = re.sub(r'[#*`_~₹]', ' ', cleaned)
    cleaned = re.sub(r'\s*•\s*', '. ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def split_into_chunks(text: str, max_len: int = 130) -> list[str]:
    parts = re.split(r'([.?!।|\n]+)', text)
    chunks = []
    curr = ""
    for p in parts:
        if not p:
            continue
        if len(curr) + len(p) <= max_len:
            curr += p
        else:
            if curr.strip():
                chunks.append(curr.strip())
            curr = p
    if curr.strip():
        chunks.append(curr.strip())
    return chunks if chunks else [text[:130]]

@router.get("/tts")
def stream_tts_audio(
    text: str = Query(..., description="Text to synthesize to speech"),
    lang: str = Query("en", description="Language code: en, hi, te, ta, kn, mr, bn, gu")
):
    """
    Streams high-quality Indian regional speech audio in MP3 format.
    Supports Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, and English.
    """
    clean_lang = SUPPORTED_VOICE_LANGS.get(lang.lower(), "en")
    clean_text = clean_text_for_speech(text)[:1000]

    if not clean_text:
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

    # 1. Use local gTTS library
    try:
        from gtts import gTTS
        fp = io.BytesIO()
        tts = gTTS(text=clean_text, lang=clean_lang, slow=False)
        tts.write_to_fp(fp)
        fp.seek(0)
        return Response(content=fp.getvalue(), media_type="audio/mpeg", headers={
            "Content-Disposition": "inline; filename=speech.mp3",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*"
        })
    except Exception as e:
        # 2. Fallback to high-reliability chunked HTTP TTS stream
        try:
            chunks = split_into_chunks(clean_text)
            combined_bytes = bytearray()
            for chunk in chunks:
                tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={clean_lang}&q={urllib.parse.quote(chunk)}"
                req = urllib.request.Request(tts_url, headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                })
                with urllib.request.urlopen(req, timeout=5) as response:
                    combined_bytes.extend(response.read())

            if combined_bytes:
                return Response(content=bytes(combined_bytes), media_type="audio/mpeg", headers={
                    "Content-Disposition": "inline; filename=speech.mp3",
                    "Cache-Control": "public, max-age=3600",
                    "Access-Control-Allow-Origin": "*"
                })
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)} / {str(e2)}")
