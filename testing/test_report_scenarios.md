# 📋 Laporan Pengujian API — Semua Skenario (Sukses, Gagal & Jailbreak)

> Dijalankan: 17/7/2026, 20.25.26


---

## 🗂️ AUTH — POST /api/auth/login

### ✅ [1.1] ✔ Login berhasil
`POST /api/auth/login` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "admin@test.com",
  "password": "rahasia2026"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "token": "30c6b521-8ddf-49c1-bd4e-21d9bb73fee8"
  }
}
```
</details>

### ✅ [1.2] ✘ Password salah → 401
`POST /api/auth/login` | Ekspektasi: **401** | Aktual: **401**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "admin@test.com",
  "password": "passwordSalah"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "Email or password is wrong"
}
```
</details>

### ✅ [1.3] ✘ Email tidak terdaftar → 401
`POST /api/auth/login` | Ekspektasi: **401** | Aktual: **401**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "tidakada@test.com",
  "password": "apapun"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "Email or password is wrong"
}
```
</details>

### ✅ [1.4] ✘ Body kosong → 400
`POST /api/auth/login` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"email\" is required. \"password\" is required"
}
```
</details>

### ✅ [1.5] ✘ Format email invalid → 400
`POST /api/auth/login` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "inibukanemail",
  "password": "rahasia2026"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"email\" must be a valid email"
}
```
</details>

### ✅ [1.6] 🔒 SQL Injection attempt → 400/401
`POST /api/auth/login` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "' OR '1'='1",
  "password": "x"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"email\" must be a valid email"
}
```
</details>

### ✅ [1.7] 🔒 XSS attempt di field email → 400
`POST /api/auth/login` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "<script>alert(1)</script>@evil.com",
  "password": "x"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"email\" must be a valid email"
}
```
</details>

### ✅ [1.8] ✘ Akses endpoint tanpa token → 401
`GET /api/users` | Ekspektasi: **401** | Aktual: **401**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Access denied, token not found"
}
```
</details>

### ✅ [1.9] ✘ Token palsu/invalid → 401
`GET /api/users` | Ekspektasi: **401** | Aktual: **401**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```
</details>


---

## 🗂️ USER — POST /api/user (Tambah User)

### ✅ [2.1] ✔ Tambah user berhasil
`POST /api/user` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
    "nama": "Guru 1",
    "email": "guru1@test.com",
    "no_telp": "08111",
    "role": "GURU",
    "profile_photo": null
  }
}
```
</details>

### ✅ [2.2] ✔ Tambah user muhassin berhasil
`POST /api/user` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "19f89265-29af-4b1a-9c99-52bdce9f1aa6",
    "nama": "Guru 2",
    "email": "guru2@test.com",
    "no_telp": "08222",
    "role": "GURU",
    "profile_photo": null
  }
}
```
</details>

### ✅ [2.3] ✘ Email duplikat → 400
`POST /api/user` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "email": "guru1@test.com",
  "...": "sama"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "Data guru sudah terdaftar"
}
```
</details>

### ✅ [2.4] ✘ Field email tidak ada → 400
`POST /api/user` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Tanpa Email"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"email\" is required. \"role\" is required"
}
```
</details>

### ✅ [2.5] ✘ Role invalid (HACKER) → 400
`POST /api/user` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "role": "HACKER"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"role\" must be one of [SUPER_ADMIN, DIREKTUR, GURU]"
}
```
</details>

### ✅ [2.6] 🔒 String nama sangat panjang (1000 char) → 400/200
`POST /api/user` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...(1000 char)"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"nama\" length must be less than or equal to 100 characters long"
}
```
</details>

### ✅ [2.7] 🔒 XSS di field nama — apakah tersimpan apa adanya?
`POST /api/user` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "<img src=x ...>"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "7d1e0ae6-cf71-46a8-9c4e-c2ac5c4ee415",
    "nama": "<img src=x onerror=alert(1)>",
    "email": "xss@test.com",
    "no_telp": "08777",
    "role": "GURU",
    "profile_photo": null
  }
}
```
</details>

### ✅ [2.8] 🔒 RBAC: GURU coba POST /user → 403
`POST /api/user` | Ekspektasi: **403** | Aktual: **403**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Access denied, role prohibited"
}
```
</details>


---

## 🗂️ USER — PUT /api/user/:id (Edit User)

### ✅ [3.1] ✔ Edit user berhasil
`PUT /api/user/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Guru 1 Updated",
  "no_telp": "08999"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
    "nama": "Guru 1 Updated",
    "email": "guru1@test.com",
    "no_telp": "08999",
    "role": "GURU",
    "profile_photo": null
  }
}
```
</details>

### ✅ [3.2] ✘ User ID tidak ditemukan → 404
`PUT /api/user/:id` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data guru tidak ditemukan"
}
```
</details>

### ✅ [3.3] ✘ Body kosong saat edit → cek response
`PUT /api/user/:id` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"value\" must have at least 1 key"
}
```
</details>


---

## 🗂️ USER — GET /api/users & /api/user/:id

### ✅ [4.1] ✔ Get semua user berhasil
`GET /api/users` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": [
    {
      "id": "7d1e0ae6-cf71-46a8-9c4e-c2ac5c4ee415",
      "nama": "<img src=x onerror=alert(1)>",
      "email": "xss@test.com",
      "no_telp": "08777",
      "role": "GURU",
      "profile_photo": null
    },
    {
      "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
      "nama": "Guru 1 Updated",
      "email": "guru1@test.com",
      "no_telp": "08999",
      "role": "GURU",
      "profile_photo": null
    },
    {
      "id": "19f89265-29af-4b1a-9c99-52bdce9f1aa6",
      "nama": "Guru 2",
      "email": "guru2@test.com",
      "no_telp": "08222",
      "role": "GURU",
      "profile_photo": null
    },
    {
      "id": "d0ccc47c-8d3c-4edc-b90a-557d3af604f8",
      "nama": "Super Admin",
      "email": "admin@test.com",
      "no_telp": "081234567890",
      "role": "SUPER_ADMIN",
      "profile_photo": null
    }
  ]
}
```
</details>

### ✅ [4.2] ✔ Get detail user berhasil
`GET /api/user/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
    "nama": "Guru 1 Updated",
    "email": "guru1@test.com",
    "no_telp": "08999",
    "role": "GURU",
    "profile_photo": null
  }
}
```
</details>

### ✅ [4.3] ✘ Get user dengan ID tidak ada → 404
`GET /api/user/:id` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "User not found"
}
```
</details>

### ✅ [4.4] 🔒 RBAC: GURU akses GET /users → 403
`GET /api/users` | Ekspektasi: **403** | Aktual: **403**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Access denied, role prohibited"
}
```
</details>


---

## 🗂️ SISWA — POST /api/siswa (Tambah Siswa)

### ✅ [5.1] ✔ Tambah siswa berhasil
`POST /api/siswa` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

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
</details>

<details><summary>📥 Response</summary>

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
    "riwayatKelas": [
      {
        "nama_kelas": "1A"
      }
    ],
    "profile_photo": null,
    "createdAt": "2026-07-17T13:25:28.479Z",
    "updatedAt": "2026-07-17T13:25:28.479Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```
</details>

### ✅ [5.2] ✘ NIS duplikat → 400
`POST /api/siswa` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nis": "112233"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa sudah terdaftar"
}
```
</details>

### ✅ [5.3] ✘ Field NIS tidak ada → 400
`POST /api/siswa` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Tanpa NIS"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"nis\" is required. \"tanggal_lahir\" is required. \"alamat\" is required. \"nama_wali\" is required. \"no_telp\" is required. \"kelas\" is required. \"tahapan_tahsin\" is required"
}
```
</details>

### ✅ [5.4] ✘ jenis_kelamin invalid (ALIEN) → 400
`POST /api/siswa` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "jenis_kelamin": "ALIEN"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"jenis_kelamin\" must be one of [LAKI_LAKI, PEREMPUAN]"
}
```
</details>

### ✅ [5.5] ✘ Format tanggal_lahir invalid → 400
`POST /api/siswa` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "tanggal_lahir": "bukan-tanggal"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"tanggal_lahir\" must be in ISO 8601 date format"
}
```
</details>

### ✅ [5.6] 🔒 SQL Injection di NIS → 400/200
`POST /api/siswa` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nis": "'; DROP TABLE siswa;--"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"nis\" must only contain alpha-numeric characters"
}
```
</details>


---

## 🗂️ SISWA — PUT /api/student/:nis (Edit Siswa)

### ✅ [6.1] ✔ Edit siswa berhasil (partial)
`PUT /api/student/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Siswa Teladan Updated",
  "kelas": "2A"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan Updated",
    "jenis_kelamin": "LAKI_LAKI",
    "tanggal_lahir": "2010-01-01T00:00:00.000Z",
    "alamat": "Jl. Kebajikan No 1",
    "nama_wali": "Bapak Wali",
    "no_telp": "08555",
    "riwayatKelas": [
      {
        "nama_kelas": "1A"
      },
      {
        "nama_kelas": "2A"
      }
    ],
    "profile_photo": null,
    "createdAt": "2026-07-17T13:25:28.479Z",
    "updatedAt": "2026-07-17T13:25:28.479Z",
    "halaqoh_tahfidz_id": null,
    "tahapan_tahsin": "JILID_DASAR"
  }
}
```
</details>

### ✅ [6.2] ✘ NIS tidak ditemukan → 400/404
`PUT /api/student/:nis` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa tidak ditemukan"
}
```
</details>


---

## 🗂️ SISWA — DELETE /api/student/:nis

### ✅ [6.3] ✔ Hapus siswa berhasil
`DELETE /api/student/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": "OK"
}
```
</details>

### ✅ [6.4] ✘ Hapus siswa tidak ada → 400/404
`DELETE /api/student/:nis` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa tidak ditemukan"
}
```
</details>


---

## 🗂️ HALAQOH — POST /api/halaqoh (Tambah Halaqoh)

### ✅ [7.1] ✔ Tambah halaqoh Tahfidz berhasil
`POST /api/halaqoh` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Halaqoh Tahfidz Umar",
  "kategori": "TAHFIDZ",
  "userId": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
  "nis_siswa": [
    "112233"
  ]
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "f2e25468-fb05-4859-a89d-ffc927e0d887",
    "nama_halaqoh": "Halaqoh Tahfidz Umar",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
      "nama": "Guru 1 Updated",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan Updated",
        "riwayatKelas": [
          {
            "nama_kelas": "1A"
          },
          {
            "nama_kelas": "2A"
          }
        ],
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```
</details>

### ✅ [7.2] ✔ Tambah halaqoh Tahsin berhasil
`POST /api/halaqoh` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Halaqoh Tahsin Abu Bakar",
  "kategori": "TAHSIN",
  "userId": "19f89265-29af-4b1a-9c99-52bdce9f1aa6",
  "nis_siswa": [
    "112233"
  ]
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "3baf0f31-a93e-464b-8216-6e2a1048a25c",
    "nama_halaqoh": "Halaqoh Tahsin Abu Bakar",
    "kategori": "TAHSIN",
    "guru": {
      "id": "19f89265-29af-4b1a-9c99-52bdce9f1aa6",
      "nama": "Guru 2",
      "no_telp": "08222"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan Updated",
        "riwayatKelas": [
          {
            "nama_kelas": "1A"
          },
          {
            "nama_kelas": "2A"
          }
        ],
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```
</details>

### ✅ [7.3] ✘ userId tidak terdaftar → 400
`POST /api/halaqoh` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "userId": "uuid-tidak-ada"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"userId\" must be a valid GUID"
}
```
</details>

### ✅ [7.4] ✘ userId bukan guru (SUPER_ADMIN) → 400
`POST /api/halaqoh` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "userId": "adminId (SUPER_ADMIN)"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "User bukan Muhassin / Muhaffidz"
}
```
</details>

### ✅ [7.5] ✘ Kategori invalid (OLAHRAGA) → 400
`POST /api/halaqoh` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "kategori": "OLAHRAGA"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"kategori\" must be one of [TAHSIN, TAHFIDZ]"
}
```
</details>

### ✅ [7.6] ✘ nis_siswa tidak ada → 400
`POST /api/halaqoh` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nis_siswa": [
    "NIS-TIDAK-ADA"
  ]
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"nis_siswa[0]\" must only contain alpha-numeric characters"
}
```
</details>


---

## 🗂️ HALAQOH — GET & PUT & DELETE

### ✅ [8.1] ✔ Get semua halaqoh berhasil
`GET /api/halaqoh` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": [
    {
      "id": "f2e25468-fb05-4859-a89d-ffc927e0d887",
      "nama_halaqoh": "Halaqoh Tahfidz Umar",
      "kategori": "TAHFIDZ",
      "guru": {
        "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
        "nama": "Guru 1 Updated",
        "no_telp": "08999"
      },
      "siswa": [
        {
          "nis": "112233",
          "nama": "Siswa Teladan Updated",
          "riwayatKelas": [
            {
              "nama_kelas": "1A"
            },
            {
              "nama_kelas": "2A"
            }
          ],
          "alamat": "Jl. Kebajikan No 1",
          "no_telp": "08555"
        }
      ]
    },
    {
      "id": "3baf0f31-a93e-464b-8216-6e2a1048a25c",
      "nama_halaqoh": "Halaqoh Tahsin Abu Bakar",
      "kategori": "TAHSIN",
      "guru": {
        "id": "19f89265-29af-4b1a-9c99-52bdce9f1aa6",
        "nama": "Guru 2",
        "no_telp": "08222"
      },
      "siswa": [
        {
          "nis": "112233",
          "nama": "Siswa Teladan Updated",
          "riwayatKelas": [
            {
              "nama_kelas": "1A"
            },
            {
              "nama_kelas": "2A"
            }
          ],
          "alamat": "Jl. Kebajikan No 1",
          "no_telp": "08555"
        }
      ]
    }
  ]
}
```
</details>

### ✅ [8.2] ✔ Get detail halaqoh berhasil
`GET /api/halaqoh/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "f2e25468-fb05-4859-a89d-ffc927e0d887",
    "nama_halaqoh": "Halaqoh Tahfidz Umar",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
      "nama": "Guru 1 Updated",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan Updated",
        "riwayatKelas": [
          {
            "nama_kelas": "1A"
          },
          {
            "nama_kelas": "2A"
          }
        ],
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```
</details>

### ✅ [8.3] ✘ Get detail halaqoh tidak ada → 404
`GET /api/halaqoh/:id` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Halaqoh tidak ditemukan"
}
```
</details>

### ✅ [8.4] 🔒 RBAC: GURU akses GET /halaqoh list → 403
`GET /api/halaqoh` | Ekspektasi: **403** | Aktual: **403**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Access denied, role prohibited"
}
```
</details>

### ✅ [8.5] ✔ GURU boleh GET /halaqoh/:id detail
`GET /api/halaqoh/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "f2e25468-fb05-4859-a89d-ffc927e0d887",
    "nama_halaqoh": "Halaqoh Tahfidz Umar",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
      "nama": "Guru 1 Updated",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan Updated",
        "riwayatKelas": [
          {
            "nama_kelas": "1A"
          },
          {
            "nama_kelas": "2A"
          }
        ],
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```
</details>

### ✅ [8.6] ✔ Edit halaqoh berhasil
`PUT /api/halaqoh/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "nama": "Updated"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "f2e25468-fb05-4859-a89d-ffc927e0d887",
    "nama_halaqoh": "Updated",
    "kategori": "TAHFIDZ",
    "guru": {
      "id": "8ec55222-96be-4f4e-ba46-b9a768cd7f21",
      "nama": "Guru 1 Updated",
      "no_telp": "08999"
    },
    "siswa": [
      {
        "nis": "112233",
        "nama": "Siswa Teladan Updated",
        "riwayatKelas": [
          {
            "nama_kelas": "1A"
          },
          {
            "nama_kelas": "2A"
          }
        ],
        "alamat": "Jl. Kebajikan No 1",
        "no_telp": "08555"
      }
    ]
  }
}
```
</details>


---

## 🗂️ TAHFIDZ HAFALAN — POST /api/assessment/tahfidz/hafalan/:nis

### ✅ [9.1] ✔ Input hafalan berhasil
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
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
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "e6d119f6-1f13-4caa-9331-664f798a594e",
    "timestamp": "2026-07-17T13:25:29.306Z",
    "nis_siswa": "112233",
    "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
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
      "nama": "Siswa Teladan Updated",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Updated"
    },
    "surah": {
      "nama_surah": "An-Naba"
    }
  }
}
```
</details>

### ✅ [9.2] ✘ halaqohId tidak ada → 400
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "halaqohId": "id-tidak-ada"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"halaqohId\" must be a valid GUID"
}
```
</details>

### ✅ [9.3] ✘ no_surah > 114 → 400
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "no_surah": 115
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"no_surah\" must be less than or equal to 114"
}
```
</details>

### ✅ [9.4] ✘ Body kosong → 400
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"halaqohId\" is required. \"no_surah\" is required. \"ayat_awal\" is required. \"ayat_akhir\" is required. \"durasi_baca\" is required. \"toggle_tarjamah\" is required. \"jumlah_salah\" is required. \"murajaah\" is required. \"tajwid\" is required"
}
```
</details>

### ✅ [9.5] ✘ NIS siswa tidak ada → 400
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📥 Response</summary>

```json
{
  "message": "\"nis_siswa\" must only contain alpha-numeric characters"
}
```
</details>

### ✅ [9.6] 🔒 RBAC: SUPER_ADMIN POST hafalan → 403
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **403** | Aktual: **403**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Access denied, role prohibited"
}
```
</details>

### ✅ [9.7] 🔒 tajwid = 999 (di luar 0-100) → apakah ditolak?
`POST /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "tajwid": 999
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"tajwid\" must be less than or equal to 100"
}
```
</details>


---

## 🗂️ TAHFIDZ HAFALAN — GET /api/assessment/tahfidz/hafalan/:nis

### ✅ [10.1] ✔ Get riwayat hafalan berhasil
`GET /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan Updated",
    "history": {
      "hafalan_baru": [
        {
          "id": "e6d119f6-1f13-4caa-9331-664f798a594e",
          "timestamp": "2026-07-17T13:25:29.306Z",
          "nis_siswa": "112233",
          "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
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
</details>

### ✅ [10.2] ✘ Get riwayat NIS tidak ada → 404
`GET /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa tidak ditemukkan"
}
```
</details>

### ✅ [10.3] 🔒 ✔ GURU GET riwayat hafalan (Bisa karena role disatukan) → 200
`GET /api/assessment/tahfidz/hafalan/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan Updated",
    "history": {
      "hafalan_baru": [
        {
          "id": "e6d119f6-1f13-4caa-9331-664f798a594e",
          "timestamp": "2026-07-17T13:25:29.306Z",
          "nis_siswa": "112233",
          "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
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
</details>


---

## 🗂️ TAHFIDZ MURAJAAH — POST /api/assessment/tahfidz/murajaah/:nis

### ✅ [11.1] ✔ Input murajaah berhasil
`POST /api/assessment/tahfidz/murajaah/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
  "no_surah": 78,
  "ayat_awal": 1,
  "ayat_akhir": 5,
  "jumlah_salah": 0,
  "murajaah": 5,
  "tajwid": 90
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "98e4cf4e-d81b-484f-8583-a3952574c28e",
    "timestamp": "2026-07-17T13:25:29.571Z",
    "nis_siswa": "112233",
    "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
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
      "nama": "Siswa Teladan Updated",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Updated"
    },
    "surah": {
      "nama_surah": "An-Naba"
    }
  }
}
```
</details>

### ✅ [11.2] ✘ Body kosong → 400
`POST /api/assessment/tahfidz/murajaah/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"halaqohId\" is required. \"no_surah\" is required. \"ayat_awal\" is required. \"ayat_akhir\" is required. \"jumlah_salah\" is required. \"murajaah\" is required. \"tajwid\" is required"
}
```
</details>

### ✅ [11.3] ✘ no_surah = 0 (harus positif) → 400
`POST /api/assessment/tahfidz/murajaah/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "no_surah": 0
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"no_surah\" must be a positive number"
}
```
</details>


---

## 🗂️ TAHFIDZ MURAJAAH — GET /api/assessment/tahfidz/murajaah/:nis

### ✅ [12.1] ✔ Get riwayat murajaah berhasil
`GET /api/assessment/tahfidz/murajaah/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan Updated",
    "history": {
      "murajaah_baru": [
        {
          "id": "98e4cf4e-d81b-484f-8583-a3952574c28e",
          "timestamp": "2026-07-17T13:25:29.571Z",
          "nis_siswa": "112233",
          "halaqohId": "f2e25468-fb05-4859-a89d-ffc927e0d887",
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
</details>

### ✅ [12.2] ✘ NIS tidak ada → 404
`GET /api/assessment/tahfidz/murajaah/:nis` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa tidak ditemukkan"
}
```
</details>


---

## 🗂️ TAHSIN — POST /api/assessment/tahsin/:nis

### ✅ [13.1] ✔ Input tahsin berhasil
`POST /api/assessment/tahsin/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "halaqohId": "3baf0f31-a93e-464b-8216-6e2a1048a25c",
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
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "32a9589d-153c-437e-b5c6-a513ce24f543",
    "timestamp": "2026-07-17T13:25:29.668Z",
    "nis_siswa": "112233",
    "id_kelompok": "3baf0f31-a93e-464b-8216-6e2a1048a25c",
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
      "nama": "Siswa Teladan Updated",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahsin Abu Bakar"
    }
  }
}
```
</details>

### ✅ [13.2] ✘ Body kosong → 400
`POST /api/assessment/tahsin/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"halaqohId\" is required. \"hafalan_surah\" is required. \"hafalan_ayat_awal\" is required. \"hafalan_ayat_akhir\" is required. \"nilai\" is required"
}
```
</details>

### ✅ [13.3] ✘ Nilai invalid (Z) → cek validasi
`POST /api/assessment/tahsin/:nis` | Ekspektasi: **400** | Aktual: **400**

<details><summary>📤 Request Body</summary>

```json
{
  "nilai": "Z"
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "message": "\"nilai\" must be one of [A+, A, B+, B, B-, C+, C, C-, D]"
}
```
</details>

### ✅ [13.4] 🔒 ✔ GURU POST tahsin (Bisa karena role disatukan) → 200
`POST /api/assessment/tahsin/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "f05e3d42-d6e3-4873-99d7-643ff7729bf3",
    "timestamp": "2026-07-17T13:25:29.717Z",
    "nis_siswa": "112233",
    "id_kelompok": "3baf0f31-a93e-464b-8216-6e2a1048a25c",
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
      "nama": "Siswa Teladan Updated",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahsin Abu Bakar"
    }
  }
}
```
</details>

### ✅ [13.5] 🔒 XSS di field keterangan — apakah tersimpan apa adanya?
`POST /api/assessment/tahsin/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
{
  "keterangan": "<script>..."
}
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": "2f92795f-730c-4927-b8ea-eecd06281084",
    "timestamp": "2026-07-17T13:25:29.737Z",
    "nis_siswa": "112233",
    "id_kelompok": "3baf0f31-a93e-464b-8216-6e2a1048a25c",
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
    "keterangan": "<script>alert('xss')</script>",
    "status_kelanjutan": "LANJUT",
    "siswa": {
      "nama": "Siswa Teladan Updated",
      "nis": "112233"
    },
    "halaqoh": {
      "nama": "Halaqoh Tahsin Abu Bakar"
    }
  }
}
```
</details>


---

## 🗂️ TAHSIN — GET /api/assessment/tahsin/:nis

### ✅ [14.1] ✔ Get riwayat tahsin berhasil
`GET /api/assessment/tahsin/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan Updated",
    "history": [
      {
        "id": "2f92795f-730c-4927-b8ea-eecd06281084",
        "timestamp": "2026-07-17T13:25:29.737Z",
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
        "keterangan": "<script>alert('xss')</script>"
      },
      {
        "id": "f05e3d42-d6e3-4873-99d7-643ff7729bf3",
        "timestamp": "2026-07-17T13:25:29.717Z",
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
      },
      {
        "id": "32a9589d-153c-437e-b5c6-a513ce24f543",
        "timestamp": "2026-07-17T13:25:29.668Z",
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
      "total_pertemuan": 3,
      "nilai_terakhir": "A",
      "rata_rata": "A"
    }
  }
}
```
</details>

### ✅ [14.2] ✘ NIS tidak ada → 404
`GET /api/assessment/tahsin/:nis` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa tidak ditemukan"
}
```
</details>

### ✅ [14.3] 🔒 ✔ GURU GET riwayat tahsin (Bisa karena role disatukan) → 200
`GET /api/assessment/tahsin/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": {
    "nis": "112233",
    "nama": "Siswa Teladan Updated",
    "history": [
      {
        "id": "2f92795f-730c-4927-b8ea-eecd06281084",
        "timestamp": "2026-07-17T13:25:29.737Z",
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
        "keterangan": "<script>alert('xss')</script>"
      },
      {
        "id": "f05e3d42-d6e3-4873-99d7-643ff7729bf3",
        "timestamp": "2026-07-17T13:25:29.717Z",
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
      },
      {
        "id": "32a9589d-153c-437e-b5c6-a513ce24f543",
        "timestamp": "2026-07-17T13:25:29.668Z",
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
      "total_pertemuan": 3,
      "nilai_terakhir": "A",
      "rata_rata": "A"
    }
  }
}
```
</details>


---

## 🗂️ IMPORT EXCEL — POST /api/siswa/import

### ✅ [15.0] ✔ Upload Excel berhasil
`POST /api/siswa/import` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📤 Request Body</summary>

```json
"[File Excel Attached]"
```
</details>

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "message": "File has been successfully uploaded"
}
```
</details>

### ❌ [15.0.1] ✔ Data dari Excel tersimpan di DB
`GET /api/student/99111` | Ekspektasi: **200** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Data siswa sudah terdaftar"
}
```
</details>


---

## 🗂️ AUTH LOGOUT & DELETE Operations

### ✅ [15.1] ✔ Hapus siswa (ada riwayat) — cascade delete
`DELETE /api/student/:nis` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": "OK"
}
```
</details>

### ✅ [15.2] ✔ Hapus halaqoh berhasil
`DELETE /api/halaqoh/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": "OK"
}
```
</details>

### ✅ [15.3] ✘ Hapus halaqoh sudah tidak ada → 404/500
`DELETE /api/halaqoh/:id` | Ekspektasi: **404** | Aktual: **404**

<details><summary>📥 Response</summary>

```json
{
  "message": "Halaqoh not found"
}
```
</details>

### ✅ [15.4] ✔ Hapus user berhasil
`DELETE /api/user/:id` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": "OK"
}
```
</details>

### ✅ [15.5] ✔ Logout berhasil
`DELETE /api/auth/logout` | Ekspektasi: **200** | Aktual: **200**

<details><summary>📥 Response</summary>

```json
{
  "status": "success",
  "data": "OK"
}
```
</details>

### ✅ [15.6] ✘ Akses dengan token sudah logout → 401
`GET /api/users` | Ekspektasi: **401** | Aktual: **401**

<details><summary>📥 Response</summary>

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```
</details>


---

## 📊 Ringkasan Hasil Pengujian

| Kategori | Jumlah |
|----------|--------|
| ✅ Sesuai ekspektasi | 76 |
| ❌ Tidak sesuai ekspektasi | 1 |
| **Total Tes Dijalankan** | **77** |


### Catatan Jailbreak / Security:
- **XSS di field nama/keterangan:** Perhatikan hasil tes 2.7 dan 13.5. Jika API mengembalikan 200 dan menyimpan tag HTML apa adanya, maka input **tidak disanitasi** di sisi backend. Sanitasi perlu dilakukan di **Frontend** sebelum ditampilkan.
- **SQL Injection:** Karena menggunakan Prisma ORM dengan Parameterized Query, injeksi SQL secara umum **tidak berhasil**.
- **Validasi Input Angka:** Perhatikan hasil tes 9.7 (tajwid=999). Jika lolos, perlu ditambahkan constraint `.max(100)` di Joi validation.
