/* LangFlash — flashcard trainer. Vanilla JS, zero deps. */
"use strict";

/* ---------- deck loading (outside-the-page data) ---------- */
// Decks live in data/decks/*.json. Served over http(s) they are fetched live.
// Opened via file://, fetch is blocked by the browser, so we fall back to the
// manifest + per-deck copies under data/decks/ tried via XHR, then embedded.
const FALLBACK_DECKS = [
  {
    id: "es-core", name: "Spanish — core 30", native: "en", target: "es",
    items: [
      {front:"apple", back:"la manzana", emoji:"🍎", note:"la = the"},
      {front:"water", back:"el agua", emoji:"💧", note:"el agua is feminine despite 'el'"},
      {front:"to eat", back:"comer", emoji:"🍽️"},
      {front:"to drink", back:"beber", emoji:"🥤"},
      {front:"dog", back:"el perro", emoji:"🐕"},
      {front:"cat", back:"el gato", emoji:"🐈"},
      {front:"house", back:"la casa", emoji:"🏠"},
      {front:"car", back:"el coche", emoji:"🚗"},
      {front:"book", back:"el libro", emoji:"📖"},
      {front:"friend", back:"el amigo", emoji:"🧑‍🤝‍🧑"},
      {front:"good morning", back:"buenos días", kind:"phrase", emoji:"🌄"},
      {front:"thank you", back:"gracias", kind:"phrase", emoji:"🙏"},
      {front:"how much?", back:"¿cuánto cuesta?", kind:"phrase", emoji:"💶"},
      {front:"I don't understand", back:"no entiendo", kind:"sentence", emoji:"🤷"},
      {front:"Where is the station?", back:"¿Dónde está la estación?", kind:"sentence", emoji:"🚉"},
      {front:"bread", back:"el pan", emoji:"🍞"},
      {front:"milk", back:"la leche", emoji:"🥛"},
      {front:"coffee", back:"el café", emoji:"☕"},
      {front:"night", back:"la noche", emoji:"🌙"},
      {front:"day", back:"el día", emoji:"☀️"},
      {front:"to work", back:"trabajar", emoji:"💼"},
      {front:"to sleep", back:"dormir", emoji:"😴"},
      {front:"big", back:"grande", emoji:"➕"},
      {front:"small", back:"pequeño", emoji:"➖"},
      {front:"fast", back:"rápido", emoji:"⚡"},
      {front:"slow", back:"lento", emoji:"🐢"},
      {front:"the weather", back:"el tiempo", emoji:"🌦️", note:"tiempo = weather OR time"},
      {front:"money", back:"el dinero", emoji:"💰"},
      {front:"street", back:"la calle", emoji:"🛣️"},
      {front:"I would like a coffee", back:"quisiera un café", kind:"sentence", emoji:"☕"}
    ]
  },
  {
    id: "fr-core", name: "French — core 20", native: "en", target: "fr",
    items: [
      {front:"apple", back:"la pomme", emoji:"🍎"},
      {front:"water", back:"l'eau", emoji:"💧"},
      {front:"to eat", back:"manger", emoji:"🍽️"},
      {front:"dog", back:"le chien", emoji:"🐕"},
      {front:"cat", back:"le chat", emoji:"🐈"},
      {front:"house", back:"la maison", emoji:"🏠"},
      {front:"book", back:"le livre", emoji:"📖"},
      {front:"friend", back:"l'ami", emoji:"🧑‍🤝‍🧑"},
      {front:"bread", back:"le pain", emoji:"🍞"},
      {front:"coffee", back:"le café", emoji:"☕"},
      {front:"good morning", back:"bonjour", kind:"phrase", emoji:"🌄"},
      {front:"thank you", back:"merci", kind:"phrase", emoji:"🙏"},
      {front:"how much?", back:"combien ça coûte ?", kind:"phrase", emoji:"💶"},
      {front:"I don't understand", back:"je ne comprends pas", kind:"sentence", emoji:"🤷"},
      {front:"Where is the station?", back:"où est la gare ?", kind:"sentence", emoji:"🚉"},
      {front:"night", back:"la nuit", emoji:"🌙"},
      {front:"to sleep", back:"dormir", emoji:"😴"},
      {front:"big", back:"grand", emoji:"➕"},
      {front:"small", back:"petit", emoji:"➖"},
      {front:"I would like a coffee", back:"je voudrais un café", kind:"sentence", emoji:"☕"}
    ]
  },
  {
    id: "de-core", name: "German — core 15", native: "en", target: "de",
    items: [
      {front:"apple", back:"der Apfel", emoji:"🍎"},
      {front:"water", back:"das Wasser", emoji:"💧"},
      {front:"to eat", back:"essen", emoji:"🍽️"},
      {front:"dog", back:"der Hund", emoji:"🐕"},
      {front:"house", back:"das Haus", emoji:"🏠"},
      {front:"book", back:"das Buch", emoji:"📖"},
      {front:"bread", back:"das Brot", emoji:"🍞"},
      {front:"good morning", back:"guten Morgen", kind:"phrase", emoji:"🌄"},
      {front:"thank you", back:"danke", kind:"phrase", emoji:"🙏"},
      {front:"I don't understand", back:"ich verstehe nicht", kind:"sentence", emoji:"🤷"},
      {front:"Where is the station?", back:"Wo ist der Bahnhof?", kind:"sentence", emoji:"🚉"},
      {front:"to sleep", back:"schlafen", emoji:"😴"},
      {front:"big", back:"groß", emoji:"➕"},
      {front:"small", back:"klein", emoji:"➖"},
      {front:"I would like a coffee", back:"ich hätte gern einen Kaffee", kind:"sentence", emoji:"☕"}
    ]
  },
  {
    id: "fa-core", name: "Farsi (Persian) — core 30", native: "en", target: "fa",
    items: [
      {front:"apple", back:"سیب", roman:"sib", emoji:"🍎", audio:"data/audio/fa/fa-00.mp3"},
      {front:"water", back:"آب", roman:"âb", emoji:"💧", audio:"data/audio/fa/fa-01.mp3"},
      {front:"to eat", back:"خوردن", roman:"khordan", emoji:"🍽️", audio:"data/audio/fa/fa-02.mp3"},
      {front:"to drink", back:"نوشیدن", roman:"nooshidan", emoji:"🥤", audio:"data/audio/fa/fa-03.mp3"},
      {front:"dog", back:"سگ", roman:"sag", emoji:"🐕", audio:"data/audio/fa/fa-04.mp3"},
      {front:"cat", back:"گربه", roman:"gorbe", emoji:"🐈", audio:"data/audio/fa/fa-05.mp3"},
      {front:"house", back:"خانه", roman:"khane", emoji:"🏠", audio:"data/audio/fa/fa-06.mp3"},
      {front:"car", back:"ماشین", roman:"mashin", emoji:"🚗", audio:"data/audio/fa/fa-07.mp3"},
      {front:"book", back:"کتاب", roman:"ketab", emoji:"📖", audio:"data/audio/fa/fa-08.mp3"},
      {front:"friend", back:"دوست", roman:"doost", emoji:"🧑‍🤝‍🧑", audio:"data/audio/fa/fa-09.mp3"},
      {front:"bread", back:"نان", roman:"nan", emoji:"🍞", audio:"data/audio/fa/fa-10.mp3"},
      {front:"milk", back:"شیر", roman:"shir", emoji:"🥛", audio:"data/audio/fa/fa-11.mp3"},
      {front:"coffee", back:"قهوه", roman:"ghahve", emoji:"☕", audio:"data/audio/fa/fa-12.mp3"},
      {front:"night", back:"شب", roman:"shab", emoji:"🌙", audio:"data/audio/fa/fa-13.mp3"},
      {front:"day", back:"روز", roman:"rooz", emoji:"☀️", audio:"data/audio/fa/fa-14.mp3"},
      {front:"to work", back:"کار کردن", roman:"kar kardan", emoji:"💼", audio:"data/audio/fa/fa-15.mp3"},
      {front:"to sleep", back:"خوابیدن", roman:"khabidan", emoji:"😴", audio:"data/audio/fa/fa-16.mp3"},
      {front:"big", back:"بزرگ", roman:"bozorg", emoji:"➕", audio:"data/audio/fa/fa-17.mp3"},
      {front:"small", back:"کوچک", roman:"koochak", emoji:"➖", audio:"data/audio/fa/fa-18.mp3"},
      {front:"fast", back:"سریع", roman:"sari'", emoji:"⚡", audio:"data/audio/fa/fa-19.mp3"},
      {front:"slow", back:"آهسته", roman:"âhaste", emoji:"🐢", audio:"data/audio/fa/fa-20.mp3"},
      {front:"the weather", back:"هوا", roman:"hava", emoji:"🌦️", audio:"data/audio/fa/fa-21.mp3"},
      {front:"money", back:"پول", roman:"pool", emoji:"💰", audio:"data/audio/fa/fa-22.mp3"},
      {front:"street", back:"خیابان", roman:"khiyaban", emoji:"🛣️", audio:"data/audio/fa/fa-23.mp3"},
      {front:"good morning", back:"صبح بخیر", roman:"sobh bekheir", kind:"phrase", emoji:"🌄", audio:"data/audio/fa/fa-24.mp3"},
      {front:"thank you", back:"ممنون", roman:"mamnun", kind:"phrase", emoji:"🙏", audio:"data/audio/fa/fa-25.mp3"},
      {front:"please", back:"لطفاً", roman:"lotfan", kind:"phrase", emoji:"🙏", audio:"data/audio/fa/fa-26.mp3"},
      {front:"how much?", back:"چقدر؟", roman:"cheghadr?", kind:"phrase", emoji:"💶", audio:"data/audio/fa/fa-27.mp3"},
      {front:"goodbye", back:"خداحافظ", roman:"khodahafez", kind:"phrase", emoji:"👋", audio:"data/audio/fa/fa-28.mp3"},
      {front:"I don't understand", back:"متوجه نمی‌شوم", roman:"mutavajje nemisham", kind:"sentence", emoji:"🤷", audio:"data/audio/fa/fa-29.mp3"},
      {front:"Where is the station?", back:"ایستگاه کجاست؟", roman:"istgah kojast?", kind:"sentence", emoji:"🚉", audio:"data/audio/fa/fa-30.mp3"},
      {front:"I would like a coffee", back:"یک قهوه می‌خواهم", roman:"yek ghahve mikhaham", kind:"sentence", emoji:"☕", audio:"data/audio/fa/fa-31.mp3"}
    ]
  }
];

const $ = (id) => document.getElementById(id);
let decks = [];
let deck = null;          // active deck
let mode = "manual";      // manual | auto | voice
let session = null;       // {queue, i, correct, missed, weights}
let phase = "prompt";     // prompt | answer | visual (for tap mode)
let timer = null, rafId = null, phaseStart = 0, phaseDur = 0;
let recognition = null;
let visualTapped = false; // for tap mode: true after first tap, before answer reveal

/* ---------- settings ---------- */
const DEFAULTS = {
  s_word: 4, s_phrase: 6, s_sentence: 9, s_reveal: 3, s_chars: 0.6, s_mult: 1,
  s_tts_prompt: true, s_tts_answer: true, s_voice: "", s_tts_fallback: true,
  s_count: 20, s_shuffle: true, s_weight: true, sound: true,
  s_visual_hint: "answer",  // "answer" (default), "always", "tap", "off"
  s_mode: "manual",         // "manual" | "auto" | "voice" — chosen in Settings
  s_dir: "t2n",             // "t2n" = Foreign-first (see foreign, answer native) | "n2t" = Native-first
  s_he3: "he"               // 3rd-person pronoun in prompts: "he" (male) | "she" (female)
};
let S = {...DEFAULTS};
try { Object.assign(S, JSON.parse(localStorage.getItem("langflash.settings") || "{}")); } catch(e){}
function saveSettings(){ localStorage.setItem("langflash.settings", JSON.stringify(S)); }
// Cards may carry a {he} token for the 3rd-person pronoun; resolved per setting.
function he3(s){ return String(s).replace(/\{he\}/g, S.s_he3 === "she" ? "She" : "He"); }

/* ---------- deck fetch ---------- */
async function loadDecks(){
  const list = [];
  try {
    const res = await fetch("data/decks/manifest.json?t=" + Date.now());
    if (res.ok) {
      const manifest = await res.json();
      for (const m of manifest) {
        const r = await fetch(`data/decks/${m.file}?t=` + Date.now());
        if (r.ok) list.push(await r.json());
      }
    }
  } catch(e){ /* file:// or missing data dir */ }
  if (!list.length) {
    // XHR attempt (works for file:// in some browsers) then embedded fallback
    for (const f of ["es-core.json","fr-core.json","de-core.json","fa-core.json"]) {
      try {
        const x = new XMLHttpRequest();
        x.open("GET", "data/decks/" + f, false);
        x.send();
        if (x.status === 0 || x.status === 200) {
          const d = JSON.parse(x.responseText);
          if (d && d.items) list.push(d);
        }
      } catch(e){}
    }
  }
  decks = list.length ? list : FALLBACK_DECKS;
  renderDeckList();
}

function kindOf(it, deckId){
  if (it.kind) return it.kind;
  const wc = it.front.split(/\s+/).length;
  return wc >= 4 ? "sentence" : wc >= 2 ? "phrase" : "word";
}

function renderDeckList(){
  // Get unique native and target languages from all decks
  const nativeLangs = [...new Set(decks.map(d => d.native))].sort();
  const targetLangs = [...new Set(decks.map(d => d.target))].sort();
  
  // Populate native language dropdown
  const nativeSel = $("nativesel");
  nativeSel.innerHTML = "";
  nativeLangs.forEach(lang => {
    const o = document.createElement("option");
    o.value = lang;
    o.textContent = langName(lang);
    nativeSel.appendChild(o);
  });
  
  // Populate target language dropdown
  const targetSel = $("targetsel");
  targetSel.innerHTML = "";
  targetLangs.forEach(lang => {
    const o = document.createElement("option");
    o.value = lang;
    o.textContent = langName(lang);
    targetSel.appendChild(o);
  });
  
  // Set saved values
  // Default native language to English if available, otherwise first in list
  nativeSel.value = S.s_native || (nativeLangs.includes("en") ? "en" : nativeLangs[0]) || "";
  // Default foreign language to Farsi if available, otherwise first in list
  targetSel.value = S.s_target || (targetLangs.includes("fa") ? "fa" : targetLangs[0]) || "";
  
  // Filter decks on change
  nativeSel.onchange = () => { S.s_native = nativeSel.value; saveSettings(); filterDecks(); };
  targetSel.onchange = () => { S.s_target = targetSel.value; saveSettings(); filterDecks(); };

  // Card direction (foreign-first default; persists per device)
  const dirSel = $("dirsel");
  if (dirSel) {
    dirSel.value = S.s_dir === "n2t" ? "n2t" : "t2n";
    dirSel.onchange = () => { S.s_dir = dirSel.value; saveSettings(); updateChip(); filterDecks(); };
  }
  
  // Initial filter
  filterDecks();
}

// Helper to get language display name
function langName(code){
  const names = {
    "en": "English", "es": "Spanish", "fr": "French", "de": "German",
    "fa": "Farsi", "zh": "Chinese", "ja": "Japanese", "ko": "Korean",
    "ar": "Arabic", "hi": "Hindi", "ru": "Russian", "pt": "Portuguese",
    "it": "Italian", "tr": "Turkish", "vi": "Vietnamese", "th": "Thai"
  };
  return names[code] || code.toUpperCase();
}

function filterDecks(){
  const native = $("nativesel").value;
  const target = $("targetsel").value;
  const matching = decks.filter(d => d.native === native && d.target === target);
  
  const meta = $("deckmeta");
  if (matching.length > 0) {
    // Show first matching deck
    const d = matching[0];
    const counts = {word:0, phrase:0, sentence:0};
    d.items.forEach(it => counts[kindOf(it)]++);
    // Deck names encode their language ("Spanish — core 30"); the arrow already names it — drop the prefix.
    const nm = d.name.replace(/^[^—]*—\s*/, "");
    const dc = loadDiscards(d.id).size;
    meta.textContent = `${langName(native)} → ${langName(target)} · ${nm} · ${d.items.length} cards (${counts.word} words, ${counts.phrase} phrases, ${counts.sentence} sentences)` + (dc ? ` · 🗑 ${dc} discarded` : "");
    const chip = $("discbtn");
    chip.style.display = "block";
    chip.textContent = "🗑 reshuffle — bring discarded cards back, clear practice stats";
    chip.onclick = () => reshuffleDeck(d);
    $("startbtn").onclick = () => startSession(d);
  } else {
    meta.textContent = `No deck for ${langName(native)} → ${langName(target)}`;
    $("startbtn").onclick = () => {};
  }
  
  // Update home subtitle (follows the chosen direction)
  const sub = $("homeSub");
  if (sub) {
    sub.textContent = S.s_dir === "n2t"
      ? `Words shown in ${langName(native)} → recall the ${langName(target)} word. Mode, direction, languages and pacing live in ⚙ Settings.`
      : `Words shown in ${langName(target)} → recall the ${langName(native)} translation. Mode, direction, languages and pacing live in ⚙ Settings.`;
  }
  updateChip();
}

/* ---------- classes & lessons ---------- */
const FALLBACK_CLASSES = [
  {id: "fa-isc", name: "ISC Class-e Farsi", lessons: [
    {id: "intro-verbs", title: "Introductory verbs", date: "2026-10-31", file: "fa-lesson-intro-verbs.json"}
  ]}
];
let classes = [];
const lessonDecks = {};   // lesson id -> loaded deck

async function loadClasses(){
  try {
    const res = await fetch("data/classes.json?t=" + Date.now());
    if (res.ok) classes = await res.json();
  } catch(e){ /* file:// */ }
  if (!classes.length) {
    try {
      const x = new XMLHttpRequest();
      x.open("GET", "data/classes.json", false);
      x.send();
      if (x.status === 0 || x.status === 200) classes = JSON.parse(x.responseText);
    } catch(e){}
  }
  if (!classes.length) classes = FALLBACK_CLASSES;
  for (const cls of classes) for (const l of cls.lessons) {
    try {
      const r = await fetch(`data/decks/${l.file}?t=` + Date.now());
      if (r.ok) lessonDecks[l.id] = await r.json();
    } catch(e){}
  }
  renderClasses();
  routeHash();   // honor #class/... deep links once classes+lessons are ready
}

function fmtDate(iso){
  const [y, m, d] = iso.split("-");
  return `${+m}/${+d}/${y}`;
}

function renderClasses(){
  const el = $("classlist");
  el.innerHTML = "";
  for (const cls of classes) {
    const card = document.createElement("div");
    card.className = "deckcard";
    const trow = document.createElement("div");
    trow.className = "trow";
    const t = document.createElement("span");
    t.className = "t";
    t.textContent = "🎓 " + cls.name;
    trow.appendChild(t);
    trow.appendChild(mkShareBtn("Copy link to class", () => shareLink(shareUrl(cls.id), cls.name)));
    card.appendChild(trow);
    const m = document.createElement("div");
    m.className = "m";
    const n = cls.lessons.length;
    m.textContent = `${n} lesson${n === 1 ? "" : "s"} — tap to open`;
    card.appendChild(m);
    const panel = document.createElement("div");
    panel.style.display = "none";
    // newest lesson first
    const lessons = [...cls.lessons].sort((a, b) => b.date.localeCompare(a.date));
    for (const l of lessons) {
      const row = document.createElement("div");
      row.className = "lessonrow";
      const date = document.createElement("span");
      date.className = "lessondate";
      date.textContent = fmtDate(l.date);
      const b = document.createElement("button");
      b.className = "lessonbtn";
      b.textContent = l.title;
      b.onclick = (e) => { e.stopPropagation(); openLesson(cls, l); };
      row.appendChild(date);
      row.appendChild(b);
      row.appendChild(mkShareBtn("Copy link to lesson", () => shareLink(shareUrl(cls.id, l.id), l.title)));
      const ld = lessonDecks[l.id];
      if (ld && ld.items) {
        const dc = loadDiscards(ld.id).size;
        const c = document.createElement("span");
        c.className = "lessoncounts";
        c.textContent = `${ld.items.length} cards${dc ? ` · 🗑 ${dc} discarded` : ""}`;
        row.appendChild(c);
        const rb = document.createElement("button");
        rb.className = "discchip";
        rb.textContent = "reshuffle";
        rb.title = "Re-include discarded cards and reset this deck's practice stats";
        rb.onclick = (e) => { e.stopPropagation(); reshuffleDeck(ld); };
        row.appendChild(rb);
      }
      panel.appendChild(row);
    }
    card.onclick = () => togglePanel(cls.id);
    el.appendChild(card);
    el.appendChild(panel);
    if (cls.id === openClassId) panel.style.display = "block";
    classUI[cls.id] = { card, panel };
  }
}

/* ---------- direct links & sharing ----------
   Links are built from stable ids, never titles — titles are cosmetic and
   renameable; ids decide what a link means. Lesson ids are namespaced under
   their class, so identical titles across (or within) classes never collide. */
const classUI = {};   // clsId -> {card, panel}
let openClassId = null; // class whose lesson panel is currently open (survives re-renders)

function togglePanel(clsId){
  const u = classUI[clsId];
  if (u) {
    const opening = u.panel.style.display === "none";
    u.panel.style.display = opening ? "block" : "none";
    openClassId = opening ? clsId : null;
  }
}
function openClassPanel(clsId){
  const u = classUI[clsId];
  if (u) { u.panel.style.display = "block"; openClassId = clsId; u.card.scrollIntoView({ block: "nearest" }); }
}
function shareUrl(clsId, lessonId){
  const base = location.origin + location.pathname;
  return lessonId ? `${base}#class/${clsId}/lesson/${lessonId}` : `${base}#class/${clsId}`;
}
function mkShareBtn(title, fn){
  const s = document.createElement("button");
  s.className = "sharebtn";
  s.title = title;
  s.textContent = "🔗 Share";
  s.onclick = (e) => { e.stopPropagation(); fn(); };
  return s;
}
async function shareLink(url, label){
  const fb = $("homehint");
  if (navigator.share) {
    try { await navigator.share({ title: "LangFlash — " + label, url }); return; }
    catch(e) { if (e && e.name === "AbortError") return; }   // cancelled, or share unsupported
  }
  try {
    await navigator.clipboard.writeText(url);
    fb.textContent = "Link copied — " + label;
  } catch(e) {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch(_){}
    document.body.removeChild(ta);
    fb.textContent = ok ? "Link copied — " + label : url;
  }
}
function parseHash(){
  const m = location.hash.match(/^#class\/([^/]+)(?:\/lesson\/([^/]+))?$/);
  return m ? { cls: decodeURIComponent(m[1]), lesson: m[2] ? decodeURIComponent(m[2]) : null } : null;
}
function routeHash(){
  const r = parseHash();
  if (!r) return;
  const cls = classes.find(c => c.id === r.cls);
  if (!cls) return;                       // unknown id: normal dashboard, no error page
  if (r.lesson) {
    const l = cls.lessons.find(x => x.id === r.lesson);
    if (l) openLesson(cls, l);            // straight into the cards
    return;
  }
  openClassPanel(cls.id);                 // dashboard with class expanded
}
window.addEventListener("hashchange", () => {
  if (!parseHash()) goHome();
  else routeHash();
});

function openLesson(cls, l){
  const d = lessonDecks[l.id];
  if (!d || !d.items.length) {
    $("homehint").textContent = `"${l.title}" has no cards yet — lesson content coming soon.`;
    return;
  }
  $("homehint").textContent = "";
  d.name = `${l.title} · ${cls.name}`;
  startSession(d);
}

/* ---------- card discards (device-local) ----------
   Discarded cards are skipped by every future session for this deck on this
   device. Stored in localStorage under the deck id — no server state, so each
   device curates its own deck. Re-include restores a card. */
function loadDiscards(deckId){
  try { return new Set(JSON.parse(localStorage.getItem("langflash.discards." + deckId) || "[]")); }
  catch(e){ return new Set(); }
}
function saveDiscards(deckId, set){
  localStorage.setItem("langflash.discards." + deckId, JSON.stringify([...set]));
}
function refreshLessonCounts(){ renderClasses(); }

function discardToast(it){
  const t = $("discardtoast");
  t.innerHTML = `🗑 discarded <b style="color:var(--fg)">${esc(it.front0 || it.front)}</b>`;
  const u = document.createElement("button");
  u.id = "undodiscard"; u.textContent = "undo";
  u.onclick = (e) => {
    e.stopPropagation();
    const set = loadDiscards(deck.id);
    set.delete(it.idx); saveDiscards(deck.id, set);
    t.style.display = "none"; t.innerHTML = "";
    refreshLessonCounts();
  };
  t.appendChild(u);
  t.style.display = "flex";
  clearTimeout(discardToast._t);
  discardToast._t = setTimeout(() => { t.style.display = "none"; t.innerHTML = ""; }, 6000);
}

// Reshuffle: re-include every discarded card and clear the deck's practice
// stats (weighted-repeat history) in one click — no review screen.
function reshuffleDeck(d){
  localStorage.removeItem("langflash.discards." + d.id);
  localStorage.removeItem("langflash.stats." + d.id);
  refreshLessonCounts();
  $("homehint").textContent = `“${d.name}” reshuffled — discarded cards are back and practice stats were cleared.`;
}
/* ---------- session engine ---------- */
function startSession(d){
  deck = d;
  const discarded = loadDiscards(d.id);
  let items = d.items.map((it, idx) => ({...it, idx, front0: it.front, front: he3(it.front)}));
  items = items.filter(it => !discarded.has(it.idx));
  if (!items.length) {
    $("homehint").textContent = `Every card in "${d.name}" is discarded on this device — use reshuffle to bring them back.`;
    return;
  }
  if (S.s_shuffle) items.sort(() => Math.random() - 0.5);
  // weighted repeat: pull previously-missed cards in from localStorage stats
  let stats = {};
  try { stats = JSON.parse(localStorage.getItem("langflash.stats." + d.id) || "{}"); } catch(e){}
  if (S.s_weight) {
    const extra = [];
    for (const it of items) {
      const st = stats[it.idx] || {miss:0};
      for (let k = 0; k < Math.min(3, st.miss); k++) extra.push({...it});
    }
    items = items.concat(extra);
    items.sort(() => Math.random() - 0.5);
  }
  const n = Math.min(S.s_count || 20, items.length);
  session = { queue: items.slice(0, n), i: -1, correct: 0, total: 0, results: [], dir: S.s_dir === "n2t" ? "n2t" : "t2n" };
  $("home").style.display = "none"; $("endcard").style.display = "none";
  $("session").style.display = "flex"; $("homebtn").style.display = "";
  // Session header shows deck, mode, and practice direction
  $("hdrdeck").textContent = d.name + " · " + (mode === "auto" ? "auto" : mode === "voice" ? "voice quiz" : "manual") + (S.s_dir === "n2t" ? " (Native→Foreign)" : " (Foreign→Native)") + (discarded.size ? ` · 🗑 ${discarded.size} discarded` : "");
  nextCard();
}

function nextCard(){
  clearTimer();
  session.i++;
  // skip any card discarded mid-session (weighted repeats can duplicate it)
  { const disc = loadDiscards(deck.id);
    while (session.i < session.queue.length && disc.has(session.queue[session.i].idx)) session.i++; }
  if (session.i >= session.queue.length) return endSession();
  phase = "prompt";
  visualTapped = false;
  const it = session.queue[session.i];
  const k = kindOf(it, deck.id);
  $("kind").textContent = k;
  const v = $("visual");
  // Hide the standalone visual element (we use answer area's visual-area instead)
  v.style.display = "none";
  v.innerHTML = "";
  
  // Prompt/answer content follows the session direction
  const flipped = session.dir === "n2t";
  const promptEl = $("prompt");
  const rtl = isRtlDeck();
  promptEl.classList.toggle("rtl", rtl && !flipped);
  let html;
  if (flipped) {
    // Native-first: show English word; Farsi + Finglish come in the answer
    html = `<span class="tw">${esc(it.front)}</span>`;
  } else {
    // Foreign-first (default): foreign word on top, Finglish underneath
    html = `<span class="tw"${rtl ? ' dir="rtl"' : ""}>${esc(it.back)}</span>`;
    if (it.roman) html += `<span class="roman-prompt">${esc(it.roman)}</span>`;
  }
  promptEl.innerHTML = html;
  promptEl.style.display = "block";
  $("hint").textContent = it.hint ? it.hint : "";
  // Build the FULL answer content up front (visual + translation + note) but keep it
  // visibility-hidden: the card reserves the answer's exact space from the question
  // phase, so revealing can never resize or shift the card.
  const trHtml = flipped
    ? `<span class="tw"${rtl ? ' dir="rtl"' : ""}>${esc(it.back)}</span>` + (it.roman ? `<span class="roman">${esc(it.roman)}</span>` : "")
    : (it.front ? `<span class="translation">${esc(it.front)}</span>` : "");
  const altHtml = it.note ? `<span class="alt">${esc(it.note)}</span>` : "";
  const vHtml = S.s_visual_hint !== "off" && (it.img || it.emoji)
    ? (it.img ? `<img src="${esc(it.img)}" alt="">` : `<span class="emoji">${esc(it.emoji)}</span>`) : "";
  $("answer").innerHTML = `<div class="visual-area">${vHtml}</div>${trHtml}${altHtml}`;
  // "always": visual is already visible with the question; translation still holds its slot unseen
  if (S.s_visual_hint === "always") {
    $("answer").style.visibility = "visible";
    $("answer").classList.add("pre-reveal");
  } else {
    $("answer").style.visibility = "hidden";
  }
  $("note").textContent = "";
  $("feedback").textContent = ""; $("feedback").className = "";
  $("counter").textContent = `${session.i + 1} / ${session.queue.length}`;
  $("progress").style.width = (100 * session.i / session.queue.length) + "%";
  $("voicebar").style.display = (mode === "voice") ? "flex" : "none";
  $("spoken").textContent = "tap mic and say it";
  
  if (mode === "manual" && S.s_visual_hint === "tap") {
    $("tapcue").textContent = "tap word for visual → tap again for answer";
  } else if (mode === "manual") {
    $("tapcue").textContent = "tap anywhere to reveal";
  } else if (mode === "voice") {
    $("tapcue").textContent = "say the translation, or tap to reveal";
  } else {
    $("tapcue").textContent = "auto mode — sit back";
  }

  // TTS for prompt
  const promptLang = flipped ? deck.native : deck.target;
  if (S.s_tts_prompt) speak($("prompt").textContent, promptLang, getPromptAudio(it));

  if (mode === "auto") {
    phaseDur = showSeconds(it) * 1000;
    startTimerBar();
    timer = setTimeout(reveal, phaseDur);
  } else {
    $("timerbar").style.width = "0";
  }
}

// Helper: should we show visual at this phase?
function shouldShowVisual(currentPhase) {
  const setting = S.s_visual_hint || "answer";
  if (setting === "off") return false;
  if (setting === "always") return true;
  if (setting === "answer") return currentPhase === "answer";
  if (setting === "tap") return currentPhase === "answer" || visualTapped;
  return false;
}

// Helper: get audio for prompt (foreign word's bundled audio follows direction)
function getPromptAudio(it) {
  return session && session.dir === "n2t" ? null : stampedAudio(it);
}

// Helper: get audio for answer
function getAnswerAudio(it) {
  return session && session.dir === "n2t" ? stampedAudio(it) : null;
}

// Version-stamp bundled mp3 URLs so regenerated clips can't be served from a
// device's stale cache (same cache-bust discipline as app.js?v=).
function stampedAudio(it) {
  if (!it.audio) return null;
  return it.audio + (it.audio.includes("?") ? "&" : "?") + "v=" + BUILD;
}

function showSeconds(it){
  const base = {word: S.s_word, phrase: S.s_phrase, sentence: S.s_sentence}[kindOf(it)] || 4;
  const extra = (S.s_chars || 0) * (it.front.length / 10);
  const ttsBonus = S.s_tts_prompt ? Math.min(3, it.front.split(/\s+/).length * 0.5) : 0;
  return Math.max(1.5, (base + extra + ttsBonus) * (S.s_mult || 1));
}
function revealSeconds(it){
  const base = S.s_reveal || 3;
  const extra = (S.s_chars || 0) * (it.back.length / 10);
  const ttsBonus = S.s_tts_answer ? Math.min(3, it.back.split(/\s+/).length * 0.5) : 0;
  return Math.max(1.5, (base + extra + ttsBonus) * (S.s_mult || 1));
}

function reveal(){
  clearTimer();
  if (phase !== "prompt") return;
  phase = "answer";
  const it = session.queue[session.i];
  const rtl = isRtlDeck();
  const ans = $("answer");
  ans.classList.toggle("rtl", rtl);
  // Answer content follows the session direction
  const flipped = session.dir === "n2t";
  const answerText = flipped ? it.back : it.front;
  const answerLang = flipped ? deck.target : deck.native;

  // Content was pre-built by nextCard — revealing is only a visibility flip,
  // so the card's height never changes between question and answer.
  ans.classList.remove("pre-reveal");
  ans.style.visibility = "visible";

  if (mode === "auto") {
    $("tapcue").textContent = "";
  } else {
    $("tapcue").textContent = "tap anywhere for next";
  }
  
  // TTS for answer — speak the answer text in its own language
  if (S.s_tts_answer) speak(answerText, answerLang, getAnswerAudio(it));
  
  if (mode === "auto") {
    phaseDur = revealSeconds(it) * 1000;
    startTimerBar();
    timer = setTimeout(nextCard, phaseDur);
  }
}

function endSession(){
  clearTimer();
  $("session").style.display = "none"; $("endcard").style.display = "block";
  const pct = session.total ? Math.round(100 * session.correct / session.total) : 0;
  if (session.total > 0) {
    // Scored mode (voice quiz)
    $("endscore").textContent = `${session.correct} / ${session.total} (${pct}%)`;
  } else {
    // Unscored mode (manual/auto) - just show cards completed
    const completed = session.queue.length;
    $("endscore").textContent = `Completed ${completed} card${completed === 1 ? "" : "s"}`;
  }
  $("enddetail").textContent = session.results.length
    ? "Missed: " + session.results.filter(r => !r.ok).map(r => r.front + " → " + r.back).slice(0, 6).join(" · ")
    : "";
  // persist stats for weighted repeat
  let stats = {};
  try { stats = JSON.parse(localStorage.getItem("langflash.stats." + deck.id) || "{}"); } catch(e){}
  for (const r of session.results) {
    const st = stats[r.idx] || (stats[r.idx] = {miss:0, hit:0});
    r.ok ? st.hit++ : st.miss++;
  }
  localStorage.setItem("langflash.stats." + deck.id, JSON.stringify(stats));
}

/* ---------- timing bar ---------- */
function startTimerBar(){
  phaseStart = performance.now();
  const bar = $("timerbar");
  cancelAnimationFrame(rafId);
  const step = () => {
    const p = Math.min(1, (performance.now() - phaseStart) / phaseDur);
    bar.style.width = (100 * p) + "%";
    if (p < 1) rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}
function clearTimer(){ if (timer) clearTimeout(timer); timer = null; cancelAnimationFrame(rafId); $("timerbar").style.width = "0"; }

/* ---------- interaction ---------- */
$("stage").addEventListener("click", () => {
  if (mode === "voice" && phase === "prompt") { startVoice(); return; }
  
  // Handle tap mode: first tap reveals the (already-positioned) visual; translation
  // keeps its reserved slot unseen until the second tap
  if (S.s_visual_hint === "tap" && phase === "prompt") {
    if (!visualTapped) {
      visualTapped = true;
      $("answer").classList.add("pre-reveal");
      $("answer").style.visibility = "visible";
      $("tapcue").textContent = "tap again to reveal answer";
      return;
    }
    // Second tap - reveal answer
  }
  
  if (phase === "prompt") reveal(); else if (mode !== "auto") nextCard();
});
document.addEventListener("keydown", (e) => {
  if ($("settings").style.display === "block") return;
  if (e.code === "Space") { e.preventDefault(); $("stage").click(); }
  else if (e.key === "m") toggleSound();
  else if (e.key === "Escape") goHome();
});

function goHome(){
  clearTimer(); stopSpeaking();
  session = null;
  $("session").style.display = "none"; $("endcard").style.display = "none";
  $("home").style.display = "block"; $("homebtn").style.display = "none";
  $("hdrdeck").textContent = "";
  // leaving a deep link: drop the hash so a reload lands on the dashboard
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
}
$("homebtn").onclick = goHome;
$("againbtn").onclick = () => startSession(deck);

$("discardbtn").onclick = (e) => {
  e.stopPropagation();
  if (!session || session.i < 0 || !session.queue[session.i]) return;
  const it = session.queue[session.i];
  const set = loadDiscards(deck.id);
  set.add(it.idx);
  saveDiscards(deck.id, set);
  refreshLessonCounts();
  discardToast(it);
  nextCard();
};

// Practice mode now lives in Settings; keep the global `mode` in sync.
function syncMode(){ mode = (S.s_mode === "auto" || S.s_mode === "voice") ? S.s_mode : "manual"; }
function updateChip(){
  const chip = $("setchip"); if (!chip) return;
  const m = mode === "auto" ? "Auto" : mode === "voice" ? "Voice quiz" : "Manual";
  const d = S.s_dir === "n2t" ? "English → " + langName(S.s_target || "fa") : langName(S.s_target || "fa") + " → English";
  chip.textContent = `${m} · ${d} · ${S.s_count || 20} cards`;
}
$("setchip").onclick = () => { $("settings").style.display = "block"; };
if ($("s_mode")) $("s_mode").addEventListener("change", () => { S.s_mode = $("s_mode").value; saveSettings(); syncMode(); updateChip(); });

/* ---------- language metadata ---------- */
const LANGS = {
  en: { name: "English", tts: "en-US" },
  es: { name: "Spanish", tts: "es-ES" },
  fr: { name: "French",  tts: "fr-FR" },
  de: { name: "German",  tts: "de-DE" },
  fa: { name: "Farsi (Persian)", tts: "fa-IR", rtl: true }
};
function langMeta(code){ return LANGS[code] || { name: code, tts: code }; }
function isRtlDeck(){ return !!langMeta(deck && deck.target).rtl; }

/* ---------- TTS ---------- */
function voices(){ return window.speechSynthesis ? speechSynthesis.getVoices() : []; }
function pickVoice(lang){
  const base = (lang || "").toLowerCase().split("-")[0];
  // A manually-picked voice only wins if its language matches the text being
  // spoken — otherwise an English voice would read Spanish/Farsi with English rules.
  if (S.s_voice) {
    const v = voices().find(v => v.name === S.s_voice);
    if (v && v.lang && v.lang.toLowerCase().split("-")[0] === base) return v;
  }
  // exact-ish match first (fa-IR, es-ES...), then any voice whose language matches
  return voices().find(v => v.lang && v.lang.toLowerCase().replace("_","-") === lang.toLowerCase())
      || voices().find(v => v.lang && v.lang.toLowerCase().startsWith(base))
      || null;
}
/* ---------- online/bundled audio (gesture-unlocked) ----------
   Chrome-family autoplay policy: <audio>.play() rejects with NotAllowedError
   unless a user gesture happened first. speechSynthesis is exempt, so tier-1
   (system voices) never needed one; bundled clips (Farsi) and Google fallback
   do — fatal in auto mode, where reveals are timer-driven with no gesture.
   Fix: unlock the shared audio element on the first touch/click anywhere by
   playing a silent clip; later programmatic playback on that element is then
   allowed for the rest of the session. */
let onlineAudio = null;
let audioUnlocked = false;
const SILENT_WAV = "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRAAAAAAAAAAAAAAAAAAAA==";
function ensureAudioEl(){
  if (!onlineAudio) {
    onlineAudio = new Audio();
    onlineAudio.addEventListener("error", () => {
      const fb = $("feedback");
      if (fb && onlineAudio && onlineAudio.src && !/wav;base64/.test(onlineAudio.src)) {
        fb.textContent = "could not play audio for this card"; fb.className = "";
      }
    });
  }
  return onlineAudio;
}
function unlockAudio(){
  if (audioUnlocked) return;
  const a = ensureAudioEl();
  a.src = SILENT_WAV;
  const p = a.play();
  if (p && p.then) p.then(() => { audioUnlocked = true; a.pause(); }).catch(() => {});
}
document.addEventListener("pointerdown", unlockAudio, {capture: true, passive: true});
function playUrl(url){
  const a = ensureAudioEl();
  try { a.pause(); } catch(e){}
  a.src = url;
  return new Promise((resolve, reject) => {
    const onEnded = () => { cleanup(); resolve(); };
    const onError = (e) => { cleanup(); reject(e); };
    const cleanup = () => {
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
    };
    a.addEventListener('ended', onEnded, { once: true });
    a.addEventListener('error', onError, { once: true });
    a.play().then(() => { audioUnlocked = true; }).catch(reject);
  });
}
function speak(text, lang, audioUrl){
  if (!S.sound || !text) return;
  const meta = langMeta(lang);
  const v = pickVoice(meta.tts);
  if (v || (window.speechSynthesis && meta.tts.split("-")[0] === "en")) {
    // A matching system voice exists (or it's English — always safe): use it.
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      if (v) u.voice = v;
      u.lang = meta.tts; u.rate = 0.95;
      speechSynthesis.speak(u);
      return;
    }
  }
  // No matching system voice: prefer deck-bundled audio (pre-generated, offline,
  // e.g. Farsi), and only then the online fallback. Never let an English voice
  // mangle foreign text.
  if (audioUrl) {
    playUrl(audioUrl).catch(() => {
      if (S.s_tts_fallback !== false) speakFallback(text, meta.tts);
    });
    return;
  }
  if (S.s_tts_fallback !== false) speakFallback(text, meta.tts);
}
async function speakFallback(text, lang){
  const base = lang.split("-")[0];
  // Google online TTS (media element — no CORS needed; blocked by CORS via fetch)
  playUrl("https://translate.google.com/translate_tts?ie=UTF-8&q=" +
    encodeURIComponent(text) + "&tl=" + encodeURIComponent(base) + "&client=tw-ob");
}
function stopSpeaking(){
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (onlineAudio) { try { onlineAudio.pause(); } catch(e){} }
}
function toggleSound(){
  S.sound = !S.sound; saveSettings();
  $("soundbtn").textContent = S.sound ? "🔊" : "🔇";
  $("soundbtn").classList.toggle("on", S.sound);
  if (!S.sound) stopSpeaking();
}
$("soundbtn").onclick = toggleSound;
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = populateVoices;
function populateVoices(){
  const sel = $("s_voice"); const cur = sel.value;
  sel.innerHTML = '<option value="">auto</option>';
  for (const v of voices()) {
    const o = document.createElement("option"); o.value = v.name;
    o.textContent = `${v.name} (${v.lang})`; sel.appendChild(o);
  }
  sel.value = cur;
}

/* ---------- voice quiz (speech recognition) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function startVoice(){
  if (!SR) { $("spoken").textContent = "voice recognition not supported in this browser"; return; }
  if (recognition) { recognition.abort(); recognition = null; }
  recognition = new SR();
  recognition.lang = session.dir === "n2t" ? deck.target : deck.native;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  $("micbtn").classList.add("listening");
  $("spoken").textContent = "listening…";
  recognition.onresult = (ev) => {
    const alts = Array.from(ev.results[0]).map(r => r.transcript);
    $("spoken").textContent = "you said: \"" + alts[0] + "\"";
    gradeVoice(alts);
  };
  recognition.onerror = (ev) => {
    $("micbtn").classList.remove("listening");
    $("spoken").textContent = ev.error === "not-allowed" ? "microphone blocked — allow mic access" : "didn't catch that — tap mic to retry";
  };
  recognition.onend = () => $("micbtn").classList.remove("listening");
  try { recognition.start(); } catch(e){}
}
$("micbtn").onclick = (e) => { e.stopPropagation(); startVoice(); };

function norm(s){
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // strip Latin accents
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")  // strip Arabic harakat + tatweel
    .replace(/\u200C/g, " ")                       // ZWNJ (نمی‌شوم) → word boundary
    .replace(/[¿?¡!.,;:"'،؛؟]/g, "")
    .replace(/\b(el|la|los|las|le|la|un|una|der|die|das|l|le|la|a|the)\b/g, " ")
    .replace(/\s+/g, " ").trim();
}
function lev(a, b){
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let row = [i];
    for (let j = 1; j <= n; j++)
      row[j] = Math.min(prev[j] + 1, row[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    prev = row;
  }
  return prev[n];
}
function gradeVoice(alts){
  const it = session.queue[session.i];
  // Expected spoken answer follows direction: native word (t2n) or foreign word (n2t).
  // When foreign is expected, accept the romanization too.
  const flipped = session.dir === "n2t";
  const wants = (flipped ? [it.back, it.roman] : [it.front]).filter(Boolean).map(norm).filter(Boolean);
  const answerText = flipped ? it.back : it.front;
  let best = 1e9, bestAlt = "";
  for (const alt of alts) {
    const got = norm(alt);
    for (const want of wants) {
      const d = Math.min(lev(want, got), ...want.split(" ").map(w => lev(w, got)));
      if (d < best) { best = d; bestAlt = alt; }
    }
  }
  const len = Math.max(1, (wants[0] || "").length);
  const ok = best <= Math.max(1, Math.floor(len * 0.2));
  const fb = $("feedback");
  fb.textContent = ok ? "✓ correct" : `✗ close — answer: ${answerText}`;
  fb.className = ok ? "good" : "bad";
  session.total++; session.correct += ok ? 1 : 0;
  session.results.push({idx: it.idx, front: it.front, back: it.back, ok});
  if (ok && S.s_tts_answer) speak(answerText, flipped ? deck.target : deck.native, getAnswerAudio(it));
  timer = setTimeout(nextCard, ok ? 1200 : 2600);
}

/* manual/voice modes still record correctness when user self-grades? No —
   only voice mode grades. Manual/auto sessions log all as seen (no score). */

/* ---------- settings drawer ---------- */
$("settingsbtn").onclick = () => { $("settings").style.display = $("settings").style.display === "block" ? "none" : "block"; };
$("settings").addEventListener("click", (e) => { if (e.target.id === "settings") $("settings").style.display = "none"; });
const NUMKEYS = ["s_word","s_phrase","s_sentence","s_reveal","s_chars","s_mult","s_count"];
const CHKKEYS = ["s_tts_prompt","s_tts_answer","s_shuffle","s_weight","s_tts_fallback"];
function pushSettingsToUI(){
  for (const k of NUMKEYS) $(k).value = S[k];
  for (const k of CHKKEYS) $(k).checked = !!S[k];
  // visual hint
  if ($("s_visual_hint")) $("s_visual_hint").value = S.s_visual_hint || "answer";
  if ($("s_mode")) $("s_mode").value = (S.s_mode === "auto" || S.s_mode === "voice") ? S.s_mode : "manual";
  if ($("he3sel")) $("he3sel").value = (S.s_he3 === "she") ? "she" : "he";
  populateVoices(); $("s_voice").value = S.s_voice || "";
}
for (const k of NUMKEYS) $(k).addEventListener("change", () => { S[k] = parseFloat($(k).value) || DEFAULTS[k]; saveSettings(); updateChip(); });
for (const k of CHKKEYS) $(k).addEventListener("change", () => { S[k] = $(k).checked; saveSettings(); });
$("s_voice").addEventListener("change", () => { S.s_voice = $("s_voice").value; saveSettings(); });
if ($("s_visual_hint")) $("s_visual_hint").addEventListener("change", () => { S.s_visual_hint = $("s_visual_hint").value; saveSettings(); });
if ($("he3sel")) $("he3sel").addEventListener("change", () => {
  S.s_he3 = $("he3sel").value === "she" ? "she" : "he";
  saveSettings();
  // Live-update remaining cards in an active session (current card keeps its pronoun until tap)
  if (session) session.queue.forEach(q => { if (q.front0 != null) q.front = he3(q.front0); });
});

function esc(s){ return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }

/* ---------- boot ---------- */
const BUILD = "20261104l";
{ const bt = $("buildtag"); if (bt) bt.textContent = "LangFlash build " + BUILD; }
$("soundbtn").textContent = S.sound ? "🔊" : "🔇";
pushSettingsToUI();
syncMode();
updateChip();
loadDecks();
loadClasses();
if (window.matchMedia && matchMedia("(display-mode: standalone)").matches) document.body.classList.add("installed");


