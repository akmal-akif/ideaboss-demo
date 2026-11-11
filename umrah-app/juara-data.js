/* =========================================================
   Data CONTOH untuk tab Juara. Semua alamat, nombor, harga,
   tarikh, agent dan ganjaran di sini ialah rekaan.
   Ganti dengan data sebenar Juara bila sedia.
   ========================================================= */

const WAKTU_PEJABAT = [['Isnin hingga Jumaat', '9:00 pagi hingga 6:00 petang'], ['Sabtu', '9:00 pagi hingga 1:00 tengah hari'], ['Ahad dan cuti umum', 'Tutup']];
const WAKTU_PEJABAT_UTARA = [['Ahad hingga Khamis', '9:00 pagi hingga 6:00 petang'], ['Sabtu', '9:00 pagi hingga 1:00 tengah hari'], ['Jumaat dan cuti umum', 'Tutup']];

const LOKASI = [
  { id: 'kl', nama: 'Juara Travel Kuala Lumpur', jenis: 'Pejabat', negeri: 'Kuala Lumpur',
    ringkas: 'Wangsa Maju, Kuala Lumpur', alamat: 'No. 12, Jalan Contoh 1/27A, Seksyen 5, Wangsa Maju, 53300 Kuala Lumpur',
    lat: 3.2053, lng: 101.7376, tel: '0300000001', waktu: WAKTU_PEJABAT },
  { id: 'shahalam', nama: 'Juara Travel Shah Alam', jenis: 'Pejabat', negeri: 'Selangor',
    ringkas: 'Seksyen 13, Shah Alam', alamat: 'No. 8, Jalan Contoh 13/2, Seksyen 13, 40100 Shah Alam, Selangor',
    lat: 3.0738, lng: 101.5183, tel: '0300000002', waktu: WAKTU_PEJABAT },
  { id: 'jb', nama: 'Juara Travel Johor Bahru', jenis: 'Pejabat', negeri: 'Johor',
    ringkas: 'Taman Molek, Johor Bahru', alamat: 'No. 21, Jalan Contoh 3, Taman Molek, 81100 Johor Bahru, Johor',
    lat: 1.5232, lng: 103.7930, tel: '0700000004', waktu: WAKTU_PEJABAT },
  { id: 'penang', nama: 'Juara Travel Pulau Pinang', jenis: 'Pejabat', negeri: 'Pulau Pinang',
    ringkas: 'Bukit Mertajam, Pulau Pinang', alamat: 'No. 5, Jalan Contoh, 14000 Bukit Mertajam, Pulau Pinang',
    lat: 5.3631, lng: 100.4667, tel: '0400000006', waktu: WAKTU_PEJABAT },
  { id: 'kt', nama: 'Juara Travel Kuala Terengganu', jenis: 'Pejabat', negeri: 'Terengganu',
    ringkas: 'Bandar Kuala Terengganu', alamat: 'No. 3, Jalan Contoh, 20000 Kuala Terengganu, Terengganu',
    lat: 5.3302, lng: 103.1408, tel: '0900000007', waktu: WAKTU_PEJABAT_UTARA },
  { id: 'alorsetar', nama: 'Juara Travel Alor Setar', jenis: 'Pejabat', negeri: 'Kedah',
    ringkas: 'Bandar Alor Setar, Kedah', alamat: 'No. 7, Jalan Contoh, 05000 Alor Setar, Kedah',
    lat: 6.1248, lng: 100.3678, tel: '0400000008', waktu: WAKTU_PEJABAT_UTARA }
];

const NEGERI_SEMUA = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

const TERMASUK_UMRAH = ['Tiket penerbangan pergi balik', 'Visa umrah', 'Hotel dan makan 3 kali sehari', 'Bas ziarah berhawa dingin', 'Mutawwif dan pembimbing Juara', 'Kursus umrah sebelum berlepas', 'Air zamzam 5 liter'];
const TAK_UMRAH = ['Vaksin meningitis', 'Perbelanjaan peribadi', 'Caj bagasi berlebihan', 'Upgrade bilik hotel'];
const TERMASUK_LANCONG = ['Tiket penerbangan pergi balik', 'Hotel dan makan ikut jadual', 'Bas pelancongan berhawa dingin', 'Pemandu pelancong berbahasa Melayu', 'Tiket masuk tempat lawatan dalam jadual'];
const TAK_LANCONG = ['Visa (jika perlu)', 'Insurans perjalanan', 'Perbelanjaan peribadi', 'Tip pemandu dan pemandu pelancong'];
const SOALAN_UMRAH = [
  ['Boleh bayar secara ansuran?', 'Boleh. Bayar deposit dahulu, kemudian ansuran ikut kemampuan anda sebelum tarikh akhir.'],
  ['Saya belum ada pasport. Boleh tempah dulu?', 'Boleh. Tempah dan bayar deposit dahulu. Pasport perlu sah sekurang-kurangnya 6 bulan dari tarikh berlepas.'],
  ['Warga emas boleh ikut?', 'Boleh. Maklumkan Juara jika perlukan kerusi roda atau bantuan khas supaya kami boleh atur awal.'],
  ['Ada kursus sebelum berlepas?', 'Ada. Kursus umrah percuma untuk semua jemaah di lokasi kursus Juara.']
];
const SOALAN_LANCONG = [
  ['Boleh bayar secara ansuran?', 'Boleh. Bayar deposit dahulu, kemudian ansuran sebelum tarikh akhir.'],
  ['Makanan halal?', 'Juara pilih restoran dan menu halal sepanjang perjalanan.'],
  ['Perlu visa?', 'Bergantung kepada negara dan pasport anda. Juara akan bantu semak dan uruskan.']
];

const PAKEJ = [
  { id: 'umrah9', nama: 'Umrah 9 Hari Ekonomi', jenis: 'umrah', cuti: false, hari: '9 hari 7 malam', harga: 6990, img: 'img/kaabah.jpg',
    ringkas: 'Pakej mampu milik untuk umrah pertama anda, dengan bimbingan penuh dari awal.',
    tarikh: [{ d: '2026-12-08', k: 14 }, { d: '2027-01-12', k: 22 }, { d: '2027-02-09', k: 30 }],
    jalan: [['Hari 1', 'Berlepas dari KLIA ke Madinah'], ['Hari 2 hingga 3', 'Ibadah di Masjid Nabawi dan ziarah Madinah'], ['Hari 4', 'Ke Makkah, niat ihram di Bir Ali dan umrah pertama'], ['Hari 5 hingga 8', 'Ibadah di Masjidil Haram dan ziarah Makkah'], ['Hari 9', 'Pulang ke Malaysia']],
    hotel: [['Madinah', 'Hotel contoh 3 bintang', 'Lebih kurang 600m ke Masjid Nabawi'], ['Makkah', 'Hotel contoh 3 bintang', 'Lebih kurang 900m ke Masjidil Haram, ada bas ulang alik']],
    termasuk: TERMASUK_UMRAH, tak: TAK_UMRAH, faq: SOALAN_UMRAH },
  { id: 'umrah12', nama: 'Umrah 12 Hari Selesa', jenis: 'umrah', cuti: false, hari: '12 hari 10 malam', harga: 8990, img: 'img/makkah-kumpulan.jpg',
    ringkas: 'Masa lebih panjang untuk ibadah dengan tenang. Hotel lebih dekat dengan masjid.',
    tarikh: [{ d: '2026-12-12', k: 6 }, { d: '2027-01-20', k: 18 }, { d: '2027-02-17', k: 25 }],
    jalan: [['Hari 1', 'Berlepas dari KLIA ke Madinah'], ['Hari 2 hingga 5', 'Ibadah di Masjid Nabawi, Raudhah dan ziarah Madinah'], ['Hari 6', 'Ke Makkah, niat ihram di Bir Ali dan umrah pertama'], ['Hari 7 hingga 11', 'Ibadah, ziarah Makkah dan umrah tambahan dari Jiranah'], ['Hari 12', 'Pulang ke Malaysia']],
    hotel: [['Madinah', 'Hotel contoh 4 bintang', 'Lebih kurang 200m ke Masjid Nabawi'], ['Makkah', 'Hotel contoh 4 bintang', 'Lebih kurang 400m ke Masjidil Haram']],
    termasuk: TERMASUK_UMRAH, tak: TAK_UMRAH, faq: SOALAN_UMRAH },
  { id: 'umrahplus', nama: 'Umrah Plus Madinah', jenis: 'umrah', cuti: false, hari: '14 hari 12 malam', harga: 10490, img: 'img/nabawi.jpg',
    ringkas: 'Lebih banyak masa di Madinah untuk anda yang rindu suasana Masjid Nabawi.',
    tarikh: [{ d: '2027-01-05', k: 9 }, { d: '2027-02-23', k: 20 }],
    jalan: [['Hari 1', 'Berlepas dari KLIA ke Madinah'], ['Hari 2 hingga 7', 'Ibadah di Masjid Nabawi, Raudhah, Quba dan ziarah Madinah'], ['Hari 8', 'Ke Makkah, niat ihram di Bir Ali dan umrah pertama'], ['Hari 9 hingga 13', 'Ibadah dan ziarah Makkah'], ['Hari 14', 'Pulang ke Malaysia']],
    hotel: [['Madinah', 'Hotel contoh 5 bintang', 'Lebih kurang 150m ke Masjid Nabawi'], ['Makkah', 'Hotel contoh 4 bintang', 'Lebih kurang 400m ke Masjidil Haram']],
    termasuk: TERMASUK_UMRAH, tak: TAK_UMRAH, faq: SOALAN_UMRAH },
  { id: 'umrahcuti', nama: 'Umrah Cuti Sekolah', jenis: 'umrah', cuti: true, hari: '10 hari 8 malam', harga: 9490, img: 'img/nabawi-kumpulan.jpg',
    ringkas: 'Bawa seisi keluarga ke Tanah Suci masa cuti sekolah. Jadual mesra kanak-kanak.',
    tarikh: [{ d: '2026-12-19', k: 4 }, { d: '2027-03-20', k: 28 }],
    jalan: [['Hari 1', 'Berlepas dari KLIA ke Madinah'], ['Hari 2 hingga 4', 'Ibadah dan ziarah Madinah bersama keluarga'], ['Hari 5', 'Ke Makkah, niat ihram di Bir Ali dan umrah pertama'], ['Hari 6 hingga 9', 'Ibadah dan ziarah Makkah'], ['Hari 10', 'Pulang ke Malaysia']],
    hotel: [['Madinah', 'Hotel contoh 4 bintang', 'Bilik keluarga tersedia'], ['Makkah', 'Hotel contoh 4 bintang', 'Bilik keluarga tersedia']],
    termasuk: TERMASUK_UMRAH, tak: TAK_UMRAH, faq: SOALAN_UMRAH },
  { id: 'turki', nama: 'Pelancongan Turki', jenis: 'lancong', cuti: true, hari: '10 hari 8 malam', harga: 5990, img: '',
    ringkas: 'Jejak sejarah Islam di Istanbul, Bursa dan Cappadocia bersama keluarga.',
    tarikh: [{ d: '2026-12-21', k: 12 }, { d: '2027-04-10', k: 30 }],
    jalan: [['Hari 1', 'Berlepas dari KLIA ke Istanbul'], ['Hari 2 hingga 4', 'Lawatan sekitar Istanbul dan masjid bersejarah'], ['Hari 5', 'Ke Bursa'], ['Hari 6 hingga 8', 'Cappadocia dan kawasan sekitar'], ['Hari 9', 'Kembali ke Istanbul'], ['Hari 10', 'Pulang ke Malaysia']],
    hotel: [['Istanbul', 'Hotel contoh 4 bintang', 'Di tengah bandar'], ['Cappadocia', 'Hotel contoh gaya gua', 'Pengalaman bermalam yang unik']],
    termasuk: TERMASUK_LANCONG, tak: TAK_LANCONG, faq: SOALAN_LANCONG },
  { id: 'jordan', nama: 'Pelancongan Jordan', jenis: 'lancong', cuti: false, hari: '8 hari 6 malam', harga: 6490, img: '',
    ringkas: 'Ziarah makam para sahabat, kota Petra dan Laut Mati dalam satu perjalanan.',
    tarikh: [{ d: '2027-02-14', k: 16 }, { d: '2027-05-08', k: 30 }],
    jalan: [['Hari 1', 'Berlepas dari KLIA ke Amman'], ['Hari 2 hingga 3', 'Ziarah makam para sahabat dan bandar Amman'], ['Hari 4 hingga 5', 'Kota Petra dan Wadi Rum'], ['Hari 6', 'Laut Mati'], ['Hari 7', 'Masa bebas di Amman'], ['Hari 8', 'Pulang ke Malaysia']],
    hotel: [['Amman', 'Hotel contoh 4 bintang', 'Dekat pusat bandar'], ['Petra', 'Hotel contoh 4 bintang', 'Dekat pintu masuk Petra']],
    termasuk: TERMASUK_LANCONG, tak: TAK_LANCONG, faq: SOALAN_LANCONG }
];

const AGENTS = [
  { kod: 'SALMAH01', nama: 'Puan Salmah', kawasan: 'Johor Bahru' },
  { kod: 'FAIZAL02', nama: 'Encik Faizal', kawasan: 'Shah Alam' },
  { kod: 'ROSNAH03', nama: 'Puan Rosnah', kawasan: 'Kuala Terengganu' },
  { kod: 'HAKIM04', nama: 'Encik Hakim', kawasan: 'Alor Setar' },
  { kod: 'NURUL05', nama: 'Cik Nurul', kawasan: 'Bukit Mertajam' }
];

// Kod rujukan ahli lain (contoh) yang boleh dipakai semasa tempah
const KOD_RUJUKAN = ['ZURA77', 'HALIM21', 'FARAH09'];

// Sejarah mata contoh untuk pengguna demo
const SEJARAH_MATA = [
  { t: '2026-08-30', a: 'Daftar dalam apps Jemaah Juara', m: 100 },
  { t: '2026-09-12', a: 'Tempahan deposit, Umrah Ziarah 12 Hari', m: 200 },
  { t: '2026-09-25', a: 'Rujuk kawan: Puan Zura tempah pakej umrah', m: 300 },
  { t: '2026-10-08', a: 'Rujuk kawan: Encik Halim tempah pakej umrah', m: 300 },
  { t: '2026-10-21', a: 'Rujuk kawan: Cik Farah tempah pakej Turki', m: 300 },
  { t: '2026-11-04', a: 'Rujuk kawan: Puan Rokiah tempah pakej umrah', m: 300 }
].map(e => Object.assign({ contoh: true }, e));

const GANJARAN = [
  { id: 'tng10', nama: "Baucar Touch 'n Go eWallet RM10", desc: 'Kredit terus ke eWallet anda', mata: 1000, ic: 'wallet', pre: 'TNG', cara: 'Baucar dihantar melalui WhatsApp ke nombor telefon anda dalam 7 hari bekerja.' },
  { id: 'tng30', nama: "Baucar Touch 'n Go eWallet RM30", desc: 'Kredit terus ke eWallet anda', mata: 2800, ic: 'wallet', pre: 'TNG', cara: 'Baucar dihantar melalui WhatsApp ke nombor telefon anda dalam 7 hari bekerja.' },
  { id: 'tng50', nama: "Baucar Touch 'n Go eWallet RM50", desc: 'Kredit terus ke eWallet anda', mata: 4500, ic: 'wallet', pre: 'TNG', cara: 'Baucar dihantar melalui WhatsApp ke nombor telefon anda dalam 7 hari bekerja.' },
  { id: 'kursus', nama: 'Diskaun yuran kursus RM100', desc: 'Untuk kursus umrah di lokasi kursus Juara', mata: 2000, ic: 'school', pre: 'KRS', cara: 'Tunjuk kod ini semasa daftar kursus di lokasi kursus Juara.' },
  { id: 'kit', nama: 'Beg dan kit umrah Juara', desc: 'Beg galas, beg kasut dan buku panduan', mata: 2500, ic: 'bag', pre: 'KIT', cara: 'Ambil di cawangan Juara terdekat. Tunjuk kod ini kepada petugas.' },
  { id: 'bilik', nama: 'Upgrade bilik hotel', desc: 'Dari bilik berempat ke bilik bertiga untuk satu tempahan', mata: 6000, ic: 'bed', pre: 'UPG', cara: 'Juara akan hubungi anda untuk pilih tempahan yang layak.' }
];
