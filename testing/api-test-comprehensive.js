import "dotenv/config";
import { prismaClient as prisma } from '../src/application/database.js';
import bcrypt from "bcrypt";
import fs from "fs";

const BASE_URL = 'http://localhost:5000/api';
let reportMd = "# Laporan Hasil Pengujian API (Skenario Sukses Menyeluruh)\n\n";

function logReport(category, scenario, method, url, reqBody, resStatus, resBody) {
  reportMd += `## [${category}] ${scenario}\n`;
  reportMd += `**Endpoint:** \`${method} ${url}\`\n\n`;
  if (reqBody) {
    reportMd += `### Request Body:\n\`\`\`json\n${JSON.stringify(reqBody, null, 2)}\n\`\`\`\n`;
  }
  
  const statusIcon = resStatus >= 200 && resStatus < 300 ? "✅" : "❌";
  reportMd += `### Response (Status ${resStatus} ${statusIcon}):\n\`\`\`json\n${JSON.stringify(resBody, null, 2)}\n\`\`\`\n\n`;
  reportMd += `---\n\n`;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2000); // 2 detik timeout agar tidak hang
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    return {
      status: 504,
      json: async () => ({ message: `REQUEST TIMEOUT! Server hang/tidak merespons (kemungkinan next(error) bermasalah). Error: ${error.message}` })
    };
  }
}

async function runTests() {
  console.log("Memulai pengujian komprehensif...");

  // 1. CLEANUP DB
  await prisma.setoran_Tahsin.deleteMany();
  await prisma.setoran_Murajaah.deleteMany();
  await prisma.setoran_Hafalan.deleteMany();
  await prisma.halaqoh.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.user.deleteMany();
  await prisma.surah.deleteMany();

  // Seed Surah
  await prisma.surah.createMany({
    data: [
      { no_surah: 78, nama_surah: "An-Naba", jumlah_ayat: 40 },
      { no_surah: 1, nama_surah: "Al-Fatihah", jumlah_ayat: 7 }
    ]
  });

  // Seed Super Admin
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

  // ==========================================
  // MANAJEMEN USER & AUTH
  // ==========================================
  const loginPayload = { email: "admin@test.com", password: "rahasia2026" };
  const loginRes = await fetchWithTimeout(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginPayload) });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  logReport("AUTH", "Login SUPER_ADMIN", "POST", "/api/auth/login", loginPayload, loginRes.status, loginData);
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  // Create Muhaffidz
  const reqUser1 = { nama: "Ust Muhaffidz", email: "muhaffidz@test.com", password: "password", no_telp: "08111", role: "MUHAFFIDZ" };
  const resUser1 = await fetchWithTimeout(`${BASE_URL}/user`, { method: 'POST', headers, body: JSON.stringify(reqUser1) });
  const dataUser1 = await resUser1.json();
  const muhaffidzId = dataUser1.data?.id;
  logReport("USER", "Create User (Muhaffidz)", "POST", "/api/user", reqUser1, resUser1.status, dataUser1);

  // Create Muhassin
  const reqUser2 = { nama: "Ust Muhassin", email: "muhassin@test.com", password: "password", no_telp: "08222", role: "MUHASSIN" };
  const resUser2 = await fetchWithTimeout(`${BASE_URL}/user`, { method: 'POST', headers, body: JSON.stringify(reqUser2) });
  const dataUser2 = await resUser2.json();
  const muhassinId = dataUser2.data?.id;
  logReport("USER", "Create User (Muhassin)", "POST", "/api/user", reqUser2, resUser2.status, dataUser2);

  // Get All Users
  const resUsers = await fetchWithTimeout(`${BASE_URL}/users`, { method: 'GET', headers });
  logReport("USER", "Get All Users", "GET", "/api/users", null, resUsers.status, await resUsers.json());

  // Get User by ID
  const resUserGet = await fetchWithTimeout(`${BASE_URL}/user/${muhaffidzId}`, { method: 'GET', headers });
  logReport("USER", "Get User by ID", "GET", `/api/user/${muhaffidzId}`, null, resUserGet.status, await resUserGet.json());


  // ==========================================
  // MANAJEMEN SISWA
  // ==========================================
  const reqSiswa = { 
    nis: "112233", 
    nama: "Siswa Teladan", 
    jenis_kelamin: "LAKI_LAKI",
    tanggal_lahir: "2010-01-01T00:00:00Z",
    alamat: "Jl. Kebajikan No 1",
    nama_wali: "Bapak Wali",
    no_telp: "08555",
    kelas: "1A",
    tahapan_tahsin: "JILID_DASAR"
  };
  const resSiswa = await fetchWithTimeout(`${BASE_URL}/siswa`, { method: 'POST', headers, body: JSON.stringify(reqSiswa) });
  const dataSiswa = await resSiswa.json();
  logReport("SISWA", "Create Siswa", "POST", "/api/siswa", reqSiswa, resSiswa.status, dataSiswa);

  const resStudents = await fetchWithTimeout(`${BASE_URL}/students`, { method: 'GET', headers });
  logReport("SISWA", "Get All Students", "GET", "/api/students", null, resStudents.status, await resStudents.json());

  const resStudentGet = await fetchWithTimeout(`${BASE_URL}/student/112233`, { method: 'GET', headers });
  logReport("SISWA", "Get Student by NIS", "GET", `/api/student/112233`, null, resStudentGet.status, await resStudentGet.json());


  // ==========================================
  // MANAJEMEN HALAQOH
  // ==========================================
  const reqHalaqohTahfidz = { nama: "Halaqoh Tahfidz Umar", kategori: "TAHFIDZ", userId: muhaffidzId, nis_siswa: ["112233"] };
  const resHalTahfidz = await fetchWithTimeout(`${BASE_URL}/halaqoh`, { method: 'POST', headers, body: JSON.stringify(reqHalaqohTahfidz) });
  const dataHalTahfidz = await resHalTahfidz.json();
  const halTahfidzId = dataHalTahfidz.data?.id;
  logReport("HALAQOH", "Create Halaqoh Tahfidz", "POST", "/api/halaqoh", reqHalaqohTahfidz, resHalTahfidz.status, dataHalTahfidz);

  const reqHalaqohTahsin = { nama: "Halaqoh Tahsin Abu Bakar", kategori: "TAHSIN", userId: muhassinId, nis_siswa: ["112233"] };
  const resHalTahsin = await fetchWithTimeout(`${BASE_URL}/halaqoh`, { method: 'POST', headers, body: JSON.stringify(reqHalaqohTahsin) });
  const dataHalTahsin = await resHalTahsin.json();
  const halTahsinId = dataHalTahsin.data?.id;
  logReport("HALAQOH", "Create Halaqoh Tahsin", "POST", "/api/halaqoh", reqHalaqohTahsin, resHalTahsin.status, dataHalTahsin);

  const resAllHal = await fetchWithTimeout(`${BASE_URL}/halaqoh`, { method: 'GET', headers });
  logReport("HALAQOH", "Get All Halaqoh", "GET", "/api/halaqoh", null, resAllHal.status, await resAllHal.json());


  // ==========================================
  // PENILAIAN TAHFIDZ (HAFALAN & MURAJAAH)
  // Harus menggunakan token MUHAFFIDZ
  // ==========================================
  // Login as Muhaffidz
  const loginMuhaffidzRes = await fetchWithTimeout(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: "muhaffidz@test.com", password: "password" }) });
  const tokenMuhaffidz = (await loginMuhaffidzRes.json()).data.token;
  const headersMuhaffidz = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenMuhaffidz}` };

  const reqHafalan = { halaqohId: halTahfidzId, no_surah: 78, ayat_awal: 1, ayat_akhir: 10, durasi_baca: 5, toggle_tarjamah: true, jumlah_salah: 1, murajaah: 8, tajwid: 85 };
  const resHafalan = await fetchWithTimeout(`${BASE_URL}/assessment/tahfidz/hafalan/112233`, { method: 'POST', headers: headersMuhaffidz, body: JSON.stringify(reqHafalan) });
  logReport("TAHFIDZ", "Input Hafalan Baru", "POST", "/api/assessment/tahfidz/hafalan/112233", reqHafalan, resHafalan.status, await resHafalan.json());

  const reqMurajaah = { halaqohId: halTahfidzId, no_surah: 78, ayat_awal: 1, ayat_akhir: 5, jumlah_salah: 0, murajaah: 5, tajwid: 90 };
  const resMurajaah = await fetchWithTimeout(`${BASE_URL}/assessment/tahfidz/murajaah/112233`, { method: 'POST', headers: headersMuhaffidz, body: JSON.stringify(reqMurajaah) });
  logReport("TAHFIDZ", "Input Murajaah", "POST", "/api/assessment/tahfidz/murajaah/112233", reqMurajaah, resMurajaah.status, await resMurajaah.json());

  const resRiwayatHafalan = await fetchWithTimeout(`${BASE_URL}/assessment/tahfidz/hafalan/112233`, { method: 'GET', headers }); // bisa pakai token admin
  logReport("TAHFIDZ", "Get Riwayat Hafalan", "GET", "/api/assessment/tahfidz/hafalan/112233", null, resRiwayatHafalan.status, await resRiwayatHafalan.json());

  const resRiwayatMurajaah = await fetchWithTimeout(`${BASE_URL}/assessment/tahfidz/murajaah/112233`, { method: 'GET', headers });
  logReport("TAHFIDZ", "Get Riwayat Murajaah", "GET", "/api/assessment/tahfidz/murajaah/112233", null, resRiwayatMurajaah.status, await resRiwayatMurajaah.json());


  // ==========================================
  // PENILAIAN TAHSIN
  // Harus menggunakan token MUHASSIN
  // ==========================================
  const loginMuhassinRes = await fetchWithTimeout(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: "muhassin@test.com", password: "password" }) });
  const tokenMuhassin = (await loginMuhassinRes.json()).data.token;
  const headersMuhassin = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenMuhassin}` };

  const reqTahsin = {
    halaqohId: halTahsinId,
    no_surah: 1, // Al fatihah
    hafalan_surah: 78, // An Naba
    hafalan_ayat_awal: 1,
    hafalan_ayat_akhir: 5,
    jilid: 1,
    bab: 2,
    ayat_awal: 1,
    ayat_akhir: 7,
    materi: "Pengenalan Huruf",
    nilai: "A",
    keterangan: "Bagus sekali"
  };
  const resTahsin = await fetchWithTimeout(`${BASE_URL}/assessment/tahsin/112233`, { method: 'POST', headers: headersMuhassin, body: JSON.stringify(reqTahsin) });
  logReport("TAHSIN", "Input Penilaian Tahsin", "POST", "/api/assessment/tahsin/112233", reqTahsin, resTahsin.status, await resTahsin.json());

  const resRiwayatTahsin = await fetchWithTimeout(`${BASE_URL}/assessment/tahsin/112233`, { method: 'GET', headers });
  logReport("TAHSIN", "Get Riwayat Tahsin", "GET", "/api/assessment/tahsin/112233", null, resRiwayatTahsin.status, await resRiwayatTahsin.json());


  // Menyimpan laporan
  fs.writeFileSync('./testing/test_report_comprehensive.md', reportMd);
  console.log("Semua test selesai. Laporan disimpan di testing/test_report_comprehensive.md");
  process.exit(0);
}

runTests().catch(e => {
  console.error("Terjadi kesalahan:", e);
  process.exit(1);
});
