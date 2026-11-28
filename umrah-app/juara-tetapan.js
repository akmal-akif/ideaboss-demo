/* =========================================================
   Tetapan apps Juara Travel. Tukar nilai di sini sahaja.
   ========================================================= */
const JT = {
  // Alamat server Juara (data pakej, seat dan jemaah). Kosong = guna salinan pakej dalam apps.
  // deploy.sh menukar nilai ini kepada '/api' semasa deploy ke Firebase.
  apiJuara: '',

  // Nombor WhatsApp khidmat pelanggan Juara (seperti di laman juaratravel.com.my)
  waJuara: '601157824603',

  // Deposit untuk setiap jemaah (RM)
  depositSeorang: 100,

  // Kulit pakej: setiap pakej dapat satu foto jemaah yang berbeza (bukan staf). Tambah lagi jika pakej bertambah.
  poolPakej: ['JR-melambai', 'JP-02', 'JR-08', 'JP-04', 'JR-nabawi-payung', 'JP-05', 'JR-05', 'JP-18', 'JR-kumpulan-quba', 'JP-03', 'JR-06', 'JP-11', 'JR-tren', 'JP-16', 'JR-07', 'JP-17', 'JR-ziarah-makkah', 'JP-06', 'JR-cerita-poster', 'JP-12', 'JR-madinah-poster', 'JP-19', 'JP-01', 'JP-20', 'JP-07', 'JP-21', 'JP-08', 'JP-13', 'JP-09', 'JP-14', 'JP-10', 'JP-15', 'JP-22', 'JP-23', 'JP-24', 'JP-25', 'JP-26', 'JP-27'],

  // Gerbang pembayaran. 'ujian' = paparan dummy (tiada caj sebenar). Tukar selepas akaun gateway (contoh ToyyibPay/Billplz/SenangPay) siap.
  bayaran: { mod: 'ujian', penyedia: '', akhirHari: 45 },

  // Mata Juara (loyalty). Cadangan awal, tukar ikut keputusan Juara.
  mata: { rmSeMata: 10, rmSe100: 10, bonusRujukan: 1000, bonusKursus: 100, bonusTestimoni: 200 },

  // Nombor lesen KPK. Kosong = tidak dipaparkan sehingga disahkan.
  lesenKPK: '',

  // Konfigurasi web Firebase (awam, bukan rahsia) untuk log masuk jemaah
  firebase: {
    apiKey: 'AIzaSyAo1UkKuMjAsD8gBkd1dIASP7bB0xSPkzc',
    authDomain: 'juaratravel-apps.firebaseapp.com',
    projectId: 'juaratravel-apps',
    appId: '1:878219715391:web:a2254cd2773ea9bfd2e98a'
  },

  // Sesi kursus umrah akan datang (diisi staf sehingga jadual TravelDesk disambung).
  // Contoh: { tajuk: 'Kursus Umrah Perdana', tarikh: '2026-12-06', masa: '9:00 pagi', tempat: 'Juara Travel Shah Alam' }
  kursus: [],

  // Senarai cawangan diambil terus dari sistem TravelDesk melalui /api/cawangan (sama seperti laman juaratravel.com.my).

  // Gambar sebenar ikut kod brief gambar. Kosong = kotak bertanda kod dipaparkan.
  // Contoh: 'PK-01': 'gambar/pk/pk-01-ekonomi-1.webp'
  // Gambar sementara dari Wikimedia Commons (kredit di skrin Kredit gambar) sehingga gambar Juara sendiri siap.
  gambar: {
    // Foto jemaah dan petugas Juara sendiri (dari laman umrah.juaratravel.com.my)
    'JR-01': 'gambar/JR/jr-01.webp', 'JR-02': 'gambar/JR/jr-02.webp', 'JR-03': 'gambar/JR/jr-03.webp', 'JR-04': 'gambar/JR/jr-04.webp',
    'JR-05': 'gambar/JR/jr-05.webp', 'JR-06': 'gambar/JR/jr-06.webp', 'JR-07': 'gambar/JR/jr-07.webp', 'JR-08': 'gambar/JR/jr-08.webp',
    // Bingkai dari rakaman jemaah Juara (folder RAW - UMRAH)
    'JR-melambai': 'gambar/JR/jr-melambai.webp', 'JR-kaabah-siang': 'gambar/JR/jr-kaabah-siang.webp', 'JR-kaabah-malam': 'gambar/JR/jr-kaabah-malam.webp',
    'JR-nabawi-payung': 'gambar/JR/jr-nabawi-payung.webp', 'JR-tren': 'gambar/JR/jr-tren.webp', 'JR-ziarah-makkah': 'gambar/JR/jr-ziarah-makkah.webp',
    'JR-kumpulan-quba': 'gambar/JR/jr-kumpulan-quba.webp', 'JR-cerita-poster': 'gambar/JR/jr-cerita-poster.webp', 'JR-madinah-poster': 'gambar/JR/jr-madinah-poster.webp',
    // Bingkai jemaah tambahan (rakaman RAW - UMRAH), untuk kulit pakej yang tidak berulang
    'JP-01': 'gambar/JP/jp-01.webp', 'JP-02': 'gambar/JP/jp-02.webp', 'JP-03': 'gambar/JP/jp-03.webp', 'JP-04': 'gambar/JP/jp-04.webp', 'JP-05': 'gambar/JP/jp-05.webp', 'JP-06': 'gambar/JP/jp-06.webp', 'JP-07': 'gambar/JP/jp-07.webp', 'JP-08': 'gambar/JP/jp-08.webp', 'JP-09': 'gambar/JP/jp-09.webp', 'JP-10': 'gambar/JP/jp-10.webp', 'JP-11': 'gambar/JP/jp-11.webp', 'JP-12': 'gambar/JP/jp-12.webp', 'JP-13': 'gambar/JP/jp-13.webp', 'JP-14': 'gambar/JP/jp-14.webp', 'JP-15': 'gambar/JP/jp-15.webp', 'JP-16': 'gambar/JP/jp-16.webp', 'JP-17': 'gambar/JP/jp-17.webp', 'JP-18': 'gambar/JP/jp-18.webp', 'JP-19': 'gambar/JP/jp-19.webp', 'JP-20': 'gambar/JP/jp-20.webp', 'JP-21': 'gambar/JP/jp-21.webp', 'JP-22': 'gambar/JP/jp-22.webp', 'JP-23': 'gambar/JP/jp-23.webp', 'JP-24': 'gambar/JP/jp-24.webp', 'JP-25': 'gambar/JP/jp-25.webp', 'JP-26': 'gambar/JP/jp-26.webp', 'JP-27': 'gambar/JP/jp-27.webp',
    // Kulit pakej: foto jemaah Juara (bergilir ikut pakej). Gambar destinasi kekal dalam galeri.
    'PK-01': 'gambar/JR/jr-06.webp',
    'PK-01b': 'gambar/JR/jr-08.webp',
    'PK-01c': 'gambar/JR/jr-07.webp',
    'PK-01d': 'gambar/JR/jr-05.webp',
    'PK-02': 'gambar/JR/jr-07.webp',
    'PK-03': 'gambar/JR/jr-08.webp',
    'PK-04': 'gambar/JR/jr-05.webp',
    'PK-05': 'gambar/JR/jr-06.webp',
    'PK-06': 'gambar/JR/jr-03.webp',
    'IT-02': 'gambar/IT/it-02-bir-ali.webp',
    'IT-03': 'gambar/IT/it-03-nabawi-siang.webp',
    'IT-04': 'gambar/IT/it-04-kubah-hijau.webp',
    'IT-05': 'gambar/IT/it-05-quba.webp',
    'IT-06': 'gambar/IT/it-06-uhud.webp',
    'IT-07': 'gambar/IT/it-07-qiblatain.webp',
    'IT-08': 'gambar/IT/it-08-kurma.webp',
    'IT-09': 'gambar/IT/it-09-kaabah.webp',
    'IT-10': 'gambar/IT/it-10-saie.webp',
    'IT-11': 'gambar/IT/it-11-arafah.webp',
    'IT-12': 'gambar/IT/it-12-mina.webp',
    'IT-13': 'gambar/IT/it-13-nur.webp',
    'IT-14': 'gambar/IT/it-14-tanim.webp',
    'IT-15': 'gambar/IT/it-15-taif-ros.webp',
    'IT-16': 'gambar/IT/it-16-badar.webp',
    'IT-17': 'gambar/IT/it-17-jeddah.webp',
    'IT-18': 'gambar/IT/it-18-haramain.webp',
    'IT-20': 'gambar/IT/it-20-turki-2.webp',
    // Hotel: HT-<nama-hotel-slug>-1 (fasad), -2 (bilik), -3 (laluan ke masjid). Tambah bila gambar hotel sebenar diterima.
    'HT-kompleks-menara-jam-1': 'gambar/HT/ht-menara-jam.jpg',
    // Gambar hiasan hotel (Wikimedia) bila gambar hotel sebenar belum ada
    'HT-makkah-1': 'gambar/HT/ht-makkah-1.webp', 'HT-madinah-1': 'gambar/HT/ht-madinah-1.webp', 'HT-madinah-2': 'gambar/HT/ht-madinah-2.webp', 'HT-madinah-3': 'gambar/HT/ht-madinah-3.webp',
    'IT-09p': 'gambar/IT/it-09-pintu-haram.webp',
    'IL-07': 'gambar/IL/il-07-tiada-tempahan.svg',
    'IL-14': 'gambar/IL/il-14-dokumen.svg',
    'IL-08': 'gambar/IL/il-08-tiada-internet.svg',
    'IL-09': 'gambar/IL/il-09-ralat-sistem.svg'
  }
};
