'use strict';
/* Apps Juara Travel (revamp Fasa 1).
   Tetamu: pakej, seat, butiran, tempah (WhatsApp), kursus, cawangan, waktu solat.
   Jemaah: log masuk belum dibuka; "Paparan contoh" menunjukkan rupa skrin jemaah dengan data contoh bertanda. */

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rm = n => n == null ? '–' : 'RM' + Number(n).toLocaleString('en-MY');
const BLN = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
const BLN_P = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
const HARI = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
const tkh = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const fTkh = (s, tahun) => { const t = tkh(s); return `${t.getUTCDate()} ${BLN[t.getUTCMonth()]}${tahun ? ' ' + t.getUTCFullYear() : ''}`; };
const fHari = s => HARI[tkh(s).getUTCDay()];
const fBulan = ym => { const [y, m] = ym.split('-').map(Number); return `${BLN_P[m - 1]} ${y}`; };
const hariIni = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const wa = t => `https://wa.me/${JT.waJuara}?text=${encodeURIComponent(t)}`;
const store = {
  get(k, d) { try { const v = localStorage.getItem('jt.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('jt.' + k, JSON.stringify(v)); } catch (e) { /* storan tidak tersedia */ } }
};

/* Ikon garis (stroke 1.75) */
const IKON = {
  rumah: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  cari: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  buku: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  orang: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  kalendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  dompet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  telefon: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  kembali: '<path d="m15 6-6 6 6 6"/>',
  kongsi: '<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>',
  betul: '<path d="m5 12 5 5 9-10"/>',
  loceng: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  bulan: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  kapal: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  bintang: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  kanan: '<path d="m9 6 6 6-6 6"/>',
  main: '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>',
  katil: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IKON[n] || ''}</svg>`;

/* ===== Keadaan ===== */
const S = {
  data: null, sumber: '', ralat: '', dimuat: 0,
  f: { bulan: '', bajet: '', kat: 'Semua', seat: true, orang: 1 },
  pilih: {}, bilik: {}, bil: {}, semua: {},
  demo: store.get('demo', false),
  lokasi: store.get('lokasi', 'kl'),
  tempahSiap: null,
  user: null, authSedia: false, saya: null, sayaRalat: '', sayaMuat: false
};

async function muat() {
  const api = (JT.apiJuara || '').replace(/\/$/, '');
  if (api) {
    try {
      const r = await fetch(api + '/pakej', { headers: { Accept: 'application/json' } });
      const j = await r.json();
      if (!r.ok || !j.data) throw new Error(j.ralat || 'Ralat');
      S.data = j.data; S.sumber = 'langsung'; S.ralat = '';
    } catch (e) {
      if (typeof PAKEJ_SEBENAR !== 'undefined') { S.data = PAKEJ_SEBENAR; S.sumber = 'simpanan'; }
      else S.ralat = 'Sistem Juara tidak dapat dihubungi. Cuba lagi sebentar.';
    }
  } else if (typeof PAKEJ_SEBENAR !== 'undefined') { S.data = PAKEJ_SEBENAR; S.sumber = 'simpanan'; }
  else S.ralat = 'Data pakej belum tersedia.';
  S.dimuat = Date.now();
  render(false);
}

/* ===== Data pakej ===== */
function pakejAktif() {
  if (!S.data) return [];
  const h = hariIni();
  return S.data.pakej.map(p => ({ ...p, tarikh: p.tarikh.filter(t => t.d >= h) })).filter(p => p.tarikh.length);
}
const semuaTarikh = () => pakejAktif().flatMap(p => p.tarikh.map(t => ({ p, t }))).sort((a, b) => a.t.d.localeCompare(b.t.d) || b.t.k - a.t.k);
const senaraiBulan = () => [...new Set(semuaTarikh().map(x => x.t.d.slice(0, 7)))].sort();
const senaraiKat = () => {
  const ada = new Set(pakejAktif().map(p => p.kat));
  const k = ['Ekonomi', 'Menara Jam', 'Plus Turki', 'Ramadhan', 'Syaaban', 'Syawal', 'Umrah'].filter(x => ada.has(x));
  if (pakejAktif().some(p => p.tarikh.some(t => t.cuti))) k.splice(1, 0, 'Cuti sekolah');
  return ['Semua', ...k];
};
const BAJET = [['', 'Semua bajet'], ['6000', 'Bawah RM6,000'], ['8000', 'Bawah RM8,000'], ['10000', 'Bawah RM10,000'], ['15000', 'Bawah RM15,000']];
function tapis(f) {
  return pakejAktif().map(p => ({
    ...p,
    tarikh: p.tarikh.filter(t => (!f.bulan || t.d.slice(0, 7) === f.bulan) && (!f.bajet || t.harga <= +f.bajet) && (!f.seat || t.k >= Math.max(1, +f.orang || 1)) && (f.kat !== 'Cuti sekolah' || t.cuti))
  })).filter(p => p.tarikh.length && (f.kat === 'Semua' || f.kat === 'Cuti sekolah' || p.kat === f.kat));
}
// Satu tarikh boleh ada beberapa kumpulan (kod berbeza). Kira dan papar ikut tarikh, bukan ikut kumpulan.
const bilTarikh = senarai => senarai.reduce((a, p) => a + new Set(p.tarikh.map(t => t.d)).size, 0);
const orangCari = () => Math.max(1, +S.f.orang || 1);
function ikutTarikh(tarikh) {
  const m = new Map();
  for (const t of tarikh) { if (!m.has(t.d)) m.set(t.d, []); m.get(t.d).push(t); }
  return [...m.values()];
}
// Kumpulan terbaik untuk n jemaah: yang muat dahulu, kemudian paling banyak baki
const terbaik = (kumpulan, n) => [...kumpulan].sort((a, b) => ((b.k >= n) - (a.k >= n)) || b.k - a.k)[0];
const ORANG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pilihOrang = (nama, nilai, maks = 10, data = '') => `<select class="input" ${nama}${data}>${ORANG.filter(n => n <= Math.max(1, maks)).map(n => `<option value="${n}"${nilai === n ? ' selected' : ''}>${n} orang</option>`).join('')}</select>`;
function seatTeks(k) { return k <= 0 ? ['Penuh', 'seat-penuh'] : [`Baki ${k} kerusi`, k <= 5 ? 'seat-sikit' : 'seat-ok']; }
const jarak = h => { const j = ((h && h.b) || []).find(x => /±/.test(x)); return j ? ' ' + j : ''; };
const BILIK = [['quad', 'Quad', 4], ['triple', 'Triple', 3], ['double', 'Double', 2], ['quint', 'Quint', 5]];

/* Gambar: kod ikut brief gambar. Jika JT.gambar ada fail, papar gambar sebenar. */
function kodPakej(p) {
  const n = (p.nama || '').toLowerCase();
  // Setiap pakej dapat foto jemaah yang berbeza (JT.poolPakej), ikut susunan id pakej yang tetap
  const poolJ = (JT.poolPakej || []).filter(gbAda);
  if (poolJ.length && S.data && p.id) {
    if (!kodPakej.susun || kodPakej.data !== S.data) { kodPakej.data = S.data; kodPakej.susun = S.data.pakej.map(x => x.id).sort(); }
    const i = kodPakej.susun.indexOf(p.id);
    if (i >= 0) return [poolJ[i % poolJ.length], p.kat || 'Umrah'];
  }
  const khas = ({ 'Menara Jam': ['PK-02', 'Menara Jam'], 'Plus Turki': ['PK-03', 'Plus Turki'], 'Ramadhan': ['PK-04', 'Ramadhan'], 'Syawal': ['PK-05', 'Syawal'], 'Syaaban': ['PK-05', 'Syaaban'] })[p.kat];
  if (khas) return khas;
  // Pakej umum: gambar suasana Haram/Nabawi bergilir supaya senarai tidak berulang
  const pool = ['PK-01', 'PK-01b', 'PK-01c', 'PK-01d'];
  let h = 0; for (const c of (p.id || n)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return [pool[h % pool.length], 'Umrah'];
}
const gbAda = kod => !!(JT.gambar && JT.gambar[kod]);
const LABEL_IT = { 'JR-kaabah-siang': 'Masjidil Haram', 'JR-kaabah-malam': 'Masjidil Haram, malam', 'JR-nabawi-payung': 'Masjid Nabawi', 'JR-tren': 'Tren Haramain', 'JR-ziarah-makkah': 'Ziarah Makkah', 'JR-kumpulan-quba': 'Masjid Quba', 'IT-03': 'Masjid Nabawi', 'IT-09': 'Masjidil Haram', 'IT-15': 'Taif', 'IT-16': 'Badar', 'IT-17': 'Jeddah', 'IT-18': 'Kereta api Haramain', 'IT-20': 'Istanbul', 'IT-05': 'Masjid Quba', 'IT-06': 'Jabal Uhud' };
// Gambar galeri pakej: hanya gambar yang benar-benar ada, ikut destinasi dalam nama pakej
function galeriPakej(p, sel) {
  const n = p.nama.toLowerCase(), kod = [kodPakej(p)[0]];
  if (/taif/.test(n)) kod.push('IT-15');
  if (/badar/.test(n)) kod.push('IT-16');
  if (/train/.test(n)) kod.push('JR-tren');
  if (/turki|istanbul/.test(p.kat.toLowerCase() + n)) kod.push('IT-20');
  const s = x => slug(x && x.nama);
  if (sel.makkah) kod.push(`HT-${s(sel.makkah)}-1`);
  kod.push('JR-kaabah-siang', 'JR-nabawi-payung');
  if (sel.madinah) kod.push(`HT-${s(sel.madinah)}-1`);
  kod.push('JR-kumpulan-quba', 'JR-kaabah-malam', 'IT-05', 'IT-06');
  return [...new Set(kod)].filter(gbAda).slice(0, 5);
}
function gb(kod, label, kelas = 'r169', alt = '') {
  const src = JT.gambar && JT.gambar[kod];
  if (src) return `<div class="gb ${kelas}"><img src="${esc(src)}" alt="${esc(alt || label)}" loading="lazy"></div>`;
  return `<div class="gb ${kelas}" aria-hidden="true">${esc(kod)}${label ? ' · ' + esc(label) : ''}</div>`;
}

function sumberTeks() {
  if (!S.data) return '';
  const d = new Date(S.data.dikemas);
  const masa = `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}, ${d.toLocaleTimeString('ms-MY', { hour: 'numeric', minute: '2-digit' })}`;
  return S.sumber === 'langsung'
    ? `Harga dan seat terus dari sistem tempahan Juara. Dikemas kini ${masa}.`
    : `Salinan data pada ${masa}. Sahkan seat dengan kami sebelum tempah.`;
}

/* Video jemaah (dimampatkan dari folder RAW - UMRAH). Tajuk neutral sehingga audio disemak staf. */
const VIDEO_JEMAAH = [
  { src: 'video/cerita-jemaah-1.mp4', poster: 'JR-cerita-poster', masa: '0:41', tajuk: 'Jemaah Juara berkongsi' },
  { src: 'video/suasana-madinah.mp4', poster: 'JR-madinah-poster', masa: '0:10', tajuk: 'Suasana di Madinah' }
];
function mainVideo(i) {
  const v = VIDEO_JEMAAH[i]; if (!v) return;
  const d = document.createElement('dialog'); d.className = 'dialog-video';
  d.innerHTML = `<video src="${esc(v.src)}" controls autoplay playsinline poster="${esc(JT.gambar[v.poster] || '')}"></video><button type="button" class="btn garis kecil" data-tutup>Tutup</button>`;
  document.body.appendChild(d);
  const tutup = () => { d.querySelector('video').pause(); d.close(); d.remove(); };
  d.addEventListener('click', e => { if (e.target === d || e.target.hasAttribute('data-tutup')) tutup(); });
  d.addEventListener('cancel', e => { e.preventDefault(); tutup(); });
  d.showModal();
}

/* ===== Komponen ===== */
function kadPakej(p) {
  const [kod, lbl] = kodPakej(p), n = orangCari();
  // Tarikh paling awal yang muat untuk bilangan jemaah dicari menjadi wakil kad
  const tarikhK = ikutTarikh(p.tarikh), wakil = tarikhK.find(g => g.some(t => t.k >= n)) || tarikhK[0];
  const t0 = terbaik(wakil, n), kumpulanT0 = wakil.filter(t => t.k > 0).length;
  const hargaMin = Math.min(...p.tarikh.map(t => t.harga));
  const bilik = BILIK.filter(([k]) => t0.bilik && t0.bilik[k]).slice(0, 3);
  const lain = tarikhK.length - 1;
  const [st, sc] = seatTeks(t0.k);
  return `<article class="kad pk">
    <a class="pk-gambar" href="#/pakej/${esc(p.id)}" tabindex="-1" aria-hidden="true">${gb(kod, lbl)}${t0.k > 0 && t0.k <= 5 ? `<span class="lencana amber pk-lencana">${st}</span>` : ''}</a>
    <div class="isi">
      <span class="kat">${esc(p.kat)}${p.tarikh.some(t => t.cuti) ? ' · Cuti sekolah' : ''}</span>
      <a class="nama" href="#/pakej/${esc(p.id)}">${esc(p.nama)}</a>
      <ul class="ciri">
        <li>${ic('kalendar')}<span><b>${fTkh(t0.d)} – ${fTkh(t0.p, 1)}</b>${kumpulanT0 > 1 ? ` <span class="redup">· ${kumpulanT0} kumpulan</span>` : ''}${lain > 0 ? ` <span class="redup">· +${lain} tarikh lain</span>` : ''}</span></li>
        <li>${ic('kapal')}<span>${esc([t0.syarikat, p.hari].filter(Boolean).join(' · '))}${t0.laluan ? ` <span class="redup">· ${esc(t0.laluan)}</span>` : ''}</span></li>
        ${t0.makkah ? `<li>${ic('katil')}<span>${esc(t0.makkah.nama)}<span class="redup">${esc(jarak(t0.makkah))} ke Haram</span></span></li>` : ''}
      </ul>
      ${bilik.length ? `<div class="harga-bilik">${bilik.map(([k, n]) => `<span><span class="redup">${n}</span><b class="num">${rm(t0.bilik[k])}</b></span>`).join('')}</div>` : ''}
      <div class="harga">
        <span><span class="kecil redup">Dari, seorang</span><br><b class="num">${rm(hargaMin)}</b></span>
        <span class="kecil ${sc}" style="text-align:right">${t0.k > 5 ? st : ''}</span>
      </div>
      <div class="pk-butang">
        <a class="btn garis kecil" href="#/pakej/${esc(p.id)}">Butiran</a>
        ${t0.k > 0 ? `<a class="btn kecil" href="#/tempah/${esc(p.id)}/${esc(t0.kod)}" data-aksi="pilih-dari-senarai" data-id="${esc(p.id)}" data-kod="${esc(t0.kod)}">Tempah</a>` : `<span class="btn kecil" aria-disabled="true" style="opacity:.5">Penuh</span>`}
      </div>
    </div>
  </article>`;
}
function barisRingkas({ p, t, bil = 1 }) {
  const [kod] = kodPakej(p), [s0, c0] = seatTeks(t.k);
  const s = bil > 1 ? `${bil} kumpulan tersedia` : s0, c = bil > 1 ? 'seat-ok' : c0;
  return `<a class="kad ringkas" href="#/pakej/${esc(p.id)}" data-aksi="pilih-dari-senarai" data-id="${esc(p.id)}" data-kod="${esc(t.kod)}">
    ${gb(kod, '', '')}
    <span class="t">
      <span class="kecil redup">${fHari(t.d)}, ${fTkh(t.d)} · ${esc(p.hari)}</span>
      <b>${esc(p.nama)}</b>
      <span style="margin-top:auto;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap"><b class="num">${rm(t.harga)}</b><span class="kecil ${c}">${s}</span></span>
    </span>
  </a>`;
}
function kadSolat() {
  const loc = PRESET[S.lokasi] || PRESET.kl, np = nextPrayer(loc);
  if (!np) return '';
  return `<a class="solat-kad" href="#/solat"><span style="display:flex;flex-direction:column"><span>Solat seterusnya · ${esc(loc.n)}</span><b style="font-size:18px">${np.n} ${fmtWaktu(np.at, loc)}</b></span><span>dalam ${lagiMasa(np.at - Date.now())}</span></a>`;
}
const rangka = (n, h) => Array.from({ length: n }, () => `<div class="rangka" style="height:${h}px"></div>`).join('');
function kosong(kod, label, tajuk, teks, butang) {
  return `<div class="kad kosong">${gb(kod, label, '')}<h2>${tajuk}</h2><p class="redup" style="max-width:420px">${teks}</p>${butang || ''}</div>`;
}

/* Akses pantas (ikon besar, mesra warga emas) */
const aksesPantas = (senarai) => `<nav class="akses-pantas" aria-label="Akses pantas">${senarai.map(([h, n, i]) => `<a href="#/${h}"><span class="ikon-akses">${ic(i)}</span><span>${n}</span></a>`).join('')}</nav>`;
const AKSES_AKAUN = () => `<div class="senarai-pautan">${[['dokumen', 'Dokumen umrah (pasport, gambar, vaksin)', 'buku'], ['bayaran', 'Bayaran dan resit', 'dompet'], ['persediaan', 'Persediaan', 'buku'], ['mata', 'Mata Juara dan kod rujukan', 'bintang'], ['cawangan', 'Cawangan Juara', 'pin'], ['pakej', 'Pakej umrah', 'cari']].map(([h, n, i]) => `<a class="kad pad" href="#/${h}">${ic(i)}<span>${n}</span>${ic('kanan')}</a>`).join('')}</div>`;
const corak = '<div class="corak" aria-hidden="true"></div>';

/* ===== Skrin tetamu ===== */
function vUtama() {
  if (!S.data) return S.ralat ? kosong('IL-09', 'Ralat sistem', 'Tidak dapat memuat pakej', esc(S.ralat), `<button class="btn" type="button" data-aksi="muat-semula">Cuba lagi</button>`) : rangka(1, 220) + rangka(4, 110);
  const f = S.f, bil = bilTarikh(tapis({ ...f, kat: 'Semua' }));
  const n = orangCari(), lihatD = new Map();
  for (const x of semuaTarikh()) { if (x.t.k <= 0) continue; const k = x.p.id + x.t.d; if (!lihatD.has(k)) lihatD.set(k, { ...x, bil: 0 }); const o = lihatD.get(k); o.bil++; if (x.t.k >= n && o.t.k < n) o.t = x.t; }
  const dekat = [...lihatD.values()].filter(x => x.t.k >= n).slice(0, 4);
  const kat = senaraiKat().filter(k => k !== 'Semua' && k !== 'Cuti sekolah').slice(0, 4).map(k => {
    const ps = pakejAktif().filter(p => p.kat === k), min = Math.min(...ps.flatMap(p => p.tarikh.map(t => t.harga)));
    const [kod, lbl] = kodPakej(ps[0]);
    return `<a href="#/pakej" data-aksi="kat" data-nilai="${esc(k)}" style="display:flex;flex-direction:column;gap:8px;color:var(--dakwat)">${gb(kod, lbl, 'r43')}<span><b>${esc(k)}</b><br><span class="kecil redup">Dari ${rm(min)}</span></span></a>`;
  }).join('');
  return `
  <section class="banner">
    <div class="banner-teks"><h1>Juara<br>Pilihan Kami</h1><p>25 tahun membawa tetamu Allah ke Tanah Suci</p><a class="btn putih" href="#/pakej">Lihat pakej ${ic('kanan')}</a></div>
    <figure class="banner-gambar">${gb('JR-kaabah-malam', '', '', 'Kaabah pada waktu malam')}</figure>
    ${corak}
  </section>
  ${aksesPantas([['pakej', 'Pakej', 'cari'], ['kursus', 'Kursus', 'buku'], ['cawangan', 'Cawangan', 'pin'], ['mata', 'Mata Juara', 'bintang']])}

  <section class="hero">
    <div class="stack" style="gap:16px">
      <h2 style="font-size:1.5rem">Cari tarikh umrah yang sesuai dengan anda</h2>
      <p class="redup kecil">${esc(sumberTeks())}</p>
      <form class="kad pad carian" data-borang="cari">
        <label class="medan">Bulan berlepas<select class="input" data-f="bulan"><option value="">Semua bulan</option>${senaraiBulan().map(b => `<option value="${b}"${f.bulan === b ? ' selected' : ''}>${fBulan(b)}</option>`).join('')}</select></label>
        <label class="medan">Berapa orang?${pilihOrang('data-f="orang"', n)}</label>
        <label class="medan">Bajet seorang<select class="input" data-f="bajet">${BAJET.map(([v, n]) => `<option value="${v}"${f.bajet === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
        <button class="btn" type="submit">Lihat ${bil} tarikh yang sesuai</button>
      </form>
      <div class="cips" role="group" aria-label="Jenis pakej">${senaraiKat().slice(1).map(k => `<button type="button" class="cip" data-aksi="kat" data-nilai="${esc(k)}">${esc(k)}</button>`).join('')}</div>
    </div>
    <div>
      <div class="tajuk-seksyen"><h2>Berlepas tidak lama lagi</h2><a href="#/pakej">Semua</a></div>
      <div class="stack">${dekat.map(barisRingkas).join('') || `<p class="redup">Tiada tarikh terdekat yang muat untuk ${n} orang.</p>`}</div>
    </div>
  </section>

  <section class="jemaah-juara">
    <figure class="jj-utama">${gb('JR-melambai', '', '', 'Jemaah Juara melambai ke kamera')}</figure>
    <div class="stack" style="gap:12px">
      <img src="gambar/BR/25-tahun.webp" alt="25 tahun berpengalaman" class="lencana-25" width="200">
      <h2>Bersama jemaah Juara</h2>
      <p class="redup">Petugas Juara bersama anda dari kaunter KLIA hingga pulang. Setiap kumpulan dibimbing mutawwif dan petugas lapangan sepanjang di Tanah Suci.</p>
      <div class="jj-kecil">${gb('JR-kumpulan-quba', '', '', 'Kumpulan jemaah Juara di Masjid Quba')}${gb('JR-ziarah-makkah', '', '', 'Ziarah Makkah bersama Juara')}${gb('JR-04', '', '', 'Petugas lapangan Juara')}</div>
    </div>
  </section>

  <section>
    <div class="tajuk-seksyen"><h2>Ikut jenis pakej</h2></div>
    <div class="grid-2 lebar">${kat}</div>
  </section>

  <section class="stack">
    <div class="tajuk-seksyen"><h2>Cerita jemaah Juara</h2></div>
    <div class="video-jemaah">
      ${VIDEO_JEMAAH.map((v, i) => `<button type="button" class="kad-video" data-aksi="main-video" data-nilai="${i}" aria-label="Main video: ${esc(v.tajuk)}">${gb(v.poster, '', '', v.tajuk)}<span class="main">${ic('main')}</span><span class="durasi">${v.masa}</span><span class="tajuk-video">${esc(v.tajuk)}</span></button>`).join('')}
    </div>
  </section>

  <section class="grid-pakej">
    <div class="kad pad stack">
      <h2>Kursus umrah percuma</h2>
      <p class="redup">Terbuka kepada semua, walaupun anda belum tempah pakej.</p>
      <a class="btn garis" href="#/kursus">Lihat jadual kursus</a>
    </div>
    <div class="kad pad stack">
      <h2>Sebelum anda tempah</h2>
      <div class="baris"><span class="redup">Deposit</span><b>${rm(JT.depositSeorang)} seorang</b></div>
      ${JT.lesenKPK ? `<div class="baris"><span class="redup">Lesen KPK</span><b>${esc(JT.lesenKPK)}</b></div>` : ''}
      <div class="baris"><span class="redup">Harga & seat</span><b>Terus dari sistem Juara</b></div>
      <a class="btn garis" href="${wa('Assalamualaikum Juara Travel. Saya ingin bertanya tentang pakej umrah.')}" target="_blank" rel="noopener">${ic('telefon')}Tanya melalui WhatsApp</a>
    </div>
    <div class="stack"><a class="kad pad kad-mata" href="#/mata" style="display:flex;flex-direction:column;gap:2px"><b>Mata Juara</b><span class="kecil" style="opacity:.85">Kumpul mata setiap trip dan rujukan. Tebus untuk pakej seterusnya.</span></a><a class="kad pad" href="#/cawangan" style="color:var(--dakwat);display:flex;gap:12px;align-items:center">${ic('pin')}<span><b>Cawangan Juara</b><br><span class="kecil redup">Alamat, waktu buka dan arah</span></span></a></div>
  </section>`;
}

function vPakej() {
  if (!S.data) return S.ralat ? kosong('IL-09', 'Ralat sistem', 'Tidak dapat memuat pakej', esc(S.ralat), `<button class="btn" type="button" data-aksi="muat-semula">Cuba lagi</button>`) : rangka(3, 380);
  const f = S.f, hasil = tapis(f);
  return `
  <div class="stack" style="gap:16px">
    <h1>Pakej umrah</h1>
    <div class="carian" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
      <label class="medan">Bulan berlepas<select class="input" data-f="bulan"><option value="">Semua bulan</option>${senaraiBulan().map(b => `<option value="${b}"${f.bulan === b ? ' selected' : ''}>${fBulan(b)}</option>`).join('')}</select></label>
      <label class="medan">Berapa orang?${pilihOrang('data-f="orang"', orangCari())}</label>
      <label class="medan">Bajet seorang<select class="input" data-f="bajet">${BAJET.map(([v, n]) => `<option value="${v}"${f.bajet === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
    </div>
    <div class="cips" role="group" aria-label="Jenis pakej">${senaraiKat().map(k => `<button type="button" class="cip" aria-pressed="${f.kat === k}" data-aksi="kat" data-nilai="${esc(k)}">${esc(k)}</button>`).join('')}</div>
    <div class="baris kecil redup" style="flex-wrap:wrap">
      <span>${bilTarikh(hasil)} tarikh dalam ${hasil.length} pakej</span>
      <button type="button" class="cip" aria-pressed="${f.seat}" data-aksi="seat">${orangCari() > 1 ? `Muat ${orangCari()} orang` : 'Ada seat sahaja'}</button>
    </div>
    <p class="kecil redup">${esc(sumberTeks())}</p>
  </div>
  ${hasil.length ? `<div class="grid-pakej">${hasil.map(kadPakej).join('')}</div>`
    : kosong('IL-07', 'Tiada hasil', orangCari() > 1 ? `Tiada tarikh yang muat ${orangCari()} orang` : 'Tiada tarikh yang sepadan', orangCari() > 1 ? 'Kumpulan sebelah mungkin masih ada tempat, atau staf kami boleh susun tarikh lain untuk keluarga anda.' : 'Cuba bulan lain atau bajet yang lebih tinggi.',
      `<div class="grid-2">${f.bulan ? '<button class="btn garis" type="button" data-aksi="bulan-lain">Lihat bulan lain</button>' : '<button class="btn garis" type="button" data-aksi="set-semula">Papar semua pakej</button>'}<a class="btn" href="${wa(`Assalamualaikum Juara Travel. Saya cari tarikh umrah untuk ${orangCari()} orang${f.bulan ? ' pada ' + fBulan(f.bulan) : ''}.`)}" target="_blank" rel="noopener">Tanya Juara</a></div>`)}`;
}

function cariPakej(id) { return S.data && S.data.pakej.find(p => p.id === id); }
function vButiran(id) {
  if (!S.data) return rangka(1, 260) + rangka(3, 120);
  const asal = cariPakej(id), h = hariIni();
  const p = asal && { ...asal, tarikh: asal.tarikh.filter(t => t.d >= h) };
  if (!p || !p.tarikh.length) return kosong('IL-07', 'Tiada pakej', 'Pakej ini tiada tarikh akan datang', 'Tarikh mungkin sudah penuh atau tamat. Lihat pakej lain.', `<a class="btn" href="#/pakej">Lihat semua pakej</a>`);
  const nCari = S.bil[id] || orangCari();
  const sel = p.tarikh.find(t => t.kod === S.pilih[id]) || terbaik((ikutTarikh(p.tarikh).find(g => g.some(t => t.k >= nCari)) || [p.tarikh[0]]), nCari);
  const kumpulanSel = p.tarikh.filter(t => t.d === sel.d);
  S.pilih[id] = sel.kod;
  const [kod, lbl] = kodPakej(p);
  const mk = sel.makkah, md = sel.madinah, sm = slug(mk && mk.nama), sd = slug(md && md.nama);
  const bilikAda = BILIK.filter(([k]) => sel.bilik && sel.bilik[k]);
  const bk = bilikAda.find(([k]) => k === S.bilik[id]) || bilikAda[0];
  const bil = Math.min(nCari, Math.max(1, sel.k));
  const hargaBilik = bk ? sel.bilik[bk[0]] : sel.harga;
  // Gambar hotel sebenar jika ada (HT-<slug>-1..3). Jika tiada, gambar kawasan masjid dilabel jelas, bukan gambar hotel.
  const hotelKad = (bandar, ho, s, masjid) => {
    if (!ho) return '';
    const ada = gbAda(`HT-${s}-1`), lebih = gbAda(`HT-${s}-2`);
    const kawasan = bandar === 'Makkah' ? 'IT-09' : 'IT-03';
    const peta = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ho.nama} hotel ${bandar}`)}`;
    const gambar = ada
      ? (lebih ? `<div class="gambar3">${gb(`HT-${s}-1`, 'Fasad', '', ho.nama)}<div>${gb(`HT-${s}-2`, 'Bilik', '', `Bilik ${ho.nama}`)}${gbAda(`HT-${s}-3`) ? gb(`HT-${s}-3`, `Laluan ke ${masjid}`, '') : ''}</div></div>`
        : `<figure class="hotel-gb">${gb(`HT-${s}-1`, '', '', ho.nama)}</figure>`)
      : gbAda(kawasan) ? `<figure class="hotel-gb">${gb(kawasan, '', '', `Kawasan ${masjid}`)}<figcaption>Kawasan ${masjid === 'Haram' ? 'Masjidil Haram' : 'Masjid Nabawi'}</figcaption></figure>` : '';
    return `<div class="kad hotel" style="overflow:hidden">${gambar}
      <div class="pad" style="display:flex;flex-direction:column;gap:2px"><span class="kecil redup">${bandar}</span><b>${esc(ho.nama)}</b><span class="kecil" style="color:var(--dakwat2)">${esc((ho.b || []).join(' · '))}</span>
      <a class="kecil" href="${esc(peta)}" target="_blank" rel="noopener" style="font-weight:600;margin-top:6px">Lihat hotel di peta</a></div>
    </div>`;
  };
  const penuh = sel.k <= 0;
  const ringkasan = `
    <div class="kad ringkasan">
      <div><span class="kecil redup">Seorang, bilik ${bk ? bk[1].toLowerCase() : ''}</span><br><b class="num" style="font-size:30px;line-height:1.1">${rm(hargaBilik)}</b></div>
      <label class="medan">Bilik<select class="input" data-pilih="bilik" data-id="${esc(id)}">${bilikAda.map(([k, n, o]) => `<option value="${k}"${bk && bk[0] === k ? ' selected' : ''}>${n} (${o} orang sebilik) · ${rm(sel.bilik[k])}</option>`).join('')}</select></label>
      <label class="medan">Bilangan jemaah${pilihOrang('data-pilih="bil"', bil, sel.k, ` data-id="${esc(id)}"`)}</label>
      ${nCari > sel.k && sel.k > 0 ? `<p class="kecil seat-sikit" style="margin:-6px 0 0">Kumpulan ini berbaki ${sel.k} tempat sahaja. Pilih tarikh lain untuk ${nCari} orang.</p>` : ''}
      <div class="baris" style="border-top:1px solid var(--garis);padding-top:12px"><span>Jumlah anggaran</span><b class="num">${rm(hargaBilik * bil)}</b></div>
      <div class="baris kecil redup" style="margin-top:-8px"><span>Deposit</span><span class="num">${rm(JT.depositSeorang * bil)}</span></div>
      ${penuh ? `<button class="btn penuh" type="button" disabled>Tarikh ini penuh</button>` : `<a class="btn penuh" href="#/tempah/${esc(id)}/${esc(sel.kod)}">Tempah ${fTkh(sel.d)}</a>`}
      <a class="btn garis penuh" href="${wa(`Assalamualaikum Juara Travel. Saya ingin bertanya tentang ${p.nama}, berlepas ${fTkh(sel.d, 1)} (${sel.kod}).`)}" target="_blank" rel="noopener">Tanya melalui WhatsApp</a>
    </div>`;
  return `
  <a href="#/pakej" class="kecil" style="font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-bottom:-12px">${ic('kembali')}Semua pakej</a>
  ${(() => { const g = galeriPakej(p, sel); return g.length ? `<div class="galeri n${g.length}">${g.map((k, i) => `<figure class="gal">${gb(k, i ? (LABEL_IT[k] || '') : lbl, 'r169', i ? (LABEL_IT[k] || p.nama) : p.nama)}${i && LABEL_IT[k] ? `<figcaption>${esc(LABEL_IT[k])}</figcaption>` : ''}</figure>`).join('')}</div>` : `<div class="galeri n1"><figure class="gal">${gb(kod, lbl)}</figure></div>`; })()}
  <div class="dua-lajur">
    <div class="kiri">
      <div class="stack" style="gap:6px">
        <span class="kecil redup" style="font-weight:600">${esc(p.kat)}${sel.cuti ? ' · Cuti sekolah' : ''}</span>
        <h1 style="font-size:clamp(1.5rem,3vw,2.2rem)">${esc(p.nama)}</h1>
        <span class="redup">${esc([p.hari, sel.syarikat, sel.laluan].filter(Boolean).join(' · '))}</span>
      </div>
      <ul class="fakta">
        ${mk ? `<li>${ic('katil')}<span><b>${esc(jarak(mk).trim() || 'Makkah')}</b><span class="kecil redup">ke Masjidil Haram · ${esc(mk.nama)}</span></span></li>` : ''}
        ${md ? `<li>${ic('katil')}<span><b>${esc(jarak(md).trim() || 'Madinah')}</b><span class="kecil redup">ke Masjid Nabawi · ${esc(md.nama)}</span></span></li>` : ''}
        ${(mk && mk.b || []).find(x => /sajian/.test(x)) ? `<li>${ic('betul')}<span><b>${esc((mk.b.find(x => /sajian/.test(x))))}</b><span class="kecil redup">${(mk.b || []).includes('menu Malaysia') ? 'menu Malaysia' : 'setiap hari'}</span></span></li>` : ''}
        ${sel.syarikat ? `<li>${ic('kapal')}<span><b>${esc(sel.syarikat)}</b><span class="kecil redup">${esc(sel.laluan || 'penerbangan terus')}</span></span></li>` : ''}
      </ul>
      <section class="stack">
        <h2>Pilih tarikh berlepas</h2>
        ${(() => { const hari = ikutTarikh(p.tarikh), tunjuk = S.semua[id] || hari.length <= 8 ? hari : hari.slice(0, 8).concat(hari.slice(8).filter(g => g[0].d === sel.d));
          return `<div class="tarikh-pilih">${tunjuk.map(g => { const t = terbaik(g, nCari), kosongS = g.every(x => x.k <= 0), muat = g.some(x => x.k >= nCari), maks = Math.max(...g.map(x => x.k));
            const teks = kosongS ? 'Penuh' : g.length > 1 ? `${g.filter(x => x.k > 0).length} kumpulan` : 'Baki ' + maks;
            return `<button type="button" data-aksi="pilih-tarikh" data-id="${esc(id)}" data-kod="${esc(t.kod)}" aria-pressed="${g[0].d === sel.d}"${kosongS ? ' disabled' : ''}><b>${fHari(t.d)}, ${fTkh(t.d)}</b><br><span class="kecil ${kosongS ? 'seat-penuh' : !muat ? 'seat-sikit' : maks <= 5 ? 'seat-sikit' : 'seat-ok'}">${teks}${!kosongS && !muat ? ' · tak muat ' + nCari : ''}</span></button>`; }).join('')}</div>`; })()}
        ${kumpulanSel.length > 1 ? `<div class="stack" style="gap:8px"><span class="kecil" style="font-weight:600">${kumpulanSel.length} kumpulan berlepas ${fTkh(sel.d, 1)}. Pilih kumpulan yang muat untuk anda:</span>${kumpulanSel.map(t => `<button type="button" class="kad pilihan-kumpulan" data-aksi="pilih-kumpulan" data-id="${esc(id)}" data-kod="${esc(t.kod)}" aria-pressed="${t.kod === sel.kod}"${t.k <= 0 ? ' disabled' : ''}><span><b>${esc(t.kod)}</b><span class="kecil redup"> · ${esc([t.syarikat, t.laluan].filter(Boolean).join(' · '))}</span></span><span class="kecil ${t.k <= 0 ? 'seat-penuh' : t.k < nCari ? 'seat-sikit' : 'seat-ok'}">${t.k <= 0 ? 'Penuh' : `Baki ${t.k}${t.k < nCari ? ', tak muat ' + nCari : ''}`}</span></button>`).join('')}</div>` : ''}
        ${!S.semua[id] && ikutTarikh(p.tarikh).length > 8 ? `<button type="button" class="btn garis kecil" data-aksi="semua-tarikh" data-id="${esc(id)}">Lihat semua ${ikutTarikh(p.tarikh).length} tarikh</button>` : ''}
        <span class="kecil redup">Pulang ${fHari(sel.p)}, ${fTkh(sel.p, 1)} · Kod kumpulan ${esc(sel.kod)} · ${sel.isi} daripada ${sel.seat} seat diisi</span>
      </section>
      <section class="stack">
        <h2>Harga seorang ikut bilik</h2>
        <div class="kad jadual-harga">${bilikAda.map(([k, n, o]) => `<div><span>${n} (${o} orang sebilik)</span><b class="num">${rm(sel.bilik[k])}</b></div>`).join('')}</div>
        <span class="kecil redup">Deposit ${rm(JT.depositSeorang)} seorang untuk simpan tempat.</span>
      </section>
      ${mk || md ? `<section class="stack"><h2>Hotel</h2><div class="grid-pakej">${hotelKad('Makkah', mk, sm, 'Haram')}${hotelKad('Madinah', md, sd, 'Nabawi')}</div></section>` : ''}
      <section class="stack">
        <h2>Itinerari</h2>
        <div class="nota">${ic('info')}<span>Itinerari harian bergambar untuk pakej ini sedang disediakan. Tanya kami untuk jadual perjalanan penuh.</span></div>
      </section>
    </div>
    <aside class="kanan" aria-label="Ringkasan tempahan">${ringkasan}</aside>
  </div>
  <div class="bar-tempah">
    <span style="display:flex;flex-direction:column;flex:1"><span class="kecil redup">Seorang, ${fTkh(sel.d)}</span><b class="num" style="font-size:20px">${rm(hargaBilik)}</b></span>
    <a class="btn garis kecil" href="${wa(`Assalamualaikum Juara Travel. Saya ingin bertanya tentang ${p.nama}, berlepas ${fTkh(sel.d, 1)} (${sel.kod}).`)}" target="_blank" rel="noopener" aria-label="Tanya melalui WhatsApp">${ic('telefon')}</a>
    ${penuh ? `<button class="btn kecil" type="button" disabled>Penuh</button>` : `<a class="btn kecil" href="#/tempah/${esc(id)}/${esc(sel.kod)}">Tempah</a>`}
  </div>`;
}

function vTempah(id, kod) {
  if (!S.data) return rangka(1, 400);
  const p = cariPakej(id), t = p && p.tarikh.find(x => x.kod === kod);
  if (!p || !t) return kosong('IL-07', 'Tiada', 'Tarikh tidak dijumpai', 'Pilih semula tarikh dari senarai pakej.', `<a class="btn" href="#/pakej">Senarai pakej</a>`);
  if (S.tempahSiap === kod) return `
    <div class="kad kosong">
      <span class="lencana hijau">${ic('betul')}Mesej disediakan</span>
      <h1 style="font-size:1.6rem">Hantar mesej WhatsApp untuk lengkapkan tempahan</h1>
      <p class="redup" style="max-width:460px">WhatsApp dibuka dengan butiran tempahan anda. Tekan Hantar di WhatsApp. Staf Juara akan semak tempat dan sahkan tempahan selepas deposit diterima.</p>
      <a class="btn" href="${esc(S.tempahWa || '#')}" target="_blank" rel="noopener">Buka WhatsApp semula</a>
      <a href="#/pakej/${esc(id)}">Kembali ke pakej</a>
    </div>`;
  const bilikAda = BILIK.filter(([k]) => t.bilik && t.bilik[k]);
  const bk = S.bilik[id] && t.bilik[S.bilik[id]] ? S.bilik[id] : (bilikAda[0] && bilikAda[0][0]);
  const bil = Math.min(S.bil[id] || orangCari(), Math.max(1, t.k));
  const bkI = BILIK.find(([k]) => k === bk), harga = (t.bilik && t.bilik[bk]) || t.harga;
  const draf = S.draf || {};
  return `
  <a href="#/pakej/${esc(id)}" class="kecil" style="font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-bottom:-12px">${ic('kembali')}Kembali</a>
  <div class="dua-lajur">
    <form class="kiri" data-borang="tempah" data-id="${esc(id)}" data-kod="${esc(kod)}" novalidate>
      <h1 style="font-size:clamp(1.5rem,3vw,2.2rem)">Tempah tarikh ini</h1>
      <div class="kad ringkasan-tempah">
        <div class="stack" style="gap:2px"><b>${esc(p.nama)}</b><span class="redup">${fTkh(t.d)} hingga ${fTkh(t.p, 1)} · ${esc(t.kod)}</span><span class="kecil ${seatTeks(t.k)[1]}">${seatTeks(t.k)[0]}</span></div>
        <div class="grid-2">
          <label class="medan">Bilik<select class="input" name="bilik" data-pilih="bilik" data-id="${esc(id)}">${bilikAda.map(([k, n, o]) => `<option value="${k}"${bk === k ? ' selected' : ''}>${n} (${o} sebilik) · ${rm(t.bilik[k])}</option>`).join('')}</select></label>
          <label class="medan">Bilangan jemaah${pilihOrang('name="bil" data-pilih="bil"', bil, t.k, ` data-id="${esc(id)}"`)}</label>
        </div>
        <div class="jumlah">
          <div class="baris"><span class="redup">${rm(harga)} seorang × ${bil} jemaah${bkI ? ` · ${bkI[2]} orang sebilik` : ''}</span></div>
          <div class="baris"><span>Jumlah anggaran</span><b class="num" style="font-size:22px">${rm(harga * bil)}</b></div>
          <div class="baris"><span>Deposit untuk ${bil} jemaah</span><b class="num">${rm(JT.depositSeorang * bil)}</b></div>
        </div>
        <a class="kecil" href="#/pakej/${esc(id)}" style="font-weight:600">Ubah tarikh atau pakej</a>
      </div>
      <h2 style="margin-top:8px">Maklumat anda</h2>
      <label class="medan">Nama penuh<input class="input" name="nama" autocomplete="name" required value="${esc(draf.nama || '')}"></label>
      <label class="medan">Nombor telefon (WhatsApp)<input class="input" name="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="012-345 6789" required value="${esc(draf.tel || '')}"></label>
      <label class="medan">Kod rujukan (pilihan)<input class="input" name="ruj" autocapitalize="characters" placeholder="Contoh: JT4K9Q2A" value="${esc(draf.ruj || store.get('ruj', ''))}"></label>
      <label class="medan">Nota (pilihan)<textarea class="input" name="nota" placeholder="Contoh: warga emas, perlu kerusi roda">${esc(draf.nota || '')}</textarea></label>
      <p class="kecil redup" id="ralat-tempah" role="alert"></p>
      <p class="nota" style="margin:0">${ic('info')}<span>Staf Juara akan semak tempat dan sahkan tempahan selepas deposit diterima.</span></p>
      <button class="btn penuh" type="submit" name="cara" value="bayar">Bayar deposit ${rm(JT.depositSeorang * bil)}</button>
      <button class="btn garis penuh" type="submit" name="cara" value="wa">Teruskan ke WhatsApp tanpa bayar dahulu</button>
    </form>
  </div>`;
}

const BANK_FPX = ['Maybank2u', 'CIMB Clicks', 'Bank Islam', 'Bank Rakyat', 'RHB Now', 'Public Bank', 'Hong Leong Connect', 'AmBank', 'Affin Bank', 'Bank Muamalat', 'BSN', 'Agrobank'];
function vBayar() {
  const b = S.bayar;
  if (!b) return kosong('IL-07', 'Tiada', 'Tiada bayaran untuk diproses', 'Mulakan dari halaman pakej.', `<a class="btn" href="#/pakej">Senarai pakej</a>`);
  if (b.resit) return vResit(b);
  const k = S.kaedah || 'fpx';
  const kaedahIsi = k === 'fpx' ? `<label class="medan">Pilih bank<select class="input" id="bank-ujian">${BANK_FPX.map(x => `<option>${x}</option>`).join('')}</select></label>`
    : k === 'kad' ? `<div class="nota">${ic('info')}<span>Dalam mod sebenar, anda dibawa ke halaman selamat penyedia pembayaran untuk isi butiran kad. Apps Juara tidak menyimpan nombor kad.</span></div>`
    : `<div class="nota">${ic('info')}<span>Dalam mod sebenar, kod DuitNow QR dipaparkan untuk diimbas dengan Touch 'n Go, Boost, GrabPay atau apps bank.</span></div>`;
  return `
  <div class="stack" style="gap:16px;max-width:560px;margin:0 auto">
    <div class="jalur-ujian">${ic('info')}<span><b>Mod ujian.</b> Ini paparan contoh gerbang pembayaran. Tiada wang sebenar ditolak dan tiada maklumat bank diminta.</span></div>
    <div class="kad pad stack" style="gap:6px">
      <span class="kecil redup">Bayar kepada Juara Travel & Tours Sdn Bhd</span>
      <b class="num" style="font-size:32px">${rm(b.jumlah)}</b>
      <span class="redup">Deposit ${b.bil} jemaah · ${esc(b.pakej)} · ${fTkh(b.d, 1)} (${esc(b.kod)})</span>
    </div>
    <h2>Kaedah bayaran</h2>
    <div class="cips" role="group" aria-label="Kaedah bayaran">${[['fpx', 'FPX perbankan internet'], ['kad', 'Kad debit / kredit'], ['ewallet', 'DuitNow QR / e-Wallet']].map(([v, n]) => `<button type="button" class="cip" aria-pressed="${k === v}" data-aksi="kaedah" data-nilai="${v}">${n}</button>`).join('')}</div>
    ${kaedahIsi}
    <button class="btn penuh" type="button" data-aksi="bayar-ujian"${b.proses ? ' disabled' : ''}>${b.proses ? 'Sedang memproses…' : `Bayar ${rm(b.jumlah)} (ujian)`}</button>
    <a href="#/tempah/${esc(b.id)}/${esc(b.kod)}" style="text-align:center">Kembali ke tempahan</a>
  </div>`;
}
function bayarUjian() {
  const b = S.bayar; if (!b || b.proses) return;
  b.proses = true;
  b.kaedah = S.kaedah === 'kad' ? 'Kad debit / kredit' : S.kaedah === 'ewallet' ? 'DuitNow QR' : 'FPX · ' + (($('bank-ujian') || {}).value || 'Maybank2u');
  render(false);
  setTimeout(() => {
    const d = new Date(Date.now() + 8 * 3600e3);
    b.resit = 'JT' + d.toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    b.masa = new Date().toISOString(); b.proses = false;
    hantarDaftar({ jenis: 'tempah', nama: b.nama, tel: b.tel, bil: b.bil, pakej: b.pakej, tarikh: b.d, kod: b.kod, bilik: b.bilik, nota: [b.nota, `Deposit UJIAN ${rm(b.jumlah)} · ${b.kaedah} · resit ${b.resit}`].filter(Boolean).join(' | '), setuju: true }, true).catch(() => {});
    render();
  }, 1400);
}
function vResit(b) {
  const msg = ['Assalamualaikum Juara Travel. Saya telah membayar deposit (UJIAN):', `No resit: ${b.resit}`, `Jumlah: ${rm(b.jumlah)} (${b.kaedah})`, `Pakej: ${b.pakej}`, `Berlepas: ${fTkh(b.d, 1)} (${b.kod})`, `Bilik: ${b.bilikN} · ${b.bil} orang`, `Nama: ${b.nama}`, `Telefon: ${b.tel}`].join('\n');
  return `
  <div class="stack resit" style="gap:16px;max-width:560px;margin:0 auto">
    <div class="jalur-ujian">${ic('info')}<span><b>Resit ujian.</b> Tiada wang sebenar dibayar.</span></div>
    <div class="kad pad stack" style="gap:14px">
      <span class="lencana hijau" style="align-self:flex-start">${ic('betul')}Bayaran berjaya</span>
      <div><span class="kecil redup">No resit</span><br><b class="num" style="font-size:20px">${esc(b.resit)}</b></div>
      <div class="jadual-harga" style="border:1px solid var(--garis);border-radius:10px">
        <div><span>Pakej</span><b style="text-align:right">${esc(b.pakej)}</b></div>
        <div><span>Berlepas</span><b>${fTkh(b.d, 1)} · ${esc(b.kod)}</b></div>
        <div><span>Bilik</span><b>${esc(b.bilikN)} · ${b.bil} orang</b></div>
        <div><span>Nama</span><b>${esc(b.nama)}</b></div>
        <div><span>Kaedah</span><b>${esc(b.kaedah)}</b></div>
        <div><span>Tarikh bayar</span><b>${new Date(b.masa).toLocaleString('ms-MY', { dateStyle: 'medium', timeStyle: 'short' })}</b></div>
        <div><span>Deposit dibayar</span><b class="num">${rm(b.jumlah)}</b></div>
        <div><span class="redup">Baki anggaran</span><span class="num redup">${rm(b.jumlahPenuh - b.jumlah)}</span></div>
      </div>
      <p class="redup kecil">Staf Juara akan menghubungi anda dalam 1 hari bekerja untuk sahkan tempat dan senarai dokumen.</p>
    </div>
    <div class="grid-2"><button class="btn garis" type="button" data-aksi="cetak">Simpan resit (PDF)</button><a class="btn" href="${esc(wa(msg))}" target="_blank" rel="noopener">${ic('telefon')}Hantar resit ke Juara</a></div>
    <a href="#/pakej" style="text-align:center">Lihat pakej lain</a>
  </div>`;
}

/* Senarai bulan ke hadapan untuk pilihan "bila" */
function bulanDepan(n, mula = 0) {
  const d = new Date(Date.now() + 8 * 3600e3), out = [];
  for (let i = mula; i < mula + n; i++) { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + i, 1)); out.push(x.toISOString().slice(0, 7)); }
  return out;
}
const NOTIS_PDPA = 'Saya bersetuju maklumat ini digunakan oleh Juara Travel untuk menghubungi saya tentang kursus dan pakej umrah, mengikut Akta Perlindungan Data Peribadi 2010.';
async function hantarDaftar(d, keepalive) {
  const api = (JT.apiJuara || '').replace(/\/$/, '');
  if (!api) throw new Error('Pendaftaran belum tersedia dalam paparan ini.');
  const h = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (S.user) { try { h.Authorization = 'Bearer ' + await S.user.getIdToken(); } catch (e) { /* tanpa log masuk */ } }
  const r = await fetch(api + '/daftar', { method: 'POST', headers: h, body: JSON.stringify(d), keepalive: !!keepalive });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.ralat || 'Pendaftaran gagal. Cuba lagi.');
  return j.data;
}
function vKursus() {
  if (S.kursusSiap) {
    const k = S.kursusSiap.kursus;
    return `
    <div class="kad kosong" style="max-width:640px;margin:0 auto;text-align:left;align-items:stretch">
      <span class="lencana hijau" style="align-self:flex-start">${ic('betul')}Pendaftaran diterima</span>
      <h1 style="font-size:1.6rem">Terima kasih, ${esc(S.kursusSiap.nama)}</h1>
      ${k ? `<div class="kad pad stack" style="gap:4px"><b>${fHari(k.tarikh)}, ${fTkh(k.tarikh, 1)} · ${esc(fJam(k.mula))}${k.tamat ? ' hingga ' + esc(fJam(k.tamat)) : ''}</b><span>${esc(k.tempat)}</span>${k.penceramah ? `<span class="kecil redup">Penceramah: ${esc(k.penceramah)}</span>` : ''}</div>
      <div class="grid-2"><a class="btn garis" href="${esc(k.peta)}" target="_blank" rel="noopener">${ic('pin')}Buka peta</a><button class="btn garis" type="button" data-aksi="kalendar-kursus">${ic('kalendar')}Simpan ke kalendar</button></div>
      <p class="redup">Pengesahan dan peringatan akan dihantar melalui WhatsApp ke nombor anda, bersama lokasi dan nota kursus.</p>`
      : `<p class="redup">Staf Juara akan menghubungi anda untuk mencadangkan sesi kursus yang terdekat.</p>`}
      <a href="#/pakej" style="text-align:center;font-weight:600">Lihat pakej umrah</a>
    </div>`;
  }
  const data = S.kursusData;
  if (!data) { muatKursus(); }
  const semua = data ? data.kursus : [];
  const negeri = [...new Set(semua.map(k => k.negeri).filter(Boolean))].sort();
  const pilihN = S.kursusNegeri || '';
  const tapisan = semua.filter(k => !pilihN || k.negeri === pilihN);
  const ikutTarikh = {};
  tapisan.forEach(k => (ikutTarikh[k.tarikh] = ikutTarikh[k.tarikh] || []).push(k));
  const senaraiSesi = !data ? (S.kursusRalat ? `<div class="nota">${ic('info')}<span>${esc(S.kursusRalat)}</span></div>` : rangka(3, 90))
    : !tapisan.length ? `<div class="nota">${ic('info')}<span>Tiada sesi akan datang di negeri ini. Pilih "Hubungi saya" di bawah dan staf kami akan cadangkan sesi terdekat.</span></div>`
    : Object.entries(ikutTarikh).map(([t, L]) => `
      <div class="stack" style="gap:8px">
        <h3 style="font-size:15px;color:var(--kelabu)">${fHari(t)}, ${fTkh(t, 1)}</h3>
        ${L.map(k => `<label class="kad pad sesi-kursus" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer">
          <input type="radio" name="kursusId" value="${esc(k.id)}"${S.kursusPilih === k.id ? ' checked' : ''} style="width:22px;height:22px;flex:none;accent-color:var(--merah);margin-top:2px">
          <span style="display:flex;flex-direction:column;gap:2px;min-width:0">
            <b>${esc(fJam(k.mula))}${k.tamat ? ' – ' + esc(fJam(k.tamat)) : ''} · ${esc(k.kawasan || k.negeri)}</b>
            <span>${esc(k.tempat)}</span>
            <span class="kecil redup">${esc(k.penceramah)}${k.negeri ? ' · ' + esc(k.negeri) : ''}</span>
            <a class="kecil" href="${esc(k.peta)}" target="_blank" rel="noopener" style="font-weight:600">Lihat peta</a>
          </span>
        </label>`).join('')}
      </div>`).join('');
  return `
  <section class="kursus-atas">
    <div class="stack" style="gap:8px"><h1>Kursus umrah percuma</h1><p class="redup">Terbuka kepada semua, walaupun belum tempah pakej. Pilih sesi, daftar, dan kami hantar lokasi serta peringatan melalui WhatsApp.</p></div>
    <ul class="usp">
      <li>${ic('orang')}<span><b>Dibimbing ustaz berpengalaman</b><span class="kecil redup">Ustaz dan penceramah Juara, syarikat dengan 25 tahun pengalaman</span></span></li>
      <li>${ic('pin')}<span><b>${data ? `${semua.length} sesi di ${negeri.length} negeri` : 'Sesi di seluruh Malaysia'}</b><span class="kecil redup">Di masjid dan surau berhampiran anda</span></span></li>
      <li>${ic('buku')}<span><b>Faham umrah langkah demi langkah</b><span class="kecil redup">Niat, ihram, tawaf, saie, tahallul dan persediaan</span></span></li>
      <li>${ic('telefon')}<span><b>Lokasi dan peringatan WhatsApp</b><span class="kecil redup">Malam sebelum dan 2 jam sebelum kursus</span></span></li>
    </ul>
  </section>
  ${corak}
  <div class="dua-lajur">
    <form class="kiri" data-borang="kursus" novalidate>
      <section class="stack">
        <div class="baris" style="flex-wrap:wrap;align-items:center"><h2>1. Pilih sesi kursus</h2>${data ? `<span class="kecil redup">${tapisan.length} sesi akan datang</span>` : ''}</div>
        <label class="medan">Negeri<select class="input" data-aksi-ubah="negeri-kursus"><option value="">Semua negeri</option>${negeri.map(n => `<option value="${esc(n)}"${pilihN === n ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
        <div class="stack senarai-sesi" style="max-height:560px;overflow:auto;padding-right:4px">${senaraiSesi}</div>
        <label class="kad pad" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer"><input type="radio" name="kursusId" value=""${S.kursusPilih === '' ? ' checked' : ''} style="width:22px;height:22px;flex:none;accent-color:var(--merah);margin-top:2px"><span><b>Tiada sesi yang sesuai</b><br><span class="kecil redup">Hubungi saya untuk cadangan sesi terdekat</span></span></label>
      </section>
      <section class="stack">
        <h2>2. Maklumat anda</h2>
        <label class="medan">Nama penuh<input class="input" name="nama" autocomplete="name" required></label>
        <div class="grid-2">
          <label class="medan">No telefon (WhatsApp)<input class="input" name="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="012-345 6789" required></label>
          <label class="medan">Bilangan peserta<select class="input" name="bil">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `<option value="${n}">${n} orang</option>`).join('')}</select></label>
        </div>
        <label class="medan">Anggaran bila mahu pergi umrah?<select class="input" name="anggaran">
          <option value="">Pilih bulan</option>
          ${bulanDepan(18, 1).map(b => `<option value="${b}">${fBulan(b)}</option>`).join('')}
          <option value="Belum pasti">Belum pasti</option>
        </select></label>
        <label style="display:flex;gap:12px;align-items:flex-start;font-size:14px;color:var(--dakwat2)"><input type="checkbox" name="setuju" style="width:22px;height:22px;flex:none;accent-color:var(--merah);margin-top:1px"><span>${NOTIS_PDPA}</span></label>
        <p class="kecil" id="ralat-kursus" role="alert" style="color:var(--merah)"></p>
        <button class="btn penuh" type="submit">Daftar kursus</button>
      </section>
    </form>
    <aside class="kanan stack">
      ${gb('IT-09', 'Masjidil Haram', 'r169').replace('class="gb r169"', 'class="gb r169" style="border-radius:12px"')}
      <div class="kad pad stack" style="gap:8px">
        <b>Selepas mendaftar</b>
        <span class="semak">${ic('betul')}Pengesahan WhatsApp bersama lokasi</span>
        <span class="semak">${ic('betul')}Nota kursus umrah (PDF)</span>
        <span class="semak">${ic('betul')}Peringatan malam sebelum dan pagi kursus</span>
      </div>
      <div class="kad pad stack" style="gap:8px">
        <b>Apa yang anda pelajari</b>
        <span class="semak">${ic('betul')}Niat dan pakaian ihram</span>
        <span class="semak">${ic('betul')}Tawaf, saie dan tahallul</span>
        <span class="semak">${ic('betul')}Ziarah Makkah dan Madinah</span>
        <span class="semak">${ic('betul')}Persediaan dokumen dan barang</span>
      </div>
    </aside>
  </div>`;
}
function fJam(hm) { const [h, m] = String(hm || '0:0').split(':').map(Number); const ap = h < 12 ? 'pagi' : h < 14 ? 'tengah hari' : h < 19 ? 'petang' : 'malam'; return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`; }
async function muatKursus() {
  if (muatKursus.sedang) return; muatKursus.sedang = true;
  try {
    const api = (JT.apiJuara || '').replace(/\/$/, '');
    if (!api) throw new Error('Jadual kursus belum tersedia dalam paparan ini.');
    const r = await fetch(api + '/kursus', { headers: { Accept: 'application/json' } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.ralat || 'Jadual kursus tidak dapat dimuat. Cuba lagi.');
    S.kursusData = j.data; S.kursusRalat = '';
  } catch (e) { S.kursusRalat = e.message; S.kursusData = null; }
  muatKursus.sedang = false;
  if (laluan().nama === 'kursus') render(false);
}
function kalendarKursus(k) {
  const z = s => s.replace(/[-:]/g, '');
  const mula = new Date(Date.parse(`${k.tarikh}T${k.mula}:00+08:00`)).toISOString().replace(/\.\d+Z$/, 'Z');
  const tamat = new Date(Date.parse(`${k.tarikh}T${k.tamat || k.mula}:00+08:00`) + (k.tamat ? 0 : 3 * 3600e3)).toISOString().replace(/\.\d+Z$/, 'Z');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Juara Travel//Kursus Umrah//MS', 'BEGIN:VEVENT', `UID:kursus-${k.id}@juaratravel`, `DTSTAMP:${z(new Date().toISOString().replace(/\.\d+Z$/, 'Z'))}`, `DTSTART:${z(mula)}`, `DTEND:${z(tamat)}`, 'SUMMARY:Kursus Umrah Juara Travel', `LOCATION:${k.tempat.replace(/[,;]/g, '\\$&')}`, `DESCRIPTION:${(k.penceramah ? 'Penceramah: ' + k.penceramah + '\\n' : '') + k.peta}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Kursus umrah', 'TRIGGER:-PT2H', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'kursus-umrah-juara.ics'; document.body.appendChild(a); a.click(); a.remove();
}

function vAdmin() {
  if (!S.user) return kosong('IL-09', 'Log masuk', 'Log masuk staf diperlukan', 'Log masuk dengan akaun Google staf Juara.', `<a class="btn" href="#/masuk">Log masuk</a>`);
  if (!S.admin) { muatAdmin(); return rangka(1, 60) + rangka(5, 44); }
  if (S.admin.ralat) return kosong('IL-09', 'Tiada akses', 'Tiada akses', esc(S.admin.ralat), '');
  const tabStaf = `<div class="cips tab-staf" role="tablist">${[['daftar', 'Pendaftaran'], ['dokumen', 'Dokumen jemaah']].map(([k, n]) => `<button type="button" role="tab" class="cip" aria-pressed="${(S.adminTab || 'daftar') === k}" data-aksi="admin-tab" data-nilai="${k}">${n}</button>`).join('')}</div>`;
  if (S.adminTab === 'dokumen') return `<h1>Panel staf</h1>${tabStaf}${vAdminDok()}`;
  const rows = S.admin.data.filter(r => !S.adminJenis || r.jenis === S.adminJenis);
  const tTkh = s => s ? new Date(s).toLocaleString('ms-MY', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '';
  return `
  <h1>Panel staf</h1>${tabStaf}
  <div class="baris" style="flex-wrap:wrap"><h2>Pendaftaran</h2><button class="btn garis kecil" type="button" data-aksi="muat-csv">Muat turun Excel (CSV)</button></div>
  <div class="cips" role="group" aria-label="Jenis">${[['', 'Semua'], ['kursus', 'Kursus'], ['tempah', 'Tempahan']].map(([k, n]) => `<button type="button" class="cip" aria-pressed="${(S.adminJenis || '') === k}" data-aksi="admin-jenis" data-nilai="${k}">${n}</button>`).join('')}</div>
  <p class="kecil redup">${rows.length} rekod</p>
  <div class="kad" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px;min-width:760px">
    <thead><tr style="text-align:left;color:var(--kelabu)">${['Masa', 'Jenis', 'Nama', 'Telefon', 'Kursus / Pakej', 'Anggaran umrah', 'Bil.'].map(h => `<th style="padding:10px 12px;border-bottom:1px solid var(--garis)">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${[tTkh(r.masa), r.jenis, r.nama, `<a href="https://wa.me/${esc(String(r.tel).replace(/\D/g, '').replace(/^0/, '60'))}" target="_blank" rel="noopener">${esc(r.tel)}</a>`, esc(r.jenis === 'kursus' ? r.sesi : [r.pakej, r.tarikh, r.bilik].filter(Boolean).join(' · ')), esc(r.anggaran ? (/^\d{4}-\d{2}$/.test(r.anggaran) ? fBulan(r.anggaran) : r.anggaran) : ''), r.bil].map((c, i) => `<td style="padding:10px 12px;border-bottom:1px solid #F0EEEC">${i === 3 || i === 4 || i === 5 ? c : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}
async function muatAdmin() {
  if (muatAdmin.sedang) return; muatAdmin.sedang = true;
  try {
    const t = await S.user.getIdToken();
    const r = await fetch((JT.apiJuara || '').replace(/\/$/, '') + '/admin/pendaftaran', { headers: { Authorization: 'Bearer ' + t, Accept: 'application/json' } });
    const j = await r.json().catch(() => ({}));
    S.admin = r.ok ? { data: j.data || [] } : { ralat: j.ralat || 'Tiada akses.' };
  } catch (e) { S.admin = { ralat: 'Sistem tidak dapat dihubungi.' }; }
  muatAdmin.sedang = false; render(false);
}
async function muatCsv() {
  const t = await S.user.getIdToken();
  const r = await fetch((JT.apiJuara || '').replace(/\/$/, '') + '/admin/pendaftaran?format=csv' + (S.adminJenis ? '&jenis=' + S.adminJenis : ''), { headers: { Authorization: 'Bearer ' + t } });
  if (!r.ok) return toast('Muat turun gagal');
  const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob());
  a.download = `pendaftaran-juara-${hariIni()}.csv`; document.body.appendChild(a); a.click(); a.remove();
}

async function muatCawangan() {
  if (S.cawMuat) return; S.cawMuat = true;
  try {
    const api = (JT.apiJuara || '').replace(/\/$/, '');
    if (!api) throw new Error('Senarai cawangan belum tersedia dalam paparan ini.');
    const r = await fetch(api + '/cawangan'), j = await r.json();
    if (!r.ok || !j.data) throw new Error(j.ralat || 'Tidak dapat memuat cawangan.');
    S.cawangan = j.data.cawangan; S.cawRalat = '';
  } catch (e) { S.cawRalat = e.message; S.cawMuat = false; }
  if (laluan().nama === 'cawangan') render(false);
}
function vCawangan() {
  if (!S.cawangan && !S.cawRalat) muatCawangan();
  const c = S.cawangan || [], zon = [...new Set(c.map(x => x.zon).filter(Boolean))];
  const z = S.zon && zon.includes(S.zon) ? S.zon : '', senarai = c.filter(x => !z || x.zon === z);
  const telBersih = t => String(t || '').split('/')[0].replace(/[^\d+]/g, '');
  const kad = x => `<article class="kad pad stack cawangan" style="gap:6px">
      <span class="kecil redup" style="font-weight:600">${x.utama ? 'Ibu pejabat · ' : ''}${esc(x.negeri || x.zon)}</span>
      <b style="font-size:17px">Juara Travel ${esc(x.nama)}</b>
      <span class="redup">${esc(x.alamat)}</span>
      ${x.waktu ? `<span class="kecil">Buka ${esc(x.waktu.replace('-', ' hingga '))}</span>` : ''}
      ${x.pengurus ? `<span class="kecil redup">Pengurus: ${esc(x.pengurus)}${x.lesen ? ' · ' + esc(x.lesen) : ''}</span>` : ''}
      <div class="butang-caw">
        <a class="btn garis kecil" href="${esc(x.peta)}" target="_blank" rel="noopener">${ic('pin')}Arah</a>
        ${x.telefon ? `<a class="btn garis kecil" href="tel:${esc(telBersih(x.telefon))}">${ic('telefon')}Telefon</a>` : ''}
        ${x.wa ? `<a class="btn garis kecil" href="https://wa.me/${esc(x.wa)}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
      </div>
    </article>`;
  const isi = S.cawRalat
    ? kosong('IL-09', 'Ralat', 'Tidak dapat memuat cawangan', esc(S.cawRalat), `<a class="btn" href="${wa('Assalamualaikum Juara Travel. Di mana cawangan Juara yang terdekat dengan saya?')}" target="_blank" rel="noopener">${ic('telefon')}Tanya cawangan terdekat</a>`)
    : !S.cawangan ? rangka(4, 170) : `<div class="grid-pakej">${senarai.map(kad).join('')}</div>`;
  return `
  <div class="stack" style="gap:6px"><h1>Cawangan</h1><p class="redup">${c.length ? c.length + ' cawangan Juara di seluruh Malaysia. ' : ''}Datang ke cawangan atau hubungi kami.</p></div>
  ${zon.length ? `<div class="cips" role="group" aria-label="Zon">${['', ...zon].map(v => `<button type="button" class="cip" aria-pressed="${z === v}" data-aksi="zon" data-nilai="${esc(v)}">${v ? esc(v) : 'Semua'}</button>`).join('')}</div>` : ''}
  ${isi}`;
}

function vSolat() {
  const loc = PRESET[S.lokasi] || PRESET.kl, t = prayerTimes(loc, ...locDay(loc)), np = nextPrayer(loc);
  return `
  <div class="stack" style="gap:6px"><h1>Waktu solat</h1><p class="redup">${esc(loc.n)} · ${inSaudi(loc.lat, loc.lng) ? 'kaedah Umm al-Qura' : 'kaedah JAKIM'}</p></div>
  <div class="cips" role="group" aria-label="Lokasi">${Object.entries(PRESET).map(([k, v]) => `<button type="button" class="cip" aria-pressed="${S.lokasi === k}" data-aksi="lokasi" data-nilai="${k}">${v.n}</button>`).join('')}</div>
  <div class="kad waktu" style="max-width:560px">${SOL_NAMES.map(([k, n]) => `<div class="${np && np.k === k && np.at.getTime() === t[k].getTime() ? 'kini' : ''}"><span>${n}</span><span class="num">${fmtWaktu(t[k], loc)}</span></div>`).join('')}</div>
  <p class="kecil redup">Waktu dikira dalam apps. Rujuk jadual rasmi masjid tempatan jika berbeza.</p>`;
}

function vMasuk() {
  return `
  <div class="stack" style="gap:20px;max-width:520px">
    <img src="logo-juara.png" alt="Juara Travel" style="width:104px">
    <div class="stack" style="gap:6px"><h1 style="font-size:1.8rem">Log masuk jemaah</h1><p class="redup">Untuk lihat tempahan, bayaran, dokumen dan jadual perjalanan anda.</p></div>
    <button class="btn penuh" type="button" data-aksi="masuk-google"${AUTH ? '' : ' disabled'}><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7z" fill="#fff" stroke="none"/><path d="M12 21c2.6 0 4.7-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.5v2.5A9.5 9.5 0 0 0 12 21z" fill="#fff" stroke="none" opacity=".85"/><path d="M6.7 13.3a5.7 5.7 0 0 1 0-3.6V7.2H3.5a9.5 9.5 0 0 0 0 8.6z" fill="#fff" stroke="none" opacity=".7"/><path d="M12 6.8c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9.5 9.5 0 0 0 3.5 7.2l3.2 2.5C7.4 8.5 9.5 6.8 12 6.8z" fill="#fff" stroke="none" opacity=".55"/></svg>Log masuk dengan Google</button>
    <button class="btn garis penuh" type="button" disabled>Log masuk dengan WhatsApp (akan datang)</button>
    <p class="kecil redup">Gunakan akaun Google dengan emel yang sama seperti yang didaftarkan semasa tempahan dengan Juara.</p>
    <a class="btn garis penuh" href="#/contoh">Lihat contoh paparan jemaah</a>
    <p class="kecil redup">Perlu bantuan tentang tempahan sedia ada? <a href="${wa('Assalamualaikum Juara Travel. Saya ingin semak status tempahan saya.')}" target="_blank" rel="noopener">WhatsApp kami</a></p>
  </div>`;
}

function vKredit() {
  const k = typeof KREDIT !== 'undefined' ? KREDIT : [];
  return `
  <div class="stack" style="gap:6px"><h1>Kredit gambar</h1><p class="redup">Gambar lokasi di bawah daripada Wikimedia Commons dan digunakan mengikut lesen masing-masing. Ikon daripada Lucide (lesen ISC).</p></div>
  <div class="kad kredit-senarai">${k.map(x => `<div><div class="gb r169"><img src="${esc(x.fail)}" alt="" loading="lazy"></div><span><b>${esc(x.pencipta)}</b> · ${esc(x.lesen)}<br><a href="${esc(x.sumber)}" target="_blank" rel="noopener">Halaman sumber</a> · <span class="redup">${esc(x.nota)}</span></span></div>`).join('')}</div>`;
}

/* ===== Paparan contoh jemaah (data contoh, bertanda) ===== */
const CONTOH = {
  nama: 'Puan Aminah', pakej: 'Eko-Klasik Ziarah Taif dan Badar', berlepas: '2026-12-12', pulang: '2026-12-23',
  harga: 7990, dibayar: 4000, akhirBayar: '2026-12-05',
  hari: [
    { img: ['IT-01', 'KLIA T1, kaunter Juara'], label: 'Hari 1 · Kuala Lumpur ke Madinah', tajuk: 'Berlepas ke Madinah', akt: [['6:00', 'IT-01', 'Berkumpul di KLIA T1', 'Kaunter Juara. Bawa pasport.'], ['9:40', 'IT-19', 'Penerbangan ke Madinah', 'Lebih kurang 9 jam'], ['17:30', 'HT-kayan-international-1', 'Daftar masuk hotel', 'Kayan International atau setaraf']], nota: 'Pakaian selesa untuk penerbangan panjang. Kain ihram belum diperlukan.' },
    { img: ['IT-03', 'Masjid Nabawi'], label: 'Hari 2 · Madinah', tajuk: 'Masjid Nabawi & Raudhah', akt: [['4:30', 'IT-03', 'Subuh berjemaah', 'Berkumpul di lobi 4:15 pagi'], ['9:00', 'IT-04', 'Taklimat Raudhah', 'Giliran ikut permit Nusuk'], ['21:00', 'IT-04', 'Ziarah Raudhah (wanita)', 'Bersama mutawwifah']], nota: 'Permit Raudhah diuruskan oleh Juara. Jangan ambil gambar di dalam Raudhah.' },
    { img: ['IT-05', 'Masjid Quba'], label: 'Hari 3 · Madinah', tajuk: 'Ziarah luar Madinah', akt: [['8:00', 'IT-05', 'Masjid Quba', 'Solat sunat 2 rakaat'], ['9:30', 'IT-06', 'Jabal Uhud & Makam Syuhada', 'Dari luar pagar'], ['11:00', 'IT-08', 'Ladang kurma', 'Masa membeli 45 minit']], nota: 'Bawa topi atau payung dan air. Bas bertolak tepat 8:00 pagi.' }
  ],
  dokumen: [['Pasport (muka surat berfoto)', 'Belum hantar', 'merah', true], ['Gambar berukuran pasport', 'Sedang disemak staf', 'amber', false], ['Kad vaksin meningitis', 'Diterima', 'hijau', false], ['Visa umrah', 'Menunggu pasport', 'kelabu', false]]
};
const hariLagi = d => Math.max(0, Math.round((tkh(d) - tkh(hariIni())) / 86400000));

function vSayaContoh() {
  const c = CONTOH, baki = c.harga - c.dibayar;
  return `
  <div class="baris"><span><span class="redup kecil">Assalamualaikum,</span><br><b style="font-size:20px">${c.nama}</b></span></div>
  ${aksesPantas([['pakej', 'Pakej', 'cari'], ['bayaran', 'Bayaran', 'dompet'], ['kursus', 'Kursus', 'buku'], ['cawangan', 'Cawangan', 'pin']])}
  <div class="grid-pakej" style="align-items:start">
    <a class="kad perjalanan" href="#/perjalanan" style="overflow:hidden;color:var(--dakwat);display:block">
      ${gb('JP-02', 'Kulit pakej yang ditempah', '')}
      <span class="pad baris" style="align-items:flex-end;display:flex">
        <span style="display:flex;flex-direction:column;min-width:0"><span class="kecil redup">Perjalanan anda</span><b style="font-size:17px">${c.pakej}</b><span class="kecil redup">${fHari(c.berlepas)}, ${fTkh(c.berlepas, 1)} · KLIA T1, 6:00 pagi</span></span>
        <span style="display:flex;flex-direction:column;align-items:flex-end;flex:none"><b class="num" style="font-size:36px;line-height:1">${hariLagi(c.berlepas)}</b><span class="kecil redup">hari lagi</span></span>
      </span>
    </a>
    <section class="stack">
      <div class="tajuk-seksyen" style="margin:0"><h2>Perlu tindakan</h2><span class="kecil redup">2 belum selesai</span></div>
      <div class="kad pad tindakan"><span><b>Bayar baki ${rm(baki)}</b><br><span class="kecil seat-sikit">Sebelum ${fTkh(c.akhirBayar)} · ${hariLagi(c.akhirBayar)} hari lagi</span></span><a class="btn kecil" href="#/bayaran">Bayar</a></div>
      <div class="kad pad tindakan"><span><b>Hantar gambar pasport</b><br><span class="kecil redup">Diperlukan untuk visa</span></span><a class="btn garis kecil" href="#/dokumen">Muat naik</a></div>
      <span class="semak">${ic('betul')}Deposit ${rm(JT.depositSeorang)} diterima</span>
      <span class="semak">${ic('betul')}Kursus umrah sesi 1 dihadiri</span>
    </section>
    <section class="stack">
      <div class="tajuk-seksyen" style="margin:0"><h2>Hari pertama</h2><a href="#/perjalanan">Itinerari penuh</a></div>
      ${kadMataRingkas({ mata: 1840, menunggu: 400, nilai: 180, tahap: TAHAP[1] })}
      <a class="kad ringkas" href="#/perjalanan">${gb('IT-01', '', '')}<span class="t"><b>Kuala Lumpur ke Madinah</b><span class="kecil"><b class="num">6:00</b> <span class="redup">Berkumpul, kaunter Juara KLIA T1</span></span><span class="kecil"><b class="num">9:40</b> <span class="redup">Penerbangan ke Madinah</span></span></span></a>
      <div class="kad pad" style="display:flex;gap:14px;align-items:center">${gb('OR-01', '', 'r11').replace('class="gb r11"', 'class="gb r11" style="width:56px;border-radius:999px;flex:none"')}<span style="flex:1"><span class="kecil redup">Mutawwif kumpulan anda</span><br><b>[Nama mutawwif]</b></span><a class="btn garis kecil" href="#" aria-label="WhatsApp mutawwif">${ic('telefon')}</a></div>
    </section>
  </div>`;
}

function vPerjalananContoh() {
  return `
  <div class="stack" style="gap:6px"><h1>Perjalanan</h1><p class="redup">${CONTOH.pakej} · ${fTkh(CONTOH.berlepas, 1)} hingga ${fTkh(CONTOH.pulang, 1)}</p></div>
  <div class="grid-pakej" style="align-items:start">${CONTOH.hari.map(d => `
    <article class="kad hari-kad" style="overflow:hidden">
      ${gb(d.img[0], d.img[1])}
      <div class="pad stack">
        <span><span class="kecil redup" style="font-weight:600">${d.label}</span><br><b style="font-size:19px">${d.tajuk}</b></span>
        ${d.akt.map(([m, k, t, n]) => `<div class="aktiviti"><b class="num">${m}</b>${gb(k, '', '')}<span><b style="font-size:15px">${t}</b><br><span class="kecil redup">${n}</span></span></div>`).join('')}
        <div class="nota kecil">${d.nota}</div>
      </div>
    </article>`).join('')}</div>`;
}

function vBayaranContoh() {
  const c = CONTOH, baki = c.harga - c.dibayar, pct = Math.round(c.dibayar / c.harga * 100);
  return `
  <h1>Bayaran</h1>
  <div class="grid-pakej" style="align-items:start">
    <div class="kad pad stack">
      <div class="baris" style="align-items:flex-start"><span><span class="kecil redup">Baki perlu dibayar</span><br><b class="num" style="font-size:34px;line-height:1.1">${rm(baki)}</b></span><span class="lencana amber">Sebelum ${fTkh(c.akhirBayar)}</span></div>
      <div style="height:8px;border-radius:999px;background:var(--garis);overflow:hidden"><div style="width:${pct}%;height:100%;background:var(--hijau)"></div></div>
      <div class="baris kecil redup"><span>Dibayar ${rm(c.dibayar)}</span><span>daripada ${rm(c.harga)}</span></div>
      <button class="btn penuh" type="button" data-aksi="toast" data-nilai="Bayaran dalam apps akan dibuka dalam Fasa 2">Bayar ${rm(baki)} (FPX / kad)</button>
      <button class="btn garis penuh" type="button" data-aksi="toast" data-nilai="Muat naik resit akan dibuka dalam Fasa 2">Muat naik resit pindahan bank</button>
    </div>
    <div class="stack">
      <h2>Sejarah bayaran</h2>
      <div class="kad jadual-harga"><div><span><b>Bayaran kedua</b><br><span class="kecil redup">20 Okt 2026 · FPX</span></span><b class="num">${rm(3000)}</b></div><div><span><b>Deposit</b><br><span class="kecil redup">15 Sep 2026 · Kaunter cawangan</span></span><b class="num">${rm(1000)}</b></div></div>
      <h2>Pecahan harga</h2>
      <div class="kad jadual-harga"><div><span class="redup">Pakej, bilik quad</span><span class="num">${rm(c.harga)}</span></div><div><span class="redup">Naik taraf bilik</span><span>RM0</span></div><div><b>Jumlah</b><b class="num">${rm(c.harga)}</b></div></div>
    </div>
  </div>`;
}

function vPersediaanContoh() {
  return `
  <h1>Persediaan</h1>
  <div class="grid-pakej" style="align-items:start">
    <section class="stack">
      <h2>Dokumen</h2>
      <div class="kad jadual-harga">${CONTOH.dokumen.map(([n, s, w, b]) => `<div style="align-items:center"><span><b>${n}</b><br><span class="lencana ${w}" style="margin-top:4px">${s}</span></span>${b ? `<a class="btn kecil" href="#/dokumen">Muat naik</a>` : ''}</div>`).join('')}</div>
      <div class="kad pad" style="display:flex;gap:14px">${gb('IL-10', 'Contoh pasport', 'r11').replace('class="gb r11"', 'class="gb r11" style="width:96px;flex:none;border-radius:8px"')}<span class="kecil"><b style="font-size:15px">Gambar pasport yang diterima</b><br>Muka surat berfoto, rata, tiada silau, keempat-empat bucu kelihatan.</span></div>
    </section>
    <section class="stack">
      <h2>Kursus seterusnya</h2>
      <div class="kad pad stack" style="gap:4px"><span class="kecil redup">Sesi 2 daripada 2</span><b style="font-size:17px">Amali tawaf dan saie</b><span class="redup">Sab, 6 Dis · 9:00 pagi hingga 1:00 tengah hari</span><span class="redup">Juara Travel [cawangan]</span></div>
    </section>
  </div>`;
}

function vAkaunContoh() {
  return `
  <h1>Akaun</h1>
  <div class="kad jadual-harga" style="max-width:560px"><div><span class="redup">Nama</span><b>Aminah binti Yusof</b></div><div><span class="redup">Telefon</span><b>+60 12-345 6789</b></div><div><span class="redup">Ahli keluarga</span><b>Tiada</b></div><div><span class="redup">Bahasa</span><b>Bahasa Melayu</b></div></div>
  <div style="max-width:560px">${AKSES_AKAUN()}</div>
  <button class="btn garis" type="button" data-aksi="keluar-contoh" style="max-width:560px">Keluar dari paparan contoh</button>`;
}

/* ===== Log masuk (Google melalui Firebase Auth) dan data jemaah sebenar ===== */
let AUTH = null;
function mulaAuth() {
  if (!window.firebase || !JT.firebase) { S.authSedia = true; return; }
  const cfg = { ...JT.firebase };
  // Guna domain sendiri sebagai authDomain supaya log masuk redirect berfungsi di pelayar yang sekat kuki pihak ketiga
  // Hanya domain utama (berdaftar dalam klien OAuth). Saluran pratonton (nama--saluran.web.app) guna authDomain lalai.
  if (/\.(web\.app|firebaseapp\.com)$/.test(location.hostname) && !location.hostname.includes('--')) cfg.authDomain = location.hostname;
  firebase.initializeApp(cfg);
  AUTH = firebase.auth();
  AUTH.useDeviceLanguage();
  AUTH.getRedirectResult().catch(e => toast(mesejAuth(e)));
  AUTH.onAuthStateChanged(u => {
    S.user = u; S.authSedia = true;
    if (u) { if (S.demo) { S.demo = false; store.set('demo', false); } muatSaya(); }
    else { S.saya = null; S.sayaRalat = ''; }
    const n = laluan().nama;
    if (u && (n === 'masuk' || n === '')) location.replace('#/saya'); else render(false);
  });
}
function mesejAuth(e) {
  const c = e && e.code;
  if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return 'Log masuk dibatalkan.';
  if (c === 'auth/network-request-failed') return 'Tiada internet. Cuba lagi.';
  if (c === 'auth/unauthorized-domain') return 'Alamat ini belum dibenarkan untuk log masuk.';
  return 'Log masuk gagal. Cuba lagi.';
}
async function masukGoogle() {
  if (!AUTH) return toast('Log masuk belum tersedia.');
  const p = new firebase.auth.GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  try { await AUTH.signInWithPopup(p); }
  catch (e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') return AUTH.signInWithRedirect(p);
    toast(mesejAuth(e));
  }
}
const icKunci = () => 'ic.' + (S.user ? S.user.uid : '');
async function muatSaya(icBaru) {
  const ic = icBaru || store.get(icKunci(), '');
  if (!S.user || !ic) { S.saya = null; render(false); return; }
  S.sayaMuat = true; S.sayaRalat = ''; render(false);
  try {
    const t = await S.user.getIdToken();
    const r = await fetch((JT.apiJuara || '').replace(/\/$/, '') + '/saya?ic=' + encodeURIComponent(ic), { headers: { Authorization: 'Bearer ' + t, Accept: 'application/json' } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.ralat || 'Sistem Juara tidak dapat dihubungi. Cuba lagi.');
    S.saya = j.data; store.set(icKunci(), ic);
  } catch (e) { S.sayaRalat = e.message; if (icBaru) S.saya = null; }
  S.sayaMuat = false; render(false);
}
// Tempahan utama: yang akan datang paling dekat, jika tiada, yang terkini
function tempahanUtama() {
  if (!S.saya || !S.saya.length) return null;
  const h = hariIni(), akan = S.saya.filter(r => r.berlepas && r.berlepas >= h).sort((a, b) => a.berlepas.localeCompare(b.berlepas));
  return akan[0] || S.saya[0];
}
const icSamar = ic => ic ? String(ic).slice(0, 6) + '-**-' + String(ic).slice(-4) : '';
const namaPendek = n => { const w = String(n || '').trim().split(/\s+/); return w[0] ? w[0].charAt(0) + w[0].slice(1).toLowerCase() : ''; };
const tajukKes = s => String(s || '').toLowerCase().replace(/\b\p{L}/gu, c => c.toUpperCase());

function vHubung() {
  const emel = S.user && S.user.email;
  return `
  <div class="stack" style="gap:18px;max-width:560px">
    <div class="stack" style="gap:6px"><h1 style="font-size:1.8rem">Hubungkan tempahan anda</h1><p class="redup">Log masuk sebagai <b>${esc(emel)}</b>. Masukkan nombor IC jemaah. Kami hanya papar tempahan yang didaftarkan dengan emel ini dalam sistem Juara.</p></div>
    <form class="stack" data-borang="hubung" novalidate>
      <label class="medan">No kad pengenalan<input class="input num" name="ic" inputmode="numeric" autocomplete="off" placeholder="000000-00-0000" required></label>
      <p class="kecil" id="ralat-hubung" role="alert" style="color:var(--merah)">${esc(S.sayaRalat)}</p>
      <button class="btn penuh" type="submit"${S.sayaMuat ? ' disabled' : ''}>${S.sayaMuat ? 'Sedang semak…' : 'Cari tempahan saya'}</button>
    </form>
    <div class="nota">${ic('info')}<span>Emel dalam rekod Juara berbeza? Hubungi kami untuk kemas kini, atau log masuk dengan WhatsApp bila dibuka nanti.</span></div>
    <a class="btn garis penuh" href="${wa('Assalamualaikum Juara Travel. Saya ingin kemas kini emel dalam rekod tempahan saya untuk apps Juara.')}" target="_blank" rel="noopener">${ic('telefon')}Hubungi Juara</a>
    <a href="#/pakej" style="text-align:center;font-weight:600">Belum tempah? Lihat pakej</a>
  </div>`;
}
function perluData(fn) {
  if (S.demo) return null;
  if (!S.authSedia || (S.sayaMuat && !S.saya)) return rangka(1, 200) + rangka(2, 100);
  if (!S.saya) return vHubung();
  return fn(tempahanUtama());
}
function vSaya() {
  if (S.demo) return vSayaContoh();
  return perluData(r => {
    const b = r.bayaran, lagi = r.berlepas ? hariLagi(r.berlepas) : null, dahLepas = r.berlepas && r.berlepas < hariIni();
    const [kod, lbl] = kodPakej({ nama: r.pakej || '', kat: '' });
    return `
    <div><span class="redup kecil">Assalamualaikum,</span><br><b style="font-size:20px">${esc(namaPendek(r.nama))}</b></div>
    ${aksesPantas([['pakej', 'Pakej', 'cari'], ['bayaran', 'Bayaran', 'dompet'], ['kursus', 'Kursus', 'buku'], ['cawangan', 'Cawangan', 'pin']])}
    <div class="grid-pakej" style="align-items:start">
      <a class="kad perjalanan" href="#/perjalanan" style="overflow:hidden;color:var(--dakwat);display:block">
        ${gb(kod, lbl, '')}
        <span class="pad" style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px">
          <span style="display:flex;flex-direction:column;min-width:0"><span class="kecil redup">${dahLepas ? 'Perjalanan terakhir' : 'Perjalanan anda'}</span><b style="font-size:17px">${esc(tajukKes(r.pakej))}</b><span class="kecil redup">${r.berlepas ? `${fHari(r.berlepas)}, ${fTkh(r.berlepas, 1)}` : 'Tarikh belum ditetapkan'}</span></span>
          ${r.berlepas && !dahLepas ? `<span style="display:flex;flex-direction:column;align-items:flex-end;flex:none"><b class="num" style="font-size:36px;line-height:1">${lagi}</b><span class="kecil redup">hari lagi</span></span>` : `<span class="lencana kelabu">${dahLepas ? 'Sudah pulang' : 'Akan datang'}</span>`}
        </span>
      </a>
      <section class="stack">
        <div class="tajuk-seksyen" style="margin:0"><h2>Perlu tindakan</h2></div>
        ${b.baki > 0 && !dahLepas ? `<div class="kad pad tindakan"><span><b>Bayar baki ${rm(b.baki)}</b><br><span class="kecil redup">Dibayar ${rm(b.dibayar)} daripada ${rm(b.jumlah)}</span></span><a class="btn kecil" href="#/bayaran">Lihat</a></div>`
          : `<span class="semak">${ic('betul')}${b.baki > 0 ? `Baki ${rm(b.baki)}` : 'Bayaran lunas'}</span>`}
        <a class="kad pad tindakan" href="#/dokumen" style="color:var(--dakwat)"><span><b>Dokumen umrah</b><br><span class="kecil redup">Imbas pasport, gambar dan sijil vaksin</span></span><span class="btn kecil">Buka</span></a>
      </section>
      <section class="stack">${kadMataRingkas(kiraMata(S.saya))}${S.saya.length > 1 ? `<a class="kad pad" href="#/perjalanan" style="color:var(--dakwat)"><b>${S.saya.length} tempahan</b><br><span class="kecil redup">Lihat semua tempahan anda</span></a>` : ''}</section>
    </div>`;
  });
}
function vPerjalanan() {
  if (S.demo) return vPerjalananContoh();
  return perluData(() => `
    <h1>Perjalanan</h1>
    <div class="nota">${ic('info')}<span>Itinerari harian bergambar akan dipaparkan di sini selepas Juara mengemas kininya untuk kumpulan anda.</span></div>
    <div class="grid-pakej">${S.saya.map(r => { const [kod, lbl] = kodPakej({ nama: r.pakej || '', kat: '' }); return `<div class="kad" style="overflow:hidden">${gb(kod, lbl)}<div class="pad stack" style="gap:4px"><b>${esc(tajukKes(r.pakej))}</b><span class="redup">${r.berlepas ? `${fTkh(r.berlepas, 1)} hingga ${r.pulang ? fTkh(r.pulang, 1) : '–'}` : 'Tarikh belum ditetapkan'}</span>${r.bilik ? `<span class="kecil redup">Bilik ${esc(r.bilik)}</span>` : ''}</div></div>`; }).join('')}</div>`);
}
function vBayaran() {
  if (S.demo) return vBayaranContoh();
  return perluData(r => {
    const b = r.bayaran, pct = b.jumlah ? Math.min(100, Math.round(b.dibayar / b.jumlah * 100)) : 0;
    return `
    <div class="stack" style="gap:6px"><h1>Bayaran</h1><p class="redup">${esc(tajukKes(r.pakej))}${r.berlepas ? ' · ' + fTkh(r.berlepas, 1) : ''}</p></div>
    <div class="grid-pakej" style="align-items:start">
      <div class="kad pad stack">
        <div class="baris" style="align-items:flex-start"><span><span class="kecil redup">Baki perlu dibayar</span><br><b class="num" style="font-size:34px;line-height:1.1">${rm(b.baki)}</b></span><span class="lencana ${b.baki > 0 ? 'amber' : 'hijau'}">${b.baki > 0 ? 'Belum lunas' : 'Lunas'}</span></div>
        <div style="height:8px;border-radius:999px;background:var(--garis);overflow:hidden"><div style="width:${pct}%;height:100%;background:var(--hijau)"></div></div>
        <div class="baris kecil redup"><span>Dibayar ${rm(b.dibayar)}</span><span>daripada ${rm(b.jumlah)}</span></div>
        ${b.baki > 0 ? `<a class="btn penuh" href="${wa(`Assalamualaikum Juara Travel. Saya ingin bayar baki ${rm(b.baki)} untuk ${tajukKes(r.pakej)}${r.berlepas ? ', berlepas ' + fTkh(r.berlepas, 1) : ''}.`)}" target="_blank" rel="noopener">Hubungi Juara untuk bayar</a>` : ''}
        <p class="kecil redup">Bayaran terus dalam apps akan dibuka kemudian.</p>
      </div>
      <div class="stack">
        <h2>Pecahan harga</h2>
        <div class="kad jadual-harga"><div><span class="redup">Harga pakej</span><span class="num">${rm(b.harga)}</span></div>${b.upgrade ? `<div><span class="redup">Naik taraf</span><span class="num">${rm(b.upgrade)}</span></div>` : ''}${b.tambahan ? `<div><span class="redup">Tambahan</span><span class="num">${rm(b.tambahan)}</span></div>` : ''}${b.diskaun ? `<div><span class="redup">Diskaun</span><span class="num">-${rm(b.diskaun)}</span></div>` : ''}<div><b>Jumlah</b><b class="num">${rm(b.jumlah)}</b></div></div>
      </div>
    </div>`;
  });
}
function vPersediaan() {
  if (S.demo) return vPersediaanContoh();
  return perluData(() => `
    <h1>Persediaan</h1>
    <a class="kad pad tindakan" href="#/dokumen" style="color:var(--dakwat);max-width:560px"><span><b>Dokumen umrah</b><br><span class="kecil redup">Imbas pasport, gambar dan sijil vaksin dari telefon</span></span><span class="btn kecil">Buka</span></a>
    <a class="kad pad" href="#/kursus" style="color:var(--dakwat);max-width:560px"><b>Kursus umrah</b><br><span class="kecil redup">Lihat jadual kursus dan daftar hadir</span></a>
  `);
}
function vAkaun() {
  if (S.demo) return vAkaunContoh();
  if (!S.user) return rangka(1, 200);
  const ic = store.get(icKunci(), '');
  return `
  <h1>Akaun</h1>
  <div class="kad jadual-harga" style="max-width:560px"><div><span class="redup">Nama</span><b>${esc(S.user.displayName || '')}</b></div><div><span class="redup">Emel</span><b style="word-break:break-all">${esc(S.user.email || '')}</b></div><div><span class="redup">IC dihubungkan</span><b class="num">${ic ? esc(icSamar(ic)) : 'Belum'}</b></div></div>
  <div class="stack" style="max-width:560px">
    ${AKSES_AKAUN()}
    ${ic ? `<button class="btn garis" type="button" data-aksi="tukar-ic">Tukar IC</button>` : ''}
    <button class="btn garis" type="button" data-aksi="log-keluar">Log keluar</button>
    <a class="kecil" href="#/admin" style="text-align:center">Panel staf: senarai pendaftaran</a>
  </div>`;
}

/* ===== Penghala ===== */
/* ===== Mata Juara (loyalty) =====
   Peraturan dalam JT.mata. Mata dikira daripada bayaran sebenar TravelDesk untuk trip yang sudah pulang.
   Bonus rujukan, kursus dan testimoni direkod oleh staf (akan datang dalam Panel staf). */
const TAHAP = [
  { k: 'jemaah', n: 'Jemaah', trip: 1, ruj: 0, faedah: ['Kumpul mata setiap trip', 'Kod rujukan peribadi'] },
  { k: 'setia', n: 'Jemaah Setia', trip: 2, ruj: 0, faedah: ['Simpan tempat 48 jam tanpa deposit', 'Keutamaan pilih bilik'] },
  { k: 'duta', n: 'Duta Juara', trip: 3, ruj: 3, faedah: ['Keutamaan tarikh puncak (Ramadhan, cuti sekolah)', 'Kursus ulangan percuma untuk keluarga', 'Hadiah khas setiap rujukan berjaya'] }
];
const kodRujukan = uid => { let h = 7; for (const c of String(uid || 'tetamu')) h = (h * 31 + c.charCodeAt(0)) >>> 0; return 'JT' + h.toString(36).toUpperCase().slice(0, 6).padStart(6, '0'); };
function kiraMata(tempahan, rujukan = 0) {
  const m = JT.mata, h = hariIni();
  const selesai = tempahan.filter(t => t.pulang && t.pulang < h), akanDatang = tempahan.filter(t => !(t.pulang && t.pulang < h));
  const sejarah = selesai.map(t => ({ tajuk: tajukKes(t.pakej || 'Umrah'), tarikh: t.pulang, mata: Math.floor((t.bayaran ? t.bayaran.dibayar : 0) / m.rmSeMata) }));
  if (rujukan) sejarah.push({ tajuk: `${rujukan} rujukan berjaya`, tarikh: '', mata: rujukan * m.bonusRujukan });
  const menunggu = akanDatang.reduce((a, t) => a + Math.floor((t.bayaran ? t.bayaran.dibayar : 0) / m.rmSeMata), 0);
  const mata = sejarah.reduce((a, x) => a + x.mata, 0), trip = selesai.length;
  const tahap = [...TAHAP].reverse().find(x => trip >= x.trip || (x.ruj && rujukan >= x.ruj)) || null;
  const seterusnya = TAHAP.find(x => !tahap || TAHAP.indexOf(x) > TAHAP.indexOf(tahap)) || null;
  return { mata, menunggu, trip, rujukan, tahap, seterusnya, sejarah, nilai: Math.floor(mata / 100) * m.rmSe100 };
}
function kadMataRingkas(r) {
  return `<a class="kad pad kad-mata" href="#/mata"><span class="kecil" style="opacity:.8">Mata Juara · ${esc(r.tahap ? r.tahap.n : 'Ahli baru')}</span><b class="num" style="font-size:28px;line-height:1.1">${r.mata.toLocaleString('ms-MY')} mata</b><span class="kecil" style="opacity:.8">${r.menunggu ? `+${r.menunggu.toLocaleString('ms-MY')} mata selepas trip akan datang` : `Bernilai ${rm(r.nilai)} untuk pakej seterusnya`}</span></a>`;
}
function vMata() {
  const m = JT.mata;
  const kongsi = kod => wa(`Assalamualaikum. Saya pergi umrah dengan Juara Travel. Guna kod rujukan saya ${kod} semasa tempah: ${location.origin}/?ruj=${kod}`).replace(/^https:\/\/wa\.me\/\d+/, 'https://wa.me/');
  const cara = `
    <section class="stack"><h2>Cara kumpul mata</h2>
      <div class="kad jadual-harga">
        <div><span>Setiap ${rm(m.rmSeMata)} dibayar untuk pakej (dikira selepas pulang)</span><b class="num">1 mata</b></div>
        <div><span>Rakan atau saudara guna kod rujukan anda dan berlepas</span><b class="num">${m.bonusRujukan.toLocaleString('ms-MY')}</b></div>
        <div><span>Hadir kursus umrah Juara</span><b class="num">${m.bonusKursus}</b></div>
        <div><span>Bayar penuh 90 hari sebelum berlepas</span><b class="num">+10%</b></div>
        <div><span>Kongsi testimoni video yang diluluskan</span><b class="num">${m.bonusTestimoni}</b></div>
      </div></section>
    <section class="stack"><h2>Guna mata</h2>
      <div class="grid-2 lebar">
        <div class="kad pad stack" style="gap:4px"><b>Potongan pakej</b><span class="redup kecil">100 mata = ${rm(m.rmSe100)} untuk pakej seterusnya</span></div>
        <div class="kad pad stack" style="gap:4px"><b>Naik taraf bilik</b><span class="redup kecil">Quad ke Triple atau Double, tertakluk kekosongan</span></div>
        <div class="kad pad stack" style="gap:4px"><b>Tambahan perjalanan</b><span class="redup kecil">Ziarah Taif, tiket tren Haramain, naik taraf kelas perniagaan</span></div>
        <div class="kad pad stack" style="gap:4px"><b>Tabung umrah asnaf</b><span class="redup kecil">Sumbang mata untuk membantu jemaah yang memerlukan</span></div>
      </div></section>
    <section class="stack"><h2>Tahap ahli</h2>
      <div class="grid-pakej">${TAHAP.map(t => `<div class="kad pad stack" style="gap:6px"><b>${t.n}</b><span class="kecil redup">${t.trip} trip${t.ruj ? ` atau ${t.ruj} rujukan berjaya` : ''}</span><ul class="senarai-faedah">${t.faedah.map(f => `<li>${ic('betul')}${esc(f)}</li>`).join('')}</ul></div>`).join('')}</div>
      <p class="kecil redup">Mata ialah rebat bernilai tetap tanpa cabutan bertuah. Mata keluarga boleh dikongsi. Mata luput 3 tahun selepas diperoleh. Terma penuh akan diumumkan oleh Juara.</p></section>`;
  if (!S.demo && !S.user) return `
    <div class="stack" style="gap:6px"><h1>Mata Juara</h1><p class="redup">Program ganjaran untuk jemaah dan keluarga yang kembali bersama Juara.</p></div>
    <div class="kad pad stack kad-mata" style="gap:10px;max-width:560px"><b style="font-size:20px">Log masuk untuk lihat mata anda</b><span style="opacity:.85">Mata dikira daripada bayaran tempahan anda dalam sistem Juara.</span><a class="btn" href="#/masuk" style="background:#fff;color:var(--dakwat)">Log masuk</a></div>
    ${cara}`;
  const r = S.demo ? { mata: 1840, menunggu: 400, trip: 2, rujukan: 1, tahap: TAHAP[1], seterusnya: TAHAP[2], nilai: 180, sejarah: [{ tajuk: 'Umrah Syawal', tarikh: '2025-05-02', mata: 840 }, { tajuk: '1 rujukan berjaya', tarikh: '', mata: 1000 }] }
    : S.saya ? kiraMata(S.saya, 0) : null;
  if (!r) return perluData(() => vMata());
  const kod = kodRujukan(S.demo ? 'contoh' : S.user.uid);
  const maju = r.seterusnya ? Math.min(100, Math.round(r.trip / r.seterusnya.trip * 100)) : 100;
  return `
  <div class="stack" style="gap:6px"><h1>Mata Juara</h1><p class="redup">${S.demo ? 'Paparan contoh.' : 'Dikira daripada bayaran tempahan anda dalam sistem Juara.'}</p></div>
  <div class="grid-pakej" style="align-items:start">
    <div class="kad pad stack kad-mata" style="gap:10px">
      <span class="kecil" style="opacity:.8">${esc(r.tahap ? r.tahap.n : 'Ahli baru')}</span>
      <b class="num" style="font-size:40px;line-height:1">${r.mata.toLocaleString('ms-MY')}<span style="font-size:16px"> mata</span></b>
      <span style="opacity:.85">Bernilai ${rm(r.nilai)} untuk pakej seterusnya${r.menunggu ? ` · +${r.menunggu.toLocaleString('ms-MY')} mata selepas trip akan datang` : ''}</span>
      ${r.seterusnya ? `<div class="maju" aria-label="Kemajuan ke ${esc(r.seterusnya.n)}"><span style="width:${maju}%"></span></div><span class="kecil" style="opacity:.85">${r.trip} daripada ${r.seterusnya.trip} trip ke ${esc(r.seterusnya.n)}${r.seterusnya.ruj ? `, atau ${r.seterusnya.ruj} rujukan` : ''}</span>` : ''}
    </div>
    <div class="kad pad stack" style="gap:10px">
      <span class="kecil redup">Kod rujukan anda</span>
      <b class="num" style="font-size:26px;letter-spacing:.06em">${kod}</b>
      <span class="redup kecil">Dapat ${JT.mata.bonusRujukan.toLocaleString('ms-MY')} mata bagi setiap rakan atau saudara yang tempah dengan kod ini dan berlepas.</span>
      <a class="btn" href="${esc(kongsi(kod))}" target="_blank" rel="noopener">${ic('telefon')}Kongsi di WhatsApp</a>
    </div>
  </div>
  ${r.sejarah.length ? `<section class="stack"><h2>Sejarah mata</h2><div class="kad jadual-harga">${r.sejarah.map(x => `<div><span>${esc(x.tajuk)}${x.tarikh ? `<br><span class="kecil redup">${fTkh(x.tarikh, 1)}</span>` : ''}</span><b class="num">+${x.mata.toLocaleString('ms-MY')}</b></div>`).join('')}</div></section>` : ''}
  ${cara}`;
}

/* ===== Dokumen jemaah: imbas pasport, gambar, vaksin, maklumat, urus keluarga ===== */
const DOK = [
  ['pasport', 'Pasport', 'Muka surat berfoto. Letak rata, tiada silau, keempat-empat bucu kelihatan.', 'Imbas pasport'],
  ['gambar', 'Gambar berukuran pasport', 'Latar putih, muka penuh ke depan, tanpa cermin mata gelap.', 'Ambil gambar'],
  ['vaksin', 'Sijil vaksin meningitis', 'Sijil ACYW, diambil sekurang-kurangnya 10 hari sebelum berlepas.', 'Muat naik sijil']
];
const STATUS_DOK = { menunggu: ['Belum hantar', 'kelabu'], disemak: ['Sedang disemak', 'amber'], diterima: ['Diterima', 'hijau'], semula: ['Perlu hantar semula', 'merah'] };
const HUBUNGAN = ['Saya', 'Pasangan', 'Ibu', 'Bapa', 'Anak', 'Adik-beradik', 'Lain-lain'];
const SAIZ = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
const CONTOH_DOK = [
  { id: 'contoh1', nama: 'AMINAH BINTI YUSOF', hubungan: 'Saya', berlepas: '2026-12-12', pasport: { no: 'A12345678', luput: '2029-05-01' }, amaran: '', maklumat: { waris: 'Ahmad bin Ali', telWaris: '012-345 6789', saiz: 'M' }, dok: { pasport: { status: 'diterima' }, gambar: { status: 'semula', nota: 'Latar belakang tidak putih. Sila ambil semula di dinding putih.' }, vaksin: { status: 'disemak' } } },
  { id: 'contoh2', nama: 'YUSOF BIN HAMID', hubungan: 'Bapa', berlepas: '2026-12-12', pasport: { no: 'A87654321', luput: '2027-02-10' }, amaran: 'Pasport tamat 2027-02-10, kurang 6 bulan dari tarikh berlepas. Sila perbaharui sebelum berlepas.', maklumat: {}, dok: { pasport: { status: 'disemak' }, gambar: { status: 'menunggu' }, vaksin: { status: 'menunggu' } } }
];

async function apiDok(path, opts = {}) {
  const t = await S.user.getIdToken();
  const r = await fetch((JT.apiJuara || '').replace(/\/$/, '') + path, { ...opts, headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json', Accept: 'application/json', ...(opts.headers || {}) } });
  if (opts.blob) { if (!r.ok) throw new Error('Fail tidak dapat dibuka.'); return r.blob(); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.ralat || 'Sistem Juara tidak dapat dihubungi.');
  return j.data;
}
async function muatDok() {
  if (S.dokMuat) return; S.dokMuat = true;
  try { S.dok = await apiDok('/dokumen'); S.dokRalat = ''; if (!S.dok.length) S.dokBuka = 'baru'; }
  catch (e) { S.dokRalat = e.message; }
  S.dokMuat = false; render(false);
}
// Mampat gambar di telefon sebelum dihantar (maks 1600 px, JPEG)
async function mampatGambar(fail) {
  const url = URL.createObjectURL(fail);
  try {
    const img = await new Promise((ok, gagal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => gagal(new Error('Gambar tidak dapat dibaca. Cuba JPG atau PNG.')); i.src = url; });
    const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.85);
  } finally { URL.revokeObjectURL(url); }
}
const tarikhBerlepasSaya = () => { const t = (S.saya || []).map(x => x.berlepas).filter(d => d && d >= hariIni()).sort()[0]; return t || ''; };

function kadAhli(a, demo) {
  const buka = S.dokBuka === a.id, lulus = DOK.filter(([k]) => a.dok[k].status === 'diterima').length;
  const perlu = DOK.filter(([k]) => a.dok[k].status === 'semula' || a.dok[k].status === 'menunggu').length;
  const baris = DOK.map(([k, n, panduan, butang]) => {
    const d = a.dok[k], [st, w] = STATUS_DOK[d.status] || STATUS_DOK.menunggu, boleh = d.status !== 'diterima';
    return `<div class="dok-baris">
      <span class="dok-ikon ${w}">${ic(d.status === 'diterima' ? 'betul' : k === 'gambar' ? 'orang' : 'buku')}</span>
      <span class="dok-isi"><b>${n}</b><span class="lencana ${w}">${st}</span>
        ${d.status === 'semula' && d.nota ? `<span class="kecil" style="color:var(--merah)">${esc(d.nota)}</span>` : boleh ? `<span class="kecil redup">${panduan}</span>` : ''}
        ${k === 'pasport' && a.pasport ? `<span class="kecil">No ${esc(a.pasport.no)} · luput ${fTkh(a.pasport.luput, 1)}</span>` : ''}
        ${k === 'vaksin' && boleh ? `<label class="kecil" style="display:flex;gap:6px;align-items:center">Tarikh suntikan <input type="date" class="input kecil-input" data-vaksin-tarikh="${esc(a.id)}" value="${esc(a.vaksinTarikh || '')}"></label>` : ''}
      </span>
      ${boleh ? (demo ? `<button class="btn kecil" type="button" data-aksi="toast" data-nilai="Paparan contoh: muat naik tidak dihantar">${butang}</button>`
        : `<label class="btn kecil${d.ada ? ' garis' : ''}">${d.ada ? 'Ganti' : butang}<input type="file" accept="image/*" ${k === 'gambar' ? 'capture="user"' : 'capture="environment"'} data-muatnaik="${k}" data-id="${esc(a.id)}" hidden></label>`) : ''}
    </div>`;
  }).join('');
  const sah = S.dokMrz && S.dokMrz.id === a.id ? S.dokMrz : null;
  return `<article class="kad ahli${buka ? ' buka' : ''}">
    <button type="button" class="ahli-kepala" data-aksi="dok-buka" data-nilai="${esc(a.id)}" aria-expanded="${buka}">
      <span class="ahli-avatar">${esc((a.nama || '?').trim()[0] || '?')}</span>
      <span style="flex:1;min-width:0;text-align:left"><b>${esc(a.nama)}</b><br><span class="kecil redup">${esc(a.hubungan)}${a.berlepas ? ' · berlepas ' + fTkh(a.berlepas, 1) : ''}</span></span>
      <span class="ahli-kemajuan"><b class="num">${lulus}/3</b><span class="kecil redup">diterima</span></span>
    </button>
    ${a.amaran ? `<div class="nota amaran">${ic('info')}<span>${esc(a.amaran)}</span></div>` : ''}
    ${!buka && perlu ? `<span class="kecil" style="padding:0 16px 14px;display:block;color:var(--merah)">${perlu} dokumen perlu tindakan</span>` : ''}
    ${buka ? `<div class="ahli-badan">
      ${sah ? borangMrz(a, sah) : ''}
      <div class="dok-senarai">${baris}</div>
      <details class="maklumat-ahli"${a.nama ? '' : ' open'}><summary>Maklumat jemaah${a.maklumat && a.maklumat.waris ? '' : ' <span class="lencana amber">Belum lengkap</span>'}</summary>${borangAhli(a, demo)}</details>
    </div>` : ''}
  </article>`;
}
function borangMrz(a, m) {
  const p = m.mrz || {};
  return `<form class="kad pad stack mrz" data-borang="pasport" data-id="${esc(a.id)}" style="gap:10px;border:2px solid var(--dakwat)">
    <b>${p.no ? 'Semak butiran pasport' : 'Isi butiran pasport'}</b>
    <span class="kecil redup">${p.no ? (p.semuaSah ? 'Dibaca dari kod di bawah halaman pasport. Pastikan betul.' : 'Sebahagian butiran mungkin tidak tepat. Sila semak dengan pasport.') : 'Kod pasport tidak dapat dibaca. Sila isi sendiri seperti dalam pasport.'}</span>
    <div class="grid-2">
      <label class="medan">No pasport<input class="input" name="no" value="${esc(p.no || '')}" required autocapitalize="characters"></label>
      <label class="medan">Tarikh luput<input class="input" type="date" name="luput" value="${esc(p.luput || '')}" required></label>
      <label class="medan">Nama keluarga<input class="input" name="namaKeluarga" value="${esc(p.namaKeluarga || '')}" autocapitalize="characters"></label>
      <label class="medan">Nama diberi<input class="input" name="namaDiberi" value="${esc(p.namaDiberi || '')}" autocapitalize="characters"></label>
      <label class="medan">Tarikh lahir<input class="input" type="date" name="lahir" value="${esc(p.lahir || '')}"></label>
      <label class="medan">Jantina<select class="input" name="jantina"><option value="L"${p.jantina === 'L' ? ' selected' : ''}>Lelaki</option><option value="P"${p.jantina === 'P' ? ' selected' : ''}>Perempuan</option></select></label>
    </div>
    <input type="hidden" name="negara" value="${esc(p.negara || 'MYS')}">
    ${m.amaran ? `<div class="nota amaran">${ic('info')}<span>${esc(m.amaran)}</span></div>` : ''}
    <p class="kecil" id="ralat-mrz" role="alert"></p>
    <button class="btn" type="submit">Simpan butiran pasport</button>
  </form>`;
}
function borangAhli(a, demo) {
  const m = a.maklumat || {}, baru = a.id === 'baru';
  return `<form class="stack" data-borang="ahli" data-id="${esc(baru ? '' : a.id)}" style="gap:12px;padding:4px 0" novalidate>
    <div class="grid-2">
      <label class="medan">Nama penuh seperti pasport<input class="input" name="nama" value="${esc(a.nama || (baru && !(S.dok || []).length && S.user ? (S.user.displayName || '') : ''))}" required></label>
      <label class="medan">Hubungan dengan anda<select class="input" name="hubungan">${HUBUNGAN.filter(h => h !== 'Saya' || baru && !(S.dok || []).some(x => x.hubungan === 'Saya') || a.hubungan === 'Saya').map(h => `<option${(a.hubungan || '') === h ? ' selected' : ''}>${h}</option>`).join('')}</select></label>
      <label class="medan">Tarikh berlepas (jika tahu)<input class="input" type="date" name="berlepas" value="${esc(a.berlepas || (baru ? tarikhBerlepasSaya() : ''))}"></label>
      <label class="medan">No telefon jemaah<input class="input" name="tel" type="tel" inputmode="tel" value="${esc(m.tel || '')}"></label>
      <label class="medan">Waris kecemasan (di Malaysia)<input class="input" name="waris" value="${esc(m.waris || '')}"></label>
      <label class="medan">No telefon waris<input class="input" name="telWaris" type="tel" inputmode="tel" value="${esc(m.telWaris || '')}"></label>
      <label class="medan">Mahram (bagi jemaah wanita)<input class="input" name="mahram" value="${esc(m.mahram || '')}" placeholder="Nama suami atau mahram"></label>
      <label class="medan">Rakan sebilik pilihan<input class="input" name="rakanBilik" value="${esc(m.rakanBilik || '')}"></label>
      <label class="medan">Saiz baju (untuk kit jemaah)<select class="input" name="saiz"><option value="">Pilih</option>${SAIZ.map(z => `<option${m.saiz === z ? ' selected' : ''}>${z}</option>`).join('')}</select></label>
    </div>
    <label class="medan">Keperluan khas (pilihan)<textarea class="input" name="khas" placeholder="Contoh: kerusi roda, diet rendah garam, ubat darah tinggi">${esc(m.khas || '')}</textarea></label>
    <label class="setuju"><input type="checkbox" name="setuju"${a.nama ? ' checked' : ''}> <span class="kecil">Saya bersetuju Juara Travel menyimpan maklumat dan dokumen ini untuk urusan visa dan perjalanan umrah sahaja, mengikut Akta Perlindungan Data Peribadi 2010. Dokumen dipadam secara automatik selepas perjalanan.</span></label>
    <p class="kecil" id="ralat-ahli-${esc(a.id)}" role="alert"></p>
    <div class="grid-2">${demo ? `<button class="btn" type="button" data-aksi="toast" data-nilai="Paparan contoh: tidak disimpan">Simpan maklumat</button>` : `<button class="btn" type="submit">Simpan maklumat</button>`}
    ${!baru && !demo ? `<button class="btn garis" type="button" data-aksi="dok-padam" data-nilai="${esc(a.id)}">Buang ahli ini</button>` : ''}</div>
  </form>`;
}
function vDokumen() {
  const demo = S.demo;
  if (!demo && !S.user) return kosong('IL-14', 'Dokumen', 'Log masuk untuk hantar dokumen', 'Imbas pasport, gambar dan sijil vaksin terus dari telefon. Tak perlu ke cawangan.', `<a class="btn" href="#/masuk">Log masuk</a>`);
  if (!demo && !S.dok && !S.dokRalat) muatDok();
  const senarai = demo ? CONTOH_DOK : (S.dok || []);
  const semua = senarai.length * 3, lulus = senarai.reduce((n, a) => n + DOK.filter(([k]) => a.dok[k].status === 'diterima').length, 0);
  return `
  <div class="stack" style="gap:6px"><h1>Dokumen umrah</h1><p class="redup">Hantar dokumen dari telefon. Staf Juara akan semak dan beritahu jika perlu dihantar semula.</p></div>
  ${senarai.length ? `<div class="kad pad kemajuan-dok"><div class="baris"><b>${lulus} daripada ${semua} dokumen diterima</b><span class="kecil redup">${senarai.length} jemaah</span></div><div class="maju-dok"><span style="width:${semua ? Math.round(lulus / semua * 100) : 0}%"></span></div></div>` : ''}
  ${S.dokRalat ? `<div class="nota amaran">${ic('info')}<span>${esc(S.dokRalat)}</span></div>` : ''}
  ${!demo && !S.dok && !S.dokRalat ? rangka(2, 120) : `<div class="stack">${senarai.map(a => kadAhli(a, demo)).join('')}
    ${S.dokBuka === 'baru' ? `<article class="kad ahli buka"><div class="ahli-kepala"><span class="ahli-avatar">+</span><b style="flex:1">${senarai.length ? 'Ahli keluarga baru' : 'Mula dengan maklumat anda'}</b></div><div class="ahli-badan">${borangAhli({ id: 'baru', nama: '', hubungan: senarai.length ? 'Pasangan' : 'Saya', maklumat: {} }, demo)}</div></article>`
      : `<button class="btn garis penuh" type="button" data-aksi="dok-buka" data-nilai="baru">${ic('orang')}Tambah ahli keluarga</button>`}</div>`}
  <div class="kad pad stack panduan-dok" style="gap:8px">
    <b>Tip imbas pasport</b>
    <span class="kecil">Letak pasport di atas meja gelap, buka muka surat berfoto. Pastikan 2 baris kod di bawah (&lt;&lt;&lt;) jelas. Apps akan baca nama, nombor dan tarikh luput secara automatik.</span>
    <span class="kecil redup">Dokumen disimpan dengan selamat di pelayan Juara dan hanya boleh dilihat oleh anda dan staf yang ditetapkan.</span>
  </div>`;
}

/* ===== Panel staf: semakan dokumen ===== */
async function muatAdminDok() {
  if (muatAdminDok.sedang) return; muatAdminDok.sedang = true;
  try { S.adminDok = { data: await apiDok('/admin/dokumen') }; } catch (e) { S.adminDok = { ralat: e.message }; }
  muatAdminDok.sedang = false; render(false);
}
function vAdminDok() {
  if (!S.adminDok) { muatAdminDok(); return rangka(4, 60); }
  if (S.adminDok.ralat) return `<div class="nota amaran">${ic('info')}<span>${esc(S.adminDok.ralat)}</span></div>`;
  const tapis = S.adminDokTapis || 'perlu';
  const rows = S.adminDok.data.filter(r => tapis === 'semua' || (tapis === 'perlu' ? DOK.some(([k]) => r.dok[k].status === 'disemak') : tapis === 'amaran' ? !!r.amaran : DOK.some(([k]) => r.dok[k].status === 'menunggu' || r.dok[k].status === 'semula')));
  const sel = (r, k) => { const d = r.dok[k], [st, w] = STATUS_DOK[d.status] || STATUS_DOK.menunggu; return `<td><span class="lencana ${w}">${st}</span>${d.ada ? `<div class="aksi-dok"><button class="btn garis kecil" type="button" data-aksi="dok-lihat" data-id="${esc(r.docId)}" data-jenis="${k}">Lihat</button>${d.status !== 'diterima' ? `<button class="btn kecil" type="button" data-aksi="dok-terima" data-id="${esc(r.docId)}" data-jenis="${k}">Terima</button>` : ''}<button class="btn garis kecil" type="button" data-aksi="dok-semula" data-id="${esc(r.docId)}" data-jenis="${k}">Semula</button></div>` : ''}${S.dokSemula === r.docId + k ? `<form class="semula" data-borang="dok-semula" data-id="${esc(r.docId)}" data-jenis="${k}"><input class="input" name="nota" placeholder="Sebab (dihantar kepada jemaah)" required><button class="btn kecil" type="submit">Hantar</button></form>` : ''}</td>`; };
  return `
  <div class="cips" role="group" aria-label="Tapis dokumen">${[['perlu', 'Perlu disemak'], ['tertunggak', 'Belum lengkap'], ['amaran', 'Amaran pasport'], ['semua', 'Semua']].map(([k, n]) => `<button type="button" class="cip" aria-pressed="${tapis === k}" data-aksi="admin-dok-tapis" data-nilai="${k}">${n}</button>`).join('')}</div>
  <p class="kecil redup">${rows.length} jemaah</p>
  <div class="kad" style="overflow-x:auto"><table class="jadual-staf">
    <thead><tr>${['Jemaah', 'Berlepas', 'Pasport', 'Gambar', 'Vaksin', 'Maklumat'].map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>
      <td><b>${esc(r.nama)}</b><br><span class="kecil redup">${esc(r.hubungan)} · ${esc(r.emel)}</span>${r.pasport ? `<br><span class="kecil">No ${esc(r.pasport.no)} · luput ${esc(r.pasport.luput)}</span>` : ''}${r.amaran ? `<br><span class="kecil" style="color:var(--merah)">${esc(r.amaran)}</span>` : ''}</td>
      <td class="kecil">${r.berlepas ? fTkh(r.berlepas, 1) : '-'}${r.kod ? '<br>' + esc(r.kod) : ''}</td>
      ${sel(r, 'pasport')}${sel(r, 'gambar')}${sel(r, 'vaksin')}
      <td class="kecil">${esc([r.maklumat.waris && 'Waris: ' + r.maklumat.waris + ' ' + (r.maklumat.telWaris || ''), r.maklumat.mahram && 'Mahram: ' + r.maklumat.mahram, r.maklumat.rakanBilik && 'Sebilik: ' + r.maklumat.rakanBilik, r.maklumat.saiz && 'Saiz ' + r.maklumat.saiz, r.maklumat.khas].filter(Boolean).join(' · ') || '-')}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}
async function lihatDok(id, jenis) {
  try {
    const b = await apiDok(`/admin/dokumen/fail?id=${encodeURIComponent(id)}&jenis=${encodeURIComponent(jenis)}`, { blob: true });
    const url = URL.createObjectURL(b), d = document.createElement('dialog'); d.className = 'dialog-video';
    d.innerHTML = `<img src="${url}" alt="Dokumen jemaah" style="max-width:100%;max-height:80vh;border-radius:8px"><button type="button" class="btn garis kecil" data-tutup>Tutup</button>`;
    document.body.appendChild(d);
    const tutup = () => { d.close(); d.remove(); URL.revokeObjectURL(url); };
    d.addEventListener('click', e => { if (e.target === d || e.target.hasAttribute('data-tutup')) tutup(); });
    d.addEventListener('cancel', e => { e.preventDefault(); tutup(); });
    d.showModal();
  } catch (e) { toast(e.message); }
}
async function statusDok(docId, jenis, status, nota = '') {
  try { await apiDok('/admin/dokumen/status', { method: 'POST', body: JSON.stringify({ docId, jenis, status, nota }) }); S.dokSemula = null; toast(status === 'diterima' ? 'Dokumen diterima' : 'Jemaah diminta hantar semula'); S.adminDok = null; render(false); }
  catch (e) { toast(e.message); }
}
async function muatNaikDok(input) {
  const f = input.files && input.files[0]; if (!f) return;
  const id = input.dataset.id, jenis = input.dataset.muatnaik;
  const lbl = input.closest('label'); if (lbl) { lbl.classList.add('sedang'); lbl.firstChild.textContent = 'Menghantar…'; }
  try {
    const data = await mampatGambar(f);
    const t = document.querySelector(`[data-vaksin-tarikh="${id}"]`);
    const r = await apiDok('/dokumen/muatnaik', { method: 'POST', body: JSON.stringify({ id, jenis, data, tarikh: t ? t.value : '' }) });
    if (jenis === 'pasport') S.dokMrz = { id, mrz: r.mrz, amaran: r.amaran };
    toast(jenis === 'pasport' ? (r.mrz ? 'Pasport dibaca. Sila semak butiran.' : 'Pasport dihantar. Sila isi butiran.') : 'Dokumen dihantar untuk semakan');
    S.dok = null; S.dokBuka = id; await muatDok();
  } catch (e) { toast(e.message); render(false); }
}

const NAV_TETAMU = [['', 'Utama', 'rumah'], ['pakej', 'Pakej', 'cari'], ['kursus', 'Kursus', 'buku'], ['cawangan', 'Cawangan', 'pin'], ['masuk', 'Log masuk', 'orang']];
const NAV_JEMAAH = [['saya', 'Utama', 'rumah'], ['pakej', 'Pakej', 'cari'], ['kursus', 'Kursus', 'buku'], ['perjalanan', 'Perjalanan', 'kalendar'], ['akaun', 'Akaun', 'orang']];
// Pautan tambahan di menu atas (desktop) untuk jemaah
const NAV_JEMAAH_ATAS = [['dokumen', 'Dokumen'], ['cawangan', 'Cawangan'], ['bayaran', 'Bayaran'], ['mata', 'Mata Juara']];
const JEMAAH = new Set(['saya', 'perjalanan', 'bayaran', 'persediaan', 'akaun', 'dokumen']);
const TAJUK = { '': 'Juara Travel', pakej: 'Pakej umrah', kursus: 'Kursus umrah', cawangan: 'Cawangan', masuk: 'Log masuk', solat: 'Waktu solat', kredit: 'Kredit gambar', admin: 'Pendaftaran', tempah: 'Tempah', bayar: 'Bayaran deposit', mata: 'Mata Juara', dokumen: 'Dokumen umrah', saya: 'Utama jemaah', perjalanan: 'Perjalanan', bayaran: 'Bayaran', persediaan: 'Persediaan', akaun: 'Akaun' };

function laluan() {
  const [nama = '', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return { nama, args };
}

let laluanLepas = null;
function render(alih = true) {
  let { nama, args } = laluan();
  if (nama === 'contoh') { S.demo = true; store.set('demo', true); location.replace('#/saya'); return; }
  if (JEMAAH.has(nama) && !S.demo && !S.user && S.authSedia) { location.replace('#/masuk'); return; }
  if (S.user && (nama === '' || nama === 'masuk')) { location.replace('#/saya'); return; }
  const jemaah = S.demo || !!S.user;
  const nav = jemaah ? NAV_JEMAAH : NAV_TETAMU;
  const akar = nama === 'tempah' || nama === 'bayar' ? 'pakej' : nama;
  const kini = k => (k === akar || (k === 'pakej' && nama === 'pakej')) ? ' aria-current="page"' : '';

  $('atas').innerHTML = `<div class="dalam">
    <a class="logo" href="#/${jemaah ? 'saya' : ''}" aria-label="Juara Travel, utama"><img src="logo-juara.png" alt="Juara Travel"></a>
    <nav aria-label="Menu utama">${nav.filter(([k]) => k !== 'masuk' && k !== 'akaun').map(([k, n]) => `<a href="#/${k}"${kini(k)}>${n}</a>`).join('')}${jemaah ? NAV_JEMAAH_ATAS.map(([k, n]) => `<a href="#/${k}"${kini(k)}>${n}</a>`).join('') : '<a href="#/mata"' + kini('mata') + '>Mata Juara</a>'}</nav>
    <span class="kanan">${jemaah ? `<a class="pil" href="#/akaun">${ic('orang')}Akaun</a>` : `<a class="pil" href="#/masuk">Log masuk</a>`}</span>
  </div>`;
  $('bawah').innerHTML = nav.map(([k, n, i]) => `<a href="#/${k}"${kini(k)}>${ic(i)}${n}</a>`).join('');
  const jalur = $('contoh');
  jalur.hidden = !S.demo;
  if (S.demo) jalur.innerHTML = `<span>Paparan contoh: data di bawah bukan data sebenar</span><button type="button" data-aksi="keluar-contoh">Keluar</button>`;

  const V = { dokumen: vDokumen, mata: vMata, bayar: vBayar, '': vUtama, pakej: () => args[0] ? vButiran(args[0]) : vPakej(), tempah: () => vTempah(args[0], args[1]), kursus: vKursus, cawangan: vCawangan, solat: vSolat, masuk: vMasuk, kredit: vKredit, admin: vAdmin, saya: vSaya, perjalanan: vPerjalanan, bayaran: vBayaran, persediaan: vPersediaan, akaun: vAkaun };
  $('isi').innerHTML = (V[nama] || vUtama)();
  document.body.classList.toggle('ada-bar', nama === 'pakej' && !!args[0]);
  const p = nama === 'pakej' && args[0] && cariPakej(args[0]);
  document.title = (p ? p.nama : TAJUK[nama] || 'Juara Travel') + (nama ? ' · Juara Travel' : '');
  const key = location.hash;
  if (alih && key !== laluanLepas) { window.scrollTo(0, 0); $('isi').focus({ preventScroll: true }); }
  laluanLepas = key;
}

function toast(t) {
  const el = $('toast'); el.textContent = t; el.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2600);
}

/* ===== Peristiwa ===== */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-aksi]');
  if (!el) return;
  const a = el.dataset.aksi, v = el.dataset.nilai;
  if (a === 'kat') { S.f.kat = v; if (location.hash !== '#/pakej') { e.preventDefault(); location.hash = '#/pakej'; } else render(false); }
  else if (a === 'seat') { S.f.seat = !S.f.seat; render(false); }
  else if (a === 'set-semula') { S.f = { bulan: '', bajet: '', kat: 'Semua', seat: true, orang: S.f.orang || 1 }; render(false); }
  else if (a === 'bulan-lain') { S.f.bulan = ''; render(false); }
  else if (a === 'pilih-kumpulan') { S.pilih[el.dataset.id] = el.dataset.kod; render(false); }
  else if (a === 'zon') { S.zon = v; render(false); }
  else if (a === 'kaedah') { S.kaedah = v; render(false); }
  else if (a === 'bayar-ujian') bayarUjian();
  else if (a === 'cetak') window.print();
  else if (a === 'main-video') mainVideo(+v);
  else if (a === 'dok-buka') { S.dokBuka = S.dokBuka === v ? null : v; if (!(S.dokMrz && S.dokMrz.id === v)) S.dokMrz = null; render(false); }
  else if (a === 'dok-padam') { if (S.dokPadam !== v) { S.dokPadam = v; toast('Tekan sekali lagi untuk buang ahli dan dokumennya'); } else { apiDok('/dokumen/padam', { method: 'POST', body: JSON.stringify({ id: v }) }).then(() => { S.dok = null; S.dokBuka = null; toast('Ahli dibuang'); muatDok(); }).catch(e => toast(e.message)); } }
  else if (a === 'admin-tab') { S.adminTab = v; render(false); }
  else if (a === 'admin-dok-tapis') { S.adminDokTapis = v; render(false); }
  else if (a === 'dok-lihat') lihatDok(el.dataset.id, el.dataset.jenis);
  else if (a === 'dok-terima') statusDok(el.dataset.id, el.dataset.jenis, 'diterima');
  else if (a === 'dok-semula') { S.dokSemula = S.dokSemula === el.dataset.id + el.dataset.jenis ? null : el.dataset.id + el.dataset.jenis; render(false); }
  else if (a === 'pilih-tarikh') { S.pilih[el.dataset.id] = el.dataset.kod; render(false); }
  else if (a === 'semua-tarikh') { S.semua[el.dataset.id] = true; render(false); }
  else if (a === 'pilih-dari-senarai') { S.pilih[el.dataset.id] = el.dataset.kod; }
  else if (a === 'lokasi') { S.lokasi = v; store.set('lokasi', v); render(false); }
  else if (a === 'keluar-contoh') { S.demo = false; store.set('demo', false); location.hash = '#/'; }
  else if (a === 'muat-semula') { S.ralat = ''; render(false); muat(); }
  else if (a === 'toast') toast(v);
  else if (a === 'masuk-google') masukGoogle();
  else if (a === 'admin-jenis') { S.adminJenis = v; render(false); }
  else if (a === 'kalendar-kursus') { if (S.kursusSiap && S.kursusSiap.kursus) kalendarKursus(S.kursusSiap.kursus); }
  else if (a === 'muat-csv') muatCsv();
  else if (a === 'log-keluar') { if (AUTH) AUTH.signOut(); S.saya = null; S.dok = null; S.adminDok = null; location.hash = '#/'; toast('Anda telah log keluar'); }
  else if (a === 'tukar-ic') { store.set(icKunci(), ''); S.saya = null; S.sayaRalat = ''; location.hash = '#/saya'; render(false); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.f) { S.f[el.dataset.f] = el.dataset.f === 'orang' ? +el.value : el.value; if (el.dataset.f === 'orang') { S.bil = {}; S.pilih = {}; if (laluan().nama === '') render(false); } if (laluan().nama === 'pakej') render(false); else { const b = el.form && el.form.querySelector('button[type=submit]'); if (b) b.textContent = `Lihat ${bilTarikh(tapis({ ...S.f, kat: 'Semua' }))} tarikh`; } }
  else if (el.dataset.aksiUbah === 'negeri-kursus') { S.kursusNegeri = el.value; S.kursusPilih = null; render(false); }
  else if (el.name === 'kursusId') { S.kursusPilih = el.value; }
  else if (el.dataset.muatnaik) muatNaikDok(el);
  else if (el.dataset.pilih === 'bilik' || el.dataset.pilih === 'bil') {
    if (el.form && el.form.dataset.borang === 'tempah') { const fd = new FormData(el.form); S.draf = { nama: fd.get('nama'), tel: fd.get('tel'), nota: fd.get('nota'), ruj: fd.get('ruj') }; }
    if (el.dataset.pilih === 'bilik') S.bilik[el.dataset.id] = el.value; else S.bil[el.dataset.id] = +el.value;
    render(false);
  }
});
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.dataset.borang === 'cari') { e.preventDefault(); S.f.kat = 'Semua'; location.hash = '#/pakej'; }
  else if (f.dataset.borang === 'kursus') {
    e.preventDefault();
    const fd = new FormData(f), salah = $('ralat-kursus'), btn = f.querySelector('button[type=submit]');
    const kid = fd.get('kursusId');
    const d = { jenis: 'kursus', nama: fd.get('nama'), tel: fd.get('tel'), bil: fd.get('bil'), anggaran: fd.get('anggaran'), setuju: fd.get('setuju') === 'on',
      kursusId: kid || '', sesi: kid ? '' : 'Minta dihubungi untuk sesi terdekat' + (S.kursusNegeri ? ' (' + S.kursusNegeri + ')' : '') };
    if (kid === null) { salah.textContent = 'Sila pilih sesi kursus, atau "Tiada sesi yang sesuai".'; return; }
    if (String(d.nama || '').trim().length < 2) { salah.textContent = 'Sila isi nama penuh.'; return; }
    if (String(d.tel || '').replace(/\D/g, '').length < 9) { salah.textContent = 'Sila isi nombor telefon yang sah.'; return; }
    if (!d.anggaran) { salah.textContent = 'Sila pilih anggaran bila mahu pergi umrah.'; return; }
    if (!d.setuju) { salah.textContent = 'Sila tandakan persetujuan notis privasi.'; return; }
    btn.disabled = true; btn.textContent = 'Sedang hantar…'; salah.textContent = '';
    hantarDaftar(d).then(r => { S.kursusSiap = { nama: String(d.nama).trim().split(/\s+/)[0], kursus: r && r.kursus }; render(); })
      .catch(err => { salah.textContent = err.message; btn.disabled = false; btn.textContent = 'Daftar kursus'; });
  }
  else if (f.dataset.borang === 'ahli') {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), salah = f.querySelector('[role=alert]'), btn = f.querySelector('button[type=submit]');
    const ralat = String(d.nama || '').trim().length < 2 ? 'Sila isi nama penuh seperti dalam pasport.' : !d.setuju ? 'Sila tandakan persetujuan notis privasi.' : '';
    if (ralat) { salah.textContent = ralat; salah.style.color = 'var(--merah)'; return; }
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    apiDok('/dokumen/ahli', { method: 'POST', body: JSON.stringify({ id: f.dataset.id || undefined, nama: d.nama, hubungan: d.hubungan, berlepas: d.berlepas, setuju: true, maklumat: { tel: d.tel, waris: d.waris, telWaris: d.telWaris, mahram: d.mahram, rakanBilik: d.rakanBilik, saiz: d.saiz, khas: d.khas } }) })
      .then(x => { toast('Maklumat disimpan'); S.dok = null; S.dokBuka = x.id; muatDok(); })
      .catch(err => { salah.textContent = err.message; salah.style.color = 'var(--merah)'; btn.disabled = false; btn.textContent = 'Simpan maklumat'; });
  }
  else if (f.dataset.borang === 'pasport') {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), btn = f.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    apiDok('/dokumen/pasport', { method: 'POST', body: JSON.stringify({ id: f.dataset.id, ...d }) })
      .then(x => { S.dokMrz = null; toast(x.amaran ? 'Disimpan. Sila perhatikan amaran pasport.' : 'Butiran pasport disimpan'); S.dok = null; muatDok(); })
      .catch(err => { $('ralat-mrz').textContent = err.message; $('ralat-mrz').style.color = 'var(--merah)'; btn.disabled = false; btn.textContent = 'Simpan butiran pasport'; });
  }
  else if (f.dataset.borang === 'dok-semula') { e.preventDefault(); statusDok(f.dataset.id, f.dataset.jenis, 'semula', new FormData(f).get('nota')); }
  else if (f.dataset.borang === 'hubung') {
    e.preventDefault();
    const icNo = String(new FormData(f).get('ic') || '').replace(/\D/g, '');
    if (icNo.length !== 12) { $('ralat-hubung').textContent = 'No IC mesti 12 digit.'; return; }
    muatSaya(icNo);
  }
  else if (f.dataset.borang === 'tempah') {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), id = f.dataset.id, kod = f.dataset.kod;
    const tel = String(d.tel || '').replace(/[^\d+]/g, '');
    const salah = !String(d.nama || '').trim() ? 'Sila isi nama penuh.' : tel.replace(/\D/g, '').length < 9 ? 'Sila isi nombor telefon yang sah.' : '';
    if (salah) { $('ralat-tempah').textContent = salah; $('ralat-tempah').style.color = 'var(--merah)'; return; }
    const p = cariPakej(id), t = p.tarikh.find(x => x.kod === kod), bk = BILIK.find(([k]) => k === d.bilik);
    S.bilik[id] = d.bilik; S.bil[id] = +d.bil; S.draf = { nama: d.nama, tel: d.tel, nota: d.nota, ruj: d.ruj };
    const ruj = String(d.ruj || '').trim().toUpperCase(); if (ruj) d.nota = [d.nota && d.nota.trim(), 'Kod rujukan: ' + ruj].filter(Boolean).join(' | ');
    if (e.submitter && e.submitter.value === 'bayar') {
      S.bayar = { id, kod, d: t.d, pakej: p.nama, nama: String(d.nama).trim(), tel, bil: +d.bil, bilik: d.bilik, bilikN: bk ? bk[1] : d.bilik, nota: (d.nota || '').trim(), jumlah: JT.depositSeorang * +d.bil, jumlahPenuh: (t.bilik[d.bilik] || t.harga) * +d.bil };
      location.hash = '#/bayar'; return;
    }
    const msg = ['Assalamualaikum Juara Travel. Saya ingin menempah:', `Pakej: ${p.nama}`, `Berlepas: ${fHari(t.d)}, ${fTkh(t.d, 1)} (${t.kod})`, `Bilik: ${bk ? bk[1] : d.bilik} · ${rm(t.bilik[d.bilik])} seorang`, `Bilangan: ${d.bil} orang`, `Jumlah anggaran: ${rm(t.bilik[d.bilik] * d.bil)} · deposit ${rm(JT.depositSeorang * d.bil)}`, `Nama: ${String(d.nama).trim()}`, `Telefon: ${tel}`].concat(d.nota && d.nota.trim() ? [`Nota: ${d.nota.trim()}`] : []).join('\n');
    S.tempahWa = wa(msg); S.tempahSiap = kod;
    window.open(S.tempahWa, '_blank', 'noopener');
    // Simpan juga sebagai rekod bakal pelanggan untuk susulan staf
    hantarDaftar({ jenis: 'tempah', nama: d.nama, tel, bil: d.bil, pakej: p.nama, tarikh: t.d, kod: t.kod, bilik: d.bilik, nota: d.nota, setuju: true }, true).catch(() => {});
    render();
  }
});
window.addEventListener('hashchange', () => { const n = laluan().nama; if (n !== 'tempah') S.tempahSiap = null; if (n !== 'bayar' && n !== 'tempah') S.bayar = null; if (n !== 'kursus') S.kursusSiap = null; if (n !== 'admin') S.admin = null; render(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - S.dimuat > 15 * 60 * 1000) muat(); });
setInterval(() => { const n = laluan().nama; if (n === '' || n === 'solat' || n === 'saya') render(false); }, 60000);

try { const ruj = new URLSearchParams(location.search).get('ruj'); if (ruj && /^JT[0-9A-Z]{6}$/i.test(ruj)) store.set('ruj', ruj.toUpperCase()); } catch (e) { /* abaikan */ }
mulaAuth();
render(false);
muat();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
