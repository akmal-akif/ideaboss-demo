/* =========================================================
   Data sebenar dari sistem Juara (TravelDesk) melalui server Juara.
   Apps tidak simpan key. Alamat server ditetapkan dalam juara-tetapan.js (apiJuara).
   ========================================================= */
const KOD_KEKAL = ['SV','MH','JED','MED','MAK','KUL','HQ','JT','KLIA'];
function tajuk(s){
  return String(s||'').toLowerCase().replace(/[a-z0-9@+']+/g, w => KOD_KEKAL.includes(w.toUpperCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase()+w.slice(1));
}
const AJ = { ic:'', semak:null, sibuk:false, ralat:'', bulan:null, seat:{}, seatRalat:'' };
const apiAda = () => typeof JT !== 'undefined' && !!JT.apiJuara;
async function apiGet(path){
  const r = await fetch(JT.apiJuara.replace(/\/$/, '') + path, { headers:{ Accept:'application/json' } });
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(j.ralat || 'Sistem Juara tidak dapat dihubungi. Cuba lagi.');
  return j.data;
}
const tiadaApi = () => `<div class="note">${ic('alert')}<div>Sambungan ke sistem Juara belum ditetapkan dalam apps ini.</div></div>`;
const fmtIC = s => s.replace(/\D/g,'').slice(0,12).replace(/^(\d{6})(\d{1,2})?(\d{1,4})?$/, (m,a,b,c)=>[a,b,c].filter(Boolean).join('-'));

/* ===== Semak status jemaah ===== */
function vSemak(){
  const r = AJ.semak;
  return bar('utama', 'Utama') + `
  <main class="stack">
    <div class="h1">Semak status jemaah</div>
    <div class="muted small" style="margin-top:-6px">Masukkan no kad pengenalan untuk lihat pakej dan baki bayaran</div>
    ${apiAda() ? `<form class="card" id="fSemak" autocomplete="off">
      <div class="field"><input id="inIC" inputmode="numeric" placeholder="Contoh: 900101-10-1234" value="${esc(fmtIC(AJ.ic))}" maxlength="14" aria-label="No kad pengenalan"></div>
      <button class="btn" type="submit" style="width:100%;margin-top:10px" ${AJ.sibuk?'disabled':''}>${ic('eye')}${AJ.sibuk?'Sedang semak...':'Semak'}</button>
      ${AJ.ralat?`<div class="small" style="color:var(--red);margin-top:10px">${esc(AJ.ralat)}</div>`:''}
    </form>` : tiadaApi()}
    ${r ? (r.length ? r.map(kadJemaah).join('') : `<div class="card empty">${ic('alert')}<b>Tiada rekod</b><span>Tiada jemaah dengan no IC ini. Semak semula atau hubungi Juara.</span></div>`) : ''}
    <div class="note">${ic('alert')}<div>Maklumat dari sistem Juara. Untuk sebarang pertanyaan bayaran, hubungi agent atau pejabat Juara.</div></div>
  </main>`;
}
function kadJemaah(p){
  const b = p.bayaran, pct = b.jumlah>0 ? Math.min(100, Math.round(b.dibayar/b.jumlah*100)) : 0;
  const d = p.berlepas ? hariLagi(p.berlepas) : null, lepas = d!=null && d<0;
  return `<div class="card">
    <div style="display:flex;gap:8px;align-items:flex-start;justify-content:space-between">
      <div><b style="font-size:16px;font-weight:600">${esc(tajuk(p.nama))}</b><div class="small muted" style="margin-top:2px">${esc(tajuk(p.pakej))}</div></div>
      ${lepas?'<span class="pill p-grey">Selesai</span>':(d!=null?`<span class="pill p-ok">${d} hari lagi</span>`:'')}
    </div>
    <div style="margin-top:10px">
      ${p.berlepas?`<div class="kv"><span class="muted">Berlepas</span><b>${tarikh(p.berlepas)}</b></div>`:''}
      ${p.pulang?`<div class="kv"><span class="muted">Pulang</span><b>${tarikh(p.pulang)}</b></div>`:''}
      ${p.bilik?`<div class="kv"><span class="muted">Jenis bilik</span><b>${esc(p.bilik)}</b></div>`:''}
    </div>
    <div style="margin-top:14px" class="muted small">Baki perlu dibayar</div>
    <div class="money" style="${b.baki>0?'':'color:var(--green)'}">${RM(b.baki)}</div>
    <div style="margin:10px 0 6px" class="bar2"><i style="width:${pct}%"></i></div>
    <div style="display:flex;justify-content:space-between" class="small muted"><span>Dibayar ${RM(b.dibayar)}</span><span>Jumlah ${RM(b.jumlah)}</span></div>
    <div style="margin-top:10px">
      <div class="kv"><span class="muted">Harga pakej</span><b>${RM(b.harga)}</b></div>
      ${b.upgrade?`<div class="kv"><span class="muted">Upgrade bilik</span><b>${RM(b.upgrade)}</b></div>`:''}
      ${b.tambahan?`<div class="kv"><span class="muted">Tambahan</span><b>${RM(b.tambahan)}</b></div>`:''}
      ${b.diskaun?`<div class="kv"><span class="muted">Diskaun</span><b>-${RM(b.diskaun)}</b></div>`:''}
    </div>
    ${b.baki>0?`<a class="btn" style="width:100%;margin-top:12px" target="_blank" rel="noopener" href="https://wa.me/${JT.waJuara}?text=${encodeURIComponent('Assalamualaikum Juara Travel. Saya nak jelaskan baki bayaran untuk pakej '+tajuk(p.pakej)+' (berlepas '+(p.berlepas?tarikh(p.berlepas):'-')+').')}">${ic('chat')}Tanya cara bayar</a>`:''}
  </div>`;
}
async function semakIC(){
  const ic12 = AJ.ic.replace(/\D/g,'');
  if(ic12.length!==12){ AJ.ralat='No IC mesti 12 digit.'; AJ.semak=null; return render(); }
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
function vSeat(){
  const L = senaraiBulan(); if(!AJ.bulan) AJ.bulan = L[0];
  const data = AJ.seat[AJ.bulan], hari = new Date(); hari.setHours(0,0,0,0);
  if(apiAda() && data===undefined && !AJ.seatSibuk) muatSeat(AJ.bulan);
  const ada = (data||[]).filter(x => new Date(x.berlepas+'T00:00:00') >= hari);
  return bar('utama', 'Utama') + `
  <main class="stack">
    <div class="h1">Kekosongan seat umrah</div>
    <div class="muted small" style="margin-top:-6px">Terus dari sistem Juara. Kemas kini setiap 5 minit.</div>
    ${apiAda() ? `<div class="chips" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:2px">${L.map(b=>{ const [y,m]=b.split('-'); return `<button class="pill ${b===AJ.bulan?'p-red':'p-grey'}" style="font-size:13px;padding:8px 14px" data-api="bulan" data-b="${b}">${BULAN[+m-1]} ${y}</button>`; }).join('')}</div>
    ${AJ.seatRalat ? `<div class="card empty">${ic('alert')}<b>Tidak dapat dimuat</b><span>${esc(AJ.seatRalat)}</span><button class="btn sec" style="margin-top:12px" data-api="cuba">Cuba lagi</button></div>`
      : data===undefined ? `<div class="card empty">${ic('clock')}<b>Sedang muat...</b></div>`
      : !ada.length ? `<div class="card empty">${ic('alert')}<b>Tiada tarikh berlepas</b><span>Cuba bulan lain.</span></div>`
      : `<div class="small muted">${ada.length} tarikh berlepas</div>` + ada.map(kadSeat).join('')}` : tiadaApi()}
  </main>`;
}
function kadSeat(x){
  const h = x.harga, mula = [h.quint,h.quad,h.triple,h.double].filter(Boolean)[0];
  const pill = x.baki<=0 ? '<span class="pill p-grey">Penuh</span>' : `<span class="pill ${x.baki<=10?'p-warn':'p-ok'}">Baki ${x.baki} seat</span>`;
  const bil = [['Bilik 2',h.double],['Bilik 3',h.triple],['Bilik 4',h.quad],['Bilik 5',h.quint]].filter(r=>r[1]);
  return `<div class="card">
    <div style="display:flex;gap:8px;justify-content:space-between;align-items:flex-start"><b style="font-size:15px;font-weight:600;line-height:1.35">${esc(tajuk(x.pakej))}</b>${pill}</div>
    <div class="small muted" style="margin-top:6px">${tarikh(x.berlepas)} hingga ${tarikh(x.pulang)} · ${esc(x.kod)}</div>
    ${x.hotelMakkah?`<div class="small" style="margin-top:6px">Makkah: ${esc(tajuk(x.hotelMakkah))}</div>`:''}
    ${x.hotelMadinah?`<div class="small">Madinah: ${esc(tajuk(x.hotelMadinah))}</div>`:''}
    <div class="bar2" style="margin:10px 0 4px"><i style="width:${x.seat?Math.round(x.isi/x.seat*100):0}%"></i></div>
    <div class="small muted">${x.isi} daripada ${x.seat} seat sudah diisi</div>
    ${bil.length?`<div style="margin-top:8px">${bil.map(([k,v])=>`<div class="kv"><span class="muted">${k}</span><b>${RM(v)}</b></div>`).join('')}</div>`:''}
    ${x.baki>0?`<a class="btn" style="width:100%;margin-top:12px" target="_blank" rel="noopener" href="https://wa.me/${JT.waJuara}?text=${encodeURIComponent('Assalamualaikum Juara Travel. Saya berminat dengan pakej '+tajuk(x.pakej)+', berlepas '+tarikh(x.berlepas)+' ('+x.kod+'). Masih ada seat?')}">${ic('chat')}Tempah seat${mula?' dari '+RM(mula):''}</a>`:''}
  </div>`;
}
async function muatSeat(b){
  AJ.seatSibuk = true; AJ.seatRalat = '';
  const [y,m] = b.split('-');
  try{ AJ.seat[b] = await apiGet(`/seat?tahun=${y}&bulan=${+m}`); }
  catch(e){ AJ.seatRalat = navigator.onLine ? e.message : 'Tiada internet. Sambung dan cuba lagi.'; }
  AJ.seatSibuk = false; if((location.hash.slice(1)||'')==='seat') render();
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-api]'); if(!a) return;
  if(a.dataset.api==='bulan'){ AJ.bulan = a.dataset.b; AJ.seatRalat=''; render(); }
  else if(a.dataset.api==='cuba'){ delete AJ.seat[AJ.bulan]; AJ.seatRalat=''; render(); }
});
document.addEventListener('submit', e => { if(e.target.id==='fSemak'){ e.preventDefault(); AJ.ic = $('inIC').value; semakIC(); } });
document.addEventListener('input', e => { if(e.target.id==='inIC'){ const v = fmtIC(e.target.value); if(v!==e.target.value) e.target.value = v; AJ.ic = v; } });
