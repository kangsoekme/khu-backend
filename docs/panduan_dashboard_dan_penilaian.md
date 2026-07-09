# 📘 Panduan Dashboard & Format Penilaian
## Sistem Informasi Tahsin Qiraah & Tahfidz Quran — Khoiru Ummah Foundation

---

# BAGIAN 1: DASHBOARD HOMEPAGE PER ROLE

---

## 🔵 1. Dashboard Super Admin

**Fokus utama:** Monitoring keseluruhan sistem, manajemen user, dan kesehatan data.

Super Admin adalah "penjaga sistem". Ia perlu melihat **siapa melakukan apa**, **apakah data terisi dengan baik**, dan **apakah ada masalah yang perlu ditangani**.

### Wireframe Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo Khoiru Ummah  |  Homepage Dashboard  |  Ahmad Fulan   │
│                              |                       |  Super Admin   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── QUICK ACCESS ─────────────────────────┐  ┌─── SKEMA USER ───┐ │
│  │ [👥 Manajemen] [🎓 Manajemen] [📖 Pantau] │  │   PIE CHART      │ │
│  │ [   User    ] [   Siswa   ] [ Tahsin  ]   │  │ ● Super Admin: 2 │ │
│  │             [📗 Pantau Tahfidz]            │  │ ● Direktur: 3    │ │
│  └───────────────────────────────────────────┘  │ ● Muhassin: 10   │ │
│                                                  │ ● Muhaffidz: 8   │ │
│  ┌─── STATISTIK RINGKAS ─────────────────────┐  └──────────────────┘ │
│  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │                      │
│  │ │ 👥 23  │ │ 🎓 115 │ │ 📋 12  │ │ ⚠️ 5 │ │                      │
│  │ │ GURU   │ │ SISWA  │ │HALAQOH │ │ALERT │ │                      │
│  │ │ AKTIF  │ │ TOTAL  │ │ AKTIF  │ │ HARI │ │                      │
│  │ │        │ │        │ │        │ │ INI  │ │                      │
│  │ └────────┘ └────────┘ └────────┘ └──────┘ │                      │
│  └────────────────────────────────────────────┘                      │
│                                                                      │
│  ┌─── AKTIVITAS PENGGUNA ────────────┐  ┌─── KALENDER KEGIATAN ───┐ │
│  │  LINE CHART (7 hari terakhir)     │  │     << Juni 2026 >>      │ │
│  │  Y: jumlah input penilaian        │  │  Mo Tu We Th Fr Sa Su    │ │
│  │  X: tanggal                       │  │   2  3  4  5  6  7  8   │ │
│  │  ───────────────────────────      │  │   9 10 11 12 13 14 15   │ │
│  │     📈 ~~~~/\~~~~~/\~~~~~         │  │  ─────────────────────   │ │
│  │  13 Jun  14 Jun  15 Jun ...       │  │  📌 Ujian Tilawah        │ │
│  └───────────────────────────────────┘  │  📌 Evaluasi Bulanan     │ │
│                                          └─────────────────────────┘ │
│  ┌─── HISTORI AKTIVITAS ────────────────────────────────────────────┐│
│  │ 🟢 Ust. Ahmad   - Menginput penilaian tahsin 5 siswa  - 10:30  ││
│  │ 🟢 Ust. Mahmud  - Menginput hafalan baru 3 siswa      - 09:15  ││
│  │ 🔵 Direktur     - Mengunduh laporan evaluasi           - 08:00  ││
│  │ 🟡 Admin        - Menambah 2 siswa baru                - 07:30  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### Penjelasan Setiap Widget

| Widget | Isi | Kenapa Penting |
|--------|-----|----------------|
| **Quick Access** | 4 shortcut: Manajemen User, Manajemen Siswa, Pantau Tahsin, Pantau Tahfidz | Super Admin butuh akses cepat ke semua menu utama |
| **Skema User (Pie Chart)** | Proporsi jumlah user per role | Memastikan keseimbangan distribusi tenaga pengajar |
| **Statistik Ringkas** | 4 kartu angka: Guru Aktif, Siswa Total, Halaqoh Aktif, **Alert Hari Ini** | Angka kunci untuk overview harian. Alert = siswa belum terassign, guru belum input, dsb |
| **Aktivitas Pengguna (Line Chart)** | Grafik jumlah input penilaian per hari selama 7 hari terakhir | Memantau apakah guru-guru aktif menginput data atau tidak |
| **Kalender Kegiatan** | Kalender + daftar event (ujian tilawah, evaluasi bulanan, rapat) | Perencanaan dan tracking kegiatan penting |
| **Histori Aktivitas** | Log terbaru: siapa melakukan apa, jam berapa | Audit trail – mengetahui aktivitas terakhir di sistem |

---

## 🟢 2. Dashboard Direktur

**Fokus utama:** Evaluasi kinerja guru, progress siswa secara keseluruhan, dan pengambilan keputusan.

Direktur adalah "pengambil keputusan". Ia tidak menginput data, tapi perlu **melihat tren**, **membandingkan performa**, dan **mengidentifikasi masalah**.

### Wireframe Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo Khoiru Ummah  |  Homepage Dashboard  |  Ahmad Fulan   │
│                              |                       |  Direktur      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── STATISTIK UTAMA ──────────────────────────────────────────────┐│
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             ││
│  │ │ 🎓 115   │ │ 👥 23    │ │ 📋 12    │ │ 📊 85%   │             ││
│  │ │ TOTAL    │ │ TOTAL    │ │ HALAQOH  │ │ TINGKAT  │             ││
│  │ │ SISWA    │ │ GURU     │ │ AKTIF    │ │ KEAKTIFAN│             ││
│  │ │ AKTIF    │ │ AKTIF    │ │          │ │ INPUT    │             ││
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘             ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── DISTRIBUSI PREDIKAT TAHSIN ──┐  ┌── DISTRIBUSI PREDIKAT ─────┐│
│  │       BAR CHART                 │  │     TAHFIDZ                 ││
│  │                                 │  │      BAR CHART              ││
│  │  A+ ████████████  32 siswa      │  │  Mumtaz █████████  28      ││
│  │  A  █████████     25 siswa      │  │  Jy.Jiddan ██████  20      ││
│  │  B+ ██████        18 siswa      │  │  Jayyid ████       14      ││
│  │  B  ████          12 siswa      │  │  Maqbul ██          8      ││
│  │  C  ███            8 siswa      │  │  Dhaif █            3      ││
│  │  D  █              2 siswa      │  │                             ││
│  └─────────────────────────────────┘  └─────────────────────────────┘│
│                                                                      │
│  ┌─── PERKEMBANGAN KUMULATIF ──────────────────────────────────────┐│
│  │   DUAL LINE CHART (Tahsin & Tahfidz)                            ││
│  │   Periode: [Pekan ▼] [Bulan] [Semester]                         ││
│  │                                                                  ││
│  │   ── Rata-rata Nilai Tahsin (biru)                              ││
│  │   ── Rata-rata Nilai Tahfidz (hijau)                            ││
│  │        📈 ~~~~/\~~~~~/\~~~~~                                     ││
│  │   13 Jun   14 Jun   15 Jun   16 Jun   17 Jun                    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── PERFORMA PER HALAQOH ──────────┐  ┌── KALENDER & KEGIATAN ──┐│
│  │  TABEL RINGKAS                    │  │    << Juni 2026 >>       ││
│  │                                    │  │  Mo Tu We Th Fr Sa Su   ││
│  │  Halaqoh        Guru    Rata² Nilai│  │   2  3  4  5  6  7  8  ││
│  │  ─────────────────────────────────│  │   9 10 11 12 13 14 15  ││
│  │  Abu Bakar     Ust.Ahmad  A (88)  │  │  ────────────────────   ││
│  │  Umar bin K.   Ust.Mahmud B+(82)  │  │  📌 Ujian Tilawah      ││
│  │  Utsman        Ust.Salim  A-(85)  │  │  📌 Evaluasi Bulanan   ││
│  │  Ali bin A.T.  Ust.Farid  B (78)  │  │                         ││
│  │  [Lihat Semua →]                  │  └─────────────────────────┘││
│  └────────────────────────────────────┘                              │
│                                                                      │
│  ┌─── SISWA PERLU PERHATIAN ────────┐  ┌── QUICK ACCESS ──────────┐│
│  │  ⚠️ 5 siswa dengan nilai menurun  │  │ [📖 Pantau Tahsin]       ││
│  │                                    │  │ [📗 Pantau Tahfidz]      ││
│  │  1. Ahmad Fulan - C → D (Tahsin) │  │ [🏫 Manajemen Halaqoh]   ││
│  │  2. Siti Dewi   - B → C (Tahsin) │  └──────────────────────────┘│
│  │  3. Mahmud      - Jayyid → Maqbul│                              │
│  │  [Lihat Semua →]                  │                              │
│  └────────────────────────────────────┘                              │
└──────────────────────────────────────────────────────────────────────┘
```

### Penjelasan Setiap Widget

| Widget | Isi | Kenapa Penting |
|--------|-----|----------------|
| **Statistik Utama** | 4 kartu: Total Siswa, Total Guru, Halaqoh Aktif, **Tingkat Keaktifan Input** (% guru yang input hari ini) | Overview angka kunci. Keaktifan input kritis supaya direktur tahu apakah guru rajin input |
| **Distribusi Predikat Tahsin** | Bar chart horizontal: berapa siswa di setiap level predikat (A+, A, B+, B, C, D) | Langsung terlihat kualitas bacaan secara keseluruhan |
| **Distribusi Predikat Tahfidz** | Bar chart horizontal: Mumtaz, Jayyid Jiddan, Jayyid, Maqbul, Dhaif | Langsung terlihat kualitas hafalan secara keseluruhan |
| **Perkembangan Kumulatif** | Dual line chart (Tahsin biru, Tahfidz hijau) + filter periode (pekan/bulan/semester) | Melihat tren naik/turun, apakah program berjalan efektif |
| **Performa Per Halaqoh** | Tabel: Nama Halaqoh → Guru → Rata-rata Nilai | **Ini kunci.** Direktur bisa bandingkan performa antar guru dan antar halaqoh |
| **Siswa Perlu Perhatian** | Daftar siswa yang nilainya **menurun** dari evaluasi sebelumnya | Early warning system supaya bisa ditindaklanjuti |
| **Kalender & Kegiatan** | Jadwal ujian, evaluasi, rapat | Perencanaan |
| **Quick Access** | 3 shortcut ke halaman utama | Navigasi cepat |

---

## 🟠 3. Dashboard Guru Muhassin

**Fokus utama:** Input penilaian harian, memantau progress siswa di halaqoh sendiri.

Guru Muhassin adalah "pengguna paling aktif sehari-hari". Ia buka sistem setiap hari setelah mengajar untuk **menginput nilai tahsin**. Dashboard-nya harus **to-the-point** dan **cepat diakses**.

### Wireframe Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo Khoiru Ummah  |  Homepage Dashboard  |  Ust. Ahmad    │
│                              |                       |  Guru Muhassin │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── SELAMAT DATANG ───────────────────────────────────────────────┐│
│  │  Assalamu'alaikum, Ust. Ahmad 👋                                 ││
│  │  Halaqoh: ABU BAKAR ASH SHIDDIQ  |  10 Siswa  |  Tahsin Qiraah  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── RINGKASAN HARI INI ──────────────────────────────────────────┐│
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                 ││
│  │  │  ✅  7/10   │  │  ⏳ 3/10   │  │  📊 A      │                 ││
│  │  │  SUDAH     │  │  BELUM     │  │  RATA-RATA │                 ││
│  │  │  DINILAI   │  │  DINILAI   │  │  NILAI     │                 ││
│  │  │  HARI INI  │  │  HARI INI  │  │  HARI INI  │                 ││
│  │  └────────────┘  └────────────┘  └────────────┘                 ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── DAFTAR SISWA & INPUT CEPAT ──────────────────────────────────┐│
│  │                                                                  ││
│  │  No  Siswa              Posisi Terakhir    Nilai     Aksi        ││
│  │  ── ─────────────────  ────────────────   ─────   ──────────    ││
│  │  1  Ahmad Fulan        Jilid 5, Hal 15    A+      ✅ Sudah      ││
│  │  2  Alif Fauzi         Ghorib, Hal 20     A       ✅ Sudah      ││
│  │  3  Mahmud bin Kasep   Jilid 4, Hal 17    B+      ✅ Sudah      ││
│  │  4  Siti Aisyah        Jilid 3, Hal 10    A       ✅ Sudah      ││
│  │  5  Fatimah Az-Zahra   Jilid 5, Hal 12    A+      ✅ Sudah      ││
│  │  6  Abdullah           Jilid 2, Hal 8     B       ✅ Sudah      ││
│  │  7  Khadijah           Jilid 4, Hal 20    A       ✅ Sudah      ││
│  │  8  Zainab             Ghorib, Hal 5      C       [📝 INPUT]   ││
│  │  9  Hamzah             Jilid 3, Hal 14    B+      [📝 INPUT]   ││
│  │  10 Bilal              Jilid 1, Hal 3     -       [📝 INPUT]   ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── PROGRESS HALAQOH ───────────┐  ┌── PENCAPAIAN TERBARU ──────┐│
│  │  LINE CHART                    │  │                              ││
│  │  Rata-rata nilai halaqoh       │  │  🏅 Ahmad Fulan              ││
│  │  7 pertemuan terakhir          │  │     Naik ke Jilid 5!        ││
│  │                                │  │                              ││
│  │     📈 ~~~~/\~~~~~/\~~~~~      │  │  🏅 Alif Fauzi               ││
│  │  Pertemuan: 41 42 43 44 45 46  │  │     Masuk materi Ghorib!    ││
│  │                                │  │                              ││
│  │  ── Distribusi Predikat ───    │  │  ⚠️ Bilal                    ││
│  │  A+/A: ████████ 5 siswa       │  │     Masih Jilid 1, perlu    ││
│  │  B+/B: ████     3 siswa       │  │     perhatian khusus        ││
│  │  C/D:  ██       2 siswa       │  │                              ││
│  └────────────────────────────────┘  └──────────────────────────────┘│
│                                                                      │
│  ┌─── RIWAYAT INPUT TERAKHIR ──────────────────────────────────────┐│
│  │  📝 Ahmad Fulan  - Jilid 5, Hal 15, A+ (LANJUT) - Hari ini     ││
│  │  📝 Alif Fauzi   - Ghorib, Hal 20, A (LANJUT)   - Hari ini     ││
│  │  📝 Mahmud       - Jilid 4, Hal 17, B+ (LANJUT) - Hari ini     ││
│  │  [Lihat Semua Riwayat →]                                        ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### Penjelasan Setiap Widget

| Widget | Isi | Kenapa Penting |
|--------|-----|----------------|
| **Selamat Datang** | Greeting + nama halaqoh + jumlah siswa + jenis (Tahsin) | Konteks: guru langsung tahu ia di halaqoh mana |
| **Ringkasan Hari Ini** | 3 kartu: Sudah Dinilai, Belum Dinilai, Rata-rata Nilai Hari Ini | **Ini yang paling penting.** Guru langsung tahu berapa siswa yang belum diinput |
| **Daftar Siswa & Input Cepat** | Tabel semua siswa + posisi bacaan terakhir + tombol [📝 INPUT] untuk yang belum dinilai | **Satu klik langsung ke form.** Ini menghilangkan navigasi berbelit-belit |
| **Progress Halaqoh** | Line chart rata-rata nilai 7 pertemuan terakhir + distribusi predikat | Guru bisa evaluasi: apakah halaqoh-nya membaik atau menurun |
| **Pencapaian Terbaru** | Highlight siswa yang naik level (🏅) dan siswa yang perlu perhatian (⚠️) | Motivasi + early warning |
| **Riwayat Input Terakhir** | Log input terbaru yang bisa di-klik untuk edit | Untuk koreksi jika ada salah input |

---

## 🟣 4. Dashboard Guru Muhaffidz

**Fokus utama:** Input hafalan baru & murojaah, tracking jadwal murojaah berdasarkan rumus 3-5-7.

Guru Muhaffidz lebih kompleks dari Muhassin karena ada **2 jenis input** (Hafalan Baru + Murojaah) dan ada **sistem reminder murojaah** yang wajib diikuti.

### Wireframe Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo Khoiru Ummah  |  Homepage Dashboard  |  Ust. Mahmud    │
│                              |                       |  Guru Muhaffidz│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── SELAMAT DATANG ───────────────────────────────────────────────┐│
│  │  Assalamu'alaikum, Ust. Mahmud 👋                                ││
│  │  Halaqoh: UMAR BIN KHATTAB  |  8 Siswa  |  Tahfidz Quran        ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── QUICK ACTION ─────────────────────────────────────────────────┐│
│  │   ┌──────────────────┐         ┌──────────────────┐              ││
│  │   │  📗 INPUT         │         │  🔄 INPUT         │              ││
│  │   │  HAFALAN BARU     │         │  MUROJAAH         │              ││
│  │   └──────────────────┘         └──────────────────┘              ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── ⚠️ REMINDER MUROJAAH HARI INI ───────────────────────────────┐│
│  │  Siswa yang hafalannya HARUS di-murojaah hari ini (rumus 3-5-7) ││
│  │                                                                  ││
│  │  🔴 Ahmad Fulan  - Al-Fajr (1-30) - Terakhir: 4 hari lalu      ││
│  │     Rumus aktif: 3 hari  →  TERLAMBAT 1 HARI                    ││
│  │                                                                  ││
│  │  🟡 Siti Dewi    - An-Naba (1-40) - Terakhir: 5 hari lalu      ││
│  │     Rumus aktif: 5 hari  →  WAKTUNYA HARI INI                   ││
│  │                                                                  ││
│  │  🟢 Mahmud       - Al-A'la (1-19) - Terakhir: 2 hari lalu      ││
│  │     Rumus aktif: 3 hari  →  Besok                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── DAFTAR SISWA & POSISI HAFALAN ───────────────────────────────┐│
│  │                                                                  ││
│  │  Siswa           Total     Surah Terakhir    Predikat    Aksi    ││
│  │  ──────────────  ────────  ───────────────  ─────────  ───────  ││
│  │  Ahmad Fulan     12 Surah  Al-Fajr (1-30)   MUMTAZ     [📝]    ││
│  │  Siti Dewi       10 Surah  An-Naba (1-40)   MUMTAZ     [📝]    ││
│  │  Mahmud          8 Surah   Al-A'la (1-19)   JY.JIDDAN  [📝]    ││
│  │  Abdullah        6 Surah   At-Thoriq (1-17) JAYYID     [📝]    ││
│  │  Khadijah        5 Surah   Al-Buruj (1-22)  MUMTAZ     [📝]    ││
│  │  ...                                                             ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─── STATISTIK HALAQOH ─────────┐  ┌── PROGRESS HAFALAN ─────────┐│
│  │  ┌──────────┐  ┌──────────┐   │  │  LINE CHART                 ││
│  │  │ 📊 94    │  │ 🎯 12    │   │  │  Jumlah surah dihafal       ││
│  │  │ RATA-RATA│  │ TOTAL    │   │  │  per siswa (7 hari)         ││
│  │  │ NILAI    │  │ PERTEMUAN│   │  │                              ││
│  │  │ MINGGU   │  │ BULAN INI│   │  │    📈 ~~~~/\~~~~~/\~~~~~    ││
│  │  └──────────┘  └──────────┘   │  │                              ││
│  │                                │  │  Distribusi Predikat:       ││
│  │  ┌──────────┐  ┌──────────┐   │  │  Mumtaz:     ████████  4   ││
│  │  │ 📗 68    │  │ 🔄 85%   │   │  │  Jy.Jiddan:  █████    2   ││
│  │  │ TOTAL    │  │ KETEPATAN│   │  │  Jayyid:     ███      1   ││
│  │  │ SURAH    │  │ MUROJAAH │   │  │  Maqbul:     ██       1   ││
│  │  │ DIHAFAL  │  │          │   │  │                              ││
│  │  └──────────┘  └──────────┘   │  └──────────────────────────────┘│
│  └────────────────────────────────┘                                  │
│                                                                      │
│  ┌─── RIWAYAT INPUT TERAKHIR ──────────────────────────────────────┐│
│  │  📗 Ahmad Fulan - Al-Fajr 1-30 - HB:94 BB:88 - MUMTAZ  - Hari ini│
│  │  🔄 Siti Dewi   - An-Naba 1-20 - Kel:90 Tj:95 - Murojaah - Kmrn ││
│  │  [Lihat Semua Riwayat →]                                        ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### Penjelasan Setiap Widget

| Widget | Isi | Kenapa Penting |
|--------|-----|----------------|
| **Selamat Datang** | Greeting + nama halaqoh + jumlah siswa + jenis (Tahfidz) | Konteks langsung |
| **Quick Action** | 2 tombol besar: Input Hafalan Baru + Input Murojaah | **Dua aksi utama.** Harus bisa diakses dalam 1 klik |
| **⚠️ Reminder Murojaah** | **WIDGET PALING KRUSIAL.** Daftar siswa yang hafalannya harus di-murojaah hari ini berdasarkan rumus 3-5-7 | Ini jantung dari metode Al-Qosimi. Tanpa reminder ini, guru bisa lupa dan hafalan siswa "kadaluarsa" |
| **Daftar Siswa & Posisi** | Tabel semua siswa + total surah dihafal + surah terakhir + predikat + shortcut input | Navigasi cepat ke form per siswa |
| **Statistik Halaqoh** | 4 kartu: Rata-rata Nilai, Total Pertemuan, Total Surah Dihafal, **Ketepatan Murojaah** (% murojaah tepat waktu) | Ketepatan Murojaah = KPI unik untuk tahfidz |
| **Progress Hafalan (Chart)** | Line chart + distribusi predikat | Tren perkembangan |
| **Riwayat Input** | Log terbaru dengan ikon beda (📗 hafalan, 🔄 murojaah) | Untuk verifikasi/edit |

---

## 📐 Ringkasan Perbandingan Dashboard 4 Role

| Aspek | Super Admin | Direktur | Guru Muhassin | Guru Muhaffidz |
|-------|-------------|----------|---------------|----------------|
| **Fokus utama** | Sistem & user | Evaluasi & keputusan | Input harian tahsin | Input hafalan & murojaah |
| **Scope data** | Seluruh sistem | Semua halaqoh | Halaqoh sendiri saja | Halaqoh sendiri saja |
| **Widget khas** | Skema User, Histori Aktivitas | Performa per Halaqoh, Siswa Perlu Perhatian | Belum Dinilai Hari Ini, Input Cepat | Reminder Murojaah 3-5-7, Quick Action 2 tombol |
| **Chart utama** | Aktivitas Pengguna | Distribusi Predikat + Tren Kumulatif | Progress Halaqoh | Progress Hafalan |
| **Aksi utama** | Kelola user/siswa | Lihat laporan, bandingkan | Input penilaian tahsin | Input hafalan + murojaah |

---
---

# BAGIAN 2: FORMAT PENILAIAN TAHSIN QIRAAH & TAHFIDZ QURAN

---

## 📖 A. PENILAIAN TAHSIN QIRAAH (Metode Ummi)

Tahsin Qiraah adalah pembelajaran **membaca Al-Qur'an dengan baik dan benar**. Menggunakan **Metode Ummi** yang terdiri dari jilid-jilid bertahap.

### Jenjang/Level Bacaan (dari bawah ke atas)

```
Level 1:  Jilid 1    → Pengenalan huruf hijaiyah
Level 2:  Jilid 2    → Huruf sambung
Level 3:  Jilid 3    → Tanda baca (harokat)
Level 4:  Jilid 4    → Tajwid dasar
Level 5:  Jilid 5    → Tajwid lanjutan
Level 6:  Jilid 6    → Tajwid lengkap
Level 7:  Ghorib     → Bacaan-bacaan asing/khusus dalam Al-Qur'an
Level 8:  Tajwid     → Penerapan tajwid di Al-Qur'an langsung
Level 9:  Al-Qur'an  → Membaca Al-Qur'an secara mandiri
```

### Komponen Penilaian Tahsin (per pertemuan/sesi)

Penilaian tahsin dilakukan **setiap kali tatap muka** (setiap hari sekolah). Ada **4 komponen** yang diisi:

---

#### 🔹 Komponen 1: HAFALAN PENDEK

**Apa ini?** Hafalan surah-surah pendek (Juz 'Amma) yang dihafal siswa secara bertahap.

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Surah** | Dropdown | Pilih nama surah, misal: An-Naba, An-Nazi'at, 'Abasa, dst. Urutan dari Juz 30 (An-Naba → An-Nas) |
| **Ayat Mulai** | Number (dropdown) | Ayat pertama yang dibaca/dihafal hari ini |
| **Ayat Selesai** | Number (dropdown) | Ayat terakhir yang dibaca/dihafal hari ini |

**Contoh isian:**
> Surah: **An-Naba** | Ayat: **1 - 10**
> Artinya: Hari ini siswa menghafal/menyetorkan Surah An-Naba ayat 1 sampai 10.

---

#### 🔹 Komponen 2: LAPORAN BACAAN (Posisi Bacaan Ummi)

**Apa ini?** Posisi siswa dalam buku Ummi — sedang di jilid berapa, halaman berapa, dan materi apa yang sedang dipelajari.

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Jilid / Surat** | Number atau Text | Angka jilid (1-6) atau nama level (Ghorib, Tajwid, Al-Qur'an) |
| **Halaman / Ayat** | Number | Halaman buku Ummi yang sedang dibaca, atau ayat jika sudah Al-Qur'an |
| **Pembahasan / Materi** | Text/Dropdown | Materi tajwid yang sedang dipelajari |

**Daftar materi yang bisa muncul** (sesuai tingkatan):

| Jilid | Contoh Materi |
|-------|---------------|
| Jilid 1-2 | Pengenalan huruf, huruf sambung |
| Jilid 3 | Mad Thobi'i, Nun Sukun |
| Jilid 4 | Mad Wajib & Jaiz, Idgham Bighunnah, Ikhfa' |
| Jilid 5 | Mad Layyin, Idgham Mimi, Waqaf, Ikhfa' Syafawi |
| Jilid 6 | Qolqolah, Mad 'Aridh Lissukun, Mad Lazim |
| Ghorib | Saktah, Imalah, Isymam, Naql, bacaan khusus |
| Tajwid | Penerapan seluruh kaidah tajwid pada mushaf |

**Contoh isian:**
> Jilid: **5** | Halaman: **15** | Materi: **Mad Layyin, Idgham Mimi**

---

#### 🔹 Komponen 3: PENILAIAN / NILAI

**Apa ini?** Nilai yang diberikan guru berdasarkan kualitas bacaan siswa saat membaca 1 halaman buku Ummi.

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Nilai** | Huruf (pilih salah satu) | A+, A, B+, B, B-, C+, C, C-, D |
| **Status** | Pilih salah satu | LANJUT (naik ke halaman berikutnya) atau ULANGI (mengulang halaman yang sama) |

### 📋 TABEL KONVERSI NILAI TAHSIN (Metode Ummi)

| Nilai Huruf | Skor Angka | Jumlah Kesalahan | Status | Penjelasan |
|:-----------:|:----------:|:-----------------:|:------:|------------|
| **A+** | 90 - 100 | 0 kesalahan | ✅ LANJUT | Baca 1 halaman benar semua, kualitas bacaan bagus sekali |
| **A** | 90 - 100 | 0 kesalahan | ✅ LANJUT | Baca 1 halaman benar semua, kualitas bacaan biasa-biasa |
| **B+** | 85 | 1 kesalahan | ✅ LANJUT | Salah 1 kali, tapi bisa membetulkan sendiri |
| **B** | 80 | 2 kesalahan | ✅ LANJUT | Salah 2 kali, tapi bisa membetulkan sendiri |
| **B-** | 75 | 3 kesalahan | ⚠️ LANJUT* | Salah 3 kali, tapi bisa membetulkan sendiri. *Naik tapi harus ulangi halaman tsb dulu |
| **C+** | 70 | 4 kesalahan | ❌ ULANGI | Salah 4 kali, bisa membetulkan sendiri tapi belum boleh naik |
| **C** | 65 | 5 kesalahan | ❌ ULANGI | Salah 5 kali, bisa membetulkan sendiri tapi belum boleh naik |
| **C-** | 60 | 6 kesalahan | ❌ ULANGI | Salah 6 kali, belum boleh naik |
| **D** | < 60 | 7+ kesalahan | ❌ ULANGI | Salah 7 kali atau lebih, belum bisa membaca dengan benar |

> [!NOTE]
> **Catatan penting dari buku panduan:**
> - Nilai **A+ vs A**: Bedanya di kualitas bacaan, bukan jumlah salah. Keduanya 0 salah, tapi A+ bacaannya lebih bagus.
> - Jika salah tapi **belum bisa memperbaiki sendiri** → tetap tidak bisa naik meskipun salah hanya 1 kali.

---

#### 🔹 Komponen 4: KETERANGAN

**Apa ini?** Catatan bebas dari guru tentang kondisi bacaan siswa.

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Keterangan** | Textarea (teks bebas) | Catatan kesalahan spesifik atau progress khusus |

**Contoh isian:**
> "Masih sering salah di Mad Layyin, perlu drill halaman 14-15"
> "Sudah lancar, siap naik ke Ghorib minggu depan"
> "Makhorijul huruf ث dan ذ masih tertukar"

---

### 📝 Contoh Lengkap 1 Sesi Penilaian Tahsin

```
════════════════════════════════════════════════
PENILAIAN TAHSIN QIRAAH
════════════════════════════════════════════════
Siswa        : Ahmad Fulan
Halaqoh      : Abu Bakar Ash Shiddiq
Pertemuan ke  : 47
Tanggal      : Senin, 22 Mei 2026
────────────────────────────────────────────────
HAFALAN PENDEK
  Surah      : An-Naba
  Ayat       : 1 - 10
────────────────────────────────────────────────
LAPORAN BACAAN
  Jilid      : 5
  Halaman    : 15
  Materi     : Mad Layyin, Idgham Mimi
────────────────────────────────────────────────
PENILAIAN
  Nilai      : A+ (90-100, 0 kesalahan)
  Status     : LANJUT ✅ (naik ke halaman 16)
────────────────────────────────────────────────
KETERANGAN
  "Bacaan sudah sangat lancar. Mad Layyin
   sudah benar. Lanjut ke halaman berikutnya."
════════════════════════════════════════════════
```

---
---

## 📗 B. PENILAIAN TAHFIDZ QURAN (Metode Al-Qosimi — PRA-SE-PAS-MAIN)

Tahfidz Quran adalah program **menghafal Al-Qur'an**. Menggunakan **Metode Al-Qosimi** dengan prinsip:

> *"Mengutamakan Lancarnya Hafalan daripada Banyaknya Hafalan"*
> Rumus: **Materi Sedikit, Pengulangannya Banyak**

### Alur Kerja Tahfidz: 4 Fase PRA-SE-PAS-MAIN

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   PRA (55%)  →  SEDANG (15%)  →  PASCA (15%)  →  MAIN (15%)
│                                                            │
│   Persiapan     Setoran ke      Pengulangan    Perawatan   │
│   Sebelum       Teman & Guru    Setelah        Jangka      │
│   Menghafal                     Setoran        Panjang     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

Masing-masing fase ada **penilaiannya sendiri**. Berikut penjelasan per fase:

---

### 🔹 FASE 1: PRA (Bobot 55%)

**Apa ini?** Persiapan sebelum menghafal. Siswa **membaca berulang** materi yang akan dihafal. Ini fase terpenting (55%).

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Surah** | Dropdown | Nama surah yang akan dihafal |
| **Ayat Mulai** | Number | Ayat pertama |
| **Ayat Selesai** | Number | Ayat terakhir |
| **Waktu Baca 40x** | Number (menit) | Durasi membaca materi sebanyak 40 kali. Maks 15 menit per halaman. Standar: MMTBG (Membaca 40x sebelum Menghafal untuk Tajwid Bagus) |
| **Terjemah 3x** | Toggle (Ya/Tidak) | Apakah sudah membaca terjemah ayat minimal 3 kali |
| **Kecepatan Baca** | Pilih salah satu | Kecepatan saat membaca 40x |

**Pilihan Kecepatan Baca:**

| Kecepatan | Durasi per Halaman | Jumlah | Total |
|-----------|-------------------|--------|-------|
| **Tartil** | 3 menit/halaman | 2x | 6 menit |
| **Tadwir** | 2 menit/halaman | 2x | 4 menit |
| **Hadr** | 1,5 menit/halaman | 2x | 3 menit |
| **MTT** (Murotal Tidak Tartil) | 1 menit/halaman | 2x | 2 menit |

**Contoh isian Fase PRA:**
> Surah: **Al-Fajr** | Ayat: **1 - 8** | Baca 40x: **15 menit** | Terjemah 3x: **Ya** | Kecepatan: **Tartil**

---

### 🔹 FASE 2: SEDANG (Bobot 15%)

**Apa ini?** Proses setoran hafalan. Ada **3 tahap** berurutan:

#### Tahap 1: SHB-KT (Setoran Hafalan Baru Kepada Teman)

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Jumlah Kesalahan (S)** | Number | Jumlah kesalahan saat setor ke teman |

#### Tahap 2: SHB-KG (Setoran Hafalan Baru Kepada Guru)

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Nilai HB** (Hafalan Baru) | Number (60-100) | Skor hafalan baru. Minimal 60, standar bagus 95. 1 halaman maks 3 kesalahan |
| **Nilai BB** (Baca Bersih) | Number (60-100) | Skor makhroj dan tajwid saat membaca |

> [!IMPORTANT]
> **Aturan SHB-KG:**
> - HB minimal nilai **60**, maksimal **95** saat SHB
> - 1 halaman maksimal **3 kesalahan**
> - Jika salah lebih dari 3, maka harus **diulang**

#### Tahap 3: MR-SHB-SG (Murojaah Setoran Hafalan Baru di Samping Guru)

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Jumlah Pengulangan** | Number | Berapa kali mengulangi di samping guru. Standar: 8x per halaman, butuh waktu 15 menit |

**Contoh isian Fase SEDANG:**
> SHB-KT Kesalahan: **2** | SHB-KG HB: **94** | SHB-KG BB: **88** | MR-SHB-SG: **8x**

---

### 🔹 FASE 3: PASCA (Bobot 15%)

**Apa ini?** Pengulangan intensif **setelah setoran**. Siswa mengulangi setoran hafalan baru (MR-SHB) setiap 1 jam selama sehari semalam, minimal 15 kali.

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **MR-SHB Tiap 1 jam (Jumlah)** | Number | Berapa kali sudah mengulangi di rumah. Maks 15x. Ditulis sesuai fakta |
| **Paraf Orang Tua** | Checkbox | Tanda bahwa orang tua memverifikasi |

**Juga termasuk:**

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **MR-KG (Murojaah Kepada Guru)** | J/S + L/A | Surat/Juz dan Lembar/Ayat yang di-murojaah-kan ke guru |

> [!NOTE]
> Jika kesulitan mengulangi setiap 1 jam, boleh setiap 2 jam sekali diulangi 2x.

**Contoh isian Fase PASCA:**
> MR-SHB: **15x** | Paraf Ortu: **✅** | MR-KG: **Al-Fajr / 1-30**

---

### 🔹 FASE 4: MAINTENANCE (Bobot 15%)

**Apa ini?** Perawatan hafalan jangka panjang. Menggunakan **rumus "3-5-7"** yang artinya:

| Rumus | Kapan | Keterangan | Durasi Berlaku |
|:-----:|-------|------------|----------------|
| **3** | Setiap **3 hari** sekali diulang | Untuk hafalan **baru** (bulan ke-1 & ke-2) | 2 bulan pertama setelah hafal |
| **5** | Setiap **5 hari** sekali diulang | Setelah mampu ujian juz'iyah (1 juz sekali duduk) | Sampai mampu 1 juz sekali duduk |
| **7** | Setiap **7 hari** sekali diulang | Untuk hafalan yang sudah ujian 1 juz sekali duduk | Sampai meninggal dunia (seumur hidup) |

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Surah/Juz yang di-Maintenance** | Dropdown | Surah/Juz yang sedang dijaga |
| **Lembar/Ayat** | Number | Range ayat yang di-murojaah |
| **Rumus Aktif** | Pilih: 3/5/7 | Rumus mana yang berlaku untuk surah ini |
| **Terakhir di-Murojaah** | Date (auto) | Tanggal terakhir surah ini di-murojaah |
| **Status** | Auto-calculate | Tepat waktu / Terlambat / Kadaluarsa |

**Contoh isian Fase MAINTENANCE:**
> Surah: **Al-Fajr** | Ayat: **1-30** | Rumus: **3 hari** | Terakhir: **12 Juni 2026** | Status: **⚠️ Waktunya hari ini**

---

### Kriteria Kesalahan dalam Tahfidz

Apa saja yang dihitung sebagai **1 kesalahan**:

| No | Jenis Kesalahan | Penjelasan |
|----|-----------------|------------|
| 1 | Mengubah **Makhroj** | Salah titik keluar huruf |
| 2 | Mengubah **Harokat** | Salah baris (fathah/dhommah/kasroh) |
| 3 | Mengubah **Huruf** | Mengganti huruf dengan huruf lain |
| 4 | Mengubah **Kata** | Mengganti atau menambah/mengurangi kata |
| 5 | Membaca **tidak urut** | Melompat ayat atau membaca ayat yang salah |
| 6 | Diperingatkan **2x** tapi masih salah | Peringatan ke-3 baru dihitung 1 kesalahan |
| 7 | **Diam 8 detik** | Berhenti lama tanpa melanjutkan = 1 kesalahan |

**Pengurangan skor:**
- Saat **SHB** (setoran harian): 1 kesalahan = **-10 poin**, maks 3 kesalahan
- Saat **Ujian 1 Juz**: 1 kesalahan = **-3 poin**
- Jika ujian 1 juz kesalahan > 10 → harus **remidi**
- Jika remidi 3x masih > 10 kesalahan → boleh lanjut SHB baru (supaya tidak patah semangat)

---

### 📋 TABEL PREDIKAT/KATEGORI TAHFIDZ

| Nilai Angka (rata-rata HB & BB) | Predikat | Keterangan |
|:------:|:--------:|------------|
| 90 - 100 | **MUMTAZ** | Istimewa / Sempurna |
| 80 - 89 | **JAYYID JIDDAN** | Sangat Baik |
| 70 - 79 | **JAYYID** | Baik |
| 60 - 69 | **MAQBUL** | Cukup / Diterima |
| < 60 | **DHAIF** | Lemah / Perlu Bimbingan Intensif |

> [!NOTE]
> Predikat dihitung dari **rata-rata nilai HB dan BB** pada SHB-KG.
> Contoh: HB = 94, BB = 88 → Rata-rata = 91 → **MUMTAZ**

---

### 📝 Contoh Lengkap 1 Sesi Penilaian Tahfidz (Hafalan Baru)

```
════════════════════════════════════════════════
PENILAIAN TAHFIDZ - HAFALAN BARU
════════════════════════════════════════════════
Siswa        : Ahmad Fulan
Halaqoh      : Umar bin Khattab
Pertemuan ke  : 32
Tanggal      : Senin, 22 Mei 2026
────────────────────────────────────────────────
MATERI HAFALAN
  Surah      : Al-Fajr
  Ayat       : 23 - 30  (8 ayat)
────────────────────────────────────────────────
FASE PRA (55%)
  Waktu Baca 40x  : 12 menit   ✅
  Terjemah 3x     : Ya         ✅
  Kecepatan Baca  : Tadwir
────────────────────────────────────────────────
FASE SEDANG (15%)
  SHB-KT (ke teman)
    Kesalahan    : 1
  SHB-KG (ke guru)
    Nilai HB     : 94
    Nilai BB     : 88
    Kesalahan    : 2
  MR-SHB-SG
    Pengulangan  : 8x          ✅
────────────────────────────────────────────────
AUTO-PREDIKAT
  Rata-rata HB+BB : (94+88)/2 = 91
  Kategori         : 🏅 MUMTAZ
────────────────────────────────────────────────
CATATAN GURU
  "Makhroj huruf ع sudah membaik.
   Tajwid ikhfa sudah benar."
════════════════════════════════════════════════

FASE PASCA (dilaporkan keesokan harinya/berikutnya)
  MR-SHB Tiap 1 jam : 15x      ✅
  Paraf Orang Tua   : ✅
  MR-KG             : Al-Fajr / 23-30

MAINTENANCE (otomatis dijadwalkan sistem)
  Rumus aktif        : 3 hari
  Harus murojaah     : 25 Mei 2026
════════════════════════════════════════════════
```

---

## 🔄 C. PENILAIAN MUROJAAH (Pengulangan Hafalan)

Murojaah adalah **sesi terpisah** dari hafalan baru. Ini untuk **mengulang hafalan yang sudah dihafal** supaya tidak lupa.

### Jenis-Jenis Murojaah

| Jenis | Singkatan | Kapan | Kepada Siapa |
|-------|-----------|-------|-------------|
| Murojaah Setoran Hafalan Baru | MR-SHB | Tiap 1 jam setelah setoran (fase PASCA) | Mandiri + ortu |
| Murojaah Kepada Guru | MR-KG | Sesi berikutnya setelah PASCA | Guru |
| Murojaah Pribadi / Maintenance | MR-PBD | Setiap 3/5/7 hari (seumur hidup) | Mandiri |

### Format Input Murojaah

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| **Tipe Murojaah** | Pilih salah satu | MR-SHB / MR-KG / MR-PBD |
| **Surah** | Dropdown | Surah yang di-murojaah |
| **Ayat Mulai** | Number | Ayat awal |
| **Ayat Selesai** | Number | Ayat akhir |
| **Kelancaran** | Number (0-100) | Skor kelancaran membaca |
| **Tajwid** | Number (0-100) | Skor ketepatan tajwid |
| **Jumlah Salah** | Number | Total kesalahan |
| **Murojaah ke-** | Number | Ini pengulangan yang ke berapa untuk surah ini |

### 📋 TABEL PREDIKAT MUROJAAH

| Rata-rata (Kelancaran + Tajwid) / 2 | Predikat |
|:---:|:---:|
| 90 - 100 | MUMTAZ |
| 80 - 89 | JAYYID JIDDAN |
| 70 - 79 | JAYYID |
| 60 - 69 | MAQBUL |
| < 60 | DHAIF |

### 📝 Contoh Lengkap 1 Sesi Murojaah

```
════════════════════════════════════════════════
PENILAIAN MUROJAAH
════════════════════════════════════════════════
Siswa        : Ahmad Fulan
Halaqoh      : Umar bin Khattab
Tanggal      : Rabu, 25 Mei 2026
────────────────────────────────────────────────
Tipe         : MR-PBD (Maintenance Pribadi)
Surah        : Al-Fajr
Ayat         : 1 - 30 (seluruh surah)
Murojaah ke  : 4
────────────────────────────────────────────────
PENILAIAN
  Kelancaran   : 90
  Tajwid       : 95
  Jumlah Salah : 1
────────────────────────────────────────────────
AUTO-PREDIKAT
  Rata-rata    : (90+95)/2 = 92.5
  Kategori     : 🏅 MUMTAZ
────────────────────────────────────────────────
STATUS JADWAL
  Rumus aktif  : 3 hari
  Jadwal berikutnya : 28 Mei 2026
  Status       : ✅ TEPAT WAKTU
════════════════════════════════════════════════
```

---

## 📊 Ringkasan Perbandingan Format Penilaian

| Aspek | Tahsin Qiraah | Tahfidz (Hafalan Baru) | Murojaah |
|-------|---------------|------------------------|----------|
| **Metode** | Ummi | Al-Qosimi (PRA-SE-PAS-MAIN) | Al-Qosimi |
| **Frekuensi** | Setiap pertemuan | Setiap ada hafalan baru | Sesuai rumus 3-5-7 |
| **Komponen utama** | Hafalan Pendek + Laporan Bacaan + Nilai + Keterangan | 4 fase: PRA, SEDANG, PASCA, MAIN | Kelancaran + Tajwid + Jml Salah |
| **Skala nilai** | Huruf (A+ sampai D) | Angka (0-100) untuk HB & BB | Angka (0-100) untuk Kelancaran & Tajwid |
| **Predikat** | LANJUT / ULANGI | Mumtaz / Jy.Jiddan / Jayyid / Maqbul / Dhaif | Mumtaz / Jy.Jiddan / Jayyid / Maqbul / Dhaif |
| **Penentuan predikat** | Berdasarkan jumlah kesalahan baca 1 halaman | Rata-rata (HB + BB) / 2 | Rata-rata (Kelancaran + Tajwid) / 2 |
| **Tracking posisi** | Jilid + Halaman | Surah + Ayat + Total Surah Dihafal | Surah + Ayat + Murojaah ke-berapa |
| **Fitur unik** | Konversi kesalahan → nilai huruf | Fase PRA 40x baca, kecepatan, terjemah | Rumus 3-5-7, status kadaluarsa |

