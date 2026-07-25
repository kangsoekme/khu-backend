# Laporan Hasil Pengujian API (Skenario Sukses Menyeluruh)

## [AUTH] Login SUPER_ADMIN
**Endpoint:** `POST /api/auth/login`

### Request Body:
```json
{
  "email": "admin@test.com",
  "password": "rahasia2026"
}
```
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "token": "03ce0183-c8e6-438a-8474-4e4796c159b9"
  }
}
```

---

## [USER] Create User (Muhaffidz)
**Endpoint:** `POST /api/user`

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
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "71ebc621-7f54-40a1-a292-8a044f972c15",
    "nama": "Ust Muhaffidz",
    "email": "muhaffidz@test.com",
    "no_telp": "08111",
    "role": "MUHAFFIDZ",
    "profile_photo": null
  }
}
```

---

## [USER] Create User (Muhassin)
**Endpoint:** `POST /api/user`

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
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "d5549ccd-44ce-4df1-a642-89f9348ab555",
    "nama": "Ust Muhassin",
    "email": "muhassin@test.com",
    "no_telp": "08222",
    "role": "MUHASSIN",
    "profile_photo": null
  }
}
```

---

## [USER] Get All Users
**Endpoint:** `GET /api/users`

### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": [
    {
      "id": "f7d82f15-41a4-4617-a451-1d8175893bf9",
      "nama": "Super Admin Tester",
      "email": "admin@test.com",
      "no_telp": "081234567890",
      "role": "SUPER_ADMIN",
      "profile_photo": null
    },
    {
      "id": "71ebc621-7f54-40a1-a292-8a044f972c15",
      "nama": "Ust Muhaffidz",
      "email": "muhaffidz@test.com",
      "no_telp": "08111",
      "role": "MUHAFFIDZ",
      "profile_photo": null
    },
    {
      "id": "d5549ccd-44ce-4df1-a642-89f9348ab555",
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

## [USER] Get User by ID
**Endpoint:** `GET /api/user/71ebc621-7f54-40a1-a292-8a044f972c15`

### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "71ebc621-7f54-40a1-a292-8a044f972c15",
    "nama": "Ust Muhaffidz",
    "email": "muhaffidz@test.com",
    "no_telp": "08111",
    "role": "MUHAFFIDZ",
    "profile_photo": null
  }
}
```

---

## [SISWA] Create Siswa
**Endpoint:** `POST /api/siswa`

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
### Response (Status 200 ✅):
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
    "createdAt": "2026-07-13T14:42:27.209Z",
    "updatedAt": "2026-07-13T14:42:27.209Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```

---

## [SISWA] Get All Students
**Endpoint:** `GET /api/students`

### Response (Status 200 ✅):
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
      "createdAt": "2026-07-13T14:42:27.209Z",
      "updatedAt": "2026-07-13T14:42:27.209Z",
      "halaqoh_tahfidz_id": null,
      "tahapan_tahsin": "JILID_DASAR"
    }
  ]
}
```

---

## [SISWA] Get Student by NIS
**Endpoint:** `GET /api/student/112233`

### Response (Status 200 ✅):
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
    "createdAt": "2026-07-13T14:42:27.209Z",
    "updatedAt": "2026-07-13T14:42:27.209Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```

---

## [HALAQOH] Create Halaqoh Tahfidz
**Endpoint:** `POST /api/halaqoh`

### Request Body:
```json
{
  "nama": "Halaqoh Tahfidz Umar",
  "kategori": "TAHFIDZ",
  "userId": "71ebc621-7f54-40a1-a292-8a044f972c15",
  "nis_siswa": [
    "112233"
  ]
}
```
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
    "nama_halaqoh": "Halaqoh Tahfidz Umar",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "71ebc621-7f54-40a1-a292-8a044f972c15",
      "nama": "Ust Muhaffidz",
      "no_telp": "08111"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan",
        "kelas": "1A",
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```

---

## [HALAQOH] Create Halaqoh Tahsin
**Endpoint:** `POST /api/halaqoh`

### Request Body:
```json
{
  "nama": "Halaqoh Tahsin Abu Bakar",
  "kategori": "TAHSIN",
  "userId": "d5549ccd-44ce-4df1-a642-89f9348ab555",
  "nis_siswa": [
    "112233"
  ]
}
```
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "c72adf4d-787c-4917-9661-4dd84e93c999",
    "nama_halaqoh": "Halaqoh Tahsin Abu Bakar",
    "kategori": "TAHSIN",
    "guru": {
      "id": "d5549ccd-44ce-4df1-a642-89f9348ab555",
      "nama": "Ust Muhassin",
      "no_telp": "08222"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan",
        "kelas": "1A",
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```

---

## [HALAQOH] Get All Halaqoh
**Endpoint:** `GET /api/halaqoh`

### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": [
    {
      "id": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
      "nama_halaqoh": "Halaqoh Tahfidz Umar",
      "kategori": "TAHFIDZ",
      "guru": {
        "id": "71ebc621-7f54-40a1-a292-8a044f972c15",
        "nama": "Ust Muhaffidz",
        "no_telp": "08111"
      },
      "siswa": [
        {
          "nis": "112233",
          "nama": "Siswa Teladan",
          "kelas": "1A",
          "alamat": "Jl. Kebajikan No 1",
          "no_telp": "08555"
        }
      ]
    },
    {
      "id": "c72adf4d-787c-4917-9661-4dd84e93c999",
      "nama_halaqoh": "Halaqoh Tahsin Abu Bakar",
      "kategori": "TAHSIN",
      "guru": {
        "id": "d5549ccd-44ce-4df1-a642-89f9348ab555",
        "nama": "Ust Muhassin",
        "no_telp": "08222"
      },
      "siswa": [
        {
          "nis": "112233",
          "nama": "Siswa Teladan",
          "kelas": "1A",
          "alamat": "Jl. Kebajikan No 1",
          "no_telp": "08555"
        }
      ]
    }
  ]
}
```

---

## [TAHFIDZ] Input Hafalan Baru
**Endpoint:** `POST /api/assessment/tahfidz/hafalan/112233`

### Request Body:
```json
{
  "halaqohId": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
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
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "e82d8529-97f1-485b-bc00-aefe0037fcbd",
    "timestamp": "2026-07-13T14:42:27.426Z",
    "nis_siswa": "112233",
    "halaqohId": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
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
      "nama": "Siswa Teladan",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahfidz Umar"
    },
    "surah": {
      "nama_surah": "An-Naba"
    }
  }
}
```

---

## [TAHFIDZ] Input Murajaah
**Endpoint:** `POST /api/assessment/tahfidz/murajaah/112233`

### Request Body:
```json
{
  "halaqohId": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
  "no_surah": 78,
  "ayat_awal": 1,
  "ayat_akhir": 5,
  "jumlah_salah": 0,
  "murajaah": 5,
  "tajwid": 90
}
```
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "43f04ff3-f164-44de-9106-fba3d10d88ca",
    "timestamp": "2026-07-13T14:42:27.468Z",
    "nis_siswa": "112233",
    "halaqohId": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
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
      "nama": "Siswa Teladan",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahfidz Umar"
    },
    "surah": {
      "nama_surah": "An-Naba"
    }
  }
}
```

---

## [TAHFIDZ] Get Riwayat Hafalan
**Endpoint:** `GET /api/assessment/tahfidz/hafalan/112233`

### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan",
    "history": {
      "hafalan_baru": [
        {
          "id": "e82d8529-97f1-485b-bc00-aefe0037fcbd",
          "timestamp": "2026-07-13T14:42:27.426Z",
          "nis_siswa": "112233",
          "halaqohId": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
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

## [TAHFIDZ] Get Riwayat Murajaah
**Endpoint:** `GET /api/assessment/tahfidz/murajaah/112233`

### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan",
    "history": {
      "murajaah_baru": [
        {
          "id": "43f04ff3-f164-44de-9106-fba3d10d88ca",
          "timestamp": "2026-07-13T14:42:27.468Z",
          "nis_siswa": "112233",
          "halaqohId": "e12c91c2-3ae8-463b-9e91-214bcf605f34",
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

## [TAHSIN] Input Penilaian Tahsin
**Endpoint:** `POST /api/assessment/tahsin/112233`

### Request Body:
```json
{
  "halaqohId": "c72adf4d-787c-4917-9661-4dd84e93c999",
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
### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "id": "7f3e2a7b-57db-41c0-acec-38684bc63a27",
    "timestamp": "2026-07-13T14:42:27.596Z",
    "nis_siswa": "112233",
    "id_kelompok": "c72adf4d-787c-4917-9661-4dd84e93c999",
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
      "nama": "Siswa Teladan",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahsin Abu Bakar"
    }
  }
}
```

---

## [TAHSIN] Get Riwayat Tahsin
**Endpoint:** `GET /api/assessment/tahsin/112233`

### Response (Status 200 ✅):
```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan",
    "history": [
      {
        "id": "7f3e2a7b-57db-41c0-acec-38684bc63a27",
        "timestamp": "2026-07-13T14:42:27.596Z",
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

