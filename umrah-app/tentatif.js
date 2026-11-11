/* =========================================================
   Jadual perjalanan tentatif jemaah (CONTOH).
   Disusun ikut pakej dalam index.html (J), hotel (HOTEL) dan ZIARAH.
   Masa ialah anggaran. Ganti dengan tentatif sebenar dari Juara.
   ========================================================= */
const TENTATIF = [
  { s: 'Berlepas dari KLIA', tempat: 'Kuala Lumpur ke Madinah', loc: 'kl', a: [
    ['6:00 pagi', 'Berkumpul di KLIA Terminal 1, kaunter Juara Travel'],
    ['7:00 pagi', 'Daftar masuk bagasi dan taklimat ringkas bersama mutawwif'],
    ['10:00 pagi', 'Berlepas ke Madinah'],
    ['4:00 petang', 'Tiba di Madinah (waktu Saudi), bas ke hotel'],
    ['Malam', 'Daftar masuk hotel, makan malam dan rehat']],
    nota: 'Bawa pasport, e-Visa, ubat peribadi dan sehelai pakaian dalam beg tangan.' },
  { s: 'Masjid Nabawi', tempat: 'Madinah', loc: 'madinah', a: [
    ['Subuh', 'Solat berjemaah di Masjid Nabawi'],
    ['9:00 pagi', 'Taklimat ibadah di Madinah oleh mutawwif'],
    ['Selepas Zohor', 'Ziarah dalam Masjid Nabawi dan salam kepada Rasulullah SAW'],
    ['Malam', 'Ibadah bebas di Masjid Nabawi']] },
  { s: 'Raudhah', tempat: 'Madinah', loc: 'madinah', a: [
    ['Subuh', 'Solat berjemaah di Masjid Nabawi'],
    ['Ikut slot permit', 'Masuk Raudhah bersama kumpulan (permit Nusuk diuruskan mutawwif)'],
    ['Petang', 'Masa bebas dan ibadah sendiri']],
    nota: 'Waktu masuk Raudhah ikut slot permit. Mutawwif akan maklumkan dalam kumpulan WhatsApp.' },
  { s: 'Quba dan Uhud', tempat: 'Madinah', loc: 'madinah', a: [
    ['8:00 pagi', 'Ziarah luar: Masjid Quba (solat sunat 2 rakaat)'],
    ['10:00 pagi', 'Jabal Uhud dan makam para syuhada'],
    ['11:30 pagi', 'Singgah ladang kurma'],
    ['Petang', 'Kembali ke hotel, ibadah bebas']],
    nota: 'Ambil wuduk di hotel sebelum bertolak ke Quba.' },
  { s: 'Qiblatain dan Baqi', tempat: 'Madinah', loc: 'madinah', a: [
    ['Selepas Subuh', 'Ziarah Perkuburan Baqi (lelaki, ikut waktu dibenarkan)'],
    ['8:30 pagi', 'Ziarah Masjid Qiblatain'],
    ['Malam', 'Kemas bagasi untuk ke Makkah esok']] },
  { s: 'Miqat Bir Ali, umrah pertama', tempat: 'Madinah ke Makkah', loc: 'makkah', a: [
    ['Pagi', 'Mandi sunat ihram dan pakai pakaian ihram di hotel'],
    ['10:00 pagi', 'Bas bertolak ke Makkah, singgah miqat Bir Ali'],
    ['Di Bir Ali', 'Solat sunat ihram dan niat umrah. Mula baca talbiah'],
    ['5:00 petang', 'Tiba di Makkah, daftar masuk hotel'],
    ['Selepas Isyak', 'Umrah pertama bersama mutawwif: tawaf, saie dan tahallul']],
    nota: 'Larangan ihram bermula selepas niat. Rujuk topik "Larangan ihram" dalam tab Kursus.' },
  { s: 'Taklimat ibadah di Makkah', tempat: 'Makkah', loc: 'makkah', a: [
    ['Pagi', 'Rehat selepas umrah pertama'],
    ['Selepas Asar', 'Taklimat ibadah di Makkah dan cara kenal pintu masjid'],
    ['Malam', 'Ibadah bebas di Masjidil Haram']],
    nota: 'Ingat nombor pintu masuk anda untuk balik ke hotel.' },
  { s: 'Ziarah luar Makkah', tempat: 'Makkah', loc: 'makkah', a: [
    ['7:00 pagi', 'Ziarah luar Makkah: Jabal Thur dan Arafah (Jabal Rahmah)'],
    ['9:30 pagi', 'Lalu Mina dan Muzdalifah'],
    ['10:30 pagi', 'Jabal Nur dan Gua Hira (dilihat dari kaki bukit)'],
    ['Petang', 'Kembali ke hotel, ibadah bebas']],
    nota: 'Kawasan panas. Bawa air, payung dan topi.' },
  { s: 'Umrah kedua (pilihan)', tempat: 'Makkah', loc: 'makkah', a: [
    ['Pagi', 'Pilihan: ke Jiranah untuk niat umrah kedua'],
    ['Tengah hari', 'Umrah kedua bersama mutawwif (bagi yang berniat)'],
    ['Malam', 'Ibadah bebas di Masjidil Haram']] },
  { s: 'Ibadah bebas', tempat: 'Makkah', loc: 'makkah', a: [
    ['Sepanjang hari', 'Ibadah bebas: tawaf sunat, solat jemaah dan membaca al-Quran'],
    ['Petang', 'Masa untuk membeli buah tangan']] },
  { s: 'Kemas bagasi', tempat: 'Makkah', loc: 'makkah', a: [
    ['Sepanjang hari', 'Ibadah bebas di Masjidil Haram'],
    ['Malam', 'Kemas bagasi. Air zamzam diserah oleh petugas Juara']],
    nota: 'Pastikan berat bagasi ikut had syarikat penerbangan.' },
  { s: 'Tawaf wada, pulang', tempat: 'Makkah ke Kuala Lumpur', loc: 'kl', a: [
    ['Selepas Subuh', 'Tawaf wada (tawaf selamat tinggal)'],
    ['9:00 pagi', 'Daftar keluar hotel, bas ke Lapangan Terbang Jeddah'],
    ['3:00 petang', 'Berlepas ke Kuala Lumpur'],
    ['Malam', 'Tiba di KLIA. Alhamdulillah, selamat pulang']] }
];
const TCOL = { kl: ['#f1ece5', '#3f3f46'], madinah: ['#e6f2ef', '#0f5f56'], makkah: ['#f8e9e9', '#7a1d1d'] };

function tHari(i){ const d = new Date(J.berlepas+'T00:00:00'); d.setDate(d.getDate()+i); return d; }
const tTarikh = d => `${['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'][d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]}`;
/* Hari ke berapa sekarang: -1 sebelum berlepas, TENTATIF.length selepas pulang */
function tKini(){ const t = new Date(); t.setHours(0,0,0,0); return Math.round((t - new Date(J.berlepas+'T00:00:00'))/86400000); }

function tentatifKad(){
  const k = tKini(), n = TENTATIF.length;
  if(k >= n) return '';
  const i = Math.max(0, k), h = TENTATIF[i], c = TCOL[h.loc];
  const label = k < 0 ? 'Hari pertama' : 'Hari ini';
  return `<a class="tkad" href="#jadual">
    <div class="tkad-hd"><span>${ic('map')}Jadual perjalanan</span><span class="pill" style="background:${c[0]};color:${c[1]}">${label} · Hari ${i+1}</span></div>
    <b>${esc(h.tempat)}</b><div class="small muted">${tTarikh(tHari(i))}</div>
    <div class="tkad-list">${h.a.slice(0,2).map(x=>`<div><em>${x[0]}</em><span>${esc(x[1])}</span></div>`).join('')}</div>
    <div class="tng-go">Lihat jadual ${n} hari${ic('chev')}</div>
  </a>`;
}
function vJadual(){
  const k = tKini(), n = TENTATIF.length;
  const buka = k < 0 ? 0 : Math.min(k, n-1);
  const share = ['Jadual perjalanan umrah saya bersama Juara Travel (tentatif)', `${J.pakej}, ${tarikh(J.berlepas)} hingga ${tarikh(J.pulang)}`, '']
    .concat(TENTATIF.map((h,i)=>`Hari ${i+1}, ${tTarikh(tHari(i))}: ${h.tempat}`)).join('\n');
  return bar('utama', 'Utama') + `
  <main class="stack">
    <div><div class="jtags"><div class="h1">Jadual perjalanan</div><span class="ct">Tentatif</span></div>
      <div class="muted small" style="margin-top:4px">${esc(J.pakej)} · ${tarikh(J.berlepas)} hingga ${tarikh(J.pulang)}</div></div>
    <div class="tleg">${[['kl','Malaysia'],['madinah','Madinah'],['makkah','Makkah']].map(([l,t])=>`<span><i style="background:${TCOL[l][1]}"></i>${t}</span>`).join('')}</div>
    ${TENTATIF.map((h,i)=>{ const c = TCOL[h.loc], st = k > i ? 'lepas' : (k === i ? 'kini' : '');
      return `<details class="tday ${st}" ${i===buka?'open':''}>
        <summary><div class="tday-no" style="background:${c[0]};color:${c[1]}"><small>Hari</small>${i+1}</div>
          <div style="flex:1;min-width:0"><b>${esc(h.tempat)}</b><span>${tTarikh(tHari(i))} · ${st==='kini'?'<em>Hari ini</em>':(st==='lepas'?'Selesai':esc(h.s))}</span></div>${ic('chev')}</summary>
        <div class="tday-bd">${h.a.map(x=>`<div class="tact"><em>${x[0]}</em><span>${esc(x[1])}</span></div>`).join('')}
          ${h.nota?`<div class="tip">${ic('alert')}${esc(h.nota)}</div>`:''}</div>
      </details>`; }).join('')}
    <div class="note">${ic('alert')}<div>Jadual ini tentatif dan contoh. Masa boleh berubah ikut keadaan. Mutawwif akan maklumkan perubahan dalam kumpulan WhatsApp.</div></div>
    <div class="btns">
      <a class="btn" href="https://wa.me/?text=${encodeURIComponent(share)}" target="_blank" rel="noopener">${ic('chat')}Kongsi dengan keluarga</a>
      <a class="btn sec" href="#ziarah">${ic('map')}Sejarah tempat ziarah</a>
    </div>
  </main>`;
}
