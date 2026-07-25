import "dotenv/config";
import { prismaClient as prisma } from '../src/application/database.js';
import bcrypt from "bcrypt";
import fs from "fs";

const BASE_URL = 'http://localhost:5000/api';
let reportMd = "# Laporan Hasil Pengujian API\n\n";

function logReport(scenario, method, url, reqBody, resStatus, resBody, isExpected) {
  reportMd += `## Skenario: ${scenario} (${isExpected ? '✅ SESUAI HARAPAN' : '❌ TIDAK SESUAI HARAPAN / ERROR'})\n`;
  reportMd += `**Endpoint:** \`${method} ${url}\`\n\n`;
  if (reqBody) {
    reportMd += `### Request Body:\n\`\`\`json\n${JSON.stringify(reqBody, null, 2)}\n\`\`\`\n`;
  }
  reportMd += `### Response (Status ${resStatus}):\n\`\`\`json\n${JSON.stringify(resBody, null, 2)}\n\`\`\`\n\n`;
  reportMd += `---\n\n`;
}

async function runTests() {
  console.log("Memulai pengujian otomatis...");

  // 1. CLEANUP DB
  console.log("1. Membersihkan database dari data lama...");
  await prisma.setoran_Tahsin.deleteMany();
  await prisma.setoran_Murajaah.deleteMany();
  await prisma.setoran_Hafalan.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.halaqoh.deleteMany();
  await prisma.user.deleteMany();
  await prisma.surah.deleteMany();

  // Seed Surah untuk test
  await prisma.surah.create({
    data: { no_surah: 78, nama_surah: "An-Naba", jumlah_ayat: 40 }
  });

  // Seed User Super Admin
  const hashedPassword = await bcrypt.hash("rahasia2026", 10);
  await prisma.user.create({
    data: {
      nama: "Super Admin Tester",
      email: "admin@test.com",
      password: hashedPassword,
      no_telp: "081234567890",
      role: "SUPER_ADMIN",
    }
  });

  // 2. LOGIN (Berhasil)
  console.log("2. Menjalankan Login...");
  const loginPayload = { email: "admin@test.com", password: "rahasia2026" };
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginPayload)
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  logReport("1. Login SUPER_ADMIN (Success)", "POST", "/api/auth/login", loginPayload, loginRes.status, loginData, loginRes.status === 200);

  if (!token) {
    console.error("Gagal login, tidak mendapat token. Test dihentikan.");
    process.exit(1);
  }

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  // 3. CREATE HALAQOH (Gagal - Validasi)
  console.log("3. Menjalankan Test Halaqoh (Gagal Validasi)...");
  const halaqohErrPayload = { nama: "" }; // error joi (empty)
  const halaqohErrRes = await fetch(`${BASE_URL}/halaqoh`, { method: 'POST', headers, body: JSON.stringify(halaqohErrPayload) });
  const halaqohErrData = await halaqohErrRes.json();
  logReport("2. Create Halaqoh (Gagal Validasi Nama Kosong)", "POST", "/api/halaqoh", halaqohErrPayload, halaqohErrRes.status, halaqohErrData, halaqohErrRes.status === 400);

  // 4. CREATE HALAQOH (Berhasil)
  console.log("4. Menjalankan Test Halaqoh (Berhasil)...");
  const halaqohPayload = { nama: "Halaqoh Utsman" };
  const halaqohRes = await fetch(`${BASE_URL}/halaqoh`, { method: 'POST', headers, body: JSON.stringify(halaqohPayload) });
  const halaqohData = await halaqohRes.json();
  const halaqohId = halaqohData.data?.id;
  logReport("3. Create Halaqoh (Sukses)", "POST", "/api/halaqoh", halaqohPayload, halaqohRes.status, halaqohData, halaqohRes.status === 200);

  // 5. CREATE SISWA (Berhasil)
  console.log("5. Menjalankan Test Siswa (Berhasil)...");
  const siswaPayload = { nis: "112233", nama: "Siswa Tester", id_kelompok: halaqohId };
  const siswaRes = await fetch(`${BASE_URL}/siswa`, { method: 'POST', headers, body: JSON.stringify(siswaPayload) });
  const siswaData = await siswaRes.json();
  logReport("4. Create Siswa (Sukses)", "POST", "/api/siswa", siswaPayload, siswaRes.status, siswaData, siswaRes.status === 200);

  // 6. CREATE HAFALAN (Gagal - Surah Tidak Ditemukan)
  console.log("6. Menjalankan Test Hafalan (Gagal Validasi)...");
  const hafalanErrPayload = {
    halaqohId: halaqohId,
    no_surah: 999, // tidak ada di DB
    ayat_awal: 1,
    ayat_akhir: 10,
    durasi_baca: 5,
    toggle_tarjamah: true,
    jumlah_salah: 0,
    murajaah: 8,
    tajwid: 90
  };
  const hafalanErrRes = await fetch(`${BASE_URL}/assessment/tahfidz/hafalan/112233`, { method: 'POST', headers, body: JSON.stringify(hafalanErrPayload) });
  let hafalanErrData;
  try { hafalanErrData = await hafalanErrRes.json(); } catch(e) { hafalanErrData = await hafalanErrRes.text(); }
  logReport("5. Create Hafalan (Gagal - Surah 999 Tidak Ada)", "POST", "/api/assessment/tahfidz/hafalan/112233", hafalanErrPayload, hafalanErrRes.status, hafalanErrData, hafalanErrRes.status === 404 || hafalanErrRes.status === 400 || hafalanErrRes.status === 500);

  // 7. CREATE HAFALAN (Berhasil)
  console.log("7. Menjalankan Test Hafalan (Berhasil)...");
  const hafalanPayload = {
    halaqohId: halaqohId,
    no_surah: 78,
    ayat_awal: 1,
    ayat_akhir: 10,
    durasi_baca: 5,
    toggle_tarjamah: true,
    jumlah_salah: 1,
    murajaah: 8,
    tajwid: 85
  };
  const hafalanRes = await fetch(`${BASE_URL}/assessment/tahfidz/hafalan/112233`, { method: 'POST', headers, body: JSON.stringify(hafalanPayload) });
  let hafalanData;
  try { hafalanData = await hafalanRes.json(); } catch(e) { hafalanData = await hafalanRes.text(); }
  logReport("6. Create Hafalan (Sukses Lanjut)", "POST", "/api/assessment/tahfidz/hafalan/112233", hafalanPayload, hafalanRes.status, hafalanData, hafalanRes.status === 200);

  // 8. GET RIWAYAT HAFALAN
  console.log("8. Menjalankan Test Get Riwayat Hafalan...");
  const riwayatRes = await fetch(`${BASE_URL}/assessment/tahfidz/hafalan/112233`, { method: 'GET', headers });
  let riwayatData;
  try { riwayatData = await riwayatRes.json(); } catch(e) { riwayatData = await riwayatRes.text(); }
  logReport("7. Get Riwayat Hafalan Siswa 112233", "GET", "/api/assessment/tahfidz/hafalan/112233", null, riwayatRes.status, riwayatData, riwayatRes.status === 200);

  // Menyimpan laporan
  fs.writeFileSync('./testing/test_report.md', reportMd);
  console.log("Semua test selesai. Laporan disimpan di testing/test_report.md");
  process.exit(0);
}

runTests().catch(e => {
  console.error("Terjadi kesalahan:", e);
  process.exit(1);
});
