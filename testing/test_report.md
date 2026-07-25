# Laporan Hasil Pengujian API

## Skenario: 1. Login SUPER_ADMIN (Success) (✅ SESUAI HARAPAN)
**Endpoint:** `POST /api/auth/login`

### Request Body:
```json
{
  "email": "admin@test.com",
  "password": "rahasia2026"
}
```
### Response (Status 200):
```json
{
  "status": "success",
  "data": {
    "token": "566cf6e0-9ee7-43b3-be88-da25a19ba960"
  }
}
```

---

## Skenario: 2. Create Halaqoh (Gagal Validasi Nama Kosong) (✅ SESUAI HARAPAN)
**Endpoint:** `POST /api/halaqoh`

### Request Body:
```json
{
  "nama": ""
}
```
### Response (Status 400):
```json
{
  "message": "\"nama\" is not allowed to be empty. \"kategori\" is required. \"userId\" is required. \"nis_siswa\" is required"
}
```

---

## Skenario: 3. Create Halaqoh (Sukses) (❌ TIDAK SESUAI HARAPAN / ERROR)
**Endpoint:** `POST /api/halaqoh`

### Request Body:
```json
{
  "nama": "Halaqoh Utsman"
}
```
### Response (Status 400):
```json
{
  "message": "\"kategori\" is required. \"userId\" is required. \"nis_siswa\" is required"
}
```

---

## Skenario: 4. Create Siswa (Sukses) (❌ TIDAK SESUAI HARAPAN / ERROR)
**Endpoint:** `POST /api/siswa`

### Request Body:
```json
{
  "nis": "112233",
  "nama": "Siswa Tester"
}
```
### Response (Status 400):
```json
{
  "message": "\"jenis_kelamin\" is required. \"alamat\" is required. \"nama_wali\" is required. \"no_telp\" is required. \"kelas\" is required. \"tahapan_tahsin\" is required"
}
```

---

## Skenario: 5. Create Hafalan (Gagal - Surah 999 Tidak Ada) (❌ TIDAK SESUAI HARAPAN / ERROR)
**Endpoint:** `POST /api/assessment/tahfidz/hafalan/112233`

### Request Body:
```json
{
  "no_surah": 999,
  "ayat_awal": 1,
  "ayat_akhir": 10,
  "durasi_baca": 5,
  "toggle_tarjamah": true,
  "jumlah_salah": 0,
  "murajaah": 8,
  "tajwid": 90
}
```
### Response (Status 403):
```json
{
  "status": "error",
  "message": "Access denied, role prohibited"
}
```

---

## Skenario: 6. Create Hafalan (Sukses Lanjut) (❌ TIDAK SESUAI HARAPAN / ERROR)
**Endpoint:** `POST /api/assessment/tahfidz/hafalan/112233`

### Request Body:
```json
{
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
### Response (Status 403):
```json
{
  "status": "error",
  "message": "Access denied, role prohibited"
}
```

---

## Skenario: 7. Get Riwayat Hafalan Siswa 112233 (❌ TIDAK SESUAI HARAPAN / ERROR)
**Endpoint:** `GET /api/assessment/tahfidz/hafalan/112233`

### Response (Status 404):
```json
{
  "message": "Data siswa tidak ditemukkan"
}
```

---

