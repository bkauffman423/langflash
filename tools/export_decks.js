// Export FALLBACK_DECKS from app.js into data/decks/*.json (single source of truth).
const fs = require('fs'), vm = require('vm');
const path = require('path');
const root = path.join(__dirname, '..');
let src = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
// stub the browser globals so the script evaluates without a DOM
const stubEl = () => new Proxy({ style:{}, classList:{add(){},remove(){},toggle(){}}, addEventListener(){}, appendChild(){}, innerHTML:'', textContent:'' , value:'', checked:false}, {get:(t,k)=>k in t?t[k]:undefined});
const ctx = {
  document: { getElementById: stubEl, querySelectorAll: () => [], createElement: stubEl, addEventListener(){}, body:{classList:{add(){}}}, },
  window: {}, localStorage: { getItem: () => null, setItem(){} },
  XMLHttpRequest: function(){ this.open=()=>{}; this.send=()=>{}; this.status=404; },
  fetch: () => Promise.reject(new Error('offline')),
  speechSynthesis: null, matchMedia: () => ({matches:false}),
  performance: { now: () => 0 }, requestAnimationFrame: () => 0, cancelAnimationFrame(){},
  setTimeout, clearTimeout, console,
};
ctx.window = ctx;
vm.runInNewContext(src + "\n;globalThis.__decks = FALLBACK_DECKS;", ctx);
const decks = ctx.__decks;
if (!Array.isArray(decks) || !decks.length) { console.error('no decks found'); process.exit(1); }
const dir = path.join(root, 'data', 'decks');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(decks.map(d => ({file: d.id + '.json', name: d.name})), null, 2));
for (const d of decks) fs.writeFileSync(path.join(dir, d.id + '.json'), JSON.stringify(d, null, 2));
console.log('OK', decks.map(d => `${d.id}:${d.items.length}`).join(' '));
