/* =========================================================
   Tetapan apps Juara Travel. Tukar nilai di sini sahaja.
   ========================================================= */
const JT = {
  // Alamat server Juara (data pakej, seat dan jemaah). Kosong = guna salinan pakej dalam apps.
  // deploy.sh menukar nilai ini kepada '/api' semasa deploy ke Firebase.
  apiJuara: '',

  // Nombor WhatsApp Juara untuk tempahan dan pertanyaan (CONTOH, ganti dengan nombor sebenar)
  waJuara: '60120000000',

  // Deposit untuk setiap jemaah (RM)
  depositSeorang: 1000,

  // Nombor lesen KPK. Kosong = tidak dipaparkan sehingga disahkan.
  lesenKPK: '',

  // Senarai cawangan. Kosong = skrin Cawangan papar "akan dikemas kini".
  // Contoh: { nama: 'Juara Travel Shah Alam', alamat: '...', telefon: '60...', waktu: 'Isnin hingga Sabtu, 9 pagi hingga 6 petang', peta: 'https://maps.google.com/?q=...' }
  cawangan: [],

  // Gambar sebenar ikut kod brief gambar. Kosong = kotak bertanda kod dipaparkan.
  // Contoh: 'PK-01': 'gambar/pk/pk-01-ekonomi-1.webp'
  gambar: {}
};
