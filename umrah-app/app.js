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
  bulan: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IKON[n] || ''}</svg>`;

/* ===== Keadaan ===== */
const S = {
  data: null, sumber: '', ralat: '', dimuat: 0,
  f: { bulan: '', bajet: '', kat: 'Semua', seat: true },
  pilih: {}, bilik: {}, bil: {}, semua: {},
  demo: store.get('demo', false),
  lokasi: store.get('lokasi', 'kl'),
  tempahSiap: null
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
    tarikh: p.tarikh.filter(t => (!f.bulan || t.d.slice(0, 7) === f.bulan) && (!f.bajet || t.harga <= +f.bajet) && (!f.seat || t.k > 0) && (f.kat !== 'Cuti sekolah' || t.cuti))
  })).filter(p => p.tarikh.length && (f.kat === 'Semua' || f.kat === 'Cuti sekolah' || p.kat === f.kat));
}
const bilTarikh = senarai => senarai.reduce((a, p) => a + p.tarikh.length, 0);
function seatTeks(k) { return k <= 0 ? ['Penuh', 'seat-penuh'] : [`Baki ${k} kerusi`, k <= 5 ? 'seat-sikit' : 'seat-ok']; }
const jarak = h => { const j = ((h && h.b) || []).find(x => /±/.test(x)); return j ? ' ' + j : ''; };
const BILIK = [['quad', 'Quad', 4], ['triple', 'Triple', 3], ['double', 'Double', 2], ['quint', 'Quint', 5]];

/* Gambar: kod ikut brief gambar. Jika JT.gambar ada fail, papar gambar sebenar. */
function kodPakej(p) {
  const n = p.nama.toLowerCase();
  if (/train/.test(n)) return ['IT-18', 'Kereta api Haramain'];
  if (/taif|badar/.test(n)) return ['PK-06', 'Taif & Badar'];
  return ({ 'Ekonomi': ['PK-01', 'Ekonomi'], 'Menara Jam': ['PK-02', 'Menara Jam'], 'Plus Turki': ['PK-03', 'Plus Turki'], 'Ramadhan': ['PK-04', 'Ramadhan'], 'Syawal': ['PK-05', 'Syawal'], 'Syaaban': ['PK-05', 'Syaaban'] })[p.kat] || ['PK-01', 'Umrah'];
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

/* ===== Komponen ===== */
function kadPakej(p) {
  const [kod, lbl] = kodPakej(p), t0 = p.tarikh[0];
  const hargaMin = Math.min(...p.tarikh.map(t => t.harga));
  const info = [p.hari, t0.syarikat, t0.laluan].filter(Boolean).join(' · ');
  const hotel = [t0.makkah && `Makkah: ${t0.makkah.nama}${jarak(t0.makkah)}`, t0.madinah && `Madinah: ${t0.madinah.nama}${jarak(t0.madinah)}`].filter(Boolean).join(' · ');
  const pil = p.tarikh.slice(0, 3).map(t => `<span><b>${fTkh(t.d)}</b><span class="${seatTeks(t.k)[1]}">${t.k > 0 ? 'Baki ' + t.k : 'Penuh'}</span></span>`).join('');
  return `<a class="kad pk" href="#/pakej/${esc(p.id)}">
    ${gb(kod, lbl)}
    <div class="isi">
      <span class="kat">${esc(p.kat)}${p.tarikh.some(t => t.cuti) ? ' · Cuti sekolah' : ''}</span>
      <span class="nama">${esc(p.nama)}</span>
      <span class="kecil redup">${esc(info)}</span>
      ${hotel ? `<span class="kecil" style="color:var(--dakwat2)">${esc(hotel)}</span>` : ''}
      <div class="tarikh-pil">${pil}${p.tarikh.length > 3 ? `<span class="redup" style="justify-content:center">+${p.tarikh.length - 3} lagi</span>` : ''}</div>
      <div class="harga"><span class="kecil redup">Dari, seorang</span><b class="num">${rm(hargaMin)}</b></div>
    </div>
  </a>`;
}
function barisRingkas({ p, t }) {
  const [kod] = kodPakej(p), [s, c] = seatTeks(t.k);
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

/* ===== Skrin tetamu ===== */
function vUtama() {
  if (!S.data) return S.ralat ? kosong('IL-09', 'Ralat sistem', 'Tidak dapat memuat pakej', esc(S.ralat), `<button class="btn" type="button" data-aksi="muat-semula">Cuba lagi</button>`) : rangka(1, 220) + rangka(4, 110);
  const f = S.f, bil = bilTarikh(tapis({ ...f, kat: 'Semua' }));
  const dekat = semuaTarikh().filter(x => x.t.k > 0).slice(0, 4);
  const kat = senaraiKat().filter(k => k !== 'Semua' && k !== 'Cuti sekolah').slice(0, 4).map(k => {
    const ps = pakejAktif().filter(p => p.kat === k), min = Math.min(...ps.flatMap(p => p.tarikh.map(t => t.harga)));
    const [kod, lbl] = kodPakej(ps[0]);
    return `<a href="#/pakej" data-aksi="kat" data-nilai="${esc(k)}" style="display:flex;flex-direction:column;gap:8px;color:var(--dakwat)">${gb(kod, lbl, 'r43')}<span><b>${esc(k)}</b><br><span class="kecil redup">Dari ${rm(min)}</span></span></a>`;
  }).join('');
  return `
  <section class="hero">
    <div class="stack" style="gap:16px">
      <h1>Cari tarikh umrah yang sesuai dengan anda</h1>
      <p class="redup kecil">${esc(sumberTeks())}</p>
      <form class="kad pad carian" data-borang="cari">
        <label class="medan">Bulan berlepas<select class="input" data-f="bulan"><option value="">Semua bulan</option>${senaraiBulan().map(b => `<option value="${b}"${f.bulan === b ? ' selected' : ''}>${fBulan(b)}</option>`).join('')}</select></label>
        <label class="medan">Bajet seorang<select class="input" data-f="bajet">${BAJET.map(([v, n]) => `<option value="${v}"${f.bajet === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
        <button class="btn" type="submit">Lihat ${bil} tarikh</button>
      </form>
      <div class="cips" role="group" aria-label="Jenis pakej">${senaraiKat().slice(1).map(k => `<button type="button" class="cip" data-aksi="kat" data-nilai="${esc(k)}">${esc(k)}</button>`).join('')}</div>
    </div>
    <div>
      <div class="tajuk-seksyen"><h2>Berlepas tidak lama lagi</h2><a href="#/pakej">Semua</a></div>
      <div class="stack">${dekat.map(barisRingkas).join('') || '<p class="redup">Tiada tarikh dengan seat kosong buat masa ini.</p>'}</div>
    </div>
  </section>

  <section>
    <div class="tajuk-seksyen"><h2>Ikut jenis pakej</h2></div>
    <div class="grid-2 lebar">${kat}</div>
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
    <div class="stack">${kadSolat()}<a class="kad pad" href="#/cawangan" style="color:var(--dakwat);display:flex;gap:12px;align-items:center">${ic('pin')}<span><b>Cawangan Juara</b><br><span class="kecil redup">Alamat, waktu buka dan arah</span></span></a></div>
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
      <label class="medan">Bajet seorang<select class="input" data-f="bajet">${BAJET.map(([v, n]) => `<option value="${v}"${f.bajet === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
    </div>
    <div class="cips" role="group" aria-label="Jenis pakej">${senaraiKat().map(k => `<button type="button" class="cip" aria-pressed="${f.kat === k}" data-aksi="kat" data-nilai="${esc(k)}">${esc(k)}</button>`).join('')}</div>
    <div class="baris kecil redup" style="flex-wrap:wrap">
      <span>${bilTarikh(hasil)} tarikh dalam ${hasil.length} pakej</span>
      <button type="button" class="cip" aria-pressed="${f.seat}" data-aksi="seat">Ada seat sahaja</button>
    </div>
    <p class="kecil redup">${esc(sumberTeks())}</p>
  </div>
  ${hasil.length ? `<div class="grid-pakej">${hasil.map(kadPakej).join('')}</div>`
    : kosong('IL-07', 'Tiada hasil', 'Tiada tarikh yang sepadan', 'Cuba bulan lain atau bajet yang lebih tinggi.', `<button class="btn garis" type="button" data-aksi="set-semula">Papar semua pakej</button>`)}`;
}

function cariPakej(id) { return S.data && S.data.pakej.find(p => p.id === id); }
function vButiran(id) {
  if (!S.data) return rangka(1, 260) + rangka(3, 120);
  const asal = cariPakej(id), h = hariIni();
  const p = asal && { ...asal, tarikh: asal.tarikh.filter(t => t.d >= h) };
  if (!p || !p.tarikh.length) return kosong('IL-07', 'Tiada pakej', 'Pakej ini tiada tarikh akan datang', 'Tarikh mungkin sudah penuh atau tamat. Lihat pakej lain.', `<a class="btn" href="#/pakej">Lihat semua pakej</a>`);
  const sel = p.tarikh.find(t => t.kod === S.pilih[id]) || p.tarikh.find(t => t.k > 0) || p.tarikh[0];
  S.pilih[id] = sel.kod;
  const [kod, lbl] = kodPakej(p);
  const mk = sel.makkah, md = sel.madinah, sm = slug(mk && mk.nama), sd = slug(md && md.nama);
  const bilikAda = BILIK.filter(([k]) => sel.bilik && sel.bilik[k]);
  const bk = bilikAda.find(([k]) => k === S.bilik[id]) || bilikAda[0];
  const bil = S.bil[id] || 1;
  const hargaBilik = bk ? sel.bilik[bk[0]] : sel.harga;
  const hotelKad = (bandar, ho, s, masjid) => ho ? `<div class="kad hotel" style="overflow:hidden">
      <div class="gambar3">${gb(`HT-${s}-1`, 'Fasad', '')}<div>${gb(`HT-${s}-2`, 'Bilik', '')}${gb(`HT-${s}-3`, `Laluan ke ${masjid}`, '')}</div></div>
      <div class="pad" style="display:flex;flex-direction:column;gap:2px"><span class="kecil redup">${bandar}</span><b>${esc(ho.nama)}</b><span class="kecil" style="color:var(--dakwat2)">${esc((ho.b || []).join(' · '))}</span></div>
    </div>` : '';
  const penuh = sel.k <= 0;
  const ringkasan = `
    <div class="kad ringkasan">
      <div><span class="kecil redup">Seorang, bilik ${bk ? bk[1].toLowerCase() : ''}</span><br><b class="num" style="font-size:30px;line-height:1.1">${rm(hargaBilik)}</b></div>
      <label class="medan">Bilik<select class="input" data-pilih="bilik" data-id="${esc(id)}">${bilikAda.map(([k, n, o]) => `<option value="${k}"${bk && bk[0] === k ? ' selected' : ''}>${n} (${o} orang sebilik) · ${rm(sel.bilik[k])}</option>`).join('')}</select></label>
      <label class="medan">Bilangan jemaah<select class="input" data-pilih="bil" data-id="${esc(id)}">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option value="${n}"${bil === n ? ' selected' : ''}>${n} orang</option>`).join('')}</select></label>
      <div class="baris" style="border-top:1px solid var(--garis);padding-top:12px"><span>Jumlah anggaran</span><b class="num">${rm(hargaBilik * bil)}</b></div>
      <div class="baris kecil redup" style="margin-top:-8px"><span>Deposit</span><span class="num">${rm(JT.depositSeorang * bil)}</span></div>
      ${penuh ? `<button class="btn penuh" type="button" disabled>Tarikh ini penuh</button>` : `<a class="btn penuh" href="#/tempah/${esc(id)}/${esc(sel.kod)}">Tempah ${fTkh(sel.d)}</a>`}
      <a class="btn garis penuh" href="${wa(`Assalamualaikum Juara Travel. Saya ingin bertanya tentang ${p.nama}, berlepas ${fTkh(sel.d, 1)} (${sel.kod}).`)}" target="_blank" rel="noopener">Tanya melalui WhatsApp</a>
    </div>`;
  return `
  <a href="#/pakej" class="kecil" style="font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-bottom:-12px">${ic('kembali')}Semua pakej</a>
  <div class="galeri">${gb(kod, lbl, 'r169')}${mk ? gb(`HT-${sm}-1`, mk.nama) + gb(`HT-${sm}-2`, 'Bilik') : ''}${md ? gb(`HT-${sd}-1`, md.nama) + gb(`HT-${sd}-3`, 'Laluan ke Nabawi') : ''}</div>
  <div class="dua-lajur">
    <div class="kiri">
      <div class="stack" style="gap:6px">
        <span class="kecil redup" style="font-weight:600">${esc(p.kat)}${sel.cuti ? ' · Cuti sekolah' : ''}</span>
        <h1 style="font-size:clamp(1.5rem,3vw,2.2rem)">${esc(p.nama)}</h1>
        <span class="redup">${esc([p.hari, sel.syarikat, sel.laluan].filter(Boolean).join(' · '))}</span>
      </div>
      <section class="stack">
        <h2>Pilih tarikh berlepas</h2>
        <div class="tarikh-pilih">${(S.semua[id] || p.tarikh.length <= 8 ? p.tarikh : p.tarikh.slice(0, 8).concat(p.tarikh.slice(8).filter(t => t.kod === sel.kod))).map(t => { const [s, c] = seatTeks(t.k); return `<button type="button" data-aksi="pilih-tarikh" data-id="${esc(id)}" data-kod="${esc(t.kod)}" aria-pressed="${t.kod === sel.kod}"${t.k <= 0 ? ' disabled' : ''}><b>${fHari(t.d)}, ${fTkh(t.d)}</b><br><span class="kecil ${c}">${t.k > 0 ? 'Baki ' + t.k : s}</span></button>`; }).join('')}</div>
        ${!S.semua[id] && p.tarikh.length > 8 ? `<button type="button" class="btn garis kecil" data-aksi="semua-tarikh" data-id="${esc(id)}">Lihat semua ${p.tarikh.length} tarikh</button>` : ''}
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
      <p class="redup" style="max-width:460px">WhatsApp dibuka dengan butiran tempahan anda. Tekan Hantar di WhatsApp. Staf Juara akan menghubungi anda untuk deposit dan dokumen.</p>
      <a class="btn" href="${esc(S.tempahWa || '#')}" target="_blank" rel="noopener">Buka WhatsApp semula</a>
      <a href="#/pakej/${esc(id)}">Kembali ke pakej</a>
    </div>`;
  const bilikAda = BILIK.filter(([k]) => t.bilik && t.bilik[k]);
  const bk = S.bilik[id] || (bilikAda[0] && bilikAda[0][0]), bil = S.bil[id] || 1;
  return `
  <a href="#/pakej/${esc(id)}" class="kecil" style="font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-bottom:-12px">${ic('kembali')}Kembali</a>
  <div class="dua-lajur">
    <form class="kiri" data-borang="tempah" data-id="${esc(id)}" data-kod="${esc(kod)}" novalidate>
      <h1 style="font-size:clamp(1.5rem,3vw,2.2rem)">Tempah tarikh ini</h1>
      <div class="kad pad stack" style="gap:4px">
        <b>${esc(p.nama)}</b>
        <span class="redup">${fHari(t.d)}, ${fTkh(t.d, 1)} hingga ${fTkh(t.p, 1)} · ${esc(t.kod)}</span>
        <span class="kecil ${seatTeks(t.k)[1]}">${seatTeks(t.k)[0]}</span>
      </div>
      <label class="medan">Nama penuh<input class="input" name="nama" autocomplete="name" required></label>
      <label class="medan">Nombor telefon<input class="input" name="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="012-345 6789" required></label>
      <div class="grid-2">
        <label class="medan">Bilik<select class="input" name="bilik">${bilikAda.map(([k, n]) => `<option value="${k}"${bk === k ? ' selected' : ''}>${n} · ${rm(t.bilik[k])}</option>`).join('')}</select></label>
        <label class="medan">Bilangan jemaah<select class="input" name="bil">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option value="${n}"${bil === n ? ' selected' : ''}>${n} orang</option>`).join('')}</select></label>
      </div>
      <label class="medan">Nota (pilihan)<textarea class="input" name="nota" placeholder="Contoh: warga emas, perlu kerusi roda"></textarea></label>
      <p class="kecil redup" id="ralat-tempah" role="alert"></p>
      <button class="btn penuh" type="submit">Hantar tempahan melalui WhatsApp</button>
      <p class="kecil redup">Tempahan disahkan selepas staf Juara menghubungi anda dan deposit ${rm(JT.depositSeorang)} seorang diterima.</p>
    </form>
  </div>`;
}

function vKursus() {
  return `
  <div class="stack" style="gap:6px"><h1>Kursus umrah</h1><p class="redup">Percuma dan terbuka kepada semua, walaupun anda belum tempah pakej.</p></div>
  ${kosong('OR-05', 'Suasana kursus', 'Jadual kursus akan dipaparkan di sini', 'Kami sedang menyambungkan jadual kursus dari sistem Juara. Sementara itu, tanya tarikh kursus terdekat melalui WhatsApp.',
    `<a class="btn" href="${wa('Assalamualaikum Juara Travel. Bila kursus umrah yang terdekat? Saya ingin hadir.')}" target="_blank" rel="noopener">${ic('telefon')}Tanya jadual kursus</a>`)}`;
}

function vCawangan() {
  const c = JT.cawangan || [];
  return `
  <div class="stack" style="gap:6px"><h1>Cawangan</h1><p class="redup">Datang ke cawangan atau hubungi kami.</p></div>
  ${c.length ? `<div class="grid-pakej">${c.map(x => `<div class="kad" style="overflow:hidden">${gb('OR-03', x.nama, 'r43')}<div class="pad stack" style="gap:4px"><b>${esc(x.nama)}</b><span class="redup">${esc(x.alamat || '')}</span>${x.waktu ? `<span class="kecil redup">${esc(x.waktu)}</span>` : ''}<div class="grid-2" style="margin-top:8px">${x.peta ? `<a class="btn garis kecil" href="${esc(x.peta)}" target="_blank" rel="noopener">Arah</a>` : ''}${x.telefon ? `<a class="btn garis kecil" href="https://wa.me/${esc(x.telefon)}" target="_blank" rel="noopener">WhatsApp</a>` : ''}</div></div></div>`).join('')}</div>`
    : kosong('OR-03', 'Fasad cawangan', 'Senarai cawangan akan dikemas kini', 'Alamat, waktu buka dan arah ke setiap cawangan akan dipaparkan di sini. Hubungi kami untuk cawangan terdekat.',
      `<a class="btn" href="${wa('Assalamualaikum Juara Travel. Di mana cawangan Juara yang terdekat dengan saya?')}" target="_blank" rel="noopener">${ic('telefon')}Tanya cawangan terdekat</a>`)}`;
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
    <div class="nota">${ic('info')}<span>Log masuk dengan nombor telefon sedang disediakan dan akan dibuka tidak lama lagi. Anda boleh lihat contoh paparan jemaah dahulu.</span></div>
    <a class="btn penuh" href="#/contoh">Lihat contoh paparan jemaah</a>
    <a class="btn garis penuh" href="#/pakej">Lihat pakej tanpa log masuk</a>
    <p class="kecil redup">Perlu bantuan tentang tempahan sedia ada? <a href="${wa('Assalamualaikum Juara Travel. Saya ingin semak status tempahan saya.')}" target="_blank" rel="noopener">WhatsApp kami</a></p>
  </div>`;
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

function vSaya() {
  const c = CONTOH, baki = c.harga - c.dibayar;
  return `
  <div class="baris"><span><span class="redup kecil">Assalamualaikum,</span><br><b style="font-size:20px">${c.nama}</b></span></div>
  <div class="grid-pakej" style="align-items:start">
    <a class="kad perjalanan" href="#/perjalanan" style="overflow:hidden;color:var(--dakwat);display:block">
      ${gb('PK-06', 'Kulit pakej yang ditempah', '')}
      <span class="pad baris" style="align-items:flex-end;display:flex">
        <span style="display:flex;flex-direction:column;min-width:0"><span class="kecil redup">Perjalanan anda</span><b style="font-size:17px">${c.pakej}</b><span class="kecil redup">${fHari(c.berlepas)}, ${fTkh(c.berlepas, 1)} · KLIA T1, 6:00 pagi</span></span>
        <span style="display:flex;flex-direction:column;align-items:flex-end;flex:none"><b class="num" style="font-size:36px;line-height:1">${hariLagi(c.berlepas)}</b><span class="kecil redup">hari lagi</span></span>
      </span>
    </a>
    <section class="stack">
      <div class="tajuk-seksyen" style="margin:0"><h2>Perlu tindakan</h2><span class="kecil redup">2 belum selesai</span></div>
      <div class="kad pad tindakan"><span><b>Bayar baki ${rm(baki)}</b><br><span class="kecil seat-sikit">Sebelum ${fTkh(c.akhirBayar)} · ${hariLagi(c.akhirBayar)} hari lagi</span></span><a class="btn kecil" href="#/bayaran">Bayar</a></div>
      <div class="kad pad tindakan"><span><b>Hantar gambar pasport</b><br><span class="kecil redup">Diperlukan untuk visa</span></span><a class="btn garis kecil" href="#/persediaan">Muat naik</a></div>
      <span class="semak">${ic('betul')}Deposit ${rm(JT.depositSeorang)} diterima</span>
      <span class="semak">${ic('betul')}Kursus umrah sesi 1 dihadiri</span>
    </section>
    <section class="stack">
      <div class="tajuk-seksyen" style="margin:0"><h2>Hari pertama</h2><a href="#/perjalanan">Itinerari penuh</a></div>
      <a class="kad ringkas" href="#/perjalanan">${gb('IT-01', '', '')}<span class="t"><b>Kuala Lumpur ke Madinah</b><span class="kecil"><b class="num">6:00</b> <span class="redup">Berkumpul, kaunter Juara KLIA T1</span></span><span class="kecil"><b class="num">9:40</b> <span class="redup">Penerbangan ke Madinah</span></span></span></a>
      <div class="kad pad" style="display:flex;gap:14px;align-items:center">${gb('OR-01', '', 'r11').replace('class="gb r11"', 'class="gb r11" style="width:56px;border-radius:999px;flex:none"')}<span style="flex:1"><span class="kecil redup">Mutawwif kumpulan anda</span><br><b>[Nama mutawwif]</b></span><a class="btn garis kecil" href="#" aria-label="WhatsApp mutawwif">${ic('telefon')}</a></div>
      ${kadSolat()}
    </section>
  </div>`;
}

function vPerjalanan() {
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

function vBayaran() {
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

function vPersediaan() {
  return `
  <h1>Persediaan</h1>
  <div class="grid-pakej" style="align-items:start">
    <section class="stack">
      <h2>Dokumen</h2>
      <div class="kad jadual-harga">${CONTOH.dokumen.map(([n, s, w, b]) => `<div style="align-items:center"><span><b>${n}</b><br><span class="lencana ${w}" style="margin-top:4px">${s}</span></span>${b ? `<button class="btn kecil" type="button" data-aksi="toast" data-nilai="Muat naik dokumen akan dibuka dalam Fasa 2">Muat naik</button>` : ''}</div>`).join('')}</div>
      <div class="kad pad" style="display:flex;gap:14px">${gb('IL-10', 'Contoh pasport', 'r11').replace('class="gb r11"', 'class="gb r11" style="width:96px;flex:none;border-radius:8px"')}<span class="kecil"><b style="font-size:15px">Gambar pasport yang diterima</b><br>Muka surat berfoto, rata, tiada silau, keempat-empat bucu kelihatan.</span></div>
    </section>
    <section class="stack">
      <h2>Kursus seterusnya</h2>
      <div class="kad pad stack" style="gap:4px"><span class="kecil redup">Sesi 2 daripada 2</span><b style="font-size:17px">Amali tawaf dan saie</b><span class="redup">Sab, 6 Dis · 9:00 pagi hingga 1:00 tengah hari</span><span class="redup">Juara Travel [cawangan]</span></div>
    </section>
  </div>`;
}

function vAkaun() {
  return `
  <h1>Akaun</h1>
  <div class="kad jadual-harga" style="max-width:560px"><div><span class="redup">Nama</span><b>Aminah binti Yusof</b></div><div><span class="redup">Telefon</span><b>+60 12-345 6789</b></div><div><span class="redup">Ahli keluarga</span><b>Tiada</b></div><div><span class="redup">Bahasa</span><b>Bahasa Melayu</b></div></div>
  <button class="btn garis" type="button" data-aksi="keluar-contoh" style="max-width:560px">Keluar dari paparan contoh</button>`;
}

/* ===== Penghala ===== */
const NAV_TETAMU = [['', 'Utama', 'rumah'], ['pakej', 'Pakej', 'cari'], ['kursus', 'Kursus', 'buku'], ['cawangan', 'Cawangan', 'pin'], ['masuk', 'Log masuk', 'orang']];
const NAV_JEMAAH = [['saya', 'Utama', 'rumah'], ['perjalanan', 'Perjalanan', 'kalendar'], ['bayaran', 'Bayaran', 'dompet'], ['persediaan', 'Persediaan', 'buku'], ['akaun', 'Akaun', 'orang']];
const JEMAAH = new Set(['saya', 'perjalanan', 'bayaran', 'persediaan', 'akaun']);
const TAJUK = { '': 'Juara Travel', pakej: 'Pakej umrah', kursus: 'Kursus umrah', cawangan: 'Cawangan', masuk: 'Log masuk', solat: 'Waktu solat', tempah: 'Tempah', saya: 'Utama jemaah', perjalanan: 'Perjalanan', bayaran: 'Bayaran', persediaan: 'Persediaan', akaun: 'Akaun' };

function laluan() {
  const [nama = '', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return { nama, args };
}

let laluanLepas = null;
function render(alih = true) {
  let { nama, args } = laluan();
  if (nama === 'contoh') { S.demo = true; store.set('demo', true); location.replace('#/saya'); return; }
  if (JEMAAH.has(nama) && !S.demo) { location.replace('#/masuk'); return; }
  const nav = S.demo ? NAV_JEMAAH : NAV_TETAMU;
  const akar = nama === 'tempah' ? 'pakej' : nama;
  const kini = k => (k === akar || (k === 'pakej' && nama === 'pakej')) ? ' aria-current="page"' : '';

  $('atas').innerHTML = `<div class="dalam">
    <a class="logo" href="#/${S.demo ? 'saya' : ''}" aria-label="Juara Travel, utama"><img src="logo-juara.png" alt="Juara Travel"></a>
    <nav aria-label="Menu utama">${nav.filter(([k]) => k !== 'masuk' && k !== 'akaun').map(([k, n]) => `<a href="#/${k}"${kini(k)}>${n}</a>`).join('')}<a href="#/solat"${kini('solat')}>Waktu solat</a></nav>
    <span class="kanan">${S.demo ? `<a class="pil" href="#/akaun">${ic('orang')}Akaun</a>` : `<a class="pil" href="#/masuk">Log masuk</a>`}</span>
  </div>`;
  $('bawah').innerHTML = nav.map(([k, n, i]) => `<a href="#/${k}"${kini(k)}>${ic(i)}${n}</a>`).join('');
  const jalur = $('contoh');
  jalur.hidden = !S.demo;
  if (S.demo) jalur.innerHTML = `<span>Paparan contoh: data di bawah bukan data sebenar</span><button type="button" data-aksi="keluar-contoh">Keluar</button>`;

  const V = { '': vUtama, pakej: () => args[0] ? vButiran(args[0]) : vPakej(), tempah: () => vTempah(args[0], args[1]), kursus: vKursus, cawangan: vCawangan, solat: vSolat, masuk: vMasuk, saya: vSaya, perjalanan: vPerjalanan, bayaran: vBayaran, persediaan: vPersediaan, akaun: vAkaun };
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
  else if (a === 'set-semula') { S.f = { bulan: '', bajet: '', kat: 'Semua', seat: true }; render(false); }
  else if (a === 'pilih-tarikh') { S.pilih[el.dataset.id] = el.dataset.kod; render(false); }
  else if (a === 'semua-tarikh') { S.semua[el.dataset.id] = true; render(false); }
  else if (a === 'pilih-dari-senarai') { S.pilih[el.dataset.id] = el.dataset.kod; }
  else if (a === 'lokasi') { S.lokasi = v; store.set('lokasi', v); render(false); }
  else if (a === 'keluar-contoh') { S.demo = false; store.set('demo', false); location.hash = '#/'; }
  else if (a === 'muat-semula') { S.ralat = ''; render(false); muat(); }
  else if (a === 'toast') toast(v);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.f) { S.f[el.dataset.f] = el.value; if (laluan().nama === 'pakej') render(false); else { const b = el.form && el.form.querySelector('button[type=submit]'); if (b) b.textContent = `Lihat ${bilTarikh(tapis({ ...S.f, kat: 'Semua' }))} tarikh`; } }
  else if (el.dataset.pilih === 'bilik') { S.bilik[el.dataset.id] = el.value; render(false); }
  else if (el.dataset.pilih === 'bil') { S.bil[el.dataset.id] = +el.value; render(false); }
});
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.dataset.borang === 'cari') { e.preventDefault(); S.f.kat = 'Semua'; location.hash = '#/pakej'; }
  else if (f.dataset.borang === 'tempah') {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), id = f.dataset.id, kod = f.dataset.kod;
    const tel = String(d.tel || '').replace(/[^\d+]/g, '');
    const salah = !String(d.nama || '').trim() ? 'Sila isi nama penuh.' : tel.replace(/\D/g, '').length < 9 ? 'Sila isi nombor telefon yang sah.' : '';
    if (salah) { $('ralat-tempah').textContent = salah; $('ralat-tempah').style.color = 'var(--merah)'; return; }
    const p = cariPakej(id), t = p.tarikh.find(x => x.kod === kod), bk = BILIK.find(([k]) => k === d.bilik);
    S.bilik[id] = d.bilik; S.bil[id] = +d.bil;
    const msg = ['Assalamualaikum Juara Travel. Saya ingin menempah:', `Pakej: ${p.nama}`, `Berlepas: ${fHari(t.d)}, ${fTkh(t.d, 1)} (${t.kod})`, `Bilik: ${bk ? bk[1] : d.bilik} · ${rm(t.bilik[d.bilik])} seorang`, `Bilangan: ${d.bil} orang`, `Nama: ${String(d.nama).trim()}`, `Telefon: ${tel}`].concat(d.nota && d.nota.trim() ? [`Nota: ${d.nota.trim()}`] : []).join('\n');
    S.tempahWa = wa(msg); S.tempahSiap = kod;
    window.open(S.tempahWa, '_blank', 'noopener');
    render();
  }
});
window.addEventListener('hashchange', () => { if (laluan().nama !== 'tempah') S.tempahSiap = null; render(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - S.dimuat > 15 * 60 * 1000) muat(); });
setInterval(() => { const n = laluan().nama; if (n === '' || n === 'solat' || n === 'saya') render(false); }, 60000);

render(false);
muat();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
