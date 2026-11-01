# LangFlash — foreign-language flashcard trainer

Self-contained web app (vanilla JS, zero dependencies). Runs in any browser on
Windows, and installs as an Android app (PWA — Add to Home screen).

## Run it

```
python serve.py            # http://127.0.0.1:8123/index.html
```

- **Windows:** open the URL in Chrome/Edge. Optional: Edge ⋯ → Apps → "Install this site as an app" for a standalone window + taskbar icon.
- **Android:** open the same URL (LAN or hosted), Chrome ⋮ → "Add to Home screen" → runs fullscreen standalone. Mic/voice works from the installed app.
- Double-clicking `index.html` (file://) also works — decks fall back to embedded copies — but serve it for full external-deck loading.

## What it does

- **Flashcards:** word shown in your native language → recall the translation → tap to confirm/reveal.
- **Visuals:** each card can carry an emoji or an image (`"img": "url-or-path"` in the deck JSON).
- **Auto mode:** no interaction needed — word displays, auto-reveals the translation after a timed beat, advances. Timings adjustable per kind (word/phrase/sentence) plus auto-scaling for text length and TTS length.
- **TTS:** speaks the native word on display and the translation on reveal — always in the *right language*. The app picks a system voice matching the deck's target language (Spanish card → Spanish voice). If no matching voice is installed, it will NOT read the foreign text with an English voice; instead it falls back to Google's online TTS (needs internet; no Farsi voice). A manual voice choice in settings only applies when its language matches the text being spoken.
- **Farsi (Persian):** deck `fa-core` (target `fa`). Answers render in Persian script (RTL) **plus romanization ("Fenglish")** below. Audio: if the device has a system Farsi voice, the app uses it; otherwise it plays **bundled MP3s** (`data/audio/fa/`, pre-generated once with Microsoft's fa-IR-DilaraNeural neural voice and shipped in the repo) — so Farsi speaks on every platform with nothing to install. Google's online TTS has no Farsi voice at all, which is why the deck carries its own audio.
- **Voice quiz mode:** you say the translation aloud; speech recognition scores it (accent-insensitive fuzzy match) and tells you ✓/✗.
- **Weighted repeats:** cards you miss in voice mode come back more often in later sessions (localStorage stats).
- Keys: `space` reveal/next · `m` mute · `Esc` home.

## Decks (data lives OUTSIDE the page)

`data/decks/manifest.json` + one JSON per deck — fetched live at load:

```json
{
  "id": "es-core", "name": "Spanish — core 30",
  "native": "en", "target": "es",
  "items": [
    {"front": "apple", "back": "la manzana", "emoji": "🍎"},
    {"front": "Where is the station?", "back": "¿Dónde está la estación?", "kind": "sentence", "img": "data/img/station.jpg", "hint": "estación = station", "note": "¿...? marks questions"}
  ]
}
```

For non-Latin targets add `"roman"` (romanization shown under the answer);
`"audio"` (path to a pre-generated clip) makes the card speak on devices with no
system voice for the target language:

```json
{"front": "water", "back": "آب", "roman": "âb", "emoji": "💧", "audio": "data/audio/fa/fa-01.mp3"}
```

`kind` is optional (auto-detected from word count). Add a deck by dropping a
JSON file in `data/decks/` and listing it in `manifest.json`.
`tools/export_decks.js` mirrors the app's built-in fallback decks to those files.

## Android notes

- PWA manifest included (`manifest.webmanifest`); install prompt appears after a couple of visits.
- Speech recognition (voice quiz) needs Chrome on Android or Edge on Windows; manual/auto modes work everywhere.
- To use on a phone without hosting: run `python serve.py 8123` on the PC and open `http://<pc-ip>:8123` on the phone (same Wi-Fi), or just copy the folder to the phone and open index.html.

## Later hooks (planned)

- External data sources for decks (CSV/Anki import, dictionary APIs, image lookup) — the deck-JSON boundary is already the seam.
- Spaced repetition (SM-2) on top of the existing per-card stats.
- Offline caching (service worker) once decks are hosted.

## Classes & lessons

`data/classes.json` defines classes (e.g. **Class-e Farsi ISC**), each with an
ordered list of lessons. Home shows a **Classes** section: tapping a class
reveals its lessons newest-first as `date → lesson button`. Each lesson points
at a deck file in `data/decks/` (`file` field); an empty lesson shows a
"coming soon" hint. Add a lesson by appending to `data/classes.json` and
creating its deck JSON.
