import { NextRequest, NextResponse } from "next/server";

// Clean emojis, markdown, and symbols for crisp, native speech pronunciation
function cleanTextForTTS(raw: string): string {
  return raw
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D/g, " ")
    .replace(/[#*`_~₹]/g, " ")
    .replace(/\s*•\s*/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

// Split into safe sub-chunks under 130 characters for high-reliability TTS stream
function splitIntoChunks(text: string, maxLen: number = 130): string[] {
  const parts = text.split(/([.?!।|\n]+)/g);
  const chunks: string[] = [];
  let current = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    if ((current + part).length <= maxLen) {
      current += part;
    } else {
      if (current.trim()) {
        chunks.push(current.trim());
      }
      if (part.length > maxLen) {
        const subParts = part.split(/([,;\s]+)/g);
        let subCurr = "";
        for (const sub of subParts) {
          if ((subCurr + sub).length <= maxLen) {
            subCurr += sub;
          } else {
            if (subCurr.trim()) chunks.push(subCurr.trim());
            subCurr = sub;
          }
        }
        current = subCurr;
      } else {
        current = part;
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text.slice(0, 130)];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawText = searchParams.get("text") || "";
  const lang = searchParams.get("lang") || "en";

  const cleanedText = cleanTextForTTS(rawText);
  if (!cleanedText) {
    return new NextResponse("Text is required", { status: 400 });
  }

  // 1. Try FastAPI backend TTS service if available
  try {
    const backendUrl = `http://127.0.0.1:8000/api/v1/voice/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(cleanedText.slice(0, 500))}`;
    const res = await fetch(backendUrl, { cache: "no-store" });
    if (res.ok) {
      const audioBuffer = await res.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": "inline; filename=speech.mp3",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (err) {
    // Backend offline or unreachable, proceed to high-reliability chunked upstream
  }

  // 2. High-reliability Chunked Google TTS upstream
  try {
    const chunks = splitIntoChunks(cleanedText);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const upstreamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(upstreamUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuf));
      }
    }

    if (audioBuffers.length > 0) {
      const combinedBuffer = Buffer.concat(audioBuffers);
      return new NextResponse(combinedBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": "inline; filename=speech.mp3",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (err2) {
    console.error("TTS upstream chunk error:", err2);
  }

  return new NextResponse("TTS Synthesis Failed", { status: 500 });
}
