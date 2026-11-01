#!/usr/bin/env python3
"""Regenerate the bundled Farsi audio clips (data/audio/fa/) and stamp
`"audio"` paths into data/decks/fa-core.json.

Run after editing fa-core.json text. Nothing on the user's side ever runs
this — clips ship pre-generated in the repo (GitHub Pages can't execute code;
Google online TTS has no Farsi voice, hence bundled audio).

    python -m venv .venv && .venv/bin/pip install "edge-tts>=7.3.1"
    .venv/bin/python tools/gen_fa_audio.py
"""
import asyncio, json, os, sys

try:
    import edge_tts
except ImportError:
    sys.exit("needs edge-tts:  pip install 'edge-tts>=7.3.1'")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DECK = os.path.join(ROOT, "data", "decks", "fa-core.json")
OUTDIR = os.path.join(ROOT, "data", "audio", "fa")
VOICE = "fa-IR-DilaraNeural"  # alternate: fa-IR-FaridNeural (male)


async def main():
    os.makedirs(OUTDIR, exist_ok=True)
    deck = json.load(open(DECK, encoding="utf-8"))
    for i, it in enumerate(deck["items"]):
        rel = f"data/audio/fa/fa-{i:02d}.mp3"
        await edge_tts.Communicate(it["back"], VOICE).save(
            os.path.join(ROOT, rel))
        it["audio"] = rel
        print(f"{i:02d}", it["back"], "->", rel)
    json.dump(deck, open(DECK, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("deck updated with audio paths")


asyncio.run(main())
