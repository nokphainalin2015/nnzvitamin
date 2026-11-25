// nnz vitamin shop · ບໍ່ຈຳເປັນຕ້ອງແກ້ໄຟລ໌ນີ້ · ແກ້ສິນຄ້າໃນ products.csv ຫຼື Google Sheet · ແກ້ເບີໃນ config.js
(function(){
const CFG = window.NNZ_CONFIG || {};
const NEEDS = [
  {id:"new", lb:"ສິນຄ້າໃໝ່", ic:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'},
  {id:"trial", lb:"ຂວດແບ່ງລອງ", ic:'<rect x="8" y="7" width="8" height="13" rx="2.5"/><path d="M9.5 4h5v3h-5z"/>'},
  {id:"immune", lb:"ພູມຕ້ານທານ", ic:'<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>'},
  {id:"skin", lb:"ຜິວ ແລະ ຄວາມງາມ", ic:'<path d="M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10z"/><path d="M9.5 11.5c.8 1 4.2 1 5 0"/>'},
  {id:"sleep", lb:"ນອນ ແລະ ຄວາມຄຽດ", ic:'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'},
  {id:"joint", lb:"ກະດູກ ແລະ ຂໍ້", ic:'<path d="M8 6a2.5 2.5 0 1 0-3 3l9 9a2.5 2.5 0 1 0 3-3z"/>'},
  {id:"liver", lb:"ຕັບ ແລະ ການຍ່ອຍ", ic:'<path d="M4 9c0-3 3-4 8-4s8 2 8 5-3 9-9 9c-4 0-7-4-7-10z"/>'},
  {id:"kids", lb:"ເດັກນ້ອຍ", ic:'<circle cx="12" cy="9" r="4"/><path d="M6 20c1-3 3.5-5 6-5s5 2 6 5"/>'},
  {id:"women", lb:"ແມ່ ແລະ ຜູ້ຍິງ", ic:'<circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18h6"/>'},
  {id:"t:beauty", lb:"ເຄື່ອງສຳອາງ", ic:'<path d="M9 3h6v4H9z"/><rect x="7" y="7" width="10" height="14" rx="3"/>'},
  {id:"t:perfume", lb:"ນ້ຳຫອມ", ic:'<path d="M10 3h4v3h-4z"/><rect x="6" y="8" width="12" height="13" rx="3"/><path d="M12 6v2"/>'},
  {id:"t:sport", lb:"ກິລາ ແລະ ໂປຣຕີນ", ic:'<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>'}
];
const TYPE_LB = {supplement:"ວິຕາມິນ ແລະ ອາຫານເສີມ", beauty:"ເຄື່ອງສຳອາງ", perfume:"ນ້ຳຫອມ", sport:"ກິລາ ແລະ ໂປຣຕີນ", other:"ອື່ນໆ"};
const DELIVERY = [
  {id:"rider", lb:"ໄຣເດີສົ່ງພາຍໃນມື້", sub:"ນະຄອນຫຼວງວຽງຈັນ · ພັກທຸກວັນອາທິດ", fee:true},
  {id:"hal", lb:"ຂົນສົ່ງ ຮຸ່ງອາລຸນ", sub:"ຕ່າງແຂວງ"},
  {id:"anousith", lb:"ຂົນສົ່ງ ອານຸສິດ", sub:"ຕ່າງແຂວງ"},
  {id:"mixay", lb:"ຂົນສົ່ງ ມີໄຊ", sub:"ຕ່າງແຂວງ"}
];

const $ = s => document.querySelector(s);
const kip = n => Number(n).toLocaleString("en-US") + " ກີບ";
const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const waLink = text => "https://wa.me/" + (CFG.whatsapp || "") + "?text=" + encodeURIComponent(text);
function store(k, v){ try{ if(v===undefined) return JSON.parse(localStorage.getItem(k)||"null"); localStorage.setItem(k, JSON.stringify(v)); }catch(e){ return null; } }

// ----- CSV -----
function parseCSV(text){
  const rows=[]; let row=[], f="", q=false;
  text = text.replace(/^﻿/,"");
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
    else if(c==='"') q=true;
    else if(c===','){ row.push(f); f=""; }
    else if(c==='\n'||c==='\r'){ if(c==='\r'&&text[i+1]==='\n') i++; row.push(f); rows.push(row); row=[]; f=""; }
    else f+=c;
  }
  if(f!==""||row.length){ row.push(f); rows.push(row); }
  const head = (rows.shift()||[]).map(h=>h.trim().toLowerCase());
  return rows.filter(r=>r.some(x=>x.trim())).map(r=>Object.fromEntries(head.map((h,i)=>[h,(r[i]||"").trim()])));
}
const yes = v => /^(yes|y|1|true|ມີ|ແມ່ນ)$/i.test(String(v).trim());
const num = v => Number(String(v).replace(/[^\d.]/g,"")) || 0;
function hueOf(s){ let h=0; for(const ch of String(s)) h=(h*31+ch.charCodeAt(0))%360; return h; }
// ຊື່ຫຍໍ້ຍີ່ຫໍ້ທີ່ທີມໃຊ້ໃນ Pancake → ຊື່ເຕັມໃຫ້ລູກຄ້າອ່ານ (ຄົ້ນຫາໄດ້ທັງ 2 ແບບ)
const BRANDS = {hc:"Healthy Care", ntbt:"Nature's Bounty", bm:"Blackmores", ntw:"Nature's Way", ntm:"Nature Made", kl:"Kirkland", lsp:"Life Space", spl:"Springleaf", sw:"Swisse"};
const fullBrand = s => String(s).replace(/(^|[\s(\/])(hc|ntbt|bm|ntw|ntm|kl|lsp|spl)(?=[\s)\/.,]|$)/gi, (a,pre,b)=>pre+BRANDS[b.toLowerCase()]);
// ຍີ່ຫໍ້ ສຳລັບ "ເລືອກຕາມຍີ່ຫໍ້" (ເບິ່ງຈາກຊື່ສິນຄ້າ)
const BRAND_RX = [["Blackmores",/blackmores/i],["Swisse",/swisse|\bsw\b/i],["Healthy Care",/healthy ?care/i],["Nature's Way",/nature'?s way/i],["Nature's Bounty",/nature'?s bounty/i],["Nature Made",/nature made/i],["Kirkland",/kirkland/i],["Life Space",/life ?space/i],["Bio Island",/bio ?island/i],["Elevit",/elevit|menevit/i],["Centrum",/centrum/i],["Caruso's",/caruso/i],["Micro Organics",/micro ?(organics|genics)|microgenics/i],["Ostelin",/ostelin/i],["NOW",/^now\b|\bnow (foods|vitamin|garlic|gaba|nadh|magnesium|beta|coq10|pumpkin|pycno|astax|sport|egcg|ultra)/i],["Natrol",/natrol/i],["NeoCell",/neocell/i],["Wagner",/wagner/i],["Rifold",/rifold/i],["Musashi",/musashi/i],["Fatblaster",/fat ?blaster/i],["Vital Proteins",/vital proteins/i],["Youtheory",/youtheory/i],["Teddi Lab",/teddi/i],["Sambucol",/sambucol/i],["Brauer",/brauer/i],["L'il Critters",/critters/i],["Aptamil",/aptamil/i],["PediaSure",/pediasure/i],["Alula",/alula/i],["La Roche-Posay",/roche.?pos/i],["CeraVe",/cerave/i],["Aveeno",/aveeno/i],["Eaoron",/eaoron/i],["Thompson's",/thompson/i],["Puritan's Pride",/puritan/i],["Go Healthy",/^go |go healthy/i],["CareVoice",/care ?voice/i],["Dior",/dior|sauvage|jadore/i],["Chanel",/chanel|chance/i],["YSL",/\bysl\b|black opium|libre|mon paris|myslf/i],["Armani",/armani|acqua di gio|si passion|stronger with you/i],["Lancome",/lanc[oô]me|idole|la vie est belle/i],["Burberry",/burberry/i],["Gucci",/gucci/i],["Versace",/versace/i],["Jo Malone",/jo malone/i],["Jean Paul Gaultier",/gaultier|le male/i],["Narciso Rodriguez",/narciso/i],["Armaf",/armaf|club de nuit/i],["MFK",/\bmfk\b|baccarat/i],["Prada",/prada/i],["Sarah Jessica Parker",/sarah jessica|\blovely\b/i],["Ariana Grande",/ariana/i],["Delta",/^delta/i],["Elizabeth Arden",/elizabeth arden|elizabet arden/i],["Britney Spears",/britney/i],["Webber Naturals",/webber/i],["Nature's Care",/nature'?s care|nature care|\bntc\b/i],["Vaseline",/vaseline/i],["Quality of Life",/quality of life/i],["Calvin Klein",/calvin klein|\bck\b/i],["Berocca",/berocca/i],["Bioglan",/bioglan/i],["Inner Health",/inner ?health/i],["Cenovis",/cenovis/i],["Natural Factors",/natural factors/i],["Oral-B",/oral.?b/i],["Colgate",/colgate/i],["One A Day",/one a day/i],["Selsun",/selsun/i],["Vicks",/vick/i],["Life Extension",/life extension/i]];
const PROMO_RX = /\bsale\b|ໂປຼແຖມ|\*\s*pro\b|\bpro\s*\*|\bpro\s*\d|\bpro\s*$/i; // ຊື່ສິນຄ້າທີ່ມີ Pro / Sale / ໂປຼແຖມ = ສິນຄ້າໂປຣໂມຊັ່ນ
function applyTimedPromos(list){ // ລາຄາໂປຣຕາມວັນ (config.timedPromos) · ເວລາລາວ UTC+7
  const now = Date.now();
  const all = list.filter(p=>p.promo).map(p=>p.promo).concat((CFG.timedPromos||[]).filter(t=>!list.some(p=>p.promo&&p.id===t.id))); // ໂປຣຈາກ Sheet (ໜ້າແອັດມິນ) ກ່ອນ, ແລ້ວຈາກ config
  all.forEach(t=>{
    const from = Date.parse(t.from+"T00:00:00+07:00"), end = Date.parse(t.until+"T23:59:59+07:00");
    if(!(now>=from && now<=end)) return;
    const p = list.find(x=>x.id===t.id); if(!p) return;
    if(t.full && p.full){ if(p.full>t.full) p.was = p.full; p.full = t.full; }
    (t.trial||[]).forEach((v,k)=>{ if(p.trials[k] && v){ p.trials[k].was = p.trials[k].price; p.trials[k].price = v; } });
    p.trial = p.trials[0]||null;
    p.promoLabel = (t.label||"ໂປຣ")+" ຮອດ "+t.until.split("-").reverse().slice(0,2).join("/");
    if(!p.tags.includes("sale")) p.tags.push("sale");
  });
}
const brandOf = s => (BRAND_RX.find(([,rx])=>rx.test(s))||[""])[0];
function toProduct(r, i){
  const id = r.id || String(i+1);
  const tsz = (r.trial_size||"").split("|"), tpr = (r.trial_price||"").split("|");
  const trials = tpr.map((pr,k)=>({qty:(tsz[k]||"").trim(), price:num(pr)})).filter(t=>t.price>0);
  let type = (r.type||"supplement").trim().toLowerCase();
  if(type!=="perfume" && /ນ້ຳຫອມ|\bED[PT]\b|parfum|cologne|club de nuit/i.test(r.name_lo||"")) type = "perfume";
  const tags = (r.category||"").split(/[|,]/).map(s=>s.trim().toLowerCase()).filter(Boolean)
    .concat(brandOf(fullBrand(r.name_lo||r.name_en||"")+" "+(r.brand||""))?["b:"+brandOf(fullBrand(r.name_lo||r.name_en||"")+" "+(r.brand||""))]:[], (yes(r.best_seller)||(CFG.bestSellers||[]).includes(r.id||String(i+1)))?["best"]:[], yes(r.new)?["new"]:[], (yes(r.sale)||PROMO_RX.test(r.name_lo||""))?["sale"]:[], ["t:"+type]);
  // 4 ໝວດໃຫຍ່ (ແບບ Chemist): ນ້ຳຫອມ / ແມ່ ແລະ ເດັກ / ຄວາມງາມ / ວິຕາມິນ
  const grp = type==="perfume" ? "perfume" : (tags.includes("kids") || MOM_RX.test((r.name_lo||"")+" "+(r.name_en||""))) ? "mom" : type==="beauty" ? "beauty" : "vit";
  tags.push("g:"+grp);
  const raw = r.name_lo || r.name_en || "—", nm = fullBrand(raw);
  return {
    id, rank:(CFG.bestSellers||[]).indexOf(id)+1, nm, en:r.name_en || "", size:r.size || "", brand:fullBrand(r.brand || ""), type, tags,
    full:num(r.price_full), was:num(r.price_old)||0,
    trials, trial: trials[0] || null,
    promo: (r.promo_until||"").trim() ? {id, label:r.promo_label||"", from:(r.promo_from||"").trim()||"2000-01-01", until:r.promo_until.trim(), full:num(r.promo_full), trial:(r.promo_trial||"").split("|").map(num)} : null,
    // ສິນຄ້າສັ່ງຈອງ: ຖັນ in_stock = pre (ຫຼື ຈອງ) · ຖັນ note = ວັນຄາດວ່າຮອດ
    pre: /^(pre|preorder|ຈອງ)$/i.test(String(r.in_stock||"").trim()), eta: (r.note||"").trim(),
    stock: r.in_stock==="" ? true : (yes(r.in_stock) || /^(pre|preorder|ຈອງ)$/i.test(String(r.in_stock).trim())),
    photo: r.photo || "", tiktok: r.tiktok || "", hue: hueOf(r.brand||nm),
    bk: brandOf(nm+" "+(r.brand||"")),
    find: (nm+" "+raw+" "+(r.name_en||"")+" "+(r.search||"")+(type==="beauty"?" ເຄື່ອງສຳອາງ ສຳອາງ ຄວາມງາມ cosmetic":"")).toLowerCase()
  };
}

// ລວມນ້ຳຫອມຂະໜາດຕ່າງໆ (ລະຫັດ A134ກ່ອງໃຫຍ່ / A134ແບ່ງ5ML ...) ເປັນສິນຄ້າດຽວ ເພາະ Pancake ແຍກເປັນຫຼາຍລາຍການ
const VAR_RX = /^(.+?)\s*(ກ່ອງໃຫຍ່|ແບ່ງ\s*([\d.]+)\s*(ML|ແຜ່ນ))\s*$/i;
function mergeVariants(rows){
  const groups = new Map(), out = [];
  rows.forEach(r => {
    const m = VAR_RX.exec((r.code||"").trim());
    if(!m){ out.push(r); return; }
    const key = m[1].trim()+"|"+(r.name_lo||"").trim().toLowerCase();
    if(!groups.has(key)){ groups.set(key, []); out.push(groups.get(key)); }
    groups.get(key).push({r, ml: m[3] ? m[3]+(/ແຜ່ນ/.test(m[4]||"")?" ແຜ່ນ":"ml") : ""});
  });
  return out.map(x => {
    if(!Array.isArray(x)) return x;
    if(x.length===1 && !x[0].ml) return x[0].r; // ແຖວແບ່ງດ່ຽວ (ບໍ່ມີຂວດເຕັມ) ຕ້ອງສະແດງເປັນຂວດແບ່ງ ບໍ່ແມ່ນລາຄາຂວດເຕັມ
    const main = x.find(v=>!v.ml);
    const base = {...(main ? main.r : x[0].r)};
    const splits = x.filter(v=>v.ml && num(v.r.price_full)>0 && (v.r.in_stock==="" || yes(v.r.in_stock))).sort((a,b)=>parseFloat(b.ml)-parseFloat(a.ml));
    if(!main){ base.price_full = ""; base.price_old = ""; }
    base.trial_size = splits.map(v=>v.ml).join("|");
    base.trial_price = splits.map(v=>v.r.price_full).join("|");
    base.photo = (main && main.r.photo) || (x.find(v=>v.r.photo)||{r:{}}).r.photo || "";
    base.in_stock = x.some(v=>v.r.in_stock==="" || yes(v.r.in_stock)) ? "yes" : "no";
    return base;
  });
}

let shown = 40, showBrands = false;
let P = [], cart = store("nnz-cart") || [], tab = "home", filter = null, query = "", delivery = store("nnz-dl2") || "", pay = store("nnz-pay") || "qr", loadErr = "";

function shapeOf(p){
  const n = p.find || "";
  if(p.type==="perfume") return "perfume";
  if(p.type==="sport" || /powder|whey|protein|ຜົງ/.test(n)) return "tub";
  if(/gumm|ກຳມີ້|jelly|ເຈວລີ/.test(n)) return "jar";
  if(/serum|essence|drop|oil\b|ເອສເຊັນ/.test(n) && p.type==="beauty") return "dropper";
  if(p.type==="beauty") return "tube";
  return "bottle";
}
function pic(p){
  if(p.photo){
    const gd = (p.photo.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=|thumbnail\?id=)([\w-]{20,})/)||[])[1];
    const src = gd ? `https://drive.google.com/thumbnail?id=${gd}&sz=w800` : /^https?:/i.test(p.photo) ? p.photo : "images/" + p.photo;
    return `<img src="${esc(src)}" alt="${esc(p.nm)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">`;
  }
  const h = p.hue, dark = `hsl(${h} 45% 28%)`, main = `hsl(${h} 62% 52%)`, soft = `hsl(${h} 70% 95%)`, ink = `hsl(${h} 45% 20%)`;
  const brand = esc((p.brand||"nnz").toUpperCase().slice(0,10));
  const sub = esc((p.trial && !p.full) ? "ແບ່ງ " + p.trial.qty : (p.nm.match(/\d+\s?(?:mg|ml|g|iu|met|caps?|tabs?)\b/i)||[""])[0]);
  const lab = (x,y,w,hh) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="${soft}"/>
    <text x="100" y="${y+hh/2-2}" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="${brand.length>7?11:13}" fill="${ink}">${brand}</text>
    <text x="100" y="${y+hh/2+13}" text-anchor="middle" font-family="Inter,'Noto Sans Lao',sans-serif" font-weight="600" font-size="9" fill="${dark}">${sub}</text>`;
  const shine = (x,y,hh) => `<rect x="${x}" y="${y}" width="8" height="${hh}" rx="4" fill="#fff" opacity=".25"/>`;
  const shapes = {
    bottle: `<rect x="72" y="28" width="56" height="22" rx="6" fill="${dark}"/><rect x="58" y="48" width="84" height="132" rx="18" fill="${main}"/>${lab(62,84,76,62)}${shine(68,56,112)}`,
    jar: `<rect x="56" y="46" width="88" height="22" rx="8" fill="${dark}"/><rect x="48" y="66" width="104" height="114" rx="22" fill="${main}"/>${lab(56,94,88,58)}${shine(56,74,96)}`,
    tub: `<rect x="44" y="50" width="112" height="20" rx="6" fill="${dark}"/><path d="M48 70h104l-8 110H56z" fill="${main}"/>${lab(58,98,84,58)}${shine(60,76,96)}`,
    perfume: `<rect x="84" y="26" width="32" height="26" rx="5" fill="${dark}"/><rect x="94" y="50" width="12" height="12" fill="${dark}"/><rect x="50" y="60" width="100" height="120" rx="14" fill="${main}" opacity=".9"/><rect x="58" y="68" width="84" height="104" rx="10" fill="#fff" opacity=".18"/>${lab(64,98,72,52)}`,
    tube: `<path d="M70 30h60l6 120H64z" fill="${main}"/><rect x="78" y="148" width="44" height="32" rx="5" fill="${dark}"/>${lab(70,66,60,58)}${shine(76,36,104)}`,
    dropper: `<rect x="90" y="18" width="20" height="26" rx="10" fill="${dark}"/><rect x="82" y="42" width="36" height="16" rx="4" fill="${dark}"/><rect x="62" y="56" width="76" height="124" rx="14" fill="${main}"/>${lab(66,92,68,58)}${shine(68,62,110)}`
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.nm)}"><ellipse cx="100" cy="184" rx="58" ry="7" fill="hsl(${h} 30% 40% / .16)"/>${shapes[shapeOf(p)]}</svg>`;
}
function card(p){
  return `<button class="card" data-open="${esc(p.id)}" aria-label="${esc(p.nm)}">
    <div class="pic">${pic(p)}${p.rank?`<span class="rank${p.rank<=3?' top':''}">🔥 ຂາຍດີ #${p.rank}</span>`:''}${!p.stock?'<span class="tag out">ໝົດຊົ່ວຄາວ</span>':p.pre?'<span class="tag pre">🚚 ກຳລັງມາ · ຈອງໄດ້</span>':(p.promoLabel?`<span class="tag promo">🎁 ${esc(p.promoLabel.split(' ຮອດ')[0])}</span>`:p.was>p.full?'<span class="tag">ຫຼຸດລາຄາ</span>':(p.tags.includes("sale")?`<span class="tag promo">🎁 ${esc(p.promoLabel?p.promoLabel.split(' ຮອດ')[0]:'ໂປຣ')}</span>`:''))}${p.trial?`<span class="tag trial">${/ແຜ່ນ/.test(p.trial.qty)?'ແຍກແຜ່ນໄດ້':/ແຜງ/.test(p.trial.qty)?'ແຍກແຜງໄດ້':'ມີຂວດແບ່ງ'}</span>`:''}${hasVid(p.id)?'<span class="vbadge">▶ ມີວິດີໂອ</span>':''}</div>
    <div class="body"><div class="nm">${esc(p.nm)}</div><div class="meta">${esc(TYPE_LB[p.type]||"")}</div>
    <div class="pr">${p.full?`<b>${kip(p.full)}</b>`:`<b>${kip(p.trial.price)}</b>`}${p.was>p.full?`<s>${kip(p.was)}</s>`:''}${p.full&&p.trial?`<small>${/ແຜ່ນ/.test(p.trial.qty)?'ແຜ່ນລະ':/ແຜງ/.test(p.trial.qty)?'ແຜງລະ':'ແບ່ງລອງ'} ${kip(p.trial.price)}</small>`:(!p.full?'<small>ຂວດແບ່ງ</small>':'')}</div></div>
  </button>`;
}
function list(){
  const q = query.trim().toLowerCase();
  const r = P.filter(p => (!filter || (filter==="trial" ? !!p.trial : p.tags.includes(filter))) &&
    (!q || q.split(/\s+/).every(w=>p.find.includes(w))));
  return filter==="best" ? r.sort((a,b)=>(a.rank||99)-(b.rank||99)) : r;
}
const brandCounts = () => { const m={}; P.forEach(p=>{ if(p.bk) m[p.bk]=(m[p.bk]||0)+1; }); return Object.entries(m).sort((a,b)=>b[1]-a[1]); };
// ຍີ່ຫໍ້ແບ່ງເປັນ 3 ກຸ່ມ ຕາມປະເພດສິນຄ້າສ່ວນໃຫຍ່ຂອງຍີ່ຫໍ້ນັ້ນ
const BRAND_GROUPS = [["vit","ວິຕາມິນ ແລະ ອາຫານເສີມ"],["beauty","ເຄື່ອງສຳອາງ"],["perfume","ນ້ຳຫອມ"]];
const brandGroupOf = b => { const t={}; P.forEach(p=>{ if(p.bk===b){ const g = p.type==="beauty"?"beauty":p.type==="perfume"?"perfume":"vit"; t[g]=(t[g]||0)+1; } }); return Object.entries(t).sort((a,c)=>c[1]-a[1])[0][0]; };
const BRAND_COLOR = {"Swisse":"#1f3c88","Healthy Care":"#2e7d32","Blackmores":"#7b1f2e","Nature's Way":"#c62828","Nature's Bounty":"#4a2c82","Nature Made":"#1b5e20","Kirkland":"#b71c1c","Life Space":"#e46c0a","NOW":"#0b5aa6","Bio Island":"#0097b2","Elevit":"#8e3a9d","Centrum":"#0d47a1","Caruso's":"#1a237e","La Roche-Posay":"#1565c0","CeraVe":"#1e88e5","Dior":"#222","Chanel":"#111","YSL":"#111","Armani":"#333","PediaSure":"#5e35b1","Ostelin":"#f57c00","Micro Organics":"#00897b"};
const BRAND_MARK = {"NOW":"NOW","YSL":"YSL","MFK":"MFK","Swisse":"SW","Blackmores":"BM","Kirkland":"KL","Centrum":"CT","Elevit":"EL","Ostelin":"OS","Natrol":"NT","NeoCell":"NC","Wagner":"WG","Musashi":"MS","Caruso's":"CR","PediaSure":"PS","Alula":"AL","CeraVe":"CV","Aveeno":"AV","Dior":"DIOR","Chanel":"CC","Armani":"GA","Burberry":"BB","Gucci":"GG","Versace":"VS","Prada":"PR","Lancome":"LC","Vaseline":"VS","Berocca":"BR","Bioglan":"BG","Cenovis":"CN","Colgate":"CG","Vicks":"VK","Selsun":"SS","Rifold":"RF","Sambucol":"SB","Brauer":"BR","Youtheory":"YT","Eaoron":"EA","Armaf":"AF","Delta":"DT","Fatblaster":"FB"};
const brandMark = b => { if(BRAND_MARK[b]) return BRAND_MARK[b]; const w = b.replace(/[^A-Za-z0-9' -]/g,"").split(/[\s-]+/).filter(Boolean); return (w.length>1 ? w[0][0]+w[1][0] : (w[0]||"?").slice(0,2)).toUpperCase(); };
const brandChip = ([b,c]) => `<button class="btile" data-need="b:${esc(b)}" aria-pressed="${filter==='b:'+b}"><span class="bmark" style="background:${BRAND_COLOR[b]||`hsl(${hueOf(b)} 45% 38%)`}">${esc(brandMark(b))}</span><span class="bname">${esc(b)}</span><span class="bnum num">${c} ລາຍການ</span></button>`;
let bdGroup = "all";
function renderDrop(){
  const all = brandCounts().filter(([b])=>bdGroup==="all"||brandGroupOf(b)===bdGroup).sort((a,b)=>a[0].localeCompare(b[0],"en",{sensitivity:"base"}));
  const byL = {}; all.forEach(x=>{ const L=(x[0][0]||"#").toUpperCase(); (byL[L]=byL[L]||[]).push(x); });
  const tabs = [["all","ທັງໝົດ"]].concat(BRAND_GROUPS).map(([g,lb])=>`<button type="button" data-bdg="${g}" aria-pressed="${bdGroup===g}">${lb}</button>`).join("");
  $("#bdrop").innerHTML = `<div class="bd-in"><div class="bd-tabs">${tabs}</div>${Object.keys(byL).sort().map(L=>`<div class="bd-letter">${esc(L)}</div>${byL[L].map(([b,c])=>`<button type="button" class="bd-item" data-need="b:${esc(b)}" aria-pressed="${filter==='b:'+b}"><span class="bmark" style="background:${BRAND_COLOR[b]||`hsl(${hueOf(b)} 45% 38%)`}">${esc(brandMark(b))}</span><b>${esc(b)}</b><span class="num">${c}</span></button>`).join("")}`).join("")}</div>`;
}
function toggleDrop(open){ const d=$("#bdrop"), btn=$("#brandsBtn"); open = open===undefined ? d.hidden : open; if(open){ renderDrop(); d.scrollTop=0; } d.hidden=!open; btn.setAttribute("aria-expanded", String(open)); }
const brandGrid = (arr) => `<div class="bgrid">${arr.map(brandChip).join("")}</div>`;
const brandSections = () => { const all = brandCounts(); return BRAND_GROUPS.map(([g,lb])=>{ const arr = all.filter(([b])=>brandGroupOf(b)===g); return arr.length?`<h3 class="bgroup">${lb} <span class="num">· ${arr.length} ຍີ່ຫໍ້ ປັດເບິ່ງ ›</span></h3><div class="brow">${arr.map(brandChip).join("")}</div>`:""; }).join(""); };
const NEED_COLOR = {"new":"#e53935","trial":"#ef6c00","immune":"#2e7d32","skin":"#d81b60","sleep":"#5e35b1","joint":"#1e88e5","liver":"#00897b","kids":"#f2a20c","women":"#c2185b","t:beauty":"#ec407a","t:perfume":"#8e24aa","t:sport":"#455a64"};
// ບັດໝວດໝູ່ມີຮູບ (ແຖວດຽວ ປັດຂ້າງ): ເລືອກຮູບສິນຄ້າຈິງຂອງໝວດນັ້ນ ເອົາຮູບ NNZ ໃໝ່ (pg_) ແລະ ສິນຄ້າຂາຍດີກ່ອນ ບໍ່ໃຫ້ຮູບຊ້ຳກັນ
function needCards(){
  const used = new Set();
  return NEEDS.map(n=>{
    const pool = P.filter(p=>p.photo && p.stock && !used.has(p.photo) && (n.id==="trial" ? !!p.trial : p.tags.includes(n.id)));
    pool.sort((a,b)=>((a.rank||99)-(b.rank||99)) || ((/pg_/.test(b.photo)?1:0)-(/pg_/.test(a.photo)?1:0)));
    const p = pool[0]; if(p) used.add(p.photo);
    const c = NEED_COLOR[n.id]||"#e52535";
    return `<button class="ncard" data-need="${n.id}" aria-pressed="${filter===n.id}" style="--c:${c}"><span class="nimg">${p?pic(p):`<span class="nph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${n.ic}</svg></span>`}</span><span class="nlab">${n.lb}</span></button>`;
  }).join("");
}
const MOM_RX = /pediasure|aptamil|alula|elevit|menevit|natalis|pregnan|breastfeed|infant|\bbaby|\bkids?\b|ເດັກ|critters|bio ?island|pentavite|teen|ນົມເດັກ/i;
const CATS = [{id:"g:vit",lb:"ວິຕາມິນ ແລະ ອາຫານເສີມ",img:"cat/c3_vit.jpg"},{id:"g:mom",lb:"ສິນຄ້າແມ່ ແລະ ເດັກ",img:"cat/c2_mom.jpg"},{id:"g:beauty",lb:"ຄວາມງາມ ແລະ ເຄື່ອງສຳອາງ",img:"cat/c2_beauty.jpg"},{id:"g:perfume",lb:"ນ້ຳຫອມ",img:"cat/c2_perfume.jpg"}];
const catCard = c => `<button class="ccard" data-need="${c.id}" aria-pressed="${filter===c.id}"><img src="images/${c.img}" alt="${c.lb}" loading="lazy"><span class="clab">${c.lb}</span></button>`;
const needBtn = n => `<button class="need" data-need="${n.id}" aria-pressed="${filter===n.id}" style="--c:${NEED_COLOR[n.id]||"#e52535"};--cb:${(NEED_COLOR[n.id]||"#e52535")}30;--cb2:${(NEED_COLOR[n.id]||"#e52535")}0d"><span class="dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${n.ic}</svg></span>${n.lb}</button>`;

let V = [];
const vidsOf = id => V.filter(v=>(v.products||[]).includes(id)).sort((a,b)=>(b.n||0)-(a.n||0));
const PRODUCT_VIDEOS = false; // ເຈົ້າຂອງຂໍປິດວິດີໂອໃນໜ້າສິນຄ້າໄວ້ກ່ອນ (2026-11-19) · ປ່ຽນເປັນ true ເພື່ອເປີດຄືນ
const hasVid = id => PRODUCT_VIDEOS && V.some(v=>(v.products||[]).includes(id));
const ACC = {nnz_vitaminofficial:"NNZ vitamin official", nnzvitamin2:"NNZ vitamin ຊ່ອງສຳຮອງ"};
const ttUrl = v => `https://www.tiktok.com/@${v.acc}/video/${v.id}`;
const vidCard = v => `<button class="vcard" data-vid="${esc(v.id)}" aria-label="ເບິ່ງວິດີໂອ ${esc(v.title||'NNZ')}">
  <div class="vthumb">${v.cover?`<img src="images/${esc(v.cover)}" alt="" loading="lazy">`:'<div class="vph">NNZ</div>'}
    <span class="vplay"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
    <span class="vviews">▶ ${esc(v.views)}</span></div>
  <span class="vtitle">${esc(v.title||'ວິດີໂອຈາກ NNZ')}</span></button>`;
// ເຕືອນມິດສາຊີບ: ແຖບແດງເທິງໜ້າຫຼັກ ກົດແລ້ວເປີດລາຍລະອຽດ (ບໍ່ເດັ້ງຂຶ້ນເອງ ຕາມເຈົ້າຂອງສັ່ງ 22/11)
function openScam(){
  if(document.querySelector(".sheet.scam")) return;
  const sh = document.createElement("div"); sh.className="sheet scam"; sh.setAttribute("role","dialog"); sh.setAttribute("aria-modal","true"); sh.setAttribute("aria-label","ລະວັງມິດສາຊີບ");
  const wa = [CFG.whatsappShow, CFG.whatsappShow2].filter(Boolean).map(esc).join(" · ");
  sh.innerHTML = `<div class="panel"><div class="grab"></div><div class="wrap scamw">
    <div class="scamhead"><span aria-hidden="true">⚠️</span><h2>ລະວັງມິດສາຊີບ ປອມເປັນຮ້ານ</h2></div>
    <p>ໂອນເງິນເຂົ້າ <b>ຊື່ບັນຊີນີ້ຊື່ດຽວເທົ່ານັ້ນ</b></p>
    <div class="scamname">${esc(CFG.payName||"")}</div>
    <ul class="scamlist">
      <li>❌ ແອັດມິນ <b>ບໍ່ເຄີຍ</b> ສົ່ງ QR ຫຼື ເລກບັນຊີອື່ນໃຫ້ໂອນ</li>
      <li>❌ ຮ້ານ <b>ບໍ່ເຄີຍ</b> ຂໍລະຫັດ OTP ຫຼື ລະຫັດຜ່ານ</li>
      <li>✅ ເວັບທາງການມີບ່ອນດຽວ: <b>nnzvitamin.com</b></li>
      ${wa?`<li>✅ WhatsApp ທາງການ: <b class="num">${wa}</b></li>`:""}
    </ul>
    <p class="note" style="margin:0">ຖ້າມີຄົນໃຫ້ໂອນເຂົ້າຊື່ອື່ນ ຢ່າໂອນ · ໂທຖາມຮ້ານກ່ອນທຸກຄັ້ງ</p>
    <button class="cta" data-x>ເຂົ້າໃຈແລ້ວ</button>
  </div></div>`;
  document.body.appendChild(sh); document.body.style.overflow="hidden";
  const onKey = e => { if(e.key==="Escape") close(); };
  const close = () => { sh.remove(); document.body.style.overflow=""; document.removeEventListener("keydown", onKey); };
  document.addEventListener("keydown", onKey);
  sh.addEventListener("click", e => { if(e.target===sh || e.target.closest("[data-x]")) close(); });
}
function openVideo(id){
  const v = V.find(x=>x.id===id); if(!v) return;
  const prods = (v.products||[]).map(pid=>P.find(p=>p.id===pid)).filter(Boolean);
  const sh = document.createElement("div"); sh.className="sheet"; sh.setAttribute("role","dialog"); sh.setAttribute("aria-modal","true"); sh.setAttribute("aria-label","ວິດີໂອ");
  sh.innerHTML = `<div class="panel"><div class="grab"></div><div class="wrap">
    <button class="close" data-x>ປິດ</button>
    <div class="vplayer"><iframe src="https://www.tiktok.com/player/v1/${esc(v.id)}?autoplay=1&description=1&music_info=0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="TikTok"></iframe></div>
    <p class="note" style="margin:0">${esc(ACC[v.acc]||'NNZ')} · ▶ ${esc(v.views)} ວິວ</p>
    ${prods.map(p=>`<button class="clip" data-vprod="${esc(p.id)}" style="text-align:left;width:100%;cursor:pointer"><div class="play" style="background:var(--brand,#e52535)">🛒</div><div><b style="font-size:14px">${esc(p.nm)}</b><div class="note">ເບິ່ງລາຄາ ແລະ ສັ່ງຊື້</div></div></button>`).join("")}
    <a class="cta ghost" href="${esc(ttUrl(v))}" target="_blank" rel="noopener">ເປີດໃນແອັບ TikTok</a>
  </div></div>`;
  document.body.appendChild(sh); document.body.style.overflow="hidden";
  const onKey = e => { if(e.key==="Escape") close(); };
  const close = () => { sh.remove(); document.body.style.overflow=""; document.removeEventListener("keydown", onKey); };
  document.addEventListener("keydown", onKey);
  sh.addEventListener("click", e => {
    if(e.target===sh || e.target.closest("[data-x]")) return close();
    const o = e.target.closest("[data-vprod]"); if(o){ close(); openProduct(o.dataset.vprod); }
  });
}
function renderHome(){
  if(loadErr) return `<div class="wrap"><div class="empty"><b>ໂຫຼດລາຍການສິນຄ້າບໍ່ໄດ້</b><span>${esc(loadErr)}</span><span>ຖາມແອັດມິນທາງ WhatsApp ໄດ້ເລີຍ</span></div></div>`;
  if(!P.length) return `<div class="wrap"><div class="empty"><b>ກຳລັງໂຫຼດສິນຄ້າ…</b></div></div>`;
  const pick = (f,n=12) => P.filter(f).slice(0,n);
  const best = P.filter(p=>p.tags.includes("best")&&p.stock).sort((a,b)=>(a.rank||99)-(b.rank||99)).slice(0,12), news = pick(p=>p.tags.includes("new")), sale = pick(p=>p.tags.includes("sale")&&p.stock,16);
  const trial = pick(p=>p.trial && p.type==="supplement"), perf = pick(p=>p.type==="perfume" && p.trial), beauty = pick(p=>p.type==="beauty");
  const rowSec = (title, need, arr, note="") => arr.length ? `<section><div class="sechead"><h2>${title}</h2><button class="more" data-need="${need}">ເບິ່ງທັງໝົດ</button></div>${note}<div class="row">${arr.map(card).join("")}</div></section>` : "";
  return `<div class="wrap">
    ${CFG.payName?`<button class="scambar" data-scam><span aria-hidden="true">⚠️</span><span><b>ລະວັງມິດສາຊີບ</b> · ໂອນເຂົ້າຊື່ <b>${esc(CFG.payName)}</b> ເທົ່ານັ້ນ</span><span class="go">›</span></button>`:""}
    <section><div class="sechead"><h2>ໝວດສິນຄ້າຍອດນິຍົມ</h2></div><div class="ccards">${CATS.map(catCard).join("")}</div><div class="cdots" aria-hidden="true"></div></section>
    <section><div class="sechead"><h2>ເລືອກຕາມຍີ່ຫໍ້</h2><button class="more" data-brands>ທຸກຍີ່ຫໍ້</button></div><div class="brow">${brandCounts().filter(([b])=>brandGroupOf(b)==="vit").slice(0,14).map(brandChip).join("")}</div></section>
    ${rowSec("🔥 ສິນຄ້າຂາຍດີ ທີ່ລູກຄ້າສັ່ງຫຼາຍທີ່ສຸດ","best",best,'<p class="note" style="margin:-4px 0 10px">ຈັດອັນດັບຈາກຍອດສັ່ງຊື້ຈິງຂອງຮ້ານ · ລູກຄ້າເລືອກຊື້ຊ້ຳຫຼາຍທີ່ສຸດ</p>')}
    ${rowSec("🎁 ສິນຄ້າໂປຣໂມຊັ່ນ","sale",sale,'<p class="note" style="margin:-4px 0 10px">ລາຄາພິເສດ ແລະ ຂອງແຖມ · ມີຈຳນວນຈຳກັດ</p>')}
    ${V.length?`<section><div class="sechead"><h2>ວິດີໂອຍອດນິຍົມ</h2><a class="more" href="https://www.tiktok.com/@nnz_vitaminofficial" target="_blank" rel="noopener">TikTok</a></div><div class="row vrow">${V.filter(v=>v.row!==false).slice(0,16).map(vidCard).join("")}</div></section>`:''}
    <section aria-label="ວິທີສັ່ງ"><div class="steps">
      <div class="step"><i>1</i>ເລືອກສິນຄ້າ</div><div class="step"><i>2</i>ເລືອກຂວດເຕັມ ຫຼື ຂວດແບ່ງ</div><div class="step"><i>3</i>ໃສ່ກະຕ່າ</div><div class="step"><i>4</i>ສົ່ງອໍເດີທາງ WhatsApp</div>
    </div></section>
    ${rowSec("ຂວດແບ່ງ ຊື້ລອງກ່ອນ","trial",trial,'<p class="note" style="margin:-4px 0 10px">ແບ່ງຈາກຂວດໃຫຍ່ ໂດຍທີມທີ່ໃສ່ຖົງມື ຜ້າກັນເປື້ອນ ແລະ ໝວກ · ຕິດວິທີກິນທຸກຂວດ</p>')}
    ${rowSec("ສິນຄ້າໃໝ່","new",news)}
    ${rowSec("ນ້ຳຫອມ ມີແບ່ງ 10ml","t:perfume",perf)}
    ${rowSec("ເຄື່ອງສຳອາງ","t:beauty",beauty)}
    ${catRows(["new","trial","t:perfume","t:beauty"])}
    ${CFG.mapUrl?`<a class="mapbar" href="${esc(CFG.mapUrl)}" target="_blank" rel="noopener"><span>📍</span><span><b>ໜ້າຮ້ານ nnz ວິຕາມິນ</b><small>${esc(CFG.address||"")}</small></span><span class="go">ນຳທາງ ›</span></a>`:""}
    <p class="note" style="text-align:center">ສິນຄ້າທັງໝົດ <span class="num">${P.length.toLocaleString("en-US")}</span> ລາຍການ · ຄົ້ນຫາດ້ວຍຊື່ ຫຼື ຍີ່ຫໍ້ໄດ້ທາງເທິງ</p>
  </div>`;
}
// ໜ້າສິນຄ້າທັງໝົດ: ແຖວປັດໄດ້ ແຍກຕາມໝວດ ໃຫ້ລູກຄ້າເຫັນວ່າຮ້ານມີຫຍັງແດ່
function catRows(skip=[]){
  return NEEDS.filter(n=>!skip.includes(n.id)).map(n => {
    const arr = P.filter(p => n.id==="trial" ? !!p.trial : p.tags.includes(n.id)).sort((a,b)=>(b.stock?1:0)-(a.stock?1:0));
    if(!arr.length) return "";
    return `<section><div class="sechead"><h2>${esc(n.lb)} <span class="note num">(${arr.length})</span></h2><button class="more" data-need="${n.id}">ເບິ່ງທັງໝົດ</button></div><div class="row">${arr.slice(0,12).map(card).join("")}</div></section>`;
  }).join("");
}
function renderAll(){
  const items = list();
  const nm = filter ? (filter.startsWith("b:") ? "ຍີ່ຫໍ້ "+filter.slice(2) : ((NEEDS.find(n=>n.id===filter)||{}).lb || {best:"ຂາຍດີ",sale:"ສິນຄ້າໂປຣໂມຊັ່ນ"}[filter] || (CATS.find(c=>c.id===filter)||{}).lb || "")) : "ສິນຄ້າທັງໝົດ";
  return `<div class="wrap">
    <div class="sechead"><h2>${esc(query?`ຜົນຄົ້ນຫາ "${query}"`:nm)}</h2>${filter||query?'<button class="more" data-clear>ລ້າງຕົວກອງ</button>':''}</div>
    ${filter&&filter.startsWith("b:")?`<button class="cta ghost" type="button" id="pickBrand" style="height:40px;font-size:14px">ເລືອກຍີ່ຫໍ້ອື່ນ ▾</button>`:`<div class="needs">${NEEDS.map(needBtn).join("")}</div>`}
    ${!filter&&!query ? catRows() : ""}
    ${!filter&&!query ? `<div class="sechead" style="margin-top:6px"><h2>ສິນຄ້າທັງໝົດ</h2></div>` : ""}
    <p class="note num" style="margin:0">${items.length.toLocaleString("en-US")} ລາຍການ</p>
    ${items.length?`<div class="grid">${items.slice(0,shown).map(card).join("")}</div>${items.length>shown?`<button class="cta ghost" data-more style="width:100%">ເບິ່ງເພີ່ມ (ເຫຼືອ <span class="num">${(items.length-shown).toLocaleString("en-US")}</span>)</button>`:''}`:`<div class="empty"><b>ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ</b><span>ລອງພິມຊື່ອື່ນ ຫຼື ຖາມແອັດມິນທາງ WhatsApp</span></div>`}
  </div>`;
}
const cartTotal = () => cart.reduce((s,l)=>s+l.price*l.qty,0);
// ໂຄດສ່ວນຫຼຸດ (ຕັ້ງຄ່າໃນ config.js → promo)
let promo = store("nnz-promo") || "";
function promoInfo(){
  const P = CFG.promo; if(!P || !P.active || !promo) return {off:0, msg:""};
  if(promo.trim().toUpperCase() !== String(P.code).toUpperCase()) return {off:0, msg:"ໂຄດນີ້ໃຊ້ບໍ່ໄດ້", bad:true};
  if(P.until && new Date().toISOString().slice(0,10) > P.until) return {off:0, msg:"ໂຄດນີ້ໝົດເຂດແລ້ວ", bad:true};
  const t = cartTotal(); if(t < (P.min||0)) return {off:0, msg:`ຊື້ຄົບ ${kip(P.min)} ກໍ່ໃຊ້ໂຄດໄດ້ · ຂາດອີກ ${kip(P.min - t)}`, bad:true};
  return {off: Math.min(P.off||0, t), msg:`ໃຊ້ໂຄດ ${String(P.code).toUpperCase()} ແລ້ວ · ຫຼຸດ ${kip(P.off)}`};
}
const payTotal = () => cartTotal() - promoInfo().off;
const isSundayLA = () => { try{ return new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"Asia/Vientiane"}).format(new Date())==="Sun"; }catch(e){ return new Date().getDay()===0; } };
// ນ້ຳຫອມແບ່ງຂາຍ ຕ້ອງໂອນກ່ອນເທົ່ານັ້ນ ບໍ່ມີ COD (ເຈົ້າຂອງສັ່ງ 23/11)
const perfSplit = () => cart.some(l => { const p = P.find(x=>x.id===l.id); return p && p.type==="perfume" && /^ຂວດແບ່ງ/.test(l.opt||""); });
const shipFee = () => delivery==="rider" ? (+CFG.riderFee||0) : 0;
const shipNote = () => !delivery ? "ຍັງບໍ່ເລືອກວິທີຈັດສົ່ງ" : delivery==="rider" ? (shipFee() ? kip(shipFee())+" (ທຸກບ່ອນໃນເມືອງ)" : "ແອັດມິນແຈ້ງ") : "ລູກຄ້າຈ່າຍເອງປາຍທາງ ຕາມບໍລິສັດຂົນສົ່ງ";
const grandTotal = () => payTotal() + shipFee();
function orderText(){
  const d = DELIVERY.find(x=>x.id===delivery) || {id:'', lb:'ຍັງບໍ່ເລືອກ', sub:'-'};
  const isPre = id => (P.find(x=>x.id===id)||{}).pre;
  const lines = cart.map((l,i)=>`${i+1}. ${l.nm} (${l.opt}) x${l.qty} = ${kip(l.price*l.qty)}${isPre(l.id)?' [ຈອງ · ສິນຄ້າກຳລັງມາ]':''}`).join("\n");
  return `APP · ອໍເດີໃໝ່ຈາກແອັບ nnz\nລະຫັດອໍເດີ: ${orderCode}\n${lines}\nລວມຄ່າສິນຄ້າ: ${kip(cartTotal())}\n${promoInfo().off?`ໂຄດສ່ວນຫຼຸດ: ${String(CFG.promo.code).toUpperCase()} −${kip(promoInfo().off)}\n`:""}ຄ່າສົ່ງ: ${shipNote()}\nຍອດຕ້ອງຈ່າຍ: ${kip(grandTotal())}\nຈັດສົ່ງ: ${d.lb} (${d.sub})\n${d.id==='rider'?'ທີ່ຢູ່ / ຈຸດສົ່ງ':'ສາຂາຂົນສົ່ງ ('+d.lb.replace('ຂົນສົ່ງ ','')+')'}: ${cust.place||''}\n\nຊື່: ${cust.name||''}\nເບີໂທ: ${cust.phone||''}\nຈ່າຍແບບ: ${pay==="qr"?"ສະແກນ QR (ແນບສະລິບ)":"ເກັບເງິນປາຍທາງ (COD)"}`;
}
function renderCart(){
  if(perfSplit() && pay==="cod"){ pay="qr"; store("nnz-pay",pay); }
  if(!cart.length) return `<div class="wrap"><h2>ກະຕ່າ</h2><div class="empty"><b>ກະຕ່າຍັງວ່າງ</b><span>ເລືອກສິນຄ້າ ແລ້ວກົດ "ໃສ່ກະຕ່າ"</span><button class="cta" data-tab-go="home" style="flex:none">ເລືອກສິນຄ້າ</button></div></div>`;
  return `<div class="wrap">
    <h2>ກະຕ່າ <span class="note num">(${cart.reduce((s,l)=>s+l.qty,0)} ຊິ້ນ)</span></h2>
    ${cart.map((l,i)=>{const p=P.find(x=>x.id===l.id)||{hue:0,nm:l.nm,en:""};return `<div class="line"><div class="mini">${pic(p)}</div><div class="info"><b>${esc(l.nm)}</b><span>${esc(l.opt)} · ${kip(l.price)}</span>${p.pre?`<span class="prenote">🚚 ຈອງ · ສິນຄ້າກຳລັງມາ${p.eta?' · ຄາດວ່າຮອດ '+esc(p.eta):''}</span>`:''}</div>
      <div class="qty"><button data-dec="${i}" aria-label="ຫຼຸດ">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="ເພີ່ມ">+</button></div></div>`}).join("")}
    <div class="sumbox">
    <div class="total"><span>ລວມຄ່າສິນຄ້າ</span><span class="num">${kip(cartTotal())}</span></div>
    ${promoInfo().off?`<div class="total" style="color:var(--leaf-deep)"><span>ສ່ວນຫຼຸດ (${esc(String(CFG.promo.code).toUpperCase())})</span><span class="num">−${kip(promoInfo().off)}</span></div>`:""}
    <div class="total"><span>ຄ່າສົ່ງ</span><span class="${shipFee()?"num":"shipnote"}">${shipFee() ? kip(shipFee()) : !delivery ? "ເລືອກວິທີສົ່ງຂ້າງລຸ່ມ" : delivery==="rider" ? "ແອັດມິນແຈ້ງ" : "ຈ່າຍປາຍທາງ"}</span></div>
    <div class="total grand"><span><b>ຍອດຕ້ອງຈ່າຍ</b></span><span class="num"><b>${kip(grandTotal())}</b></span></div>
    ${delivery==="rider" && isSundayLA() ? `<p class="note" style="margin:0;color:#b3122a;font-weight:600">ມື້ນີ້ວັນອາທິດ ໄຣເດີພັກ · ອໍເດີມື້ນີ້ ຈະສົ່ງໃນວັນຈັນ</p>` : ""}
    ${delivery && delivery!=="rider" ? `<p class="note" style="margin:0">ຄ່າຂົນສົ່ງຕ່າງແຂວງ ຂຶ້ນກັບບໍລິສັດ ${esc((DELIVERY.find(x=>x.id===delivery)||{lb:""}).lb.replace("ຂົນສົ່ງ ",""))} · ລູກຄ້າຈ່າຍເອງປາຍທາງ ຕອນໄປຮັບເຄື່ອງ</p>` : ""}
    </div>
    <div class="fieldset" role="radiogroup" aria-label="ວິທີຈັດສົ່ງ"><b>ວິທີຈັດສົ່ງ</b>
      ${DELIVERY.map(d=>`<label class="radio" for="dl-${d.id}"><input type="radio" id="dl-${d.id}" name="dl" value="${d.id}" ${delivery===d.id?'checked':''}><span>${d.lb}<small>${d.sub} · ${d.fee ? (+CFG.riderFee ? "ຄ່າສົ່ງ "+kip(+CFG.riderFee)+" ທຸກບ່ອນໃນເມືອງ" : "ແອັດມິນແຈ້ງຄ່າສົ່ງ") : "ຄ່າຂົນສົ່ງ ຈ່າຍເອງປາຍທາງ"}</small></span></label>`).join("")}
    </div>
    <div class="fieldset"><b>${(delivery==="rider"||!delivery)?"ສົ່ງໃຫ້ໃສ":"ຝາກສາຂາໃດ"}</b>
      <label class="fld"><span>${(delivery==="rider"||!delivery)?"ທີ່ຢູ່ ຫຼື ຈຸດສົ່ງ (ບ້ານ, ເມືອງ, ຈຸດສັງເກດ)":"ຊື່ສາຂາ "+(DELIVERY.find(x=>x.id===delivery)||{lb:""}).lb.replace("ຂົນສົ່ງ ","")+" ທີ່ຈະໄປຮັບເຄື່ອງ (ແຂວງ, ເມືອງ, ສາຂາ)"}</span>
        <input class="inp" data-cust="place" value="${esc(cust.place||"")}" placeholder="${(delivery==="rider"||!delivery)?"ເຊັ່ນ ບ້ານໂພນທັນ ເມືອງໄຊເສດຖາ ໃກ້ຕະຫຼາດ":"ເຊັ່ນ ສາຂາ ປາກເຊ ແຂວງຈຳປາສັກ"}" autocomplete="street-address"></label>
      <label class="fld"><span>ຊື່ຜູ້ຮັບ</span><input class="inp" data-cust="name" value="${esc(cust.name||"")}" autocomplete="name"></label>
      <label class="fld"><span>ເບີໂທຜູ້ຮັບ</span><input class="inp" data-cust="phone" value="${esc(cust.phone||"")}" inputmode="tel" autocomplete="tel" placeholder="020 xxxx xxxx"></label>
    </div>
    ${CFG.promo&&CFG.promo.active?`<div class="fieldset promo"><b>ໂຄດສ່ວນຫຼຸດ</b>
      <div class="promorow"><input class="inp" id="promoInp" value="${esc(promo)}" placeholder="ພິມໂຄດ ເຊັ່ນ ${esc(CFG.promo.code)}" autocapitalize="characters" autocomplete="off"><button class="cta ghost" data-promo>ໃຊ້ໂຄດ</button></div>
      ${promoInfo().msg?`<p class="note ${promoInfo().bad?"promobad":"promook"}" style="margin:0">${esc(promoInfo().msg)}</p>`:`<p class="note" style="margin:0">ລອງສັ່ງທາງແອັບ ຫຼຸດ ${kip(CFG.promo.off)} ເມື່ອຊື້ຄົບ ${kip(CFG.promo.min)}</p>`}
    </div>`:""}
    <div class="fieldset" role="radiogroup" aria-label="ວິທີຈ່າຍເງິນ"><b>ວິທີຈ່າຍເງິນ</b>
      <label class="radio" for="py-qr"><input type="radio" id="py-qr" name="py" value="qr" ${pay==="qr"?'checked':''}><span>ສະແກນ QR ຈ່າຍເລີຍ<small>OnePay · LAO QR · ຈ່າຍໄດ້ທຸກທະນາຄານ</small></span></label>
      <label class="radio${perfSplit()?' off':''}" for="py-cod"><input type="radio" id="py-cod" name="py" value="cod" ${pay==="cod"?'checked':''} ${perfSplit()?'disabled':''}><span>ເກັບເງິນປາຍທາງ (COD)<small>${perfSplit()?'ນ້ຳຫອມແບ່ງຂາຍ ຕ້ອງໂອນກ່ອນ ບໍ່ມີເກັບເງິນປາຍທາງ':'ຈ່າຍເມື່ອຮັບເຄື່ອງ'}</small></span></label>
    </div>
    ${pay==="qr"&&CFG.payQr?`<div class="payqr">
      <p class="paystep"><b>1.</b> ${delivery ? `ໂອນ <span class="num">${kip(grandTotal())}</span> ໃຫ້ກົງຍອດ${shipFee()?" (ລວມຄ່າສົ່ງແລ້ວ)":" (ບໍ່ລວມຄ່າຂົນສົ່ງ ຈ່າຍປາຍທາງ)"}` : "ເລືອກວິທີຈັດສົ່ງກ່ອນ ຈຶ່ງຮູ້ຍອດທີ່ຕ້ອງໂອນ"}</p>
      <p class="paystep"><b>2.</b> ໃນຊ່ອງ <b>ໝາຍເຫດ / ເນື້ອໃນການໂອນ</b> ໃສ່ລະຫັດອໍເດີ <span class="ocode num">${esc(orderCode)}</span></p>
      <img src="${esc(CFG.payQr)}" alt="QR ຮັບເງິນ ${esc(CFG.payName||"")}" width="260" height="295">
      <p class="note">ຊື່ບັນຊີ: ${esc(CFG.payName||"")} · ກວດຊື່ໃຫ້ກົງກ່ອນໂອນ</p>
      <a class="cta ghost" href="${esc(CFG.payQr)}" download="nnz-QR.jpg">ບັນທຶກຮູບ QR ໄວ້ສະແກນໃນແອັບທະນາຄານ</a>
      <p class="paystep"><b>3.</b> ກົດສົ່ງອໍເດີ ແລ້ວແນບຮູບສະລິບໃນ WhatsApp · ແອັດມິນກວດເງິນເຂົ້າບັນຊີແລ້ວຈຶ່ງສົ່ງເຄື່ອງ</p>
      <div class="safe"><b>⚠ ກັນຖືກຫຼອກ</b><span>ຮ້ານຮັບເງິນເຂົ້າຊື່ <b>${esc(CFG.payName||"")}</b> ເທົ່ານັ້ນ · ແອັດມິນບໍ່ເຄີຍສົ່ງ QR ຫຼື ເລກບັນຊີອື່ນໃຫ້ໂອນ · ຖ້າມີຄົນຂໍໃຫ້ໂອນບ່ອນອື່ນ ໃຫ້ໂທຫາ ${esc(CFG.whatsappShow||"")} ກ່ອນ</span></div>
    </div>`:''}
    <a class="cta wa" id="sendWa" href="${waLink(orderText())}" target="_blank" rel="noopener">ສົ່ງອໍເດີທາງ WhatsApp</a>
    <details><summary class="note">ຖ້າ WhatsApp ບໍ່ເປີດ ໃຫ້ຄັດລອກຂໍ້ຄວາມນີ້ໄປສົ່ງເອງ</summary>
      <textarea class="msg" id="msg" readonly>${esc(orderText())}</textarea>
      <button class="cta ghost" id="copyMsg" style="width:100%;margin-top:8px">ຄັດລອກຂໍ້ຄວາມ</button></details>
  </div>`;
}
function renderContact(){
  return `<div class="wrap"><h2>ຕິດຕໍ່ຮ້ານ</h2><div class="contact">
    <div class="ccard"><b>WhatsApp</b><a class="num" href="https://wa.me/${esc(CFG.whatsapp||"")}" target="_blank" rel="noopener">${esc(CFG.whatsappShow||"")}</a>${CFG.whatsapp2?`<a class="num" href="https://wa.me/${esc(CFG.whatsapp2)}" target="_blank" rel="noopener">${esc(CFG.whatsappShow2||"")}</a>`:""}</div>
    <div class="ccard safe"><b>⚠ ເບີ ແລະ ບັນຊີທາງການ</b><span>ຮ້ານມີເບີ WhatsApp 2 ເບີຂ້າງເທິງເທົ່ານັ້ນ · ຮັບເງິນເຂົ້າຊື່ ${esc(CFG.payName||"")} ເທົ່ານັ້ນ · ຮ້ານບໍ່ເຄີຍຂໍລະຫັດ OTP ຫຼື ລະຫັດຜ່ານ</span></div>
    <div class="ccard"><b>ໜ້າຮ້ານ</b><span>${esc(CFG.address||"")}</span>${CFG.mapUrl?`<a class="cta ghost maplink" href="${esc(CFG.mapUrl)}" target="_blank" rel="noopener">📍 ເປີດແຜນທີ່ ນຳທາງມາຮ້ານ</a>`:""}</div>
    <div class="ccard"><b>ຈັດສົ່ງ</b><span>ໄຣເດີສົ່ງພາຍໃນມື້ໃນນະຄອນຫຼວງວຽງຈັນ · ຕ່າງແຂວງຝາກ ຮຸ່ງອາລຸນ · ອານຸສິດ · ມີໄຊ</span></div>
    <div class="ccard"><b>ຂາຍຍ່ອຍເທົ່ານັ້ນ</b><span>ຮ້ານດູແລສິນຄ້າເອງທຸກຂວດ ເພື່ອໃຫ້ລູກຄ້າໄດ້ຂອງແທ້</span></div>
  </div></div>`;
}
let lastView = "";
function render(){
  const v = $("#view");
  const sig = tab+"|"+filter+"|"+query; if(sig!==lastView){ shown = 40; lastView = sig; }
  v.innerHTML = tab==="home" ? (query||filter ? renderAll() : renderHome()) : tab==="all" ? renderAll() : tab==="cart" ? renderCart() : renderContact();
  const cur = tab==="home"&&(query||filter) ? "all" : tab;
  document.querySelectorAll("nav.tabs button").forEach(b=>{ b.removeAttribute("aria-current"); if(b.dataset.tab===cur) b.setAttribute("aria-current","page"); });
  const n = cart.reduce((s,l)=>s+l.qty,0); const bd=$("#badge"); bd.hidden = !n; bd.textContent = n;
  initCats(); initRows();
}
// ແຖວສິນຄ້າ: ເລື່ອນເອງທີລະ 1 ອັນ ທຸກ 4 ວິ (ສະເພາະແຖວທີ່ເຫັນໃນຈໍ) · ລູກຄ້າແຕະ ຢຸດ 8 ວິ · ຮອດທ້າຍກັບໄປຕົ້ນ
let rowTimer = null;
function initRows(){
  clearInterval(rowTimer);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rows = [...document.querySelectorAll("#view .row")]; if(!rows.length) return;
  rows.forEach(r => { r._t = 0; ["touchstart","pointerdown","wheel"].forEach(ev=>r.addEventListener(ev, ()=>{ r._t = Date.now(); }, {passive:true})); });
  let k = 0;
  rowTimer = setInterval(()=>{
    if(document.hidden || !document.body.contains(rows[0])) return;
    k++;
    rows.forEach((r,i) => {
      if((k+i)%2) return; // ສະຫຼັບກັນ ບໍ່ເລື່ອນພ້ອມກັນທຸກແຖວ
      if(Date.now()-r._t < 8000) return;
      const b = r.getBoundingClientRect(); if(b.bottom < 0 || b.top > innerHeight) return;
      const max = r.scrollWidth - r.clientWidth; if(max < 10) return;
      const step = (r.firstElementChild ? r.firstElementChild.getBoundingClientRect().width : 160) + 10;
      r.scrollTo({left: r.scrollLeft >= max - 5 ? 0 : Math.min(max, r.scrollLeft + step), behavior:"smooth"});
    });
  }, 2000);
}
// ໝວດສິນຄ້າຍອດນິຍົມ: ປັດໄດ້ ມີຈຸດບອກໜ້າ ແລະ ເລື່ອນເອງທຸກ 3.5 ວິ (ຢຸດເມື່ອລູກຄ້າແຕະ)
let catTimer = null;
function initCats(){
  clearInterval(catTimer);
  const box = $(".ccards"), dw = $(".cdots"); if(!box || !dw) return;
  const cards = [...box.children], max = Math.max(0, box.scrollWidth - box.clientWidth);
  const pos = [...new Set(cards.map(c => Math.min(c.offsetLeft - cards[0].offsetLeft, max)))]; // ຈຸດທີ່ເລື່ອນໄປຮອດໄດ້ແທ້
  dw.innerHTML = pos.length > 1 ? pos.map((_,k)=>`<i${k?"":' class="on"'}></i>`).join("") : "";
  const dots = [...dw.children]; if(dots.length < 2) return;
  const idx = () => pos.reduce((best,p,k)=> Math.abs(p-box.scrollLeft) < Math.abs(pos[best]-box.scrollLeft) ? k : best, 0);
  const mark = () => { const i = idx(); dots.forEach((d,k)=>d.classList.toggle("on", k===i)); };
  let touched = 0;
  box.addEventListener("scroll", mark, {passive:true});
  ["touchstart","pointerdown","wheel"].forEach(ev=>box.addEventListener(ev, ()=>{ touched = Date.now(); }, {passive:true}));
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  catTimer = setInterval(()=>{
    if(!document.body.contains(box)) return clearInterval(catTimer);
    if(Date.now()-touched < 6000 || document.hidden) return;
    const i = idx(); box.scrollTo({left: pos[i >= pos.length-1 ? 0 : i+1], behavior:"smooth"});
  }, 3500);
}
let cust = store("nnz-cust") || {name:"",phone:"",place:""};
const newCode = () => "NNZ" + String(Math.floor(1000 + Math.random()*9000));
let orderCode = store("nnz-oc") || newCode(); store("nnz-oc", orderCode);
const save = () => { store("nnz-cart", cart); if(!cart.length){ orderCode = newCode(); store("nnz-oc", orderCode); } };
let toastT;
function toast(t){ let el=$(".toast"); if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el);} el.textContent=t; el.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>el.hidden=true,1800); }

function heroPic(p){
  const m = /^p\/((?:fb|p2|pg)_\d{4}\.jpg|pf_\d{2}\.jpg|cw_\d+\.jpg)$/.exec(p.photo||"");
  if(!m) return pic(p);
  return `<img src="images/hd/${m[1]}" alt="${esc(p.nm)}" onerror="this.onerror=null;this.src='images/${esc(p.photo)}'" style="width:100%;height:100%;object-fit:contain;display:block">`;
}
function openZoom(src, title){
  const z=document.createElement("div"); z.className="zoomv"; z.setAttribute("role","dialog"); z.setAttribute("aria-modal","true"); z.setAttribute("aria-label",title||"ຮູບ");
  z.innerHTML=`<div class="zbar"><span>ແຕະຮູບ = ຂະຫຍາຍ/ຫຍໍ້ · ໃຊ້ 2 ນິ້ວຊູມໄດ້</span><button data-zx>ປິດ</button></div><div class="zbox"><img src="${esc(src)}" alt="${esc(title||"")}"></div>`;
  document.body.appendChild(z);
  const onKey=e=>{ if(e.key==="Escape") close(); };
  const close=()=>{ z.remove(); document.removeEventListener("keydown",onKey); };
  document.addEventListener("keydown",onKey);
  z.addEventListener("click",e=>{ e.stopPropagation(); if(e.target.closest("[data-zx]")) return close(); if(e.target.tagName==="IMG"){ const box=z.querySelector(".zbox"); const r=e.target.getBoundingClientRect(); const fx=(e.clientX-r.left)/r.width, fy=(e.clientY-r.top)/r.height; z.classList.toggle("big"); if(z.classList.contains("big")) requestAnimationFrame(()=>{ box.scrollLeft=fx*e.target.offsetWidth-box.clientWidth/2; box.scrollTop=fy*e.target.offsetHeight-box.clientHeight/2; }); } });
}
// ນັບຄົນເຂົ້າແອັບ (Google Analytics) · ຕັ້ງ gaId ໃນ config.js · ບໍ່ສົ່ງຊື່ ຫຼື ເບີໂທລູກຄ້າ
function track(name, params){ try{ if(window.gtag) gtag("event", name, params||{}); }catch(e){} }
(function(){ const id = CFG.gaId; if(!id || !/^G-[A-Z0-9]+$/.test(id)) return;
  window.dataLayer = window.dataLayer || []; window.gtag = function(){ dataLayer.push(arguments); };
  gtag("js", new Date()); gtag("config", id);
  const sc = document.createElement("script"); sc.async = true; sc.src = "https://www.googletagmanager.com/gtag/js?id=" + id; document.head.appendChild(sc);
})();
function openProduct(id){
  { const _p = P.find(x=>x.id===id); if(_p) track("view_item", {items:[{item_id:_p.id, item_name:_p.nm, item_brand:_p.brand||""}]}); }
  const p = P.find(x=>x.id===id); if(!p) return;
  let opt = p.full ? "full" : "t0", qty = 1, vi = 0;
  const optPrice = o => o==="full" ? p.full : p.trials[+o.slice(1)].price;
  const sheet = p.trials.some(t=>/ແຜ່ນ/.test(t.qty)); // ສິນຄ້າແບບແຜ່ນ (ມາກໜ້າ) ໃຊ້ຄຳ ກ່ອງ/ແຜ່ນ
  const strip = p.trials.some(t=>/ແຜງ/.test(t.qty));
  const FULL = (sheet||strip) ? "ກ່ອງເຕັມ" : "ຂວດເຕັມ", PART = sheet ? "ແຍກແຜ່ນ" : strip ? "ແຍກແຜງ" : "ຂວດແບ່ງ";
  const optLabel = o => o==="full" ? (FULL+" "+p.size).trim() : (PART+" "+p.trials[+o.slice(1)].qty).trim();
  const sh = document.createElement("div"); sh.className="sheet"; sh.setAttribute("role","dialog"); sh.setAttribute("aria-modal","true"); sh.setAttribute("aria-label",p.nm);
  const draw = () => {
    const price = optPrice(opt);
    sh.innerHTML = `<div class="panel"><div class="grab"></div><div class="wrap">
      <button class="close" data-x>ປິດ</button>
      <div class="hero${p.photo?' zoomable':''}" ${p.photo?'data-zoom role="button" aria-label="ກົດເພື່ອຂະຫຍາຍຮູບ"':''}>${heroPic(p)}${p.photo?'<span class="zhint">🔍 ກົດເບິ່ງຮູບໃຫຍ່</span>':''}</div>${p.photo?'':'<p class="note" style="margin:-6px 0 0">ຮູບປະກອບ · ສິນຄ້າຈິງອາດຕ່າງຈາກຮູບ</p>'}
      <div>${p.promoLabel?`<span class="rankline" style="background:#e52535;color:#fff;margin-right:4px">🎁 ${esc(p.promoLabel)}</span>`:''}${p.rank?`<span class="rankline">🔥 ສິນຄ້າຂາຍດີອັນດັບ ${p.rank} ຂອງຮ້ານ</span>`:''}<h2 style="font-size:20px">${esc(p.nm)}</h2><div class="note">${esc([p.brand,TYPE_LB[p.type],p.size].filter(Boolean).join(" · "))}</div></div>
      <span class="stock ${p.pre?'pre':p.stock?'':'out'}">${p.pre?'🚚 ກຳລັງມາຈາກອົດສະຕາລີ · ຈອງໄວ້ໄດ້'+(p.eta?' · ຄາດວ່າຮອດ '+esc(p.eta):''):p.stock?'ມີສິນຄ້າ ພ້ອມສົ່ງ':'ໝົດຊົ່ວຄາວ · ກຳລັງນຳເຂົ້າ'}</span>
      <div class="opts">
        ${p.full?`<button class="opt" data-opt="full" aria-pressed="${opt==='full'}"><span class="t">${FULL}</span><span class="s">${esc(p.size)||((sheet||strip)?'ທັງກ່ອງ':'ທັງຂວດ')}</span><span class="p">${kip(p.full)}</span>${p.was>p.full?`<s class="note num">${kip(p.was)}</s>`:''}</button>`:''}
        ${p.trials.map((t,k)=>`<button class="opt" data-opt="t${k}" aria-pressed="${opt==='t'+k}"><span class="t">${PART}</span><span class="s">${esc(t.qty)}</span><span class="p">${kip(t.price)}</span>${t.was>t.price?`<s class="note num">${kip(t.was)}</s>`:''}</button>`).join("")}
        ${p.full&&!p.trials.length?'<button class="opt" disabled><span class="t">ຂວດແບ່ງ</span><span class="s">ສິນຄ້ານີ້ບໍ່ມີຂວດແບ່ງ</span><span class="p">—</span></button>':''}
      </div>
      ${p.stock?`<div class="buyrow"><div class="qty"><button data-q="-1" aria-label="ຫຼຸດ">−</button><span>${qty}</span><button data-q="1" aria-label="ເພີ່ມ">+</button></div>
        <button class="cta" data-add>${p.pre?'ຈອງ':'ໃສ່ກະຕ່າ'} · <span class="num">${kip(price*qty)}</span></button></div>`
      :`<a class="cta ghost" href="${waLink('ແຈ້ງເຕືອນເມື່ອ '+p.nm+(p.en?' ('+p.en+')':'')+' ເຂົ້າໃໝ່ ແດ່')}" target="_blank" rel="noopener">ແຈ້ງເຕືອນຂ້ອຍເມື່ອສິນຄ້າເຂົ້າ</a>
        <p class="note" style="margin:0">ກົດແລ້ວຈະເປີດ WhatsApp ພ້ອມຂໍ້ຄວາມ ໃຫ້ທ່ານກົດສົ່ງເອງ</p>`}
      ${(()=>{const vs=PRODUCT_VIDEOS?vidsOf(p.id):[]; if(!vs.length) return ""; const v=vs[Math.min(vi,vs.length-1)];
        return `<div class="pvid"><div class="sechead" style="margin:0"><h2 style="font-size:16px">ວິດີໂອສິນຄ້ານີ້</h2>${vs.length>1?`<button class="more" data-vnext>ຄລິບອື່ນ (${vi%vs.length+1}/${vs.length})</button>`:''}</div>
        <div class="vplayer"><iframe src="https://www.tiktok.com/player/v1/${esc(v.id)}?autoplay=0&description=0&music_info=0" loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="TikTok"></iframe></div>
        <p class="note" style="margin:0">▶ ${esc(v.views||"")} ວິວ ໃນ TikTok · ${esc(ACC[v.acc]||"NNZ")}</p></div>`;})()}
      ${p.tiktok?`<a class="clip" href="${esc(p.tiktok)}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><div class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div><div><b style="font-size:14px">ເບິ່ງຄລິບຣີວິວ</b><div class="note">ເປີດໃນ TikTok</div></div></a>`:''}
      <p class="note" style="margin:0">ອາຫານເສີມບໍ່ແມ່ນຢາ ແລະ ບໍ່ໄດ້ໃຊ້ປິ່ນປົວພະຍາດ · ອ່ານວິທີກິນຢູ່ຂ້າງຂວດ</p>
      <div class="psteps" aria-label="ວິທີສັ່ງຊື້"><b class="ph">📝 ວິທີສັ່ງຊື້ 5 ຂັ້ນຕອນ</b><ol>
        <li><i>1</i><span>ເລືອກ <b>${FULL}</b> ຫຼື <b>${PART}</b></span></li>
        <li><i>2</i><span>ກົດ <b>+</b> <b>−</b> ເລືອກຈຳນວນ</span></li>
        <li><i>3</i><span>ກົດປຸ່ມແດງ <b>ໃສ່ກະຕ່າ</b></span></li>
        <li><i>4</i><span>ກົດ <b>ກະຕ່າ 🛒</b> ລຸ່ມຈໍ ກອກຊື່ ເບີ ທີ່ຢູ່</span></li>
        <li><i>5</i><span>ກົດ <b>ສົ່ງອໍເດີທາງ WhatsApp</b> ແລ້ວກົດສົ່ງ</span></li>
      </ol><p class="phelp">ບໍ່ເຂົ້າໃຈ? ກົດ <b>ແຊັດ</b> ຖາມແອັດມິນ 💬</p></div>
    </div></div>`;
  };
  draw(); document.body.appendChild(sh); document.body.style.overflow="hidden";
  const onKey = e => { if(e.key==="Escape") close(); };
  const close = () => { sh.remove(); document.body.style.overflow=""; document.removeEventListener("keydown", onKey); };
  document.addEventListener("keydown", onKey);
  sh.addEventListener("click", e => {
    if(e.target===sh || e.target.closest("[data-x]")) return close();
    if(e.target.closest("[data-zoom]")){ const im=sh.querySelector(".hero img"); if(im) openZoom(im.src, p.nm); return; }
    const o = e.target.closest("[data-opt]"); if(o && !o.disabled){ opt=o.dataset.opt; draw(); return; }
    if(e.target.closest("[data-vnext]")){ vi=(vi+1)%Math.max(1,vidsOf(p.id).length); draw(); return; }
    const q = e.target.closest("[data-q]"); if(q){ qty=Math.max(1,Math.min(20,qty+ +q.dataset.q)); draw(); return; }
    if(e.target.closest("[data-add]")){
      const optLb = optLabel(opt), price = optPrice(opt);
      const ex = cart.find(l=>l.id===p.id && l.opt===optLb);
      if(ex) ex.qty+=qty; else cart.push({id:p.id, nm:p.nm, opt:optLb, price, qty});
      save(); close(); render(); toast("ໃສ່ກະຕ່າແລ້ວ");
      track("add_to_cart", {items:[{item_id:p.id, item_name:p.nm, item_variant:optLb, quantity:qty, price}]});
    }
  });
  sh.querySelector("[data-x]").focus();
}

document.addEventListener("click", e => {
  if(e.target.closest("#brandsBtn")){ toggleDrop(); return; }
  const bg = e.target.closest("[data-bdg]"); if(bg){ bdGroup=bg.dataset.bdg; renderDrop(); return; }
  if(!$("#bdrop").hidden){ const inDrop = e.target.closest("#bdrop"); if(!inDrop || e.target.closest(".bd-item")) toggleDrop(false); if(!inDrop) return; }
  const t = e.target.closest("nav.tabs button"); if(t){ tab=t.dataset.tab; if(tab==="home"){filter=null;query="";$("#q").value="";} render(); window.scrollTo(0,0); return; }
  const g = e.target.closest("[data-tab-go]"); if(g){ tab=g.dataset.tabGo; render(); return; }
  const o = e.target.closest("[data-open]"); if(o){ openProduct(o.dataset.open); return; }
  const vd = e.target.closest("[data-vid]"); if(vd){ openVideo(vd.dataset.vid); return; }
  if(e.target.closest("[data-brands]")||e.target.closest("#pickBrand")){ window.scrollTo(0,0); toggleDrop(true); return; }
  const n = e.target.closest("[data-need]"); if(n){ filter = filter===n.dataset.need && tab==="all" ? null : n.dataset.need; tab="all"; render(); window.scrollTo(0,0); return; }
  if(e.target.closest("[data-more]")){ shown += 40; render(); return; }
  if(e.target.closest("[data-clear]")){ filter=null; query=""; $("#q").value=""; render(); return; }
  const inc = e.target.closest("[data-inc]"); if(inc){ cart[+inc.dataset.inc].qty++; save(); render(); return; }
  const dec = e.target.closest("[data-dec]"); if(dec){ const i=+dec.dataset.dec; cart[i].qty--; if(cart[i].qty<1) cart.splice(i,1); save(); render(); return; }
  if(e.target.closest("[data-promo]")){ const v=($("#promoInp")||{}).value||""; promo=v.trim(); store("nnz-promo",promo); render(); const i=promoInfo(); if(i.off) toast("ໃຊ້ໂຄດແລ້ວ ຫຼຸດ "+kip(i.off)); return; }
  if(e.target.closest("#copyMsg")){ const ta=$("#msg"); const fb=()=>{ta.select();toast("ກົດຄ້າງແລ້ວເລືອກ ຄັດລອກ");}; try{ navigator.clipboard.writeText(ta.value).then(()=>toast("ຄັດລອກແລ້ວ"),fb); }catch(_){ fb(); } }
});
document.addEventListener("input", e => {
  const k = e.target.dataset && e.target.dataset.cust; if(!k) return;
  cust[k] = e.target.value; store("nnz-cust", cust);
  const a = document.getElementById("sendWa"); if(a) a.href = waLink(orderText());
  const m = document.getElementById("msg"); if(m) m.value = orderText();
});
document.addEventListener("click", e => { if(e.target.closest("#sendWa") && delivery){ track("send_order", {items_count: cart.reduce((a,l)=>a+l.qty,0), delivery, pay}); } }, true);
document.addEventListener("click", e => { if(e.target.closest("#sendWa") && !delivery){ e.preventDefault(); toast("ກະລຸນາເລືອກວິທີຈັດສົ່ງກ່ອນ"); const f=document.querySelector('[aria-label="ວິທີຈັດສົ່ງ"]'); if(f) f.scrollIntoView({behavior:"smooth",block:"center"}); } }, true);
document.addEventListener("change", e => { if(e.target.name==="dl"){ delivery=e.target.value; store("nnz-dl2",delivery); render(); }
  if(e.target.name==="py"){ if(e.target.value==="cod" && perfSplit()){ toast("ນ້ຳຫອມແບ່ງຂາຍ ຕ້ອງໂອນກ່ອນເທົ່ານັ້ນ"); render(); return; } pay=e.target.value; store("nnz-pay",pay); render(); } });
$("#q").addEventListener("input", e => { query=e.target.value; if(query && tab!=="all") tab="all"; render(); });

$("#proto").hidden = !CFG.sampleMode;
$("#topWa").href = waLink("ສະບາຍດີ nnz ວິຕາມິນ ຂໍສອບຖາມສິນຄ້າ");
render();
document.addEventListener("click", e => { if(e.target.closest("[data-scam]")) openScam(); });

// ----- ໂຫຼດສິນຄ້າ: Google Sheet ກ່ອນ ຖ້າບໍ່ໄດ້ ໃຊ້ products.csv -----
async function load(url){ const r = await fetch(url, {cache:"no-store"}); if(!r.ok) throw new Error("HTTP "+r.status); const t = await r.text(); if(!/^\uFEFF?id,/.test(t)) throw new Error("not product csv"); return t; }
(async () => {
  let text = "";
  try{ text = await load(CFG.sheetCsvUrl || "products.csv"); }
  catch(e){ try{ if(CFG.sheetCsvUrl) text = await load("products.csv"); else throw e; }catch(e2){ loadErr = "ກວດອິນເຕີເນັດ ແລ້ວລອງເປີດໃໝ່"; } }
  if(text){
    P = mergeVariants(parseCSV(text).filter(r=>!/ກົ້ນຂວດ/.test(r.name_lo||"") && !(CFG.hideIds||[]).includes(r.id))).map(toProduct).filter(p=>p.full>0 || p.trials.length); // ນ້ຳຫອມກົ້ນຂວດ ມີຢ່າງລະຂວດ ບໍ່ສະແດງໃນແອັບ
    applyTimedPromos(P);
    P.sort((a,b)=>(b.photo?1:0)-(a.photo?1:0)); // ສິນຄ້າທີ່ມີຮູບແທ້ຂຶ້ນກ່ອນ
    fetch("videos.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():[]).then(j=>{ V=Array.isArray(j)?j:[]; render(); }).catch(()=>{});
    // ລາຄາໃນກະຕ່າເກົ່າ ໃຫ້ກົງກັບລາຄາລ່າສຸດ
    cart = cart.filter(l=>P.some(p=>p.id===l.id)).map(l=>{ const p=P.find(x=>x.id===l.id); const t=p.trials.find(t=>("ຂວດແບ່ງ "+t.qty).trim()===l.opt||("ແຍກແຜ່ນ "+t.qty).trim()===l.opt||("ແຍກແຜງ "+t.qty).trim()===l.opt); return {...l, nm:p.nm, price: t? t.price : (p.full||l.price)}; });
    save();
  }
  render();
})();

if("serviceWorker" in navigator && location.protocol==="https:"){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
})();
