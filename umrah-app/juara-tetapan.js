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

  // Konfigurasi web Firebase (awam, bukan rahsia) untuk log masuk jemaah
  firebase: {
    apiKey: 'AIzaSyAo1UkKuMjAsD8gBkd1dIASP7bB0xSPkzc',
    authDomain: 'juaratravel-apps.firebaseapp.com',
    projectId: 'juaratravel-apps',
    appId: '1:878219715391:web:a2254cd2773ea9bfd2e98a'
  },

  // Senarai cawangan. Kosong = skrin Cawangan papar "akan dikemas kini".
  // Contoh: { nama: 'Juara Travel Shah Alam', alamat: '...', telefon: '60...', waktu: 'Isnin hingga Sabtu, 9 pagi hingga 6 petang', peta: 'https://maps.google.com/?q=...' }
  cawangan: [],

  // Gambar sebenar ikut kod brief gambar. Kosong = kotak bertanda kod dipaparkan.
  // Contoh: 'PK-01': 'gambar/pk/pk-01-ekonomi-1.webp'
  // Gambar sementara dari Wikimedia Commons (kredit di skrin Kredit gambar) sehingga gambar Juara sendiri siap.
  gambar: {
    'PK-01': 'gambar/IT/it-09-pintu-haram.webp',
    'PK-02': 'gambar/PK/pk-02-menara-jam-2.webp',
    'PK-03': 'gambar/IT/it-20-turki-1.webp',
    'PK-04': 'gambar/PK/pk-04-iftar.webp',
    'PK-05': 'gambar/PK/pk-05-syawal-1.webp',
    'PK-06': 'gambar/PK/pk-06-taif-jalan-1.webp',
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
    'IT-15': 'gambar/IT/it-15-taif.webp',
    'IT-16': 'gambar/IT/it-16-badar.webp',
    'IT-17': 'gambar/IT/it-17-jeddah.webp',
    'IT-18': 'gambar/IT/it-18-haramain.webp',
    'IT-20': 'gambar/IT/it-20-turki-2.webp',
    'IL-07': 'gambar/IL/il-07-tiada-tempahan.svg',
    'IL-08': 'gambar/IL/il-08-tiada-internet.svg',
    'IL-09': 'gambar/IL/il-09-ralat-sistem.svg'
  }
};
