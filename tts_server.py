#!/usr/bin/env python3
"""LangFlash native-TTS helper.

Serves Microsoft Edge neural TTS audio for languages your browser has no
installed voice for — notably Farsi (fa-IR-DilaraNeural / fa-IR-FaridNeural).
Google's browser TTS endpoint has no Farsi voice; Edge's does.

Run:  python tts_server.py [port]     (default 8765)
The app auto-uses it at http://127.0.0.1:8765 when no system voice matches
the deck's target language. Requires: pip install "edge-tts>=7.3.1"
"""
import asyncio
import sys

from aiohttp import web
import edge_tts

DEFAULT_PORT = 8765

# one neural voice per language the app may need (extend freely)
VOICE_MAP = {
    "fa": "fa-IR-DilaraNeural",   # Farsi (Persian)
    "ar": "ar-SA-ZariyahNeural",
    "ur": "ur-PK-UzmaNeural",
    "hi": "hi-IN-SwaraNeural",
    "tr": "tr-TR-FeyyazNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "he": "he-IL-HilaNeural",
    "es": "es-ES-ElviraNeural",
    "fr": "fr-FR-DeniseNeural",
    "de": "de-DE-KatjaNeural",
    "en": "en-US-AriaNeural",
}


async def synthesize(text: str, voice: str) -> bytes:
    chunks = []
    communicate = edge_tts.Communicate(text, voice)
    async for msg in communicate.stream():
        if msg["type"] == "audio":
            chunks.append(msg["data"])
    return b"".join(chunks)


async def tts(request: web.Request) -> web.Response:
    text = (request.query.get("text") or "").strip()
    lang = (request.query.get("lang") or "fa").split("-")[0].lower()
    voice = request.query.get("voice") or VOICE_MAP.get(lang)
    if not text:
        return web.json_response({"error": "text required"}, status=400)
    if not voice:
        return web.json_response({"error": f"no voice mapped for lang '{lang}'"}, status=400)
    if len(text) > 400:
        text = text[:400]
    try:
        audio = await synthesize(text, voice)
    except Exception as e:  # network hiccup etc.
        return web.json_response({"error": str(e)}, status=502)
    if not audio:
        return web.json_response({"error": "empty audio"}, status=502)
    return web.Response(
        body=audio,
        content_type="audio/mpeg",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=86400",
            "X-TTS-Voice": voice,
        },
    )


async def health(_request: web.Request) -> web.Response:
    return web.json_response({"ok": True, "voices": len(VOICE_MAP)})


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    app = web.Application()
    app.router.add_get("/tts", tts)
    app.router.add_get("/health", health)
    print(f"LangFlash TTS helper on http://127.0.0.1:{port}  (Ctrl+C to stop)")
    web.run_app(app, host="127.0.0.1", port=port, print=None)


if __name__ == "__main__":
    main()
