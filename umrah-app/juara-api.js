/* =========================================================
   Data sebenar dari sistem Juara (TravelDesk) melalui server Juara.
   Apps tidak simpan key. Alamat server ditetapkan dalam juara-tetapan.js (apiJuara).
   ========================================================= */
const KOD_KEKAL = ['SV','MH','JED','MED','MAK','KUL','HQ','JT','KLIA'];
const KECIL = ['dan','ke','di','dari','atau','&'];
function tajuk(s){
  let i = 0;
  return String(s||'').toLowerCase().replace(/[a-z0-9@+'&]+/g, w => {
    const n = i++;
    if(KOD_KEKAL.includes(w.toUpperCase())) return w.toUpperCase();
    if(n>0 && KECIL.includes(w)) return w;
    return w.charAt(0).toUpperCase()+w.slice(1);
  });
}
// "CUTI SEKOLAH PAKEJ EKO-KLASIK ... : 12 HARI 10 MALAM (SV : JED-MED ) IN MAKKAH" -> bahagian kemas
function pecahPakej(s){
  let t = String(s||'').replace(/\s+/g,' ').trim(); const o = {};
  if(/^cuti sekolah\s*/i.test(t)){ o.cuti = true; t = t.replace(/^cuti sekolah\s*/i,''); }
  const m = t.match(/(\d+)\s*hari\s*(\d+)\s*malam/i); if(m){ o.tempoh = `${m[1]} hari ${m[2]} malam`; t = t.replace(m[0],''); }
  const r = t.match(/\(\s*([a-z]{2})\s*:\s*([a-z]{3})\s*-\s*([a-z]{3})\s*\)/i); if(r){ o.laluan = `${r[2].toUpperCase()} ke ${r[3].toUpperCase()}`; o.syarikat = r[1].toUpperCase(); t = t.replace(r[0],''); }
  const n = t.match(/\bin (makkah|madinah)\b/i); if(n){ o.mula = tajuk(n[1]); t = t.replace(n[0],''); }
  o.nama = tajuk(t.replace(/[\s:]+$/,'').replace(/\s{2,}/g,' ').trim());
  return o;
}
// "MKAREM ROSE @SETARAF +-300M 3X SAJIAN (CITARASA MALAYSIA)" -> nama + butiran pendek
function pecahHotel(s){
  const t = String(s||''); if(!t) return null;
  const nama = tajuk(t.split(/@|\+-|\(/)[0].trim());
  const b = [];
  if(/setaraf/i.test(t)) b.push('atau setaraf');
  const j = t.match(/\+-\s*(\d+)\s*m\b/i); if(j) b.push(`±${j[1]} m`);
  const sj = t.match(/(\d)\s*x\s*sajian/i); if(sj) b.push(`${sj[1]} kali sajian`);
  if(/citarasa malaysia/i.test(t)) b.push('menu Malaysia');
  return { nama, b };
}
const AJ = { ic:'', semak:null, sibuk:false, ralat:'', bulan:null, adaSahaja:false, buka:{} };
const apiAda = () => typeof JT !== 'undefined' && !!JT.apiJuara;
async function apiGet(path){
  const r = await fetch(JT.apiJuara.replace(/\/$/, '') + path, { headers:{ Accept:'application/json' } });
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(j.ralat || 'Sistem Juara tidak dapat dihubungi. Cuba lagi.');
  return j.data;
}
const tiadaApi = () => `<div class="note">${ic('alert')}<div>Sambungan ke sistem Juara belum ditetapkan dalam apps ini.</div></div>`;
const fmtIC = s => String(s).replace(/\D/g,'').slice(0,12).replace(/^(\d{6})(\d{1,2})?(\d{1,4})?$/, (m,a,b,c)=>[a,b,c].filter(Boolean).join('-'));
const HARI_P = ['Ahd','Isn','Sel','Rab','Kha','Jum','Sab'];
const waJ = t => `https://wa.me/${JT.waJuara}?text=${encodeURIComponent(t)}`;

/* ===== Semak status jemaah ===== */
const IC_CONTOH = '000000000000';
const REKOD_CONTOH = [{ contoh:true, nama:'Aminah B*** Y***', pakej:'PAKEJ EKO-KLASIK ZIARAH TAIF DAN BADAR : 12 HARI 10 MALAM (SV : JED-MED ) IN MAKKAH',
  berlepas:'2027-01-14', pulang:'2027-01-25', bilik:'Quad',
  bayaran:{ harga:7990, upgrade:0, tambahan:150, diskaun:100, jumlah:8040, dibayar:3500, baki:4540 } }];

function vSemak(){
  const r = AJ.semak;
  return bar('utama', 'Utama') + `
  <main class="stack">
    <div><div class="h1">Status jemaah</div><div class="muted small" style="margin-top:4px">Semak pakej dan baki bayaran anda</div></div>
    ${(r ? '' : `<form class="card" id="fSemak" autocomplete="off" novalidate>
      <label class="aj-lbl" for="inIC">No kad pengenalan</label>
      <div class="field ${AJ.ralat?'err':''}"><input id="inIC" inputmode="numeric" enterkeyhint="search" placeholder="000000-00-0000" value="${esc(fmtIC(AJ.ic))}" maxlength="14"></div>
      ${AJ.ralat?`<div class="aj-err">${esc(AJ.ralat)}</div>`:''}
      <button class="btn" type="submit" style="margin-top:12px" ${AJ.sibuk?'disabled':''}>${AJ.sibuk?'<span class="aj-spin"></span>Sedang semak':'Semak'}</button>
      <div class="aj-hint">${ic('eye')}<span>IC anda tidak disimpan dalam phone ini.</span></div>
    </form>
    <button class="aj-try" data-api="contoh">Belum ada IC? <b>Lihat contoh paparan</b></button>`)}
    ${r ? (r.length ? r.map(kadJemaah).join('') : `<div class="card empty">${ic('alert')}<b>Tiada rekod untuk IC ini</b><span>Semak semula nombor IC, atau hubungi Juara.</span></div>`)
       + `<button class="btn sec" data-api="semula">Semak IC lain</button>` : ''}
  </main>`;
}
function kadJemaah(p){
  const b = p.bayaran, pct = b.jumlah>0 ? Math.min(100, Math.round(b.dibayar/b.jumlah*100)) : 0;
  const d = p.berlepas ? hariLagi(p.berlepas) : null, pk = pecahPakej(p.pakej);
  const lunas = b.baki<=0;
  const masa = d==null ? '' : d>0 ? `${d} hari lagi` : (p.pulang && hariLagi(p.pulang)>=0 ? 'Sedang di Tanah Suci' : 'Sudah pulang');
  return `<div class="card aj-j">
    <div class="aj-jh"><div><b>${esc(tajuk(p.nama))}</b>${p.contoh?CT:''}</div><span class="pill ${lunas?'p-ok':'p-red'}">${lunas?ic('check')+'Lunas':'Belum lunas'}</span></div>
    <div class="aj-baki ${lunas?'ok':''}"><span>Baki perlu dibayar</span><b>${RM(Math.max(0,b.baki))}</b></div>
    <div class="aj-meter"><i style="width:${pct}%"></i></div>
    <div class="aj-mrow"><span>Dibayar <b>${RM(b.dibayar)}</b></span><span>${pct}% daripada ${RM(b.jumlah)}</span></div>
    <div class="aj-sec">
      <div class="aj-t">Pakej</div>
      <b class="aj-pk">${esc(pk.nama)}</b>
      <div class="aj-tags">${pk.tempoh?`<span>${pk.tempoh}</span>`:''}${p.bilik?`<span>Bilik ${esc(p.bilik)}</span>`:''}${pk.laluan?`<span>${pk.laluan}</span>`:''}</div>
      ${p.berlepas?`<div class="aj-trip"><div><small>Berlepas</small><b>${tarikh(p.berlepas)}</b></div>${ic('chev')}<div><small>Pulang</small><b>${p.pulang?tarikh(p.pulang):'-'}</b></div></div>`:''}
      ${masa?`<div class="aj-masa">${ic('clock')}${masa}</div>`:''}
    </div>
    <div class="aj-sec">
      <div class="aj-t">Pecahan bayaran</div>
      <div class="kv"><span class="muted">Harga pakej</span><b>${RM(b.harga)}</b></div>
      ${b.upgrade?`<div class="kv"><span class="muted">Upgrade bilik</span><b>+${RM(b.upgrade)}</b></div>`:''}
      ${b.tambahan?`<div class="kv"><span class="muted">Tambahan</span><b>+${RM(b.tambahan)}</b></div>`:''}
      ${b.diskaun?`<div class="kv"><span class="muted">Diskaun</span><b class="aj-neg">-${RM(b.diskaun)}</b></div>`:''}
      <div class="kv aj-sum"><span>Jumlah</span><b>${RM(b.jumlah)}</b></div>
    </div>
    ${!lunas?`<a class="btn" target="_blank" rel="noopener" href="${waJ('Assalamualaikum Juara Travel. Saya nak jelaskan baki bayaran '+RM(b.baki)+' untuk pakej '+pk.nama+(p.berlepas?', berlepas '+tarikh(p.berlepas):'')+'.')}">${ic('chat')}Tanya cara bayar baki</a>`:''}
  </div>`;
}
async function semakIC(){
  const ic12 = AJ.ic.replace(/\D/g,'');
  if(ic12.length!==12){ AJ.ralat = 'Masukkan 12 digit nombor IC.'; return render(); }
  if(ic12===IC_CONTOH){ AJ.semak = REKOD_CONTOH; AJ.ralat=''; return render(); }
  if(!apiAda()){ AJ.ralat = 'Semakan IC sebenar aktif selepas server Juara dihidupkan. Buat masa ini, tekan Lihat contoh paparan.'; return render(); }
  AJ.sibuk=true; AJ.ralat=''; render();
  try{ AJ.semak = await apiGet('/jemaah?ic='+ic12); }
  catch(e){ AJ.semak=null; AJ.ralat = navigator.onLine ? e.message : 'Tiada internet. Sambung dan cuba lagi.'; }
  AJ.sibuk=false; render();
}

/* ===== Pakej umrah sebenar (dari server Juara, atau salinan pakej-sebenar.js) ===== */
const DATA_PAKEJ = { dikemas:null, pakej:[], sumber:'' };
const IMG_KAT = { Ekonomi:'img/makkah-kumpulan.jpg', 'Menara Jam':'img/kaabah.jpg', Ramadhan:'img/doa.jpg', Syawal:'img/nabawi-kumpulan.jpg', Syaaban:'img/nabawi.jpg', 'Plus Turki':'img/madinah-bas.jpg', Umrah:'img/petugas.jpg' };
const BLN = d => { const x = new Date(d+'T00:00:00'); return `${BULAN[x.getMonth()]} ${x.getFullYear()}`; };
function jDikemas(){
  if(!DATA_PAKEJ.dikemas) return '';
  // ikut waktu Malaysia (UTC+8) walau phone di Saudi
  const d = new Date(new Date(DATA_PAKEJ.dikemas).getTime() + 8*3600e3), h = d.getUTCHours(), m = String(d.getUTCMinutes()).padStart(2,'0');
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${h%12||12}:${m} ${h<12?'pagi':h<14?'tengah hari':h<19?'petang':'malam'}`;
}
function pasangPakej(data){
  if(!data || !data.pakej || !data.pakej.length) return;
  DATA_PAKEJ.dikemas = data.dikemas; DATA_PAKEJ.pakej = data.pakej;
  const ubah = data.pakej.map(p => {
    // satu tarikh satu baris (pilih yang paling banyak seat jika tarikh sama)
    const T = []; p.tarikh.forEach(t => { const a = T.find(x=>x.d===t.d); if(!a) T.push(t); else if(t.k > a.k) T[T.indexOf(a)] = t; });
    const t0 = T[0], syk = [...new Set(T.map(t=>t.syarikat).filter(Boolean))];
    const hotel = [['Makkah', t0.makkah], ['Madinah', t0.madinah]].filter(h=>h[1]).map(([k,h]) => [k, esc(h.nama), h.b.join(', ')]);
    const bln = [BLN(T[0].d), BLN(T[T.length-1].d)];
    return { id:'r-'+p.id, nama:p.nama, jenis:'umrah', kat:p.kat, cuti:p.cuti, hari:p.hari, harga:p.harga, img:IMG_KAT[p.kat]||IMG_KAT.Umrah,
      ringkas:`${T.length} tarikh berlepas${bln[0]===bln[1] ? ' pada '+bln[0] : ', '+bln[0]+' hingga '+bln[1]}.${syk.length?' Penerbangan '+syk.join(' atau ')+'.':''}`,
      tarikh:T, jalan:[], hotel, termasuk:null, tak:null, faq:null, sebenar:true };
  });
  for(let i = PAKEJ.length-1; i >= 0; i--) if(PAKEJ[i].jenis==='umrah') PAKEJ.splice(i, 1);
  PAKEJ.unshift(...ubah);
  const kira = {}; ubah.forEach(p => kira[p.kat] = (kira[p.kat]||0) + 1);
  KAT.umrah.splice(0, KAT.umrah.length, 'Semua', ...Object.keys(kira).sort((a,b)=>kira[b]-kira[a]));
}
function jTarikhSebenar(p){
  return p.tarikh.map(t => {
    const lepas = t.d < hariIni(), k = lepas ? 0 : jKerusi(p,t);
    return `<div class="aj-tr"><div><b>${tarikh(t.d)}</b><span>${[t.laluan, t.cuti?'Cuti sekolah':'', t.kod].filter(Boolean).join(' · ')}</span></div><div><b>${RM(t.harga)}</b>${jSeat(k)}</div></div>`;
  }).join('');
}
async function muatPakej(){
  if(!apiAda()) return;
  try{ const d = await apiGet('/pakej'); pasangPakej(d); DATA_PAKEJ.sumber = 'langsung'; jRerender(); }catch(e){}
}

/* ===== Kekosongan seat umrah ===== */
function senaraiTarikh(){
  const L = [];
  DATA_PAKEJ.pakej.forEach(p => p.tarikh.forEach(t => { if(t.d >= hariIni()) L.push({ ...t, nama:p.nama, hari:p.hari }); }));
  return L.sort((a,b) => a.d.localeCompare(b.d) || b.k - a.k);
}
const rangka = () => `<div class="card aj-sk"><i style="width:30%"></i><i style="width:85%"></i><i style="width:60%"></i><i style="width:100%;height:8px"></i></div>`;
function vSeat(){
  const semua = senaraiTarikh(), L = [...new Set(semua.map(t=>t.d.slice(0,7)))];
  if(!L.includes(AJ.bulan)) AJ.bulan = L[0];
  const akan = semua.filter(t => t.d.slice(0,7)===AJ.bulan), adaSeat = akan.filter(x => x.k>0), tunjuk = AJ.adaSahaja ? adaSeat : akan;
  return bar('utama', 'Utama') + `
  <main class="stack">
    <div><div class="h1">Kekosongan seat umrah</div><div class="muted small" style="margin-top:4px">Dari sistem Juara${DATA_PAKEJ.dikemas?', dikemas kini '+jDikemas():''}</div></div>
    ${!semua.length ? (apiAda() ? rangka()+rangka() : tiadaApi()) : `<div class="chips" style="margin-bottom:0">${L.map(b=>{ const [y,m]=b.split('-'); const n = semua.filter(t=>t.d.slice(0,7)===b).length; return `<button class="chip ${b===AJ.bulan?'on':''}" data-api="bulan" data-b="${b}">${BULAN[+m-1]} ${y} <small style="opacity:.7">${n}</small></button>`; }).join('')}</div>
      <div class="aj-bar"><span><b>${adaSeat.length}</b> daripada ${akan.length} tarikh ada seat</span>
        <button class="aj-tg ${AJ.adaSahaja?'on':''}" data-api="ada" role="switch" aria-checked="${AJ.adaSahaja}"><i></i>Ada seat sahaja</button></div>
      ${tunjuk.map(kadSeat).join('') || `<div class="card empty">${ic('alert')}<b>Semua tarikh bulan ini sudah penuh</b><span>Cuba bulan lain.</span></div>`}`}
  </main>`;
}
function kadSeat(x, i){
  const h = x.bilik || {}, dt = new Date(x.d+'T00:00:00');
  const bil = [['Bilik 5 orang',h.quint],['Bilik 4 orang',h.quad],['Bilik 3 orang',h.triple],['Bilik 2 orang',h.double]].filter(r=>r[1]);
  const penuh = x.k<=0, sikit = !penuh && x.k<=10, id = x.kod+'|'+x.d+'|'+i, buka = AJ.buka[id];
  const hotel = [['Makkah', x.makkah], ['Madinah', x.madinah]].filter(r=>r[1]);
  return `<div class="card aj-s ${penuh?'penuh':''}">
    <div class="aj-sh">
      <div class="aj-dt"><small>${HARI_P[dt.getDay()]}</small><b>${dt.getDate()}</b><small>${BULAN[dt.getMonth()]}</small></div>
      <div style="min-width:0">
        <b class="aj-pk">${esc(x.nama)}</b>
        <div class="aj-tags">${x.hari?`<span>${x.hari}</span>`:''}${x.laluan?`<span>${x.laluan}</span>`:''}${x.cuti?'<span class="b">Cuti sekolah</span>':''}</div>
      </div>
    </div>
    <div class="aj-seat ${penuh?'x':sikit?'w':''}">
      <div><b>${penuh?'Penuh':`Baki ${x.k} seat`}</b><span>${x.isi}/${x.seat} diisi</span></div>
      <div class="aj-meter"><i style="width:${x.seat?Math.min(100,Math.round(x.isi/x.seat*100)):0}%"></i></div>
    </div>
    ${hotel.length?`<div class="aj-ht">${hotel.map(([k,v])=>`<div>${ic('pin')}<div><b>${k}: ${esc(v.nama)}</b>${v.b.length?`<span>${v.b.join(' · ')}</span>`:''}</div></div>`).join('')}</div>`:''}
    <div class="aj-ft">
      <div><small>Harga dari</small><b>${RM(x.harga)}</b></div>
      ${bil.length>1?`<button class="aj-more" data-api="buka" data-id="${esc(id)}" aria-expanded="${!!buka}">Harga ikut bilik ${ic('chev', buka?'up':'')}</button>`:''}
    </div>
    ${buka?`<div class="aj-pr">${bil.map(([k,v])=>`<div class="kv"><span class="muted">${k}</span><b>${RM(v)}</b></div>`).join('')}<div class="small muted" style="margin-top:6px">Harga seorang · ${esc(x.kod)}</div></div>`:''}
    ${penuh
      ? `<a class="btn sec" target="_blank" rel="noopener" href="${waJ('Assalamualaikum Juara Travel. Tarikh '+tarikh(x.d)+' ('+x.kod+') sudah penuh. Ada tarikh lain yang hampir?')}">Tanya tarikh lain</a>`
      : `<a class="btn" target="_blank" rel="noopener" href="${waJ('Assalamualaikum Juara Travel. Saya berminat dengan '+x.nama+', berlepas '+tarikh(x.d)+' ('+x.kod+'). Masih ada seat?')}">${ic('chat')}Tempah melalui WhatsApp</a>`}
  </div>`;
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-api]'); if(!a) return;
  const k = a.dataset.api;
  if(k==='bulan'){ AJ.bulan = a.dataset.b; render(); }
  else if(k==='ada'){ AJ.adaSahaja = !AJ.adaSahaja; jRerender(); }
  else if(k==='buka'){ AJ.buka[a.dataset.id] = !AJ.buka[a.dataset.id]; jRerender(); }
  else if(k==='semula'){ AJ.semak=null; AJ.ic=''; AJ.ralat=''; render(); setTimeout(()=>$('inIC')?.focus(), 50); }
  else if(k==='contoh'){ AJ.ic = IC_CONTOH; semakIC(); }
});
document.addEventListener('submit', e => { if(e.target.id==='fSemak'){ e.preventDefault(); AJ.ic = $('inIC').value; $('inIC').blur(); semakIC(); } });
document.addEventListener('input', e => { if(e.target.id==='inIC'){ const v = fmtIC(e.target.value); if(v!==e.target.value) e.target.value = v; AJ.ic = v; if(AJ.ralat){ AJ.ralat=''; e.target.parentNode.classList.remove('err'); const er=document.querySelector('.aj-err'); if(er) er.remove(); } } });
// Pasang selepas semua skrip apps siap dimuat, kemudian lukis semula
document.addEventListener('DOMContentLoaded', () => {
  if(typeof PAKEJ_SEBENAR !== 'undefined'){ pasangPakej(PAKEJ_SEBENAR); DATA_PAKEJ.sumber = 'salinan'; render(); }
  muatPakej();
});
