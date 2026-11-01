#!/usr/bin/env python3
"""Generate bundled Farsi clips for any deck JSON and stamp "audio" paths into it.

    .venv/bin/python tools/gen_deck_audio.py data/decks/fa-lesson-intro-verbs.json lesson-intro-verbs liv

args: <deck.json relative to repo root> <audio subdir under data/audio/fa/> <filename prefix>
Clips are written to data/audio/fa/<subdir>/<prefix>-NN.mp3 (fa-IR-DilaraNeural).
Nothing on the user's side runs this — clips ship pre-generated (GitHub Pages
executes nothing; Google online TTS has no Farsi voice).
"""
import asyncio, json, os, sys

try:
    import edge_tts
except ImportError:
    sys.exit("needs edge-tts:  pip install 'edge-tts>=7.3.1'")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = "fa-IR-DilaraNeural"  # alternate: fa-IR-FaridNeural (male)


async def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    deck_rel, subdir, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
    deck_path = os.path.join(ROOT, deck_rel)
    outdir = os.path.join(ROOT, "data", "audio", "fa", subdir)
    os.makedirs(outdir, exist_ok=True)
    deck = json.load(open(deck_path, encoding="utf-8"))
    for i, it in enumerate(deck["items"]):
        rel = f"data/audio/fa/{subdir}/{prefix}-{i:02d}.mp3"
        await edge_tts.Communicate(it["back"], VOICE).save(os.path.join(ROOT, rel))
        it["audio"] = rel
        print(f"{i:02d}", it["back"], "->", rel)
    json.dump(deck, open(deck_path, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("deck updated with audio paths")


asyncio.run(main())
