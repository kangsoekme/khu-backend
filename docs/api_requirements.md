# **Khoiru Ummah Sistem Monitoring Program Tahsin Tahfidz**

## **Autentikasi**

### **Login** = POST /api/auth/login

Request Body

```json
{
  "username": "loremipsum",
  "password": "hashedpassword"
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "token": "unique-token"
  }
}
```

Response Error

```json
{
  "errors": "Username not found"
}
```

### **Logout** = POST /api/auth/logout

Response Body

```json
{
  "data": "OK"
}
```

Response Error

```json
{
  "errors": "Unauthorized"
}
```

## **Manajemen Data User**

### **Ambil Semua Data** = GET /api/users

Headers :

- Authorization : token

Response Body

```json
{
  "status": "success",
  "data": [
    {
      "id": "unique-id",
      "nama": "Ahmad Fulan",
      "email": "fulan@mail.com",
      "no_telp": "08123456789",
      "password": "hashedpassword",
      "role": "Direktur"
    },
    {
      "id": "unique-id",
      "nama": "Muhammad Abdul",
      "email": "abdul@mail.com",
      "no_telp": "08123456789",
      "password": "hashedpassword",
      "role": "Guru Muhassin"
    }
  ]
}
```

Response Error

```json
{
  "errors": "Unauthorized"
}
```

### **Tambah User** = POST /api/user

Headers :

- Authorization : token

Request Body

```json
{
  "nama": "Muhammad Abdul",
  "email": "abdul@mail.com",
  "no_telp": "08123456789",
  "password": "hashedpassword",
  "role": "Guru Muhassin",
  "profile_photo": "blah blah blah"
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
    "nama": "Muhammad Abdul",
    "email": "abdul@mail.com",
    "no_telp": "08123456789",
    "password": "hashedpassword",
    "role": "Guru Muhassin",
    "profile_photo": "blah blah blah"
  }
}
```

Response Error

```json
{
  "errors": "input invalid"
}
```

### **Ambil Data User** = GET /api/user/:id

Response Body

```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
    "nama": "Muhammad Abdul",
    "email": "abdul@mail.com",
    "no_telp": "08123456789",
    "password": "hashedpassword",
    "role": "Guru Muhassin"
  }
}
```

Response Error

```json
{
  "errors": "User not found"
}
```

### **Edit Data User** = PUT /api/user/:id

Request Body

```json
{
  "nama": "Muhammad Abdul",
  "email": "abdul@mail.com",
  "no_telp": "08123456789",
  "password": "hashedpassword",
  "role": "Guru Muhaffidz"
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
    "nama": "Muhammad Abdul",
    "email": "abdul@mail.com",
    "no_telp": "08123456789",
    "password": "hashedpassword",
    "role": "Guru Muhaffidz"
  }
}
```

Response Error

```json
{
  "errors": "input invalid"
}
```

### **Hapus Data User** = DELETE /api/user/:id

Response Body

```json
{
  "data": "OK"
}
```

Response Error

```json
{
  "errors": "User is not found"
}
```

## **Manajemen Data Siswa**

### **Ambil Semua Data** = GET /api/students

Response Body

```json
{
  "status": "success",
  "data": [
    {
      "nis": "123456879",
      "nama": "Ahmad Jaelani",
      "jenis_kelamin": "laki-laki",
      "tanggal_lahir":"dd-mm-yyyy",
      "alamat":"Jalan Prabu Siliwangi No. 13 Malang",
      "nama_wali":"Jaelani Hasan",
      "no_telp": "08123456789",
      "kelas": "VI-A",
      "halaqoh_tahsin" : {
        "id":"unique-id",
        "nama": "Abu Bakar Ash Shiddiq",
        "guru" : "Ahmad Jaelani"
      },
      "halaqoh_tahfidz" : {
        "id":"unique-id",
        "nama": "Umar bin Khattab",
        "guru" : "Usmanul Kirom"
      },
    }
    {
      "nis": "123456879",
      "nama": "Ahmad Jaelani",
      "jenis_kelamin": "laki-laki",
      "tanggal_lahir":"dd-mm-yyyy",
      "alamat":"Jalan Prabu Siliwangi No. 13 Malang",
      "nama_wali":"Jaelani Hasan",
      "no_telp": "08123456789",
      "kelas": "VI-A",
      "halaqoh_tahsin" : {
        "id":"unique-id",
        "nama": "Abu Bakar Ash Shiddiq",
        "guru" : "Ahmad Jaelani"
      },
      "halaqoh_tahfidz" : {
        "id":"unique-id",
        "nama": "Umar bin Khattab",
        "guru" : "Usmanul Kirom"
      },
    }
  ]
}
```

Response Error

```json
{
  "errors": "Unauthorized"
}
```

### **Tambah Siswa** = POST /api/student

Request Body

```json
{
  "nama": "Siti Zubaidah",
  "jenis_kelamin": "perempuan",
  "tanggal_lahir": "dd-mm-yyyy",
  "alamat": "Jalan Kemangi No. 13 Wonosobo",
  "nama_wali": "Idris Mahmud",
  "no_telp": "08123456789",
  "kelas": "VI-B",
  "halaqoh_tahsin": {
    "id": "unique-id",
    "nama": "Abu Bakar Ash Shiddiq",
    "guru": "Ahmad Jaelani"
  },
  "halaqoh_tahfidz": {
    "id": "unique-id",
    "nama": "Umar bin Khattab",
    "guru": "Usmanul Kirom"
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "nama": "Siti Zubaidah",
    "jenis_kelamin": "perempuan",
    "tanggal_lahir": "dd-mm-yyyy",
    "alamat": "Jalan Kemangi No. 13 Wonosobo",
    "nama_wali": "Idris Mahmud",
    "no_telp": "08123456789",
    "kelas": "VI-B",
    "halaqoh_tahsin": {
      "id": "unique-id",
      "nama": "Abu Bakar Ash Shiddiq",
      "guru": "Ahmad Jaelani"
    },
    "halaqoh_tahfidz": {
      "id": "unique-id",
      "nama": "Umar bin Khattab",
      "guru": "Usmanul Kirom"
    }
  }
}
```

Response Error

```json
{
  "errrors": "input invalid"
}
```

### **Ambil Data Siswa** = GET /api/student/:id

Response Body

```json
{
  "status": "success",
  "data": {
    "nama": "Siti Zubaidah",
    "jenis_kelamin": "perempuan",
    "tanggal_lahir": "dd-mm-yyyy",
    "alamat": "Jalan Kemangi No. 13 Wonosobo",
    "nama_wali": "Idris Mahmud",
    "no_telp": "08123456789",
    "kelas": "VI-B",
    "halaqoh_tahsin": {
      "id": "unique-id",
      "nama": "Abu Bakar Ash Shiddiq",
      "guru": "Ahmad Jaelani"
    },
    "halaqoh_tahfidz": {
      "id": "unique-id",
      "nama": "Umar bin Khattab",
      "guru": "Usmanul Kirom"
    }
  }
}
```

Response Error

```json
{
  "errrors": "Student not found"
}
```

### **Edit Data Siswa** = PUT /api/student/:id

Request Body

```json
{
  "nama": "Siti Zubaidah",
  "jenis_kelamin": "perempuan",
  "tanggal_lahir": "dd-mm-yyyy",
  "alamat": "Jalan Kemangi No. 13 Wonosobo",
  "nama_wali": "Idris Mahmud",
  "no_telp": "08123456789",
  "kelas": "VI-B",
  "halaqoh_tahsin": {
    "id": "unique-id",
    "nama": "Abu Bakar Ash Shiddiq",
    "guru": "Ahmad Jaelani"
  },
  "halaqoh_tahfidz": {
    "id": "unique-id",
    "nama": "Umar bin Khattab",
    "guru": "Usmanul Kirom"
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "nama": "Siti Zubaidah",
    "jenis_kelamin": "perempuan",
    "tanggal_lahir": "dd-mm-yyyy",
    "alamat": "Jalan Kemangi No. 13 Wonosobo",
    "nama_wali": "Idris Mahmud",
    "no_telp": "08123456789",
    "kelas": "VI-B",
    "halaqoh_tahsin": {
      "id": "unique-id",
      "nama": "Abu Bakar Ash Shiddiq",
      "guru": "Ahmad Jaelani"
    },
    "halaqoh_tahfidz": {
      "id": "unique-id",
      "nama": "Umar bin Khattab",
      "guru": "Usmanul Kirom"
    }
  }
}
```

Response Error

```json
{
  "errors": "input invalid"
}
```

### **Hapus Data Siswa** = DELETE /api/student/:id

Response Body

```json
{
  "data": "OK"
}
```

Response Error

```json
{
  "errors": "Student is not found"
}
```

## **Manajemen Halaqoh**

### **Ambil Semua Data** = GET /api/halaqoh

Response Body

```json
{
  "status": "success",
  "data": [
    {
      "id": "unique-id",
      "nama_halaqoh": "Abu Bakar",
      "kategori": "tahsin-qiroah",
      "guru": {
        "id": "unique-id",
        "nama": "Ahmad Jaelani",
        "no_telp": "08123456789"
      },
      "siswa": [
        {
          "nis": "123456789",
          "nama": "Ahmad Fulan",
          "kelas": "VI-A",
          "alamat": "Malang",
          "no_telp": "08123456789"
        },
        {
          "nis": "123456789",
          "nama": "Siti Nabila",
          "kelas": "VI-B",
          "alamat": "Wonosobo",
          "no_telp": "08123456789"
        }
      ]
    },
    {
      "id": "unique-id",
      "nama_halaqoh": "Abu Bakar",
      "kategori": "tahsin-qiroah",
      "guru": {
        "id": "unique-id",
        "nama": "Ahmad Jaelani",
        "no_telp": "08123456789"
      },
      "siswa": [
        {
          "nis": "123456789",
          "nama": "Ahmad Fulan",
          "kelas": "VI-A",
          "alamat": "Malang",
          "no_telp": "08123456789"
        },
        {
          "nis": "123456789",
          "nama": "Siti Nabila",
          "kelas": "VI-B",
          "alamat": "Wonosobo",
          "no_telp": "08123456789"
        }
      ]
    }
  ]
}
```

Response Error

```json
{
  "errors": "Data not found"
}
```

### **Tambah Halaqoh Baru** = POST /api/halaqoh/

Request Body

```json
{
  "data": {
    "nama_halaqoh": "Abu Bakar",
    "kategori": "tahsin-qiroah",
    "guru": {
      "id": "unique-id",
      "nama": "Ahmad Jaelani",
      "no_telp": "08123456789"
    },
    "siswa": [
      {
        "nis": "123456789",
        "nama": "Ahmad Fulan",
        "kelas": "VI-A",
        "alamat": "Malang",
        "no_telp": "08123456789"
      },
      {
        "nis": "123456789",
        "nama": "Siti Nabila",
        "kelas": "VI-B",
        "alamat": "Wonosobo",
        "no_telp": "08123456789"
      }
    ]
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
    "nama_halaqoh": "Abu Bakar",
    "kategori": "tahsin-qiroah",
    "guru": {
      "id": "unique-id",
      "nama": "Ahmad Jaelani",
      "no_telp": "08123456789"
    },
    "siswa": [
      {
        "nis": "123456789",
        "nama": "Ahmad Fulan",
        "kelas": "VI-A",
        "alamat": "Malang",
        "no_telp": "08123456789"
      },
      {
        "nis": "123456789",
        "nama": "Siti Nabila",
        "kelas": "VI-B",
        "alamat": "Wonosobo",
        "no_telp": "08123456789"
      }
    ]
  }
}
```

Response Error

```json
{
  "errors": "input invalid"
}
```

### **Ambil Data Halaqoh** = GET /api/halaqoh/:id

Response Body

```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
    "nama_halaqoh": "Abu Bakar",
    "kategori": "tahsin-qiroah",
    "guru": {
      "id": "unique-id",
      "nama": "Ahmad Jaelani",
      "no_telp": "08123456789"
    },
    "siswa": [
      {
        "nis": "123456789",
        "nama": "Ahmad Fulan",
        "kelas": "VI-A",
        "alamat": "Malang",
        "no_telp": "08123456789"
      },
      {
        "nis": "123456789",
        "nama": "Siti Nabila",
        "kelas": "VI-B",
        "alamat": "Wonosobo",
        "no_telp": "08123456789"
      }
    ]
  }
}
```

Response Error

```json
{
  "errors": "Data not found"
}
```

### **Edit Data Halaqoh** = PUT /api/halaqoh/:id

Request Body

```json
{
  "data": {
    "nama_halaqoh": "Abu Bakar",
    "kategori": "tahsin-qiroah",
    "guru": {
      "id": "unique-id",
      "nama": "Ahmad Jaelani",
      "no_telp": "08123456789"
    },
    "siswa": [
      {
        "nis": "123456789",
        "nama": "Ahmad Fulan",
        "kelas": "VI-A",
        "alamat": "Malang",
        "no_telp": "08123456789"
      },
      {
        "nis": "123456789",
        "nama": "Siti Nabila",
        "kelas": "VI-B",
        "alamat": "Wonosobo",
        "no_telp": "08123456789"
      }
    ]
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
    "nama_halaqoh": "Abu Bakar",
    "kategori": "tahsin-qiroah",
    "guru": {
      "id": "unique-id",
      "nama": "Ahmad Jaelani",
      "no_telp": "08123456789"
    },
    "siswa": [
      {
        "nis": "123456789",
        "nama": "Ahmad Fulan",
        "kelas": "VI-A",
        "alamat": "Malang",
        "no_telp": "08123456789"
      },
      {
        "nis": "123456789",
        "nama": "Siti Nabila",
        "kelas": "VI-B",
        "alamat": "Wonosobo",
        "no_telp": "08123456789"
      }
    ]
  }
}
```

Response Error

```json
{
  "errors": "input invalid"
}
```

### **Hapus Data Halaqoh** = DELETE /api/halaqoh/:id

Response Body

```json
{
  "data": "OK"
}
```

Response Error

```json
{
  "errors": "Data is not found"
}
```

## **Pengisian Perkembangan Peserta Didik**

### **Ambil Data Rekap Tahfidz Siswa** = GET /api/assessment/tahfidz/:nis

Response Body

```json
{
  "status": "success",
  "data":
    {
      "nis": "123456789",
      "nama": "Ahmad Fulan",
      "history": {
        "hafalan_baru":[
          {
            "id":"unique-id",
            "timestamp": "hh-mm-ss, dd-mm-yy",
            "surah": "An-Naba",
            "ayat-awal": "1",
            "ayat-akhir": "40",
            "pra_sesi":{
              "durasi_40_kali": "10",
              "terjemah_toggle": true,
            },
            "penilaian":{
              "jumlah_salah":"2",
              "murajaah":"2",
              "kelancaran":"75",
              "tajwid":"80",
            },
            "predikat":"A"
          },
          {
            "id":"unique-id",
            "timestamp": "hh-mm-ss, dd-mm-yy",
            "surah": "An-Naba",
            "ayat-awal": "1",
            "ayat-akhir": "40",
            "pra_sesi":{
              "durasi_40_kali": "10",
              "terjemah_toggle": true,
            },
            "penilaian":{
              "jumlah_salah":"2",
              "murajaah":"2",
              "kelancaran":"75",
              "tajwid":"80",
            },
            "predikat":"A"
          }
        ],
        "murajaah_baru":[
          {
            "id":"unique-id",
            "timestamp": "hh-mm-ss, dd-mm-yy",
            "surah": "An-Naba",
            "ayat-awal": "1",
            "ayat-akhir": "40",
            "penilaian":{
              "jumlah_salah":"2",
              "murajaah":"2",
              "kelancaran":"75",
              "tajwid":"80",
            },
            "predikat":"A"
          }
          {
            "id":"unique-id",
            "timestamp": "hh-mm-ss, dd-mm-yy",
            "surah": "An-Naba",
            "ayat-awal": "1",
            "ayat-akhir": "40",
            "penilaian":{
              "jumlah_salah":"2",
              "murajaah":"2",
              "kelancaran":"75",
              "tajwid":"80",
            },
            "predikat":"A"
          }
        ],
        "summary":{
          "total_hafalan":"2",
          "total_murajaah":"2",
          "rata_rata_kelancaran":"85",
          "rata_tajwid":"90",
          "kategori":"mumtaz",
        }
      }
    }
}
```

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Ambil Data Rekap Tahsin Siswa** = GET /api/assessment/tahsin/:nis

Response Body

```json
{
  "status": "success",
  "data": {
    "nis": "123456789",
    "nama": "Ahmad Fulan",
    "history": [
      {
        "id": "unique-id",
        "timestamp": "hh-mm-ss, dd-mm-yy",
        "hafalan_pendek": {
          "surah": "An-Naba",
          "ayat_first": "1",
          "ayat_last": "10"
        },
        "laporan_bacaan": {
          "jilid_surat": "1",
          "ayat": "10",
          "materi": "Mad Layyin"
        },
        "nilai_tahsin": "A+",
        "keterangan": "diperbaiki lagi panjang pendek nya"
      },
      {
        "id": "unique-id",
        "timestamp": "hh-mm-ss, dd-mm-yy",
        "hafalan_pendek": {
          "surah": "An-Naba",
          "ayat_first": "1",
          "ayat_last": "10"
        },
        "laporan_bacaan": {
          "jilid_surat": "1",
          "ayat": "10",
          "materi": "Mad Layyin"
        },
        "nilai_tahsin": "A+",
        "keterangan": "diperbaiki lagi panjang pendek nya"
      }
    ],
    "summary": {
      "total_pertemuan": "2",
      "nilai_terakhir": "A+",
      "rata_rata": "B+"
    }
  }
}
```

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Isi Penilaian Tahsin** = POST /api/assessment/tahsin/:nis

Request Body

```json
{
  "data": {
    "nis": "123456789",
    "nama": "Ahmad Fulan",
    "tambah_tahsin": [
      {
        "hafalan_pendek": {
          "surah": "An-Naba",
          "ayat_first": "1",
          "ayat_last": "10"
        },
        "laporan_bacaan": {
          "jilid_surat": "1",
          "ayat": "10",
          "materi": "Mad Layyin"
        },
        "nilai_tahsin": "A+",
        "keterangan": "diperbaiki lagi panjang pendek nya"
      }
    ]
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "nis": "123456789",
    "nama": "Ahmad Fulan",
    "tambah_tahsin": {
      "id": "unique-id",
      "timestamp": "hh-mm-ss, dd-mm-yy",
      "hafalan_pendek": {
        "surah": "An-Naba",
        "ayat_first": "1",
        "ayat_last": "10"
      },
      "laporan_bacaan": {
        "jilid_surat": "1",
        "ayat": "10",
        "materi": "Mad Layyin"
      },
      "nilai_tahsin": "A+",
      "keterangan": "diperbaiki lagi panjang pendek nya"
    }
  }
}
```

Response Error

```json
{
  "errors": "Input is invalid"
}
```

### **Isi Penilaian Tahfidz** = POST /api/assessment/tahfidz/tambah_hafalan/:nis

Request Body

```json
{
  "nis": "123456789",
  "nama": "Ahmad Fulan",
  "hafalan_baru": {
    "surah": "An-Naba",
    "ayat-awal": "1",
    "ayat-akhir": "40",
    "pra_sesi": {
      "durasi_40_kali": "10",
      "terjemah_toggle": true
    },
    "penilaian": {
      "jumlah_salah": "2",
      "murajaah": "2",
      "kelancaran": "75",
      "tajwid": "80"
    },
    "predikat": "A"
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "nis": "123456789",
    "nama": "Ahmad Fulan",
    "hafalan_baru": {
      "id": "unique-id",
      "timestamp": "hh-mm-ss, dd-mm-yy",
      "surah": "An-Naba",
      "ayat-awal": "1",
      "ayat-akhir": "40",
      "pra_sesi": {
        "durasi_40_kali": "10",
        "terjemah_toggle": true
      },
      "penilaian": {
        "jumlah_salah": "2",
        "murajaah": "2",
        "kelancaran": "75",
        "tajwid": "80"
      },
      "predikat": "A"
    }
  }
}
```

Response Error

```json
{
  "errors": "Input is invalid"
}
```

### **Isi Penilaian Tahfidz** = POST /api/assessment/tahfidz/murajaah/:nis

Request Body

```json
{
  "nis": "123456789",
  "nama": "Ahmad Fulan",
  "murajaah_baru": {
    "surah": "An-Naba",
    "ayat-awal": "1",
    "ayat-akhir": "40",
    "penilaian": {
      "jumlah_salah": "2",
      "murajaah": "2",
      "kelancaran": "75",
      "tajwid": "80"
    },
    "predikat": "A"
  }
}
```

Response Body

```json
{
  "status": "success",
  "data": {
    "nis": "123456789",
    "nama": "Ahmad Fulan",
    "murajaah_baru": {
      "id": "unique-id",
      "timestamp": "hh-mm-ss, dd-mm-yy",
      "surah": "An-Naba",
      "ayat-awal": "1",
      "ayat-akhir": "40",
      "penilaian": {
        "jumlah_salah": "2",
        "murajaah": "2",
        "kelancaran": "75",
        "tajwid": "80"
      },
      "predikat": "A"
    }
  }
}
```

Response Error

```json
{
  "errors": "Input is invalid"
}
```

## **Generate Laporan**

### **Generate Laporan Keseluruhan (Excel)** = GET /api/report?format=excel

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Generate Laporan Keseluruhan (PDF)** = GET /api/report?format=pdf

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Generate Laporan Halaqoh Tertentu (Excel)** = GET /api/report/halaqoh/:id?format=excel

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Generate Laporan Halaqoh Tertentu (PDF)** = GET /api/report/halaqoh/:id?format=pdf

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Generate Laporan Siswa Tertentu (Excel)** = GET /api/report/halaqoh/:nis?format=excel

Response Error

```json
{
  "errors": "Data is not found"
}
```

### **Generate Laporan Siswa Tertentu (PDF)** = GET /api/report/halaqoh/:nis?format=pdf

Response Error

```json
{
  "errors": "Data is not found"
}
```

## **Backup Data**

### **Backup Data** = GET /api/backup

Response Error

```json
{
  "errors": "Backup is fail"
}
```
