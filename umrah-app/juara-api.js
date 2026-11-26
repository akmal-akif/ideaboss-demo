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
const AJ = { ic:'', semak:null, sibuk:false, ralat:'', bulan:null, seat:{}, seatRalat:'', adaSahaja:false, buka:{} };
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
    ${apiAda() ? (r ? '' : `<form class="card" id="fSemak" autocomplete="off" novalidate>
      <label class="aj-lbl" for="inIC">No kad pengenalan</label>
      <div class="field ${AJ.ralat?'err':''}"><input id="inIC" inputmode="numeric" enterkeyhint="search" placeholder="000000-00-0000" value="${esc(fmtIC(AJ.ic))}" maxlength="14"></div>
      ${AJ.ralat?`<div class="aj-err">${esc(AJ.ralat)}</div>`:''}
      <button class="btn" type="submit" style="margin-top:12px" ${AJ.sibuk?'disabled':''}>${AJ.sibuk?'<span class="aj-spin"></span>Sedang semak':'Semak'}</button>
      <div class="aj-hint">${ic('eye')}<span>IC anda tidak disimpan dalam phone ini.</span></div>
    </form>
    <button class="aj-try" data-api="contoh">Belum ada IC? <b>Lihat contoh paparan</b></button>`) : tiadaApi()}
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
  AJ.sibuk=true; AJ.ralat=''; render();
  try{ AJ.semak = await apiGet('/jemaah?ic='+ic12); }
  catch(e){ AJ.semak=null; AJ.ralat = navigator.onLine ? e.message : 'Tiada internet. Sambung dan cuba lagi.'; }
  AJ.sibuk=false; render();
}

/* ===== Kekosongan seat umrah ===== */
function senaraiBulan(){
  const d = new Date(), L = [];
  for(let i=0;i<6;i++){ const x = new Date(d.getFullYear(), d.getMonth()+i, 1); L.push(`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}`); }
  return L;
}
const rangka = () => `<div class="card aj-sk"><i style="width:30%"></i><i style="width:85%"></i><i style="width:60%"></i><i style="width:100%;height:8px"></i></div>`;
function vSeat(){
  const L = senaraiBulan(); if(!AJ.bulan) AJ.bulan = L[0];
  const data = AJ.seat[AJ.bulan], hari = new Date(); hari.setHours(0,0,0,0);
  if(apiAda() && data===undefined && !AJ.seatSibuk && !AJ.seatRalat) muatSeat(AJ.bulan);
  const akan = (data||[]).filter(x => new Date(x.berlepas+'T00:00:00') >= hari);
  const adaSeat = akan.filter(x => x.baki>0), tunjuk = AJ.adaSahaja ? adaSeat : akan;
  return bar('utama', 'Utama') + `
  <main class="stack">
    <div><div class="h1">Kekosongan seat umrah</div><div class="muted small" style="margin-top:4px">Terus dari sistem Juara</div></div>
    ${apiAda() ? `<div class="chips" style="margin-bottom:0">${L.map(b=>{ const [y,m]=b.split('-'); return `<button class="chip ${b===AJ.bulan?'on':''}" data-api="bulan" data-b="${b}">${BULAN[+m-1]} ${y}</button>`; }).join('')}</div>
    ${AJ.seatRalat ? `<div class="card empty">${ic('wifi')}<b>Tidak dapat dimuat</b><span>${esc(AJ.seatRalat)}</span><button class="btn sec" style="margin-top:14px" data-api="cuba">Cuba lagi</button></div>`
      : data===undefined ? rangka()+rangka()
      : !akan.length ? `<div class="card empty">${ic('clock')}<b>Tiada tarikh berlepas</b><span>Cuba pilih bulan lain.</span></div>`
      : `<div class="aj-bar"><span><b>${adaSeat.length}</b> daripada ${akan.length} tarikh ada seat</span>
           <button class="aj-tg ${AJ.adaSahaja?'on':''}" data-api="ada" role="switch" aria-checked="${AJ.adaSahaja}"><i></i>Ada seat sahaja</button></div>`
        + (tunjuk.map(kadSeat).join('') || `<div class="card empty">${ic('alert')}<b>Semua tarikh bulan ini sudah penuh</b><span>Cuba bulan lain.</span></div>`)}` : tiadaApi()}
  </main>`;
}
function kadSeat(x, i){
  const h = x.harga, pk = pecahPakej(x.pakej), dt = new Date(x.berlepas+'T00:00:00');
  const bil = [['Bilik 5 orang',h.quint],['Bilik 4 orang',h.quad],['Bilik 3 orang',h.triple],['Bilik 2 orang',h.double]].filter(r=>r[1]);
  const mula = bil.length ? Math.min(...bil.map(r=>r[1])) : null;
  const penuh = x.baki<=0, sikit = !penuh && x.baki<=10, id = x.kod+'|'+i, buka = AJ.buka[id];
  const hotel = [['Makkah', pecahHotel(x.hotelMakkah)], ['Madinah', pecahHotel(x.hotelMadinah)]].filter(r=>r[1]);
  return `<div class="card aj-s ${penuh?'penuh':''}">
    <div class="aj-sh">
      <div class="aj-dt"><small>${HARI_P[dt.getDay()]}</small><b>${dt.getDate()}</b><small>${BULAN[dt.getMonth()]}</small></div>
      <div style="min-width:0">
        <b class="aj-pk">${esc(pk.nama)}</b>
        <div class="aj-tags">${pk.tempoh?`<span>${pk.tempoh}</span>`:''}${pk.laluan?`<span>${pk.laluan}</span>`:''}${pk.cuti?'<span class="b">Cuti sekolah</span>':''}</div>
      </div>
    </div>
    <div class="aj-seat ${penuh?'x':sikit?'w':''}">
      <div><b>${penuh?'Penuh':`Baki ${x.baki} seat`}</b><span>${x.isi}/${x.seat} diisi</span></div>
      <div class="aj-meter"><i style="width:${x.seat?Math.round(x.isi/x.seat*100):0}%"></i></div>
    </div>
    ${hotel.length?`<div class="aj-ht">${hotel.map(([k,v])=>`<div>${ic('pin')}<div><b>${k}: ${esc(v.nama)}</b>${v.b.length?`<span>${v.b.join(' · ')}</span>`:''}</div></div>`).join('')}</div>`:''}
    <div class="aj-ft">
      <div>${mula?`<small>Harga dari</small><b>${RM(mula)}</b>`:''}</div>
      ${bil.length>1?`<button class="aj-more" data-api="buka" data-id="${esc(id)}" aria-expanded="${!!buka}">Harga ikut bilik ${ic('chev', buka?'up':'')}</button>`:''}
    </div>
    ${buka?`<div class="aj-pr">${bil.map(([k,v])=>`<div class="kv"><span class="muted">${k}</span><b>${RM(v)}</b></div>`).join('')}<div class="small muted" style="margin-top:6px">Harga seorang · ${esc(x.kod)}</div></div>`:''}
    ${penuh
      ? `<a class="btn sec" target="_blank" rel="noopener" href="${waJ('Assalamualaikum Juara Travel. Tarikh '+tarikh(x.berlepas)+' ('+x.kod+') sudah penuh. Ada tarikh lain yang hampir?')}">Tanya tarikh lain</a>`
      : `<a class="btn" target="_blank" rel="noopener" href="${waJ('Assalamualaikum Juara Travel. Saya berminat dengan '+pk.nama+', berlepas '+tarikh(x.berlepas)+' ('+x.kod+'). Masih ada seat?')}">${ic('chat')}Tempah melalui WhatsApp</a>`}
  </div>`;
}
async function muatSeat(b){
  AJ.seatSibuk = true; AJ.seatRalat = '';
  const [y,m] = b.split('-');
  try{ AJ.seat[b] = await apiGet(`/seat?tahun=${y}&bulan=${+m}`); }
  catch(e){ AJ.seatRalat = navigator.onLine ? e.message : 'Tiada internet. Sambung dan cuba lagi.'; }
  AJ.seatSibuk = false; if((location.hash.slice(1)||'')==='seat') jRerender();
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-api]'); if(!a) return;
  const k = a.dataset.api;
  if(k==='bulan'){ AJ.bulan = a.dataset.b; AJ.seatRalat=''; render(); }
  else if(k==='cuba'){ delete AJ.seat[AJ.bulan]; AJ.seatRalat=''; render(); }
  else if(k==='ada'){ AJ.adaSahaja = !AJ.adaSahaja; jRerender(); }
  else if(k==='buka'){ AJ.buka[a.dataset.id] = !AJ.buka[a.dataset.id]; jRerender(); }
  else if(k==='semula'){ AJ.semak=null; AJ.ic=''; AJ.ralat=''; render(); setTimeout(()=>$('inIC')?.focus(), 50); }
  else if(k==='contoh'){ AJ.ic = IC_CONTOH; semakIC(); }
});
document.addEventListener('submit', e => { if(e.target.id==='fSemak'){ e.preventDefault(); AJ.ic = $('inIC').value; $('inIC').blur(); semakIC(); } });
document.addEventListener('input', e => { if(e.target.id==='inIC'){ const v = fmtIC(e.target.value); if(v!==e.target.value) e.target.value = v; AJ.ic = v; if(AJ.ralat){ AJ.ralat=''; e.target.parentNode.classList.remove('err'); const er=document.querySelector('.aj-err'); if(er) er.remove(); } } });
