/* =========================================================
   Tab Juara: Lokasi, Pakej, Beli, Tempahan saya,
   Ganjaran Agent, Tebus ganjaran, Peraturan kempen.
   Data contoh: juara-data.js. Tetapan: juara-tetapan.js.
   Fungsi ic, esc, RM, tarikh, bar, toast, $ dan P datang dari index.html.
   ========================================================= */
const jst = {
  get(k, d){ try{ const v = localStorage.getItem('jj_'+k); return v==null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('jj_'+k, JSON.stringify(v)); }catch(e){} }
};
const DRAFT0 = () => ({step:1, pakej:null, tarikh:null, bil:1, nama:'', tel:'', emel:'', negeri:'', adaAgent:false, agent:'', kaedah:'deposit'});
const JS = {
  negeri:'Semua', cari:'', jenis:'semua', err:{}, kn:'Semua', kcari:'', prev:'',
  geo: jst.get('geo', null),
  draft: Object.assign(DRAFT0(), jst.get('draft', {})),
  tempahan: jst.get('tempahan', []),
  mata: jst.get('mata', []),
  tebusan: jst.get('tebusan', [])
};
const saveDraft = () => jst.set('draft', JS.draft);

const JP = {
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  car:'<path d="M4 15l1.6-5A2 2 0 0 1 7.5 8.6h9a2 2 0 0 1 1.9 1.4L20 15v3H4z"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/><path d="M4 15h16"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8"/><path d="M12 8v12"/><path d="M12 8C10.5 5 7 4.5 7 6.5S10.5 8 12 8zM12 8c1.5-3 5-3.5 5-1.5S13.5 8 12 8z"/>',
  award:'<circle cx="12" cy="9" r="6"/><path d="M8.6 14L7 21l5-3 5 3-1.6-7"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3.5 6"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bed:'<path d="M3 18V6"/><path d="M3 14h18v4"/><path d="M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
  image:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 8"/>',
  ticket:'<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11v2M14 15v2"/>',
  rules:'<path d="M9 3h6v3H9z"/><path d="M15 4.5h3V21H6V4.5h3"/><path d="M9 11h6M9 15h4"/>',
  building:'<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 10h4a1 1 0 0 1 1 1v10"/><path d="M8 8h3M8 12h3M8 16h3M3 21h18"/>',
  school:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3"/><path d="M12 13v4M9 21h6M10 17h4v4h-4z"/>',
  plane:'<path d="M10.5 13.5L4 16v-2l6.5-4.5V5a1.5 1.5 0 0 1 3 0v4.5L20 14v2l-6.5-2.5V18l2 1.5V21L12 20l-3.5 1v-1.5l2-1.5z"/>',
  share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  repeat:'<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5"/><path d="M4 20v-4.5h4.5"/>'
};
const jic = (k, cls='') => `<svg class="i ${cls}" viewBox="0 0 24 24">${JP[k]||P[k]||''}</svg>`;
const CT = '<span class="ct">Contoh</span>';
const HARI = ['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'];
const BULAN_PENUH = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
const fmt = n => Number(n).toLocaleString('en-MY');
const pad2 = n => String(n).padStart(2,'0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const hariIni = () => ymd(new Date());
const rnd4 = () => String(Math.floor(1000 + Math.random()*9000));
const ext = 'target="_blank" rel="noopener"';
const waLink = (num, text) => `https://wa.me/${num||''}?text=${encodeURIComponent(text)}`;
const mapLink = l => `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lng}`;
const wazeLink = l => `https://waze.com/ul?ll=${l.lat},${l.lng}&navigate=yes`;
function jarak(a, b){
  const R = 6371, r = Math.PI/180, dLat = (b.lat-a.lat)*r, dLng = (b.lng-a.lng)*r;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}
const fmtKm = k => k < 1 ? Math.round(k*1000)+' m dari anda' : (k < 20 ? k.toFixed(1) : fmt(Math.round(k)))+' km dari anda';
function jRerender(){ const y = scrollY; render(); scrollTo(0, y); }
function jSalin(text, ok){ (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(()=>toast(ok), ()=>toast(text)); }

/* ===== Router tab Juara ===== */
function vJuara(parts){
  const sub = parts[1] || 'lokasi', id = parts[2];
  if(sub==='lokasi') return id ? jLokasiDetail(id) : jLokasi();
  if(sub==='kursus') return jKursus();
  if(sub==='pakej') return id ? jPakejDetail(id) : jPakej();
  if(sub==='beli') return jBeli(id);
  if(sub==='berjaya') return jBerjaya(id);
  if(sub==='tempahan') return jTempahan();
  if(sub==='ganjaran') return jGanjaran();
  if(sub==='tebus') return id ? jTebusOk(id) : jTebus();
  if(sub==='peraturan') return jPeraturan();
  return jLokasi();
}
/* Pautan kongsi agent: #agent/KOD */
function jPakaiAgent(kod){
  const k = String(kod||'').toUpperCase(), a = AGENTS.find(x=>x.kod===k);
  if(a){ JS.draft.adaAgent = true; JS.draft.agent = k; saveDraft(); setTimeout(()=>toast(`Kod agent ${a.nama} dipakai untuk tempahan anda`), 300); }
}

function jHead(tab){
  const n = JS.tempahan.length;
  return bar() + `<main>
    <div class="h1">Juara Travel</div>
    <div class="muted small" style="margin:4px 0 14px">Cawangan, pakej dan tempahan dalam satu tempat</div>
    <div class="jquick">
      <a class="card jq" href="#juara/tempahan">${jic('ticket')}<div><b>Tempahan saya</b><span>${n ? n+' tempahan' : 'Belum ada'}</span></div></a>
      <a class="card jq" href="#juara/ganjaran">${jic('gift')}<div><b>Ganjaran agent</b><span>Kumpul mata, tebus hadiah</span></div></a>
    </div>
    <div class="seg">${[['lokasi','Lokasi'],['pakej','Pakej'],['beli','Beli']].map(([k,l])=>`<a href="#juara/${k}" class="${tab===k?'on':''}">${l}</a>`).join('')}</div>`;
}

/* ===== 1. Lokasi ===== */
const jenisPill = l => l.jenis==='Pejabat'
  ? `<span class="pill p-blue">${jic('building')}Pejabat</span>`
  : `<span class="pill p-ok">${jic('school')}Lokasi kursus</span>`;
const jWaLokasi = l => waLink(JT.waJuara, `Assalamualaikum Juara Travel. Saya nak tanya tentang ${l.nama}.`);
function jActs(l){
  return `<div class="acts">
    <a class="act" href="tel:${l.tel}">${ic('phone')}Telefon</a>
    <a class="act" href="${jWaLokasi(l)}" ${ext}>${ic('chat')}WhatsApp</a>
    <a class="act" href="${mapLink(l)}" ${ext}>${ic('map')}Peta</a>
    <a class="act" href="${wazeLink(l)}" ${ext}>${jic('car')}Waze</a>
  </div>`;
}
function jLokCard(l){
  const km = JS.geo ? fmtKm(jarak(JS.geo, l)) : '';
  return `<div class="card jloc"><a class="jloc-hd" href="#juara/lokasi/${l.id}">
      <div class="jtags">${jenisPill(l)}${CT}</div>
      <b>${esc(l.nama)}</b><span class="jaddr">${esc(l.ringkas)}</span>
      <div class="jmeta"><span>${ic('clock')}${esc(l.waktu[0][0])}, ${esc(l.waktu[0][1])}</span>${km?`<span>${ic('pin')}${km}</span>`:''}</div>
    </a>${jActs(l)}</div>`;
}
function jLokList(){
  const q = JS.cari.trim().toLowerCase();
  let list = LOKASI.filter(l => (JS.negeri==='Semua' || l.negeri===JS.negeri) && (!q || (l.nama+' '+l.alamat+' '+l.negeri+' '+l.jenis).toLowerCase().includes(q)));
  if(JS.geo) list = list.slice().sort((a,b)=>jarak(JS.geo,a)-jarak(JS.geo,b));
  if(!list.length) return `<div class="card empty">${jic('search')}<b>Tiada cawangan dijumpai</b><span>Cuba negeri lain atau tukar perkataan carian.</span></div>`;
  return `<div class="stack">${list.map(jLokCard).join('')}</div>`;
}
function jLokasi(){
  let near;
  if(JS.geo){
    const l = LOKASI.slice().sort((a,b)=>jarak(JS.geo,a)-jarak(JS.geo,b))[0];
    near = `<div class="near-hd">${ic('pin')}Cawangan paling dekat dengan anda</div>${jLokCard(l)}`;
  } else {
    near = `<div class="card near-ask"><div class="row">${ic('nav')}<div><b>Cawangan paling dekat</b><span>Benarkan lokasi phone supaya kami boleh cari cawangan terdekat untuk anda.</span></div></div>
      <button class="btn sec" data-j="geo">${ic('nav')}Guna lokasi saya</button></div>`;
  }
  return jHead('lokasi') + `
    ${near}
    <div style="margin-top:12px">${jKursusKad()}</div>
    <div class="h2">Semua cawangan <small>${LOKASI.length} lokasi</small></div>
    <label class="search">${jic('search')}<input type="search" placeholder="Cari nama tempat atau bandar" data-jin="cari" value="${esc(JS.cari)}" aria-label="Cari cawangan"></label>
    <div class="chips">${NEGERI_TAPIS.map(n=>`<button class="chip ${JS.negeri===n?'on':''}" data-j="negeri" data-v="${n}">${n}</button>`).join('')}</div>
    <div id="jlist">${jLokList()}</div>
  </main>`;
}
function jLokasiDetail(id){
  const l = LOKASI.find(x=>x.id===id); if(!l) return jLokasi();
  const km = JS.geo ? fmtKm(jarak(JS.geo, l)) : '';
  const kursus = KJ_ADA().slice().sort((a,b)=>jarak(l,a)-jarak(l,b)).slice(0,3).sort((a,b)=>(a.t+a.m).localeCompare(b.t+b.m));
  return bar('juara/lokasi', 'Lokasi') + `
  <main class="stack">
    <div><div class="jtags">${jenisPill(l)}${CT}</div><div class="h1" style="margin-top:8px">${esc(l.nama)}</div>${km?`<div class="muted small" style="margin-top:2px">${km}</div>`:''}</div>
    <div class="card">
      <div class="jrow">${ic('pin')}<div><b>Alamat</b><span>${esc(l.alamat)}</span></div></div>
      <div class="jrow">${ic('clock')}<div style="flex:1"><b>Waktu operasi</b>${l.waktu.map(w=>`<div class="wk"><em>${esc(w[0])}</em><span>${esc(w[1])}</span></div>`).join('')}</div></div>
    </div>
    <div class="btns">
      <a class="btn" href="tel:${l.tel}">${ic('phone')}Telefon</a>
      <a class="btn sec" href="${jWaLokasi(l)}" ${ext}>${ic('chat')}WhatsApp</a>
      <div class="jbtn2"><a class="btn sec" href="${mapLink(l)}" ${ext}>${ic('map')}Buka peta</a><a class="btn sec" href="${wazeLink(l)}" ${ext}>${jic('car')}Waze</a></div>
    </div>
    <div><div class="h2" style="margin-top:8px">Kursus berdekatan <small><a href="#juara/kursus">Lihat semua</a></small></div>
      ${kursus.length ? `<div class="list">${kursus.map(k=>{ const d = new Date(k.t+'T00:00:00');
        return `<a class="li" href="${kWa(k)}" ${ext}><div class="day">${HARI[d.getDay()]}<br>${d.getDate()} ${BULAN[d.getMonth()]}</div><div style="min-width:0"><b style="font-size:14px">${esc(k.l)}</b><span>${jMasa(k.m)} · ${esc(k.k)}</span></div></a>`; }).join('')}</div>` : `<div class="card small muted">Tiada kursus dijadualkan buat masa ini.</div>`}</div>
    <div class="note">${ic('alert')}<div>Alamat dan nombor pejabat ialah contoh. Jadual kursus diambil dari laman Juara Travel.</div></div>
  </main>`;
}

/* ===== Kursus umrah dan haji (data sebenar dari laman Juara, kursus-data.js) ===== */
const NEGERI_MY = ['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya'];
const KJ_ADA = () => KJ.filter(k => k.t >= hariIni());
function jMasa(m){ const [h, mi] = m.split(':').map(Number); const ap = h<12 ? 'pagi' : (h<14 ? 'tengah hari' : (h<19 ? 'petang' : 'malam')); return `${h%12||12}:${pad2(mi)} ${ap}`; }
function jHariPenuh(t){ const d = new Date(t+'T00:00:00'); return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`; }
const fmtTel = n => n.replace(/^(01\d)(\d{3,4})(\d{4})$/, '$1-$2 $3').replace(/^(0[2-9])(\d{3,4})(\d{4})$/, '$1-$2 $3');
const kMap = k => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(k.l)}`;
const kWaze = k => `https://waze.com/ul?q=${encodeURIComponent(k.l)}&navigate=yes`;
const kWa = k => waLink(k.tel[0] ? '6'+k.tel[0] : JT.waJuara, `Assalamualaikum. Saya nak daftar kursus umrah Juara pada ${jHariPenuh(k.t)}, ${jMasa(k.m)} di ${k.l}. Boleh saya dapatkan maklumat lanjut?`);
function jKursusKad(){
  const all = KJ_ADA(), n = new Set(all.map(k=>k.n)).size;
  return `<a class="alert" href="#juara/kursus"><div class="ic">${ic('pin')}</div><div><b>Cari kursus umrah berdekatan</b><span>${all.length ? `${all.length} kursus akan datang di ${n} negeri` : 'Lihat jadual kursus Juara'}</span></div>${ic('chev','go')}</a>`;
}
function jKCard(k){
  const km = JS.geo ? jarak(JS.geo, k) : null;
  return `<div class="card jloc"><div class="jloc-hd">
      <div class="jtags"><span class="pill p-red">${ic('clock')}${jMasa(k.m)}</span><span class="pill p-grey">${esc(k.n)}</span></div>
      <b>${esc(k.l)}</b>
      <div class="jmeta"><span>${jic('users')}${esc(k.p)}</span>${km!=null ? `<span>${ic('pin')}Lebih kurang ${fmtKm(km)}</span>` : ''}</div>
      ${k.tel.length ? `<div class="jmeta"><span>${ic('phone')}${k.tel.map(t=>`<a href="tel:${t}" style="text-decoration:underline">${fmtTel(t)}</a>`).join(', ')}</span></div>` : ''}
    </div>
    <div class="acts">
      ${k.tel[0] ? `<a class="act" href="tel:${k.tel[0]}">${ic('phone')}Telefon</a>` : ''}
      <a class="act" href="${kWa(k)}" ${ext}>${ic('chat')}WhatsApp</a>
      <a class="act" href="${kMap(k)}" ${ext}>${ic('map')}Peta</a>
      <a class="act" href="${kWaze(k)}" ${ext}>${jic('car')}Waze</a>
    </div></div>`;
}
function jKList(){
  const q = JS.kcari.trim().toLowerCase();
  let list = KJ_ADA().filter(k => (JS.kn==='Semua' || k.n===JS.kn) && (!q || (k.l+' '+k.k+' '+k.p+' '+k.n).toLowerCase().includes(q)));
  if(!list.length) return `<div class="card empty">${jic('search')}<b>Tiada kursus dijumpai</b><span>Cuba negeri lain atau tukar perkataan carian.</span></div>`;
  const hari = [...new Set(list.map(k=>k.t))];
  return hari.map(t=>{
    let L = list.filter(k=>k.t===t);
    L = JS.geo ? L.sort((a,b)=>jarak(JS.geo,a)-jarak(JS.geo,b)) : L.sort((a,b)=>a.m.localeCompare(b.m));
    return `<div class="h2" style="margin:18px 2px 10px;font-size:15px">${jHariPenuh(t)} <small>${L.length} kursus</small></div><div class="stack">${L.map(jKCard).join('')}</div>`;
  }).join('');
}
function jKursus(){
  const all = KJ_ADA(), neg = NEGERI_MY.filter(n => all.some(k=>k.n===n)), tiada = NEGERI_MY.filter(n => !neg.includes(n));
  if(JS.kn!=='Semua' && !neg.includes(JS.kn)) JS.kn = 'Semua';
  const back = JS.prev.startsWith('kursus') ? ['kursus','Kursus'] : ['juara/lokasi','Lokasi'];
  let near = '';
  if(all.length && JS.geo){
    const k = all.slice().sort((a,b)=>jarak(JS.geo,a)-jarak(JS.geo,b))[0];
    near = `<div class="near-hd">${ic('pin')}Kursus paling dekat dengan anda</div><div class="muted small" style="margin:-4px 2px 8px">${jHariPenuh(k.t)}</div>${jKCard(k)}`;
  } else if(all.length){
    near = `<div class="card near-ask"><div class="row">${ic('nav')}<div><b>Kursus paling dekat</b><span>Benarkan lokasi phone supaya kami boleh cari kursus terdekat untuk anda.</span></div></div>
      <button class="btn sec" data-j="geo">${ic('nav')}Guna lokasi saya</button></div>`;
  }
  return bar(back[0], back[1]) + `
  <main>
    <div class="h1">Kursus umrah dan haji</div>
    <div class="muted small" style="margin:4px 0 14px">Jadual kursus Juara Travel di seluruh Malaysia</div>
    ${all.length ? `${near}
    <div class="h2">Semua kursus <small>${all.length} kursus</small></div>
    <label class="search">${jic('search')}<input type="search" placeholder="Cari bandar, masjid atau penceramah" data-jin="kcari" value="${esc(JS.kcari)}" aria-label="Cari kursus"></label>
    <div class="chips"><button class="chip ${JS.kn==='Semua'?'on':''}" data-j="kNeg" data-v="Semua">Semua</button>${neg.map(n=>`<button class="chip ${JS.kn===n?'on':''}" data-j="kNeg" data-v="${n}">${n} (${all.filter(k=>k.n===n).length})</button>`).join('')}</div>
    <div id="klist">${jKList()}</div>
    ${tiada.length ? `<div class="card small muted" style="margin-top:14px;line-height:1.55">Belum ada kursus dijadualkan di ${tiada.join(', ')}. WhatsApp Juara untuk tanya kursus terdekat.<a class="btn sec" href="${waLink(JT.waJuara, 'Assalamualaikum Juara Travel. Saya nak tanya jadual kursus umrah di negeri saya.')}" ${ext} style="margin-top:10px">${ic('chat')}Tanya Juara</a></div>` : ''}`
    : `<div class="card empty">${ic('clock')}<b>Jadual baru akan dikemas kini</b><span>Lihat jadual terkini di laman Juara Travel.</span></div>`}
    <div class="note" style="margin-top:14px">${ic('alert')}<div>Jadual dari laman Juara Travel, dikemas kini ${tarikh(KJ_TARIKH)}. Jarak ialah anggaran. Hubungi penceramah untuk sahkan sebelum hadir.</div></div>
    <a class="btn sec" href="${KJ_SUMBER}" ${ext} style="margin-top:12px">${ic('ext')}Lihat jadual terkini di laman Juara</a>
  </main>`;
}

/* ===== 2. Pakej ===== */
const JENIS = [['semua','Semua'],['umrah','Umrah'],['lancong','Pelancongan'],['cuti','Cuti Sekolah']];
const jKerusi = (p, t) => Math.max(0, t.k - JS.tempahan.filter(b=>b.pakej===p.id && b.tarikh===t.d).reduce((s,b)=>s+b.bil, 0));
const jTarikhAda = p => p.tarikh.filter(t => t.d >= hariIni());
const jTarikhAwal = p => jTarikhAda(p).find(t => jKerusi(p,t) > 0) || jTarikhAda(p)[0] || p.tarikh[p.tarikh.length-1];
const jGambar = p => p.img
  ? `<img loading="lazy" src="${p.img}" alt="${esc(p.nama)}">`
  : `<div class="noimg">${jic('image')}Gambar akan dimasukkan</div>`;
const jJenisNama = p => p.jenis==='umrah' ? 'Umrah' : 'Pelancongan';
function jSeat(k){
  if(k<=0) return `<span class="pill p-grey">Penuh</span>`;
  return `<span class="pill ${k<=10?'p-warn':'p-ok'}">Baki ${k} kerusi</span>`;
}
function jPakej(){
  const list = PAKEJ.filter(p => JS.jenis==='semua' || (JS.jenis==='cuti' ? p.cuti : p.jenis===JS.jenis));
  return jHead('pakej') + `
    <div class="chips">${JENIS.map(([k,l])=>`<button class="chip ${JS.jenis===k?'on':''}" data-j="jenis" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="stack">${list.map(p=>{ const t = jTarikhAwal(p);
      return `<div class="card jpk">
        <a class="jpk-img" href="#juara/pakej/${p.id}">${jGambar(p)}<span class="jpk-tag">${jJenisNama(p)}</span></a>
        <div class="jpk-bd">
          <div class="jtags"><b class="jpk-nm">${esc(p.nama)}</b>${CT}</div>
          <div class="jmeta"><span>${ic('clock')}${p.hari}</span><span>${jic('plane')}Berlepas ${tarikh(t.d)}</span></div>
          <div class="jpk-pr"><div><span>Harga bermula</span><b>${RM(p.harga)}</b><small> seorang</small></div>${jSeat(jKerusi(p,t))}</div>
          <div class="jbtn2"><a class="btn sec" href="#juara/pakej/${p.id}">Lihat butiran</a><button class="btn" data-j="tempah" data-id="${p.id}">Tempah</button></div>
        </div></div>`; }).join('') || `<div class="card empty">${jic('search')}<b>Tiada pakej buat masa ini</b><span>Cuba penapis lain.</span></div>`}</div>
    <div class="note" style="margin-top:14px">${ic('alert')}<div>Harga, tarikh dan baki kerusi ialah contoh. Juara akan sahkan maklumat sebenar.</div></div>
  </main>`;
}
function jSyaratBayar(){
  return [
    `Deposit ${RM(JT.depositSeorang)} seorang untuk sahkan kerusi`,
    `Baki penuh dijelaskan ${JT.bakiSebelumHari} hari sebelum berlepas`,
    'Boleh bayar secara ansuran sebelum tarikh akhir',
    'Pembatalan tertakluk kepada caj. Rujuk Juara untuk butiran'
  ];
}
function jPakejDetail(id){
  const p = PAKEJ.find(x=>x.id===id); if(!p) return jPakej();
  const t = jTarikhAwal(p);
  return bar('juara/pakej', 'Pakej') + `
  <div class="jdet-img">${jGambar(p)}</div>
  <main class="stack jpad">
    <div><div class="jtags"><span class="pill p-red">${jJenisNama(p)}</span>${p.cuti?'<span class="pill p-blue">Cuti sekolah</span>':''}${CT}</div>
      <div class="h1" style="margin-top:8px">${esc(p.nama)}</div>
      <div class="muted small" style="margin-top:4px;line-height:1.55">${esc(p.ringkas)}</div></div>
    <div class="jfacts"><div><span>Tempoh</span><b>${p.hari}</b></div><div><span>Berlepas</span><b>${tarikh(t.d)}</b></div><div><span>Bermula</span><b>${RM(p.harga)}</b></div></div>
    <div class="card"><div class="jt">${jic('cal')}Tarikh berlepas</div>
      ${p.tarikh.map(x=>`<div class="kv"><span>${tarikh(x.d)}</span>${jSeat(x.d < hariIni() ? 0 : jKerusi(p,x))}</div>`).join('')}</div>
    <div class="card"><div class="jt">${ic('map')}Ringkasan perjalanan</div>
      <div style="margin-top:10px">${p.jalan.map(j=>`<div class="jtr"><i></i><div><b>${j[0]}</b><span>${j[1]}</span></div></div>`).join('')}</div></div>
    <div class="card"><div class="jt">${jic('bed')}Hotel</div>
      ${p.hotel.map(h=>`<div class="jrow">${ic('pin')}<div><b>${h[0]}: ${h[1]}</b><span>${h[2]}</span></div></div>`).join('')}</div>
    ${p.jenis==='umrah' ? `<div class="card"><div class="jt">${jic('users')}Pembimbing Juara</div><div class="stack" style="margin-top:8px">${PEMBIMBING.map(g=>`<div class="guide"><img loading="lazy" src="${g.img}" alt="" onerror="this.style.visibility='hidden'"><div><b>${esc(g.n)}</b><span>Pembimbing jemaah Juara</span></div></div>`).join('')}</div></div>` : ''}
    <div class="card"><div class="jt">${ic('check')}Termasuk</div>
      <div class="jinc ok">${p.termasuk.map(x=>`<div>${ic('check')}<span>${x}</span></div>`).join('')}</div>
      <div class="jt" style="margin-top:16px">${ic('x')}Tidak termasuk</div>
      <div class="jinc no">${p.tak.map(x=>`<div>${ic('x')}<span>${x}</span></div>`).join('')}</div></div>
    <div class="card"><div class="jt">${ic('wallet')}Syarat bayaran</div><div class="bul">${jSyaratBayar().map(x=>`<div>${x}</div>`).join('')}</div></div>
    <div class="card"><div class="jt">${jic('rules')}Soalan lazim</div>
      ${p.faq.map(f=>`<details class="faq"><summary>${f[0]}${ic('chev')}</summary><p>${f[1]}</p></details>`).join('')}</div>
    <div class="note">${ic('alert')}<div>Butiran pakej ialah contoh. Juara akan sahkan harga, hotel dan tarikh sebenar.</div></div>
  </main>
  <div class="jcta"><div><span>Bermula</span><b>${RM(p.harga)}</b></div><button class="btn" data-j="tempah" data-id="${p.id}">Tempah sekarang</button></div>`;
}

/* ===== 3. Beli (4 langkah) ===== */
function jStep(n, title){
  return `<div class="muted small">Langkah ${n} daripada 4</div><div class="stepbar">${[1,2,3,4].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>
    <div class="h2" style="margin:16px 2px 12px">${title}</div>`;
}
const jPakejDraf = () => PAKEJ.find(x=>x.id===JS.draft.pakej);
function jMaksBil(){
  const p = jPakejDraf(), t = p && p.tarikh.find(x=>x.d===JS.draft.tarikh);
  return Math.max(1, Math.min(10, t ? jKerusi(p,t) : 10));
}
function jSah1(){ const d = JS.draft, p = jPakejDraf(); return !!(p && d.tarikh && p.tarikh.some(t=>t.d===d.tarikh && t.d >= hariIni() && jKerusi(p,t) >= d.bil)); }
function jSemak2(){
  const d = JS.draft, e = {};
  if(d.nama.trim().length < 3) e.nama = 'Sila tulis nama penuh anda seperti dalam kad pengenalan.';
  const tel = d.tel.replace(/[\s-]/g,'');
  if(!/^(\+?60|0)1\d{8,9}$/.test(tel)) e.tel = 'Nombor ini nampak tak lengkap. Contoh: 012 345 6789';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.emel.trim())) e.emel = 'Emel ini nampak tak betul. Contoh: nama@gmail.com';
  if(!d.negeri) e.negeri = 'Sila pilih negeri anda.';
  if(d.adaAgent){
    const k = d.agent.trim().toUpperCase();
    if(!k) e.agent = 'Tulis kod agent anda, atau buang tanda di atas jika tiada.';
    else if(!AGENTS.find(a=>a.kod===k)) e.agent = 'Kod agent ini tidak dijumpai. Semak semula dengan agent anda.';
  }
  return e;
}
function jBeli(stepParam){
  const d = JS.draft;
  let step = +stepParam || d.step || 1;
  if(step >= 2 && !jSah1()) step = 1;
  if(step >= 3 && Object.keys(jSemak2()).length) step = 2;
  if(d.step !== step){ d.step = step; saveDraft(); }
  return step===1 ? jBeli1() : step===2 ? jBeli2() : jBeli3();
}
function jBeli1(){
  const d = JS.draft, p = jPakejDraf(), maks = jMaksBil();
  if(d.bil > maks){ d.bil = maks; saveDraft(); }
  return jHead('beli') + jStep(1, 'Pilih pakej, tarikh dan bilangan jemaah') + `
    <div class="stack">${PAKEJ.map(x=>`<button class="opt ${d.pakej===x.id?'on':''}" data-j="pilihPakej" data-id="${x.id}"><span class="radio"></span><div style="flex:1;min-width:0"><b>${esc(x.nama)}</b><span>${x.hari} · bermula ${RM(x.harga)}</span></div>${CT}</button>`).join('')}</div>
    ${p ? `
    <div class="h2">Tarikh berlepas</div>
    <div class="jdates">${p.tarikh.map(t=>{ const k = t.d < hariIni() ? 0 : jKerusi(p,t);
      return `<button class="jdate ${d.tarikh===t.d?'on':''}" data-j="pilihTarikh" data-v="${t.d}" ${k?'':'disabled'}><b>${tarikh(t.d)}</b><span>${k?'Baki '+k+' kerusi':'Penuh'}</span></button>`; }).join('')}</div>
    <div class="h2">Bilangan jemaah</div>
    <div class="card stepper-row"><div><b>Jemaah</b><span>Termasuk anda, maksimum ${maks}</span></div>
      <div class="stepper"><button data-j="bil" data-v="-1" aria-label="Kurang" ${d.bil<=1?'disabled':''}>${jic('minus')}</button><output>${d.bil}</output><button data-j="bil" data-v="1" aria-label="Tambah" ${d.bil>=maks?'disabled':''}>${jic('plus')}</button></div></div>
    <div class="card" style="margin-top:12px"><div class="kv big"><span class="muted">Anggaran jumlah</span><b>${RM(p.harga*d.bil)}</b></div></div>` : ''}
    <div class="btns" style="margin-top:16px"><button class="btn" data-j="ke2">Seterusnya</button></div>
  </main>`;
}
function jField(k, label, type, ph, attrs=''){
  const e = JS.err[k];
  return `<div class="field ${e?'err':''}" id="f-${k}"><label for="i-${k}">${label}</label>
    <input id="i-${k}" data-jin="${k}" type="${type}" placeholder="${ph}" value="${esc(JS.draft[k])}" ${attrs}>
    ${e?`<div class="em">${ic('alert')}<span>${e}</span></div>`:''}</div>`;
}
function jBeli2(){
  const d = JS.draft, e = JS.err;
  return jHead('beli') + jStep(2, 'Isi maklumat anda') + `
    <div class="card stack">
      ${jField('nama','Nama penuh','text','Contoh: Aminah binti Yusof','autocomplete="name"')}
      ${jField('tel','Nombor telefon','tel','012 345 6789','autocomplete="tel" inputmode="tel"')}
      ${jField('emel','Emel','email','nama@gmail.com','autocomplete="email" inputmode="email"')}
      <div class="field ${e.negeri?'err':''}" id="f-negeri"><label for="i-negeri">Negeri</label>
        <select id="i-negeri" data-jin="negeri"><option value="">Pilih negeri</option>${NEGERI_SEMUA.map(n=>`<option ${d.negeri===n?'selected':''}>${n}</option>`).join('')}</select>
        ${e.negeri?`<div class="em">${ic('alert')}<span>${e.negeri}</span></div>`:''}</div>
    </div>
    <div class="card" style="margin-top:12px">
      <button class="chk ${d.adaAgent?'on':''}" data-j="adaAgent" style="padding:0;border:0"><div class="box">${d.adaAgent?ic('check'):''}</div><div><b style="font-weight:600">Saya ada kod agent</b><div class="small muted">Pilihan. Agent anda akan bantu urusan tempahan sampai selesai.</div></div></button>
      ${d.adaAgent ? `<div style="margin-top:12px">${jField('agent','Kod agent','text','Contoh: SALMAH01','autocapitalize="characters" autocomplete="off"')}</div>` : ''}
    </div>
    <div class="jbtn2" style="margin-top:16px"><a class="btn sec" href="#juara/beli/1">Kembali</a><button class="btn" data-j="ke3">Seterusnya</button></div>
  </main>`;
}
function jKira(){
  const d = JS.draft, p = jPakejDraf(), jumlah = p.harga*d.bil, dep = Math.min(JT.depositSeorang*d.bil, jumlah);
  const bayar = d.kaedah==='penuh' ? jumlah : dep;
  const akhir = new Date(d.tarikh+'T00:00:00'); akhir.setDate(akhir.getDate() - JT.bakiSebelumHari);
  return {p, jumlah, dep, bayar, baki: jumlah-bayar, akhir: ymd(akhir)};
}
function jBeli3(){
  const d = JS.draft, k = jKira();
  const akhirTxt = k.akhir <= hariIni() ? 'secepat mungkin' : 'sebelum '+tarikh(k.akhir);
  const ag = d.adaAgent ? AGENTS.find(a=>a.kod===d.agent.trim().toUpperCase()) : null;
  return jHead('beli') + jStep(3, 'Pilih cara bayaran') + `
    <div class="stack">
      <button class="opt ${d.kaedah==='deposit'?'on':''}" data-j="kaedah" data-v="deposit"><span class="radio"></span><div style="flex:1"><b>Bayar deposit</b><span>${RM(JT.depositSeorang)} seorang untuk sahkan kerusi</span></div><span class="amt">${RM(k.dep)}</span></button>
      <button class="opt ${d.kaedah==='penuh'?'on':''}" data-j="kaedah" data-v="penuh"><span class="radio"></span><div style="flex:1"><b>Bayar penuh</b><span>Selesai sekali bayar</span></div><span class="amt">${RM(k.jumlah)}</span></button>
    </div>
    <div class="card" style="margin-top:12px">
      <div class="kv"><span class="muted">Pakej</span><b>${esc(k.p.nama)}</b></div>
      <div class="kv"><span class="muted">Berlepas</span><b>${tarikh(d.tarikh)}</b></div>
      <div class="kv"><span class="muted">Jemaah</span><b>${d.bil} orang</b></div>
      ${ag?`<div class="kv"><span class="muted">Agent</span><b>${esc(ag.nama)} (${ag.kod})</b></div>`:''}
      <div class="kv"><span class="muted">Jumlah harga</span><b>${RM(k.jumlah)}</b></div>
      <div class="kv big"><span class="muted">Bayar sekarang</span><b>${RM(k.bayar)}</b></div>
      <div class="kv"><span class="muted">Baki</span><b>${k.baki ? RM(k.baki)+'<div class="small muted" style="font-weight:400">Jelaskan '+akhirTxt+'</div>' : 'Tiada baki'}</b></div>
    </div>
    <div class="note" style="margin-top:12px">${ic('alert')}<div>Ini demo. Tiada bayaran sebenar dibuat dan tiada wang ditolak.</div></div>
    <div class="jbtn2" style="margin-top:16px"><a class="btn sec" href="#juara/beli/2">Kembali</a><button class="btn" data-j="bayar">Bayar ${RM(k.bayar)}</button></div>
  </main>`;
}
function jCipta(){
  const d = JS.draft, k = jKira(), t = hariIni();
  const no = 'JT' + t.slice(2).replace(/-/g,'') + '-' + rnd4();
  const agent = d.adaAgent ? d.agent.trim().toUpperCase() : '';
  const tel = d.tel.replace(/[\s-]/g,'');
  const b = {no, pakej:k.p.id, pakejNama:k.p.nama, tarikh:d.tarikh, bil:d.bil, nama:d.nama.trim(), tel, emel:d.emel.trim(), negeri:d.negeri,
             agent, kaedah:d.kaedah, jumlah:k.jumlah, bayar:k.bayar, baki:k.baki, status:'menunggu', dibuat:t, mata:0};
  if(agent){
    const ulang = JS.tempahan.some(x=>x.tel===tel && x.agent===agent);
    const ev = [ ulang ? {a:'Rujukan jemaah berulang', m:JT.mata.rujukanBerulang} : {a:`Daftar jemaah baru (${d.bil} orang)`, m:JT.mata.daftarJemaah*d.bil},
                 d.kaedah==='penuh' ? {a:'Bayaran penuh', m:JT.mata.bayaranPenuh} : {a:'Tempahan deposit', m:JT.mata.tempahanDeposit} ];
    ev.forEach(x=>JS.mata.push({kod:agent, t, a:`${x.a}, ${no}`, m:x.m}));
    b.mata = ev.reduce((s,x)=>s+x.m, 0);
    jst.set('mata', JS.mata);
  }
  JS.tempahan.unshift(b); jst.set('tempahan', JS.tempahan);
  JS.draft = Object.assign(DRAFT0(), agent ? {adaAgent:true, agent} : {}, {nama:d.nama, tel:d.tel, emel:d.emel, negeri:d.negeri});
  saveDraft();
  location.hash = 'juara/berjaya/' + no;
}
const STATUS = {menunggu:['Menunggu pengesahan','p-warn'], deposit:['Deposit diterima','p-blue'], lengkap:['Lengkap','p-ok']};
const jStatus = s => `<span class="pill ${STATUS[s][1]}">${STATUS[s][0]}</span>`;
function jWaTempahan(b){
  const ag = b.agent ? AGENTS.find(a=>a.kod===b.agent) : null;
  const L = ['Assalamualaikum Juara Travel. Saya baru buat tempahan dalam apps Jemaah Juara.', '',
    `No tempahan: ${b.no}`, `Nama: ${b.nama}`, `Pakej: ${b.pakejNama}`, `Tarikh berlepas: ${tarikh(b.tarikh)}`, `Bilangan jemaah: ${b.bil} orang`,
    `Bayaran: ${b.kaedah==='penuh'?'Penuh':'Deposit'} ${RM(b.bayar)}`];
  if(ag) L.push(`Kod agent: ${ag.kod} (${ag.nama})`);
  L.push('', 'Mohon pengesahan. Terima kasih.');
  return waLink(JT.waJuara, L.join('\n'));
}
function jRingkas(b){
  const ag = b.agent ? AGENTS.find(a=>a.kod===b.agent) : null;
  return `<div class="kv"><span class="muted">Nama</span><b>${esc(b.nama)}</b></div>
    <div class="kv"><span class="muted">Pakej</span><b>${esc(b.pakejNama)}</b></div>
    <div class="kv"><span class="muted">Berlepas</span><b>${tarikh(b.tarikh)}</b></div>
    <div class="kv"><span class="muted">Jemaah</span><b>${b.bil} orang</b></div>
    ${ag?`<div class="kv"><span class="muted">Agent</span><b>${esc(ag.nama)} (${ag.kod})</b></div>`:''}
    <div class="kv"><span class="muted">Jumlah</span><b>${RM(b.jumlah)}</b></div>
    <div class="kv"><span class="muted">Dibayar (${b.kaedah==='penuh'?'penuh':'deposit'})</span><b>${RM(b.bayar)}</b></div>
    <div class="kv"><span class="muted">Baki</span><b>${b.baki?RM(b.baki):'Tiada baki'}</b></div>`;
}
function jBerjaya(no){
  const b = JS.tempahan.find(x=>x.no===no); if(!b) return jTempahan();
  const ag = b.agent ? AGENTS.find(a=>a.kod===b.agent) : null;
  return bar('juara/pakej', 'Juara') + `
  <main class="stack">
    <div><div class="muted small">Langkah 4 daripada 4</div><div class="stepbar"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div></div>
    <div class="jok">${ic('check')}<div class="h1">Tempahan diterima</div><div class="muted">Terima kasih, ${esc(b.nama.split(' ')[0])}. Hantar butiran ke WhatsApp Juara supaya kami boleh sahkan tempahan anda dengan cepat.</div></div>
    <div class="card"><div class="jtags"><span class="muted small">Nombor tempahan</span>${CT}</div><div class="jno">${b.no}</div>${jStatus(b.status)}</div>
    <div class="card">${jRingkas(b)}</div>
    ${ag&&b.mata?`<div class="note">${jic('gift')}<div>${esc(ag.nama)} dapat ${fmt(b.mata)} mata ganjaran daripada tempahan ini.</div></div>`:''}
    <div class="btns">
      <a class="btn" href="${jWaTempahan(b)}" ${ext}>${ic('chat')}Hantar ke WhatsApp Juara</a>
      <a class="btn sec" href="#juara/tempahan">Lihat tempahan saya</a>
    </div>
  </main>`;
}

/* ===== Tempahan saya ===== */
function jTempahan(){
  const L = JS.tempahan, steps = ['menunggu','deposit','lengkap'];
  return bar('juara/pakej', 'Juara') + `
  <main class="stack">
    <div><div class="h1">Tempahan saya</div><div class="muted small" style="margin-top:4px">Disimpan dalam phone ini</div></div>
    ${!L.length ? `<div class="card empty">${jic('ticket')}<b>Belum ada tempahan</b><span>Pilih pakej dan tempah terus dalam apps.</span><a class="btn" href="#juara/pakej" style="margin-top:14px">Lihat pakej</a></div>` :
    L.map(b=>{ const i = steps.indexOf(b.status);
      return `<div class="card">
        <div class="jbk-hd"><div><div class="jtags"><span class="muted small">No tempahan</span>${CT}</div><b>${b.no}</b></div>${jStatus(b.status)}</div>
        <b style="font-size:15.5px;font-weight:600">${esc(b.pakejNama)}</b>
        <div class="small muted">Berlepas ${tarikh(b.tarikh)} · ${b.bil} jemaah</div>
        <div class="jtrack">${steps.map((s,j)=>`<div class="${j<=i?'on':''}">${STATUS[s][0]}</div>`).join('')}</div>
        <div style="margin-top:6px">
          <div class="kv"><span class="muted">Jumlah</span><b>${RM(b.jumlah)}</b></div>
          <div class="kv"><span class="muted">Dibayar</span><b>${RM(b.status==='lengkap'?b.jumlah:b.bayar)}</b></div>
          <div class="kv"><span class="muted">Baki</span><b>${b.status==='lengkap'||!b.baki?'Tiada baki':RM(b.baki)}</b></div>
        </div>
        <a class="btn sec" href="${jWaTempahan(b)}" ${ext} style="margin-top:12px">${ic('chat')}WhatsApp Juara</a>
        <button class="jlink" data-j="status" data-v="${b.no}">Demo: tukar status</button>
      </div>`; }).join('')}
  </main>`;
}

/* ===== Ganjaran agent ===== */
function jAgentData(){
  const a = AGENTS.find(x=>x.kod===JT.agentDemo);
  const ev = SEJARAH_MATA.filter(e=>e.kod===a.kod).concat(JS.mata.filter(m=>m.kod===a.kod)).map((e,i)=>Object.assign({i}, e))
    .sort((x,y)=> y.t.localeCompare(x.t) || y.i - x.i);
  const baki = ev.reduce((s,e)=>s+e.m, 0), terkumpul = ev.filter(e=>e.m>0).reduce((s,e)=>s+e.m, 0);
  return {a, ev, baki, terkumpul};
}
function jTahap(t){
  const T = JT.tahap; let i = 0;
  T.forEach((x,j)=>{ if(t >= x.min) i = j; });
  const now = T[i], next = T[i+1] || null;
  const pct = next ? Math.round((t-now.min)/(next.min-now.min)*100) : 100;
  return {now, next, pct};
}
function jMataBulan(kod){
  const ym = hariIni().slice(0,7);
  return (KEDUDUKAN.find(k=>k.kod===kod)?.mata || 0) + JS.mata.filter(m=>m.kod===kod && m.m>0 && m.t.slice(0,7)===ym).reduce((s,e)=>s+e.m, 0);
}
const jLinkAgent = kod => location.href.split('#')[0] + '#agent/' + kod;
function jGanjaran(){
  const {a, ev, baki, terkumpul} = jAgentData(), tp = jTahap(terkumpul);
  const nama2 = a.nama.replace(/^(Puan|Encik|Cik)\s+/,'');
  const share = `Assalamualaikum. Nak tunaikan umrah atau melancong bersama Juara Travel? Lihat pakej dan tempah terus dalam apps Jemaah Juara. Guna kod agent saya ${a.kod}, saya bantu sampai selesai.\n\n${jLinkAgent(a.kod)}`;
  const rank = AGENTS.map(x=>({x, m:jMataBulan(x.kod)})).sort((p,q)=>q.m-p.m);
  const pos = rank.findIndex(r=>r.x.kod===a.kod) + 1, now = new Date();
  const cara = [['users','Daftar jemaah baru','Setiap jemaah yang daftar guna kod anda', JT.mata.daftarJemaah],
                ['ticket','Tempahan deposit','Bila jemaah bayar deposit', JT.mata.tempahanDeposit],
                ['check','Bayaran penuh','Bila jemaah selesai bayar penuh', JT.mata.bayaranPenuh],
                ['repeat','Rujukan jemaah berulang','Jemaah lama tempah semula guna kod anda', JT.mata.rujukanBerulang]];
  return bar('juara/pakej', 'Juara') + `
  <main class="stack">
    <div class="jagent">
      <div class="jag-top"><div class="jav">${esc(nama2.slice(0,1))}</div><div style="flex:1"><b>${esc(a.nama)}</b><span>Agent Juara · ${esc(a.kawasan)}</span></div><span class="ct w">Contoh</span></div>
      <div class="jag-pts"><span>Baki mata</span><b>${fmt(baki)} <small>mata</small></b></div>
      <div class="jag-tier"><span class="tier t-${tp.now.n}">${jic('award')}${tp.now.n}</span><span>${tp.next ? `Lagi ${fmt(tp.next.min-terkumpul)} mata ke ${tp.next.n}` : 'Tahap tertinggi'}</span></div>
      <div class="jag-bar"><i style="width:${tp.pct}%"></i></div>
      <div class="jag-sub">Tahap ikut jumlah mata terkumpul: ${fmt(terkumpul)} mata</div>
    </div>
    <div class="card">
      <div class="muted small">Kod agent anda</div>
      <div class="jkod">${a.kod}</div>
      <div class="small muted">Jemaah guna kod ini semasa tempah, anda terus dapat mata.</div>
      <div class="jbtn2" style="margin-top:12px"><a class="btn" href="${waLink('', share)}" ${ext}>${ic('chat')}Kongsi</a><button class="btn sec" data-j="salinLink">${jic('copy')}Salin pautan</button></div>
    </div>
    <div class="jbtn2"><a class="btn" href="#juara/tebus">${jic('gift')}Tebus ganjaran</a><a class="btn sec" href="#juara/peraturan">${jic('rules')}Peraturan</a></div>
    <div><div class="h2" style="margin-top:8px">Cara dapat mata ${CT}</div>
      <div class="list">${cara.map(c=>`<div class="li"><div class="ic">${jic(c[0])}</div><div><b style="font-size:14.5px">${c[1]}</b><span>${c[2]}</span></div><b class="jpts">+${fmt(c[3])}</b></div>`).join('')}</div></div>
    <div><div class="h2" style="margin-top:8px">Kedudukan ${BULAN_PENUH[now.getMonth()]} ${CT}</div>
      <div class="jme">${jic('trophy')}<span>Anda di tempat <b>ke-${pos}</b> daripada ${rank.length} agent bulan ini</span></div>
      <div class="list">${rank.map((r,i)=>`<div class="li ${r.x.kod===a.kod?'me':''}"><div class="jrank ${i===0?'r1':''}">${i+1}</div><div><b style="font-size:14.5px">${esc(r.x.nama)}${r.x.kod===a.kod?' (anda)':''}</b><span>${esc(r.x.kawasan)}</span></div><b style="margin-left:auto;font-size:14.5px">${fmt(r.m)} mata</b></div>`).join('')}</div></div>
    <div><div class="h2" style="margin-top:8px">Sejarah mata ${CT}</div>
      <div class="list">${ev.map(e=>`<div class="li"><div class="ic" style="${e.m<0?'background:#f1ece5;color:var(--muted)':'background:var(--green-soft);color:var(--green)'}">${jic(e.m<0?'gift':'plus')}</div><div style="min-width:0"><b style="font-size:14px">${esc(e.a)}</b><span>${tarikh(e.t)} · ${e.m<0?'Tebus':'Masuk'}</span></div><b class="jpts ${e.m<0?'jneg':''}">${e.m<0?'-':'+'}${fmt(Math.abs(e.m))}</b></div>`).join('')}</div></div>
    <div class="note">${ic('alert')}<div>Profil, mata dan kedudukan ialah contoh untuk demo. Nilai mata boleh diubah dalam fail tetapan.</div></div>
  </main>`;
}
function jTebus(){
  const {baki} = jAgentData();
  const mine = JS.tebusan;
  return bar('juara/ganjaran', 'Ganjaran agent') + `
  <main class="stack">
    <div><div class="h1">Tebus ganjaran</div><div class="muted small" style="margin-top:4px">Tukar mata anda dengan hadiah pilihan</div></div>
    <div class="card stepper-row"><div><span>Baki mata anda</span><b style="font-size:24px;font-weight:700;color:var(--red)">${fmt(baki)}</b></div>${jic('award')}</div>
    ${GANJARAN.map(g=>`<div class="card jgf">
      <div class="noimg">${jic(g.ic)}Gambar akan dimasukkan</div>
      <div class="jgf-bd"><div class="jtags"><b>${esc(g.nama)}</b>${CT}</div><span class="small muted">${esc(g.desc)}</span>
        <div class="jgf-ft"><span class="m">${fmt(g.mata)} mata</span>${baki>=g.mata ? `<button class="btn jsm" data-j="tebus" data-v="${g.id}">Tebus</button>` : `<button class="btn jsm" disabled>Kurang ${fmt(g.mata-baki)} mata</button>`}</div></div>
    </div>`).join('')}
    ${mine.length ? `<div><div class="h2" style="margin-top:8px">Ganjaran yang anda tebus</div><div class="list">${mine.map(r=>{ const g = GANJARAN.find(x=>x.id===r.id)||{nama:'Ganjaran'};
      return `<a class="li" href="#juara/tebus/${r.kod}"><div class="ic">${jic('gift')}</div><div><b style="font-size:14px">${esc(g.nama)}</b><span>${tarikh(r.t)} · ${r.kod}</span></div>${ic('chev','r')}</a>`; }).join('')}</div></div>` : ''}
    <div class="note">${ic('alert')}<div>Senarai ganjaran ialah contoh. Juara akan sahkan ganjaran sebenar.</div></div>
  </main>`;
}
function jTebusOk(kod){
  const r = JS.tebusan.find(x=>x.kod===kod); if(!r) return jTebus();
  const g = GANJARAN.find(x=>x.id===r.id), {baki} = jAgentData();
  return bar('juara/ganjaran', 'Ganjaran agent') + `
  <main class="stack">
    <div class="jok">${ic('check')}<div class="h1">Ganjaran berjaya ditebus</div><div class="muted">${esc(g.nama)}</div></div>
    <div class="jcode"><div class="jtags" style="justify-content:center"><span class="muted small">Kod tebus anda</span>${CT}</div><b>${r.kod}</b><button class="jlink" data-j="salinKod" data-v="${r.kod}" style="text-decoration:none">${jic('copy')}Salin kod</button></div>
    <div class="card">
      <div class="kv"><span class="muted">Mata ditolak</span><b>-${fmt(g.mata)}</b></div>
      <div class="kv"><span class="muted">Baki mata sekarang</span><b>${fmt(baki)}</b></div>
      <div class="kv"><span class="muted">Tarikh</span><b>${tarikh(r.t)}</b></div>
    </div>
    <div class="note">${ic('alert')}<div>${esc(g.cara)}</div></div>
    <div class="btns"><a class="btn" href="#juara/ganjaran">Kembali ke ganjaran</a><a class="btn sec" href="#juara/tebus">Lihat ganjaran lain</a></div>
  </main>`;
}
function jPeraturan(){
  const k = JT.kempen, m = JT.mata, t = JT.tahap;
  const P2 = [
    'Kempen ini terbuka kepada agent Juara yang berdaftar dan ada kod agent aktif.',
    `Tempoh kempen: ${tarikh(k.mula)} hingga ${tarikh(k.tamat)}.`,
    `Mata diberi bila jemaah daftar atau tempah guna kod anda: daftar jemaah baru ${fmt(m.daftarJemaah)} mata seorang, tempahan deposit ${fmt(m.tempahanDeposit)} mata, bayaran penuh ${fmt(m.bayaranPenuh)} mata, rujukan jemaah berulang ${fmt(m.rujukanBerulang)} mata.`,
    'Mata hanya sah selepas Juara sahkan bayaran jemaah. Jika tempahan dibatalkan, mata untuk tempahan itu ditarik balik.',
    'Satu tempahan hanya boleh dikaitkan dengan satu kod agent.',
    `Tahap agent ikut jumlah mata terkumpul: ${t.map(x=>`${x.n} (${fmt(x.min)} mata)`).join(', ')}.`,
    `Mata sah selama ${k.luputBulan} bulan dari tarikh diterima.`,
    `Baucar Touch 'n Go eWallet dihantar ke nombor telefon agent yang berdaftar dalam ${k.hariHantarBaucar} hari bekerja.`,
    'Ganjaran yang sudah ditebus tidak boleh ditukar kepada wang tunai atau dipindah kepada orang lain.',
    'Juara berhak mengubah peraturan dan ganjaran dengan notis awal kepada semua agent.'
  ];
  return bar('juara/ganjaran', 'Ganjaran agent') + `
  <main class="stack">
    <div><div class="jtags"><div class="h1">Peraturan kempen</div>${CT}</div><div class="muted small" style="margin-top:4px">${esc(k.nama)}</div></div>
    <div class="card"><div class="steps" style="margin-top:0">${P2.map(x=>`<div class="step">${x}</div>`).join('')}</div></div>
    <div class="note">${ic('alert')}<div>Peraturan ini contoh. Juara akan muktamadkan sebelum kempen bermula.</div></div>
    <a class="btn sec" href="#juara/ganjaran">Kembali ke ganjaran</a>
  </main>`;
}

/* ===== Lembaran pengesahan ===== */
function jSheet(html){
  let s = $('jsheet');
  if(!s){ s = document.createElement('div'); s.id = 'jsheet'; s.className = 'jsheet'; document.body.appendChild(s);
    s.addEventListener('click', e=>{ if(e.target===s) jTutup(); }); }
  s.innerHTML = `<div class="in" role="dialog" aria-modal="true">${html}</div>`; s.classList.add('on');
}
function jTutup(){ const s = $('jsheet'); if(s) s.classList.remove('on'); }

/* ===== Tindakan ===== */
document.addEventListener('click', e=>{
  const a = e.target.closest('[data-j]'); if(!a || a.disabled) return;
  const j = a.dataset.j, v = a.dataset.v, d = JS.draft;
  if(j==='negeri' || j==='kNeg'){ if(j==='negeri') JS.negeri = v; else JS.kn = v; jRerender(); const c = document.querySelector('.chip.on'); if(c) c.scrollIntoView({inline:'center', block:'nearest'}); }
  else if(j==='jenis'){ JS.jenis = v; jRerender(); }
  else if(j==='geo'){
    if(!navigator.geolocation){ toast('Phone ini tidak benarkan lokasi'); return; }
    toast('Mencari lokasi anda...');
    navigator.geolocation.getCurrentPosition(p=>{
      JS.geo = {lat:+p.coords.latitude.toFixed(4), lng:+p.coords.longitude.toFixed(4)}; jst.set('geo', JS.geo);
      jRerender(); toast('Disusun ikut jarak dari anda');
    }, ()=>toast('Lokasi tidak dibenarkan. Anda masih boleh cari ikut negeri.'), {enableHighAccuracy:false, timeout:12000, maximumAge:600000});
  }
  else if(j==='tempah'){
    const p = PAKEJ.find(x=>x.id===a.dataset.id); if(!p) return;
    d.pakej = p.id; const t = jTarikhAda(p).find(x=>jKerusi(p,x)>0); d.tarikh = t ? t.d : null; d.bil = 1; d.step = 1; saveDraft();
    location.hash = 'juara/beli/1';
  }
  else if(j==='pilihPakej'){
    if(d.pakej !== a.dataset.id){ d.pakej = a.dataset.id; const p = jPakejDraf(), t = jTarikhAda(p).find(x=>jKerusi(p,x)>0); d.tarikh = t ? t.d : null; d.bil = 1; }
    saveDraft(); jRerender();
  }
  else if(j==='pilihTarikh'){ d.tarikh = v; d.bil = Math.min(d.bil, jMaksBil()); saveDraft(); jRerender(); }
  else if(j==='bil'){ d.bil = Math.max(1, Math.min(jMaksBil(), d.bil + (+v))); saveDraft(); jRerender(); }
  else if(j==='ke2'){
    if(!d.pakej){ toast('Sila pilih pakej dahulu'); return; }
    if(!jSah1()){ toast('Sila pilih tarikh berlepas'); return; }
    location.hash = 'juara/beli/2';
  }
  else if(j==='adaAgent'){ d.adaAgent = !d.adaAgent; if(!d.adaAgent){ d.agent = ''; delete JS.err.agent; } saveDraft(); jRerender(); }
  else if(j==='ke3'){
    JS.err = jSemak2(); const k = Object.keys(JS.err);
    if(k.length){ jRerender(); const f = $('f-'+k[0]); if(f) f.scrollIntoView({block:'center', behavior:'smooth'}); toast('Sila semak maklumat yang bertanda merah'); return; }
    if(d.adaAgent) d.agent = d.agent.trim().toUpperCase();
    saveDraft(); location.hash = 'juara/beli/3';
  }
  else if(j==='kaedah'){ d.kaedah = v; saveDraft(); jRerender(); }
  else if(j==='bayar'){
    if(!jSah1() || Object.keys(jSemak2()).length){ render(); return; }
    a.disabled = true; a.textContent = 'Sedang diproses...';
    setTimeout(jCipta, 900);
  }
  else if(j==='status'){
    const b = JS.tempahan.find(x=>x.no===v); if(!b) return;
    const s = ['menunggu','deposit','lengkap']; b.status = s[(s.indexOf(b.status)+1) % s.length];
    jst.set('tempahan', JS.tempahan); jRerender(); toast('Status: '+STATUS[b.status][0]);
  }
  else if(j==='salinLink'){ jSalin(jLinkAgent(JT.agentDemo), 'Pautan agent disalin'); }
  else if(j==='salinKod'){ jSalin(v, 'Kod tebus disalin'); }
  else if(j==='tebus'){
    const g = GANJARAN.find(x=>x.id===v), {baki} = jAgentData(); if(!g) return;
    jSheet(`<div class="hd">${jic('gift')}<div><b>Tebus ganjaran ini?</b><span>${esc(g.nama)}</span></div></div>
      <div class="kv"><span class="muted">Mata diperlukan</span><b>${fmt(g.mata)}</b></div>
      <div class="kv"><span class="muted">Baki sekarang</span><b>${fmt(baki)}</b></div>
      <div class="kv"><span class="muted">Baki selepas tebus</span><b>${fmt(baki-g.mata)}</b></div>
      <div class="btns" style="margin-top:16px"><button class="btn" data-j="tebusYa" data-v="${g.id}">Ya, tebus sekarang</button><button class="btn sec" data-j="tutup">Batal</button></div>`);
  }
  else if(j==='tebusYa'){
    const g = GANJARAN.find(x=>x.id===v), {a: ag, baki} = jAgentData();
    if(!g || baki < g.mata){ jTutup(); toast('Mata tidak mencukupi'); return; }
    const kod = `${g.pre}-${rnd4()}-${rnd4()}`, t = hariIni();
    JS.mata.push({kod:ag.kod, t, a:`Tebus ${g.nama}`, m:-g.mata}); jst.set('mata', JS.mata);
    JS.tebusan.unshift({kod, id:g.id, t}); jst.set('tebusan', JS.tebusan);
    jTutup(); location.hash = 'juara/tebus/' + kod;
  }
  else if(j==='tutup'){ jTutup(); }
});
document.addEventListener('input', e=>{
  const t = e.target.closest('[data-jin]'); if(!t) return;
  const k = t.dataset.jin;
  if(k==='cari'){ JS.cari = t.value; const L = $('jlist'); if(L) L.innerHTML = jLokList(); return; }
  if(k==='kcari'){ JS.kcari = t.value; const L = $('klist'); if(L) L.innerHTML = jKList(); return; }
  JS.draft[k] = t.value; saveDraft();
  if(JS.err[k]){ delete JS.err[k]; const f = $('f-'+k); if(f){ f.classList.remove('err'); const m = f.querySelector('.em'); if(m) m.remove(); } }
});
window.addEventListener('hashchange', e=>{ jTutup(); try{ JS.prev = new URL(e.oldURL).hash.slice(1); }catch(_){} });
