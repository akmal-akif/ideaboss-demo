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

/* Pembantu untuk bina pakej contoh */
const HOTEL_UMRAH = b => [
  ['Madinah', `Hotel contoh ${b} bintang`, b >= 5 ? 'Lebih kurang 100m ke Masjid Nabawi' : b === 4 ? 'Lebih kurang 250m ke Masjid Nabawi' : 'Lebih kurang 600m ke Masjid Nabawi'],
  ['Makkah', `Hotel contoh ${b} bintang`, b >= 5 ? 'Lebih kurang 150m ke Masjidil Haram' : b === 4 ? 'Lebih kurang 400m ke Masjidil Haram' : 'Lebih kurang 900m ke Masjidil Haram, ada bas ulang alik']
];
function JALAN_UMRAH(hari, mdn, tambah){
  const r = [['Hari 1', 'Berlepas dari KLIA ke Madinah'], [`Hari 2 hingga ${mdn}`, 'Ibadah di Masjid Nabawi, Raudhah dan ziarah Madinah'],
             [`Hari ${mdn+1}`, 'Ke Makkah, niat ihram di Bir Ali dan umrah pertama']];
  const akhirMakkah = hari - 1 - (tambah ? tambah.hari : 0);
  r.push([`Hari ${mdn+2} hingga ${akhirMakkah}`, 'Ibadah di Masjidil Haram dan ziarah Makkah']);
  if(tambah) r.push([`Hari ${akhirMakkah+1}${tambah.hari>1?' hingga '+(hari-1):''}`, tambah.t]);
  r.push([`Hari ${hari}`, 'Pulang ke Malaysia']);
  return r;
}
const U = (id, nama, kat, hari, mdn, harga, img, bintang, ringkas, tarikh, o = {}) => Object.assign({
  id, nama, jenis: 'umrah', kat, cuti: false, hari: `${hari} hari ${hari-2} malam`, harga, img, ringkas, tarikh,
  jalan: JALAN_UMRAH(hari, mdn, o.tambah), hotel: HOTEL_UMRAH(bintang), termasuk: TERMASUK_UMRAH, tak: TAK_UMRAH, faq: SOALAN_UMRAH
}, o);
const T = (id, nama, kat, hari, harga, ringkas, tarikh, jalan, hotel, o = {}) => Object.assign({
  id, nama, jenis: 'lancong', kat, cuti: false, hari: `${hari} hari ${hari-1} malam`, harga, img: '', ringkas, tarikh, jalan, hotel,
  termasuk: kat === 'Dalam negara' ? TERMASUK_LANCONG.filter(x => !x.startsWith('Pemandu pelancong berbahasa')) : TERMASUK_LANCONG,
  tak: kat === 'Dalam negara' ? TAK_LANCONG.filter(x => !x.startsWith('Visa')) : TAK_LANCONG, faq: SOALAN_LANCONG
}, o);

const PAKEJ = [
  /* ---------- Umrah ---------- */
  U('umrah9', 'Umrah 9 Hari Ekonomi', 'Ekonomi', 9, 3, 6990, 'img/kaabah.jpg', 3,
    'Pakej mampu milik untuk umrah pertama anda, dengan bimbingan penuh dari awal.',
    [{ d: '2026-12-08', k: 14 }, { d: '2027-01-12', k: 22 }, { d: '2027-02-09', k: 30 }]),
  U('umrahhemat', 'Umrah Hemat 10 Hari', 'Ekonomi', 10, 3, 7490, 'img/nabawi-kumpulan.jpg', 3,
    'Lebih sehari di Makkah dengan harga yang tetap berpatutan.',
    [{ d: '2026-12-15', k: 18 }, { d: '2027-01-26', k: 28 }, { d: '2027-04-13', k: 35 }]),
  U('umrah12', 'Umrah 12 Hari Selesa', 'Selesa', 12, 5, 8990, 'img/makkah-kumpulan.jpg', 4,
    'Masa lebih panjang untuk ibadah dengan tenang. Hotel lebih dekat dengan masjid.',
    [{ d: '2026-12-12', k: 6 }, { d: '2027-01-20', k: 18 }, { d: '2027-02-17', k: 25 }]),
  U('umrahemas', 'Umrah Mesra Warga Emas', 'Selesa', 12, 5, 9290, 'img/petugas.jpg', 4,
    'Jadual lebih santai untuk ibu bapa anda. Petugas Juara bantu sepanjang perjalanan.',
    [{ d: '2027-01-08', k: 12 }, { d: '2027-03-05', k: 24 }],
    { termasuk: TERMASUK_UMRAH.concat(['Kerusi roda boleh diatur atas permintaan']) }),
  U('umrahcuti', 'Umrah Cuti Sekolah', 'Selesa', 10, 4, 9490, 'img/nabawi-kumpulan.jpg', 4,
    'Bawa seisi keluarga ke Tanah Suci masa cuti sekolah. Jadual mesra kanak-kanak.',
    [{ d: '2026-12-19', k: 4 }, { d: '2027-03-20', k: 28 }], { cuti: true }),
  U('umrahtaif', 'Umrah Plus Taif', 'Selesa', 12, 4, 9790, 'img/madinah-bas.jpg', 4,
    'Umrah lengkap dengan lawatan sehari ke bandar Taif yang sejuk dan bersejarah.',
    [{ d: '2027-01-15', k: 16 }, { d: '2027-04-02', k: 30 }],
    { tambah: { hari: 1, t: 'Lawatan sehari ke Taif' } }),
  U('umrahplus', 'Umrah Plus Madinah', 'Premium', 14, 7, 10490, 'img/nabawi.jpg', 5,
    'Lebih banyak masa di Madinah untuk anda yang rindu suasana Masjid Nabawi.',
    [{ d: '2027-01-05', k: 9 }, { d: '2027-02-23', k: 20 }]),
  U('umrahistanbul', 'Umrah Plus Istanbul', 'Premium', 14, 4, 11990, 'img/doa.jpg', 4,
    'Selesai umrah, singgah 3 hari di Istanbul sebelum pulang.',
    [{ d: '2027-03-10', k: 20 }, { d: '2027-05-05', k: 30 }],
    { tambah: { hari: 3, t: 'Ke Istanbul, lawatan masjid bersejarah dan bandar lama' } }),
  U('umrahramadan', 'Umrah Ramadan 15 Hari', 'Premium', 15, 5, 13990, 'img/makkah-kumpulan.jpg', 4,
    'Rasai suasana Ramadan di Madinah dan Makkah bersama kumpulan Juara.',
    [{ d: '2027-02-20', k: 10 }, { d: '2027-02-27', k: 8 }]),
  U('umrahpremium', 'Umrah Premium 5 Bintang', 'Premium', 12, 5, 14990, 'img/kaabah.jpg', 5,
    'Hotel 5 bintang paling dekat dengan masjid, untuk ibadah yang lebih selesa.',
    [{ d: '2026-12-22', k: 5 }, { d: '2027-02-02', k: 15 }, { d: '2027-04-20', k: 20 }]),

  /* ---------- Tours ---------- */
  T('kuching', 'Kuching, Sarawak', 'Dalam negara', 4, 990, 'Bandar kucing yang tenang, Waterfront dan makanan Sarawak yang sedap.',
    [{ d: '2026-12-05', k: 20 }, { d: '2027-03-13', k: 30 }],
    [['Hari 1', 'Terbang ke Kuching, Waterfront dan Masjid Bandaraya'], ['Hari 2', 'Kampung Budaya Sarawak'], ['Hari 3', 'Taman Negara Bako'], ['Hari 4', 'Pulang ke Semenanjung']],
    [['Kuching', 'Hotel contoh 4 bintang', 'Dekat Waterfront']]),
  T('kundasang', 'Kundasang, Sabah', 'Dalam negara', 4, 1290, 'Udara sejuk Kundasang dengan pemandangan Gunung Kinabalu.',
    [{ d: '2026-12-18', k: 8 }, { d: '2027-03-20', k: 25 }],
    [['Hari 1', 'Terbang ke Kota Kinabalu, Masjid Bandaraya'], ['Hari 2', 'Ke Kundasang, ladang tenusu Desa'], ['Hari 3', 'Taman Kinabalu dan Poring'], ['Hari 4', 'Pulang ke Semenanjung']],
    [['Kundasang', 'Resort contoh', 'Pemandangan Gunung Kinabalu'], ['Kota Kinabalu', 'Hotel contoh 4 bintang', 'Tengah bandar']], { cuti: true }),
  T('hanoi', 'Hanoi dan Halong, Vietnam', 'Asia', 5, 1990, 'Bandar lama Hanoi dan pelayaran di Teluk Halong.',
    [{ d: '2027-01-09', k: 18 }, { d: '2027-04-17', k: 30 }],
    [['Hari 1', 'Berlepas ke Hanoi, bandar lama'], ['Hari 2', 'Pelayaran Teluk Halong'], ['Hari 3', 'Ninh Binh'], ['Hari 4', 'Masa bebas dan membeli belah'], ['Hari 5', 'Pulang ke Malaysia']],
    [['Hanoi', 'Hotel contoh 4 bintang', 'Dekat bandar lama']]),
  T('taipei', 'Taipei, Taiwan', 'Asia', 5, 2890, 'Bandar moden, pasar malam dan pemandangan Jiufen.',
    [{ d: '2027-02-06', k: 20 }, { d: '2027-05-15', k: 30 }],
    [['Hari 1', 'Berlepas ke Taipei'], ['Hari 2', 'Taipei 101 dan Masjid Besar Taipei'], ['Hari 3', 'Jiufen dan Shifen'], ['Hari 4', 'Masa bebas'], ['Hari 5', 'Pulang ke Malaysia']],
    [['Taipei', 'Hotel contoh 4 bintang', 'Tengah bandar']]),
  T('beijing', 'Beijing, China', 'Asia', 6, 3290, 'Tembok Besar China, Kota Larangan dan masjid lama Niujie.',
    [{ d: '2027-03-27', k: 22 }, { d: '2027-05-22', k: 30 }],
    [['Hari 1', 'Berlepas ke Beijing'], ['Hari 2', 'Tembok Besar China'], ['Hari 3', 'Kota Larangan dan Dataran Tiananmen'], ['Hari 4', 'Masjid Niujie'], ['Hari 5', 'Masa bebas'], ['Hari 6', 'Pulang ke Malaysia']],
    [['Beijing', 'Hotel contoh 4 bintang', 'Dekat stesen kereta api bawah tanah']]),
  T('dubai', 'Dubai dan Abu Dhabi', 'Timur Tengah', 6, 4290, 'Burj Khalifa, safari padang pasir dan Masjid Sheikh Zayed.',
    [{ d: '2027-01-23', k: 15 }, { d: '2027-03-06', k: 28 }],
    [['Hari 1', 'Berlepas ke Dubai'], ['Hari 2', 'Burj Khalifa dan Dubai Mall'], ['Hari 3', 'Safari padang pasir'], ['Hari 4', 'Abu Dhabi dan Masjid Sheikh Zayed'], ['Hari 5', 'Masa bebas'], ['Hari 6', 'Pulang ke Malaysia']],
    [['Dubai', 'Hotel contoh 4 bintang', 'Dekat stesen metro']]),
  T('seoul', 'Seoul, Korea Selatan', 'Asia', 7, 4890, 'Musim sejuk di Seoul, Pulau Nami dan Masjid Seoul.',
    [{ d: '2026-12-14', k: 7 }, { d: '2027-04-03', k: 26 }],
    [['Hari 1', 'Berlepas ke Seoul'], ['Hari 2', 'Istana Gyeongbokgung dan Masjid Seoul'], ['Hari 3', 'Pulau Nami'], ['Hari 4', 'Taman tema dan aktiviti salji (ikut musim)'], ['Hari 5', 'Myeongdong'], ['Hari 6', 'Masa bebas'], ['Hari 7', 'Pulang ke Malaysia']],
    [['Seoul', 'Hotel contoh 4 bintang', 'Dekat Itaewon, mudah cari makanan halal']], { cuti: true }),
  T('tokyo', 'Tokyo, Jepun', 'Asia', 7, 5990, 'Tokyo, Gunung Fuji dan Masjid Tokyo Camii.',
    [{ d: '2026-12-16', k: 9 }, { d: '2027-03-29', k: 20 }],
    [['Hari 1', 'Berlepas ke Tokyo'], ['Hari 2', 'Asakusa dan Masjid Tokyo Camii'], ['Hari 3', 'Gunung Fuji dan Kawaguchiko'], ['Hari 4', 'Shibuya dan Harajuku'], ['Hari 5', 'Masa bebas'], ['Hari 6', 'Odaiba'], ['Hari 7', 'Pulang ke Malaysia']],
    [['Tokyo', 'Hotel contoh 4 bintang', 'Dekat stesen kereta api'], ['Kawaguchiko', 'Hotel contoh', 'Pemandangan Gunung Fuji']], { cuti: true }),
  T('turki', 'Pelancongan Turki', 'Eropah', 10, 5990, 'Jejak sejarah Islam di Istanbul, Bursa dan Cappadocia bersama keluarga.',
    [{ d: '2026-12-21', k: 12 }, { d: '2027-04-10', k: 30 }],
    [['Hari 1', 'Berlepas dari KLIA ke Istanbul'], ['Hari 2 hingga 4', 'Lawatan sekitar Istanbul dan masjid bersejarah'], ['Hari 5', 'Ke Bursa'], ['Hari 6 hingga 8', 'Cappadocia dan kawasan sekitar'], ['Hari 9', 'Kembali ke Istanbul'], ['Hari 10', 'Pulang ke Malaysia']],
    [['Istanbul', 'Hotel contoh 4 bintang', 'Di tengah bandar'], ['Cappadocia', 'Hotel contoh gaya gua', 'Pengalaman bermalam yang unik']], { cuti: true }),
  T('jordan', 'Pelancongan Jordan', 'Timur Tengah', 8, 6490, 'Ziarah makam para sahabat, kota Petra dan Laut Mati dalam satu perjalanan.',
    [{ d: '2027-02-14', k: 16 }, { d: '2027-05-08', k: 30 }],
    [['Hari 1', 'Berlepas dari KLIA ke Amman'], ['Hari 2 hingga 3', 'Ziarah makam para sahabat dan bandar Amman'], ['Hari 4 hingga 5', 'Kota Petra dan Wadi Rum'], ['Hari 6', 'Laut Mati'], ['Hari 7', 'Masa bebas di Amman'], ['Hari 8', 'Pulang ke Malaysia']],
    [['Amman', 'Hotel contoh 4 bintang', 'Dekat pusat bandar'], ['Petra', 'Hotel contoh 4 bintang', 'Dekat pintu masuk Petra']]),
  T('balkan', 'Balkan: Bosnia, Croatia, Montenegro', 'Eropah', 10, 8490, 'Sarajevo, Mostar dan pantai Dubrovnik dalam satu perjalanan.',
    [{ d: '2027-04-24', k: 20 }, { d: '2027-06-05', k: 30 }],
    [['Hari 1', 'Berlepas ke Sarajevo'], ['Hari 2 hingga 3', 'Sarajevo dan Masjid Gazi Husrev Beg'], ['Hari 4', 'Mostar'], ['Hari 5 hingga 6', 'Dubrovnik, Croatia'], ['Hari 7 hingga 8', 'Kotor dan Budva, Montenegro'], ['Hari 9', 'Kembali ke Sarajevo'], ['Hari 10', 'Pulang ke Malaysia']],
    [['Sarajevo', 'Hotel contoh 4 bintang', 'Dekat bandar lama'], ['Dubrovnik', 'Hotel contoh 4 bintang', 'Dekat pantai']]),
  T('eropah', 'Eropah Barat: Paris, Swiss, Itali', 'Eropah', 12, 11990, 'Menara Eiffel, pergunungan Alps dan kota Rom.',
    [{ d: '2027-05-01', k: 18 }, { d: '2027-06-12', k: 30 }],
    [['Hari 1', 'Berlepas ke Paris'], ['Hari 2 hingga 3', 'Paris dan Menara Eiffel'], ['Hari 4 hingga 6', 'Switzerland dan pergunungan Alps'], ['Hari 7 hingga 8', 'Venice dan Florence'], ['Hari 9 hingga 11', 'Rom'], ['Hari 12', 'Pulang ke Malaysia']],
    [['Paris', 'Hotel contoh 4 bintang', 'Dekat stesen metro'], ['Rom', 'Hotel contoh 4 bintang', 'Dekat pusat bandar']])
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
