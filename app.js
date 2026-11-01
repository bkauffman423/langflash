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
let phase = "prompt";     // prompt | answer
let timer = null, rafId = null, phaseStart = 0, phaseDur = 0;
let recognition = null;

/* ---------- settings ---------- */
const DEFAULTS = {
  s_word: 4, s_phrase: 6, s_sentence: 9, s_reveal: 3, s_chars: 0.6, s_mult: 1,
  s_tts_native: true, s_tts_target: true, s_voice: "", s_tts_fallback: true,
  s_count: 20, s_shuffle: true, s_weight: true, sound: true
};
let S = {...DEFAULTS};
try { Object.assign(S, JSON.parse(localStorage.getItem("langflash.settings") || "{}")); } catch(e){}
function saveSettings(){ localStorage.setItem("langflash.settings", JSON.stringify(S)); }

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

function kindOf(it){ return it.kind || (it.front.split(/\s+/).length >= 4 ? "sentence" : it.front.split(/\s+/).length >= 2 ? "phrase" : "word"); }

function renderDeckList(){
  const sel = $("langsel");
  sel.innerHTML = "";
  decks.forEach((d, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = d.name;
    sel.appendChild(o);
  });
  updateDeckMeta();
  sel.onchange = updateDeckMeta;
  $("startbtn").onclick = () => { if (decks.length) startSession(decks[sel.value]); };
}

function updateDeckMeta(){
  const d = decks[$("langsel").value];
  if (!d) return;
  const counts = {word:0, phrase:0, sentence:0};
  d.items.forEach(it => counts[kindOf(it)]++);
  $("deckmeta").textContent = `${d.native} → ${d.target} · ${d.items.length} cards (${counts.word} words, ${counts.phrase} phrases, ${counts.sentence} sentences)`;
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
      panel.appendChild(row);
    }
    card.onclick = () => togglePanel(cls.id);
    el.appendChild(card);
    el.appendChild(panel);
    classUI[cls.id] = { card, panel };
  }
}

/* ---------- direct links & sharing ----------
   Links are built from stable ids, never titles — titles are cosmetic and
   renameable; ids decide what a link means. Lesson ids are namespaced under
   their class, so identical titles across (or within) classes never collide. */
const classUI = {};   // clsId -> {card, panel}

function togglePanel(clsId){
  const u = classUI[clsId];
  if (u) u.panel.style.display = u.panel.style.display === "none" ? "block" : "none";
}
function openClassPanel(clsId){
  const u = classUI[clsId];
  if (u) { u.panel.style.display = "block"; u.card.scrollIntoView({ block: "nearest" }); }
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

/* ---------- session engine ---------- */
function startSession(d){
  deck = d;
  let items = d.items.map((it, idx) => ({...it, idx}));
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
  session = { queue: items.slice(0, n), i: -1, correct: 0, total: 0, results: [] };
  $("home").style.display = "none"; $("endcard").style.display = "none";
  $("session").style.display = "flex"; $("homebtn").style.display = "";
  $("hdrdeck").textContent = d.name + " · " + (mode === "auto" ? "auto" : mode === "voice" ? "voice quiz" : "manual");
  nextCard();
}

function nextCard(){
  clearTimer();
  session.i++;
  if (session.i >= session.queue.length) return endSession();
  phase = "prompt";
  const it = session.queue[session.i];
  const k = kindOf(it);
  $("kind").textContent = k;
  const v = $("visual");
  v.innerHTML = it.img ? `<img src="${esc(it.img)}" alt="">` : (it.emoji ? esc(it.emoji) : "");
  $("prompt").textContent = it.front;
  $("prompt").style.display = "";
  $("hint").textContent = it.hint ? it.hint : "";
  $("answer").style.display = "none"; $("answer").innerHTML = "";
  $("note").textContent = "";
  $("feedback").textContent = ""; $("feedback").className = "";
  $("counter").textContent = `${session.i + 1} / ${session.queue.length}`;
  $("progress").style.width = (100 * session.i / session.queue.length) + "%";
  $("voicebar").style.display = (mode === "voice") ? "flex" : "none";
  $("spoken").textContent = "tap mic and say it";
  $("tapcue").textContent = mode === "manual" ? "tap anywhere to reveal"
    : mode === "voice" ? "say the translation, or tap to reveal"
    : "auto mode — sit back";

  if (S.s_tts_native) speak(it.front, deck.native);

  if (mode === "auto") {
    phaseDur = showSeconds(it) * 1000;
    startTimerBar();
    timer = setTimeout(reveal, phaseDur);
  } else {
    $("timerbar").style.width = "0";
  }
}

function showSeconds(it){
  const base = {word: S.s_word, phrase: S.s_phrase, sentence: S.s_sentence}[kindOf(it)] || 4;
  const extra = (S.s_chars || 0) * (it.front.length / 10);
  const ttsBonus = S.s_tts_native ? Math.min(3, it.front.split(/\s+/).length * 0.5) : 0;
  return Math.max(1.5, (base + extra + ttsBonus) * (S.s_mult || 1));
}
function revealSeconds(it){
  const base = S.s_reveal || 3;
  const extra = (S.s_chars || 0) * (it.back.length / 10);
  const ttsBonus = S.s_tts_target ? Math.min(3, it.back.split(/\s+/).length * 0.5) : 0;
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
  // target-script line (RTL isolated for Farsi), then romanization ("Fenglish"), then note
  let html = `<span class="tw"${rtl ? ' dir="rtl"' : ""}>${esc(it.back)}</span>`;
  if (it.roman) html += `<span class="roman">${esc(it.roman)}</span>`;
  if (it.note) html += `<span class="alt">${esc(it.note)}</span>`;
  ans.innerHTML = html;
  ans.style.display = "";
  $("tapcue").textContent = mode === "auto" ? "" : "tap anywhere for next";
  if (S.s_tts_target) speak(it.back, deck.target, it.audio);
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
  $("endscore").textContent = `${session.correct} / ${session.total} (${pct}%)`;
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

document.querySelectorAll(".modebtn").forEach(b => b.onclick = () => {
  document.querySelectorAll(".modebtn").forEach(x => x.classList.remove("sel"));
  b.classList.add("sel"); mode = b.dataset.mode;
});

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
  a.play().then(() => { audioUnlocked = true; }).catch(() => {
    const fb = $("feedback");
    if (fb) { fb.textContent = "audio blocked — tap the screen once and press 🔊 twice to replay"; fb.className = ""; }
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
  if (audioUrl) { playUrl(audioUrl); return; }
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
  recognition.lang = deck.target;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  $("micbtn").classList.add("listening");
  $("spoken").textContent = "listening…";
  recognition.onresult = (ev) => {
    const alts = Array.from(ev.results[0]).map(r => r.transcript);
    $("spoken").textContent = "you said: “" + alts[0] + "”";
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
  const want = norm(it.back);
  let best = 1e9, bestAlt = "";
  for (const alt of alts) {
    const got = norm(alt);
    const d = Math.min(lev(want, got), ...want.split(" ").map(w => lev(w, got)));
    if (d < best) { best = d; bestAlt = alt; }
  }
  const len = Math.max(1, want.length);
  const ok = best <= Math.max(1, Math.floor(len * 0.2));
  const fb = $("feedback");
  fb.textContent = ok ? "✓ correct" : `✗ close — answer: ${it.back}`;
  fb.className = ok ? "good" : "bad";
  session.total++; session.correct += ok ? 1 : 0;
  session.results.push({idx: it.idx, front: it.front, back: it.back, ok});
  if (ok && S.s_tts_target) speak(it.back, deck.target, it.audio);
  timer = setTimeout(nextCard, ok ? 1200 : 2600);
}

/* manual/voice modes still record correctness when user self-grades? No —
   only voice mode grades. Manual/auto sessions log all as seen (no score). */

/* ---------- settings drawer ---------- */
$("settingsbtn").onclick = () => { $("settings").style.display = $("settings").style.display === "block" ? "none" : "block"; };
$("settings").addEventListener("click", (e) => { if (e.target.id === "settings") $("settings").style.display = "none"; });
const NUMKEYS = ["s_word","s_phrase","s_sentence","s_reveal","s_chars","s_mult","s_count"];
const CHKKEYS = ["s_tts_native","s_tts_target","s_shuffle","s_weight","s_tts_fallback"];
function pushSettingsToUI(){
  for (const k of NUMKEYS) $(k).value = S[k];
  for (const k of CHKKEYS) $(k).checked = !!S[k];
  populateVoices(); $("s_voice").value = S.s_voice || "";
}
for (const k of NUMKEYS) $(k).addEventListener("change", () => { S[k] = parseFloat($(k).value) || DEFAULTS[k]; saveSettings(); });
for (const k of CHKKEYS) $(k).addEventListener("change", () => { S[k] = $(k).checked; saveSettings(); });
$("s_voice").addEventListener("change", () => { S.s_voice = $("s_voice").value; saveSettings(); });

function esc(s){ return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

/* ---------- boot ---------- */
const BUILD = "20261101d";
{ const bt = $("buildtag"); if (bt) bt.textContent = "LangFlash build " + BUILD; }
$("soundbtn").textContent = S.sound ? "🔊" : "🔇";
pushSettingsToUI();
loadDecks();
loadClasses();
if (window.matchMedia && matchMedia("(display-mode: standalone)").matches) document.body.classList.add("installed");
