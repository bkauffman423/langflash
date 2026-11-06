#!/usr/bin/env python3
"""Regenerate bundled Farsi clips for ALL fa decks into a voice-specific dir.

    .venv/bin/python tools/gen_fa_audio_all.py fa-IR-TorresNeural data/audio/fa-torres
    .venv/bin/python tools/gen_fa_audio_all.py fa-IR-DilaraNeural data/audio/fa

Writes clips at the SAME relative filenames as the deck's current "audio"
field but rooted under the given dir (e.g. data/audio/fa-torres/basics/b-04.mp3).
Deck JSONs are NOT modified — switching a voice is a later deck-audio-path
rewrite plus a BUILD bump. Dirs are populated idempotently (skip existing).
"""
import asyncio, json, os, sys

try:
    import edge_tts
except ImportError:
    sys.exit("needs edge-tts:  pip install 'edge-tts>=7.3.1'")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DECKS = [
    "data/decks/fa-core.json",
    "data/decks/fa-basics.json",
    "data/decks/fa-lesson-intro-verbs.json",
    "data/decks/fa-lesson-conj-past.json",
]
SEM = asyncio.Semaphore(3)  # be gentle with the free edge endpoint


async def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    voice, out_dir = sys.argv[1], sys.argv[2]
    jobs = []
    for deck_rel in DECKS:
        deck = json.load(open(os.path.join(ROOT, deck_rel), encoding="utf-8"))
        for i, it in enumerate(deck["items"]):
            jobs.append((voice, it["back"], it.get("audio"), out_dir))
    done = failed = 0

    async def one(voice, text, old_rel, out_dir):
        nonlocal done, failed
        if not old_rel:
            return
        new_rel = old_rel.replace("data/audio/fa/", out_dir + "/", 1)
        path = os.path.join(ROOT, new_rel)
        if os.path.exists(path):
            done += 1
            return
        async with SEM:
            for attempt in range(3):
                try:
                    os.makedirs(os.path.dirname(path), exist_ok=True)
                    await edge_tts.Communicate(text, voice).save(path)
                    done += 1
                    return
                except Exception as e:
                    if attempt == 2:
                        failed += 1
                        print("FAIL", text, "->", new_rel, repr(e))
                    else:
                        await asyncio.sleep(2 * (attempt + 1))

    await asyncio.gather(*(one(*j) for j in jobs))
    print(f"voice={voice} dir={out_dir} done={done} failed={failed} total={len(jobs)}")


asyncio.run(main())
