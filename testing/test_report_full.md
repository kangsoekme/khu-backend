# Laporan Pengujian API — Semua 23 Endpoint

## [0] [AUTH] Login (public endpoint) ✅
**`POST /api/auth/login`** — Status: **200**

### Request Body:
```json
{
  "email": "admin@test.com",
  "password": "rahasia2026"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "token": "15838fbb-c55c-4c04-9b74-7964f077bff5"
  }
}
```

---

## [1] [USER] Tambah User (Muhaffidz) ✅
**`POST /api/user`** — Status: **200**

### Request Body:
```json
{
  "nama": "Ust Muhaffidz",
  "email": "muhaffidz@test.com",
  "password": "password",
  "no_telp": "08111",
  "role": "MUHAFFIDZ"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
    "nama": "Ust Muhaffidz",
    "email": "muhaffidz@test.com",
    "no_telp": "08111",
    "role": "MUHAFFIDZ",
    "profile_photo": null
  }
}
```

---

## [1] [USER] Tambah User (Muhassin) ✅
**`POST /api/user`** — Status: **200**

### Request Body:
```json
{
  "nama": "Ust Muhassin",
  "email": "muhassin@test.com",
  "password": "password",
  "no_telp": "08222",
  "role": "MUHASSIN"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "4fc8dc79-d09c-4c54-a026-19a2605c6cda",
    "nama": "Ust Muhassin",
    "email": "muhassin@test.com",
    "no_telp": "08222",
    "role": "MUHASSIN",
    "profile_photo": null
  }
}
```

---

## [2] [USER] Edit User ✅
**`PUT /api/user/38f69051-9760-41c1-80cf-cbf482b4f0df`** — Status: **200**

### Request Body:
```json
{
  "nama": "Ust Muhaffidz (Updated)",
  "no_telp": "08999"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
    "nama": "Ust Muhaffidz (Updated)",
    "email": "muhaffidz@test.com",
    "no_telp": "08999",
    "role": "MUHAFFIDZ",
    "profile_photo": null
  }
}
```

---

## [3] [USER] Dapatkan Semua User ✅
**`GET /api/users`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "cb60d2a0-2ce0-4f35-a2ed-ad86def815f2",
      "nama": "Super Admin",
      "email": "admin@test.com",
      "no_telp": "081234567890",
      "role": "SUPER_ADMIN",
      "profile_photo": null
    },
    {
      "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
      "nama": "Ust Muhaffidz (Updated)",
      "email": "muhaffidz@test.com",
      "no_telp": "08999",
      "role": "MUHAFFIDZ",
      "profile_photo": null
    },
    {
      "id": "4fc8dc79-d09c-4c54-a026-19a2605c6cda",
      "nama": "Ust Muhassin",
      "email": "muhassin@test.com",
      "no_telp": "08222",
      "role": "MUHASSIN",
      "profile_photo": null
    }
  ]
}
```

---

## [4] [USER] Dapatkan Detail User ✅
**`GET /api/user/38f69051-9760-41c1-80cf-cbf482b4f0df`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": {
    "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
    "nama": "Ust Muhaffidz (Updated)",
    "email": "muhaffidz@test.com",
    "no_telp": "08999",
    "role": "MUHAFFIDZ",
    "profile_photo": null
  }
}
```

---

## [7] [SISWA] Tambah Siswa ✅
**`POST /api/siswa`** — Status: **200**

### Request Body:
```json
{
  "nis": "112233",
  "nama": "Siswa Teladan",
  "jenis_kelamin": "LAKI_LAKI",
  "tanggal_lahir": "2010-01-01T00:00:00Z",
  "alamat": "Jl. Kebajikan No 1",
  "nama_wali": "Bapak Wali",
  "no_telp": "08555",
  "kelas": "1A",
  "tahapan_tahsin": "JILID_DASAR"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan",
    "jenis_kelamin": "LAKI_LAKI",
    "tanggal_lahir": "2010-01-01T00:00:00.000Z",
    "alamat": "Jl. Kebajikan No 1",
    "nama_wali": "Bapak Wali",
    "no_telp": "08555",
    "kelas": "1A",
    "profile_photo": null,
    "createdAt": "2026-07-13T15:13:56.309Z",
    "updatedAt": "2026-07-13T15:13:56.309Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```

---

## [8] [SISWA] Dapatkan Semua Siswa ✅
**`GET /api/students`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": [
    {
      "nis": "112233",
      "nama": "Siswa Teladan",
      "jenis_kelamin": "LAKI_LAKI",
      "tanggal_lahir": "2010-01-01T00:00:00.000Z",
      "alamat": "Jl. Kebajikan No 1",
      "nama_wali": "Bapak Wali",
      "no_telp": "08555",
      "kelas": "1A",
      "profile_photo": null,
      "createdAt": "2026-07-13T15:13:56.309Z",
      "updatedAt": "2026-07-13T15:13:56.309Z",
      "halaqoh_tahfidz_id": null,
      "tahapan_tahsin": "JILID_DASAR"
    }
  ]
}
```

---

## [9] [SISWA] Dapatkan Detail Siswa ✅
**`GET /api/student/112233`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan",
    "jenis_kelamin": "LAKI_LAKI",
    "tanggal_lahir": "2010-01-01T00:00:00.000Z",
    "alamat": "Jl. Kebajikan No 1",
    "nama_wali": "Bapak Wali",
    "no_telp": "08555",
    "kelas": "1A",
    "profile_photo": null,
    "createdAt": "2026-07-13T15:13:56.309Z",
    "updatedAt": "2026-07-13T15:13:56.309Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```

---

## [10] [SISWA] Edit Siswa ✅
**`PUT /api/student/112233`** — Status: **200**

### Request Body:
```json
{
  "nama": "Siswa Teladan (Edited)",
  "kelas": "2A"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan (Edited)",
    "jenis_kelamin": "LAKI_LAKI",
    "tanggal_lahir": "2010-01-01T00:00:00.000Z",
    "alamat": "Jl. Kebajikan No 1",
    "nama_wali": "Bapak Wali",
    "no_telp": "08555",
    "kelas": "2A",
    "profile_photo": null,
    "createdAt": "2026-07-13T15:13:56.309Z",
    "updatedAt": "2026-07-13T15:13:56.309Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```

---

## [12] [HALAQOH] Tambah Halaqoh Tahfidz ✅
**`POST /api/halaqoh`** — Status: **200**

### Request Body:
```json
{
  "nama": "Halaqoh Tahfidz Umar",
  "kategori": "TAHFIDZ",
  "userId": "38f69051-9760-41c1-80cf-cbf482b4f0df",
  "nis_siswa": [
    "112233"
  ]
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "8d162672-5c09-46f4-8592-43aa823b7447",
    "nama_halaqoh": "Halaqoh Tahfidz Umar",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
      "nama": "Ust Muhaffidz (Updated)",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan (Edited)",
        "kelas": "2A",
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```

---

## [12] [HALAQOH] Tambah Halaqoh Tahsin ✅
**`POST /api/halaqoh`** — Status: **200**

### Request Body:
```json
{
  "nama": "Halaqoh Tahsin Abu Bakar",
  "kategori": "TAHSIN",
  "userId": "4fc8dc79-d09c-4c54-a026-19a2605c6cda",
  "nis_siswa": [
    "112233"
  ]
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "4e0f027e-d45a-4dd5-8c8e-30b8828d8743",
    "nama_halaqoh": "Halaqoh Tahsin Abu Bakar",
    "kategori": "TAHSIN",
    "guru": {
      "id": "4fc8dc79-d09c-4c54-a026-19a2605c6cda",
      "nama": "Ust Muhassin",
      "no_telp": "08222"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan (Edited)",
        "kelas": "2A",
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```

---

## [13] [HALAQOH] Dapatkan Semua Halaqoh ✅
**`GET /api/halaqoh`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "8d162672-5c09-46f4-8592-43aa823b7447",
      "nama_halaqoh": "Halaqoh Tahfidz Umar",
      "kategori": "TAHFIDZ",
      "guru": {
        "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
        "nama": "Ust Muhaffidz (Updated)",
        "no_telp": "08999"
      },
      "siswa": [
        {
          "nis": "112233",
          "nama": "Siswa Teladan (Edited)",
          "kelas": "2A",
          "alamat": "Jl. Kebajikan No 1",
          "no_telp": "08555"
        }
      ]
    },
    {
      "id": "4e0f027e-d45a-4dd5-8c8e-30b8828d8743",
      "nama_halaqoh": "Halaqoh Tahsin Abu Bakar",
      "kategori": "TAHSIN",
      "guru": {
        "id": "4fc8dc79-d09c-4c54-a026-19a2605c6cda",
        "nama": "Ust Muhassin",
        "no_telp": "08222"
      },
      "siswa": [
        {
          "nis": "112233",
          "nama": "Siswa Teladan (Edited)",
          "kelas": "2A",
          "alamat": "Jl. Kebajikan No 1",
          "no_telp": "08555"
        }
      ]
    }
  ]
}
```

---

## [14] [HALAQOH] Dapatkan Detail Halaqoh ✅
**`GET /api/halaqoh/8d162672-5c09-46f4-8592-43aa823b7447`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": {
    "id": "8d162672-5c09-46f4-8592-43aa823b7447",
    "nama_halaqoh": "Halaqoh Tahfidz Umar",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
      "nama": "Ust Muhaffidz (Updated)",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan (Edited)",
        "kelas": "2A",
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```

---

## [15] [HALAQOH] Edit Halaqoh ✅
**`PUT /api/halaqoh/8d162672-5c09-46f4-8592-43aa823b7447`** — Status: **200**

### Request Body:
```json
{
  "nama": "Halaqoh Tahfidz Umar (Updated)",
  "kategori": "TAHFIDZ",
  "userId": "38f69051-9760-41c1-80cf-cbf482b4f0df",
  "nis_siswa": [
    "112233"
  ]
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "8d162672-5c09-46f4-8592-43aa823b7447",
    "nama_halaqoh": "Halaqoh Tahfidz Umar (Updated)",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "38f69051-9760-41c1-80cf-cbf482b4f0df",
      "nama": "Ust Muhaffidz (Updated)",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan (Edited)",
        "kelas": "2A",
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```

---

## [17] [HAFALAN] Tambah Hafalan Baru ✅
**`POST /api/assessment/tahfidz/hafalan/112233`** — Status: **200**

### Request Body:
```json
{
  "halaqohId": "8d162672-5c09-46f4-8592-43aa823b7447",
  "no_surah": 78,
  "ayat_awal": 1,
  "ayat_akhir": 10,
  "durasi_baca": 5,
  "toggle_tarjamah": true,
  "jumlah_salah": 1,
  "murajaah": 8,
  "tajwid": 85
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "1840f06b-ab58-47d9-a585-1aeb1bda63d6",
    "timestamp": "2026-07-13T15:13:56.715Z",
    "nis_siswa": "112233",
    "halaqohId": "8d162672-5c09-46f4-8592-43aa823b7447",
    "no_surah": 78,
    "ayat_awal": 1,
    "ayat_akhir": 10,
    "durasi_baca": 5,
    "toggle_tarjamah": true,
    "jumlah_salah": 1,
    "murajaah": 8,
    "kelancaran": 85,
    "tajwid": 85,
    "rata_rata": 85,
    "predikat": "JAYYID_JIDDAN",
    "status_kelanjutan": "LANJUT",
    "siswa": {
      "nama": "Siswa Teladan (Edited)",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahfidz Umar (Updated)"
    },
    "surah": {
      "nama_surah": "An-Naba"
    }
  }
}
```

---

## [18] [HAFALAN] Riwayat Hafalan ✅
**`GET /api/assessment/tahfidz/hafalan/112233`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan (Edited)",
    "history": {
      "hafalan_baru": [
        {
          "id": "1840f06b-ab58-47d9-a585-1aeb1bda63d6",
          "timestamp": "2026-07-13T15:13:56.715Z",
          "nis_siswa": "112233",
          "halaqohId": "8d162672-5c09-46f4-8592-43aa823b7447",
          "no_surah": 78,
          "ayat_awal": 1,
          "ayat_akhir": 10,
          "durasi_baca": 5,
          "toggle_tarjamah": true,
          "jumlah_salah": 1,
          "murajaah": 8,
          "kelancaran": 85,
          "tajwid": 85,
          "rata_rata": 85,
          "predikat": "JAYYID_JIDDAN",
          "status_kelanjutan": "LANJUT",
          "surah": {
            "nama_surah": "An-Naba"
          }
        }
      ],
      "summary": {
        "total_hafalan": 1,
        "rata_rata_kelancaran": 85
      }
    }
  }
}
```

---

## [19] [MURAJAAH] Tambah Murajaah ✅
**`POST /api/assessment/tahfidz/murajaah/112233`** — Status: **200**

### Request Body:
```json
{
  "halaqohId": "8d162672-5c09-46f4-8592-43aa823b7447",
  "no_surah": 78,
  "ayat_awal": 1,
  "ayat_akhir": 5,
  "jumlah_salah": 0,
  "murajaah": 5,
  "tajwid": 90
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "b54fd037-2941-4e2b-9b41-17cc6a022c58",
    "timestamp": "2026-07-13T15:13:56.789Z",
    "nis_siswa": "112233",
    "halaqohId": "8d162672-5c09-46f4-8592-43aa823b7447",
    "no_surah": 78,
    "ayat_awal": 1,
    "ayat_akhir": 5,
    "jumlah_salah": 0,
    "murajaah": 5,
    "kelancaran": 95,
    "tajwid": 90,
    "rata_rata": 93,
    "predikat": "MUMTAZ",
    "siswa": {
      "nama": "Siswa Teladan (Edited)",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahfidz Umar (Updated)"
    },
    "surah": {
      "nama_surah": "An-Naba"
    }
  }
}
```

---

## [20] [MURAJAAH] Riwayat Murajaah ✅
**`GET /api/assessment/tahfidz/murajaah/112233`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan (Edited)",
    "history": {
      "murajaah_baru": [
        {
          "id": "b54fd037-2941-4e2b-9b41-17cc6a022c58",
          "timestamp": "2026-07-13T15:13:56.789Z",
          "nis_siswa": "112233",
          "halaqohId": "8d162672-5c09-46f4-8592-43aa823b7447",
          "no_surah": 78,
          "ayat_awal": 1,
          "ayat_akhir": 5,
          "jumlah_salah": 0,
          "murajaah": 5,
          "kelancaran": 95,
          "tajwid": 90,
          "rata_rata": 93,
          "predikat": "MUMTAZ",
          "surah": {
            "nama_surah": "An-Naba"
          }
        }
      ],
      "summary": {
        "total_murajaah": 1,
        "rata_rata_kelancaran": 95
      }
    }
  }
}
```

---

## [21] [TAHSIN] Tambah Penilaian Tahsin ✅
**`POST /api/assessment/tahsin/112233`** — Status: **200**

### Request Body:
```json
{
  "halaqohId": "4e0f027e-d45a-4dd5-8c8e-30b8828d8743",
  "no_surah": 1,
  "hafalan_surah": 78,
  "hafalan_ayat_awal": 1,
  "hafalan_ayat_akhir": 5,
  "jilid": 1,
  "bab": 2,
  "ayat_awal": 1,
  "ayat_akhir": 7,
  "materi": "Pengenalan Huruf",
  "nilai": "A",
  "keterangan": "Bagus sekali"
}
```
### Response:
```json
{
  "status": "success",
  "data": {
    "id": "ffe2f255-a89f-4727-97c0-83d2c01cf2e0",
    "timestamp": "2026-07-13T15:13:56.923Z",
    "nis_siswa": "112233",
    "id_kelompok": "4e0f027e-d45a-4dd5-8c8e-30b8828d8743",
    "hafalan_surah": 78,
    "hafalan_ayat_awal": 1,
    "hafalan_ayat_akhir": 5,
    "tahapan": "JILID_DASAR",
    "jilid": 1,
    "bab": 2,
    "no_surah": 1,
    "ayat_awal": 1,
    "ayat_akhir": 7,
    "materi": "Pengenalan Huruf",
    "nilai": "A",
    "keterangan": "Bagus sekali",
    "status_kelanjutan": "LANJUT",
    "siswa": {
      "nama": "Siswa Teladan (Edited)",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahsin Abu Bakar"
    }
  }
}
```

---

## [22] [TAHSIN] Riwayat Tahsin ✅
**`GET /api/assessment/tahsin/112233`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan (Edited)",
    "history": [
      {
        "id": "ffe2f255-a89f-4727-97c0-83d2c01cf2e0",
        "timestamp": "2026-07-13T15:13:56.923Z",
        "hafalan_surah": {
          "surah": "An-Naba",
          "ayat_awal": 1,
          "ayat_akhir": 5
        },
        "laporan_bacaan": {
          "jilid_surah": "Al-Fatihah",
          "ayat": 7,
          "materi": "Pengenalan Huruf"
        },
        "nilai_tahsin": "A",
        "keterangan": "Bagus sekali"
      }
    ],
    "summary": {
      "total_pertemuan": 1,
      "nilai_terakhir": "A",
      "rata_rata": "A"
    }
  }
}
```

---

## [16] [HALAQOH] Hapus Halaqoh ✅
**`DELETE /api/halaqoh/4e0f027e-d45a-4dd5-8c8e-30b8828d8743`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": "OK"
}
```

---

## [11] [SISWA] Hapus Siswa ✅
**`DELETE /api/student/112233`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": "OK"
}
```

---

## [6] [USER] Hapus User ✅
**`DELETE /api/user/4fc8dc79-d09c-4c54-a026-19a2605c6cda`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": "OK"
}
```

---

## [5] [AUTH] Logout ✅
**`DELETE /api/auth/logout`** — Status: **200**

### Response:
```json
{
  "status": "success",
  "data": "OK"
}
```

---

## 📊 Ringkasan Hasil

| Hasil | Jumlah |
|-------|--------|
| ✅ Berhasil (2xx) | 25 |
| ❌ Gagal / Error | 0 |
| **Total Endpoint Diuji** | **25** |
