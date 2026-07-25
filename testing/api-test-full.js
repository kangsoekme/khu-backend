import "dotenv/config";
import { prismaClient as prisma } from '../src/application/database.js';
import bcrypt from "bcrypt";
import fs from "fs";

const BASE_URL = 'http://localhost:5000/api';
let reportMd = "# Laporan Pengujian API — Semua 23 Endpoint\n\n";
let passCount = 0;
let failCount = 0;

function logReport(no, category, scenario, method, url, reqBody, resStatus, resBody) {
  const isSuccess = resStatus >= 200 && resStatus < 300;
  const icon = isSuccess ? "✅" : "❌";
  if (isSuccess) passCount++; else failCount++;

  reportMd += `## [${no}] [${category}] ${scenario} ${icon}\n`;
  reportMd += `**\`${method} ${url}\`** — Status: **${resStatus}**\n\n`;
  if (reqBody) {
    reportMd += `### Request Body:\n\`\`\`json\n${JSON.stringify(reqBody, null, 2)}\n\`\`\`\n`;
  }
  reportMd += `### Response:\n\`\`\`json\n${JSON.stringify(resBody, null, 2)}\n\`\`\`\n\n---\n\n`;
  console.log(`  ${icon} [${no}] ${method} ${url} → ${resStatus}`);
}

async function req(method, url, headers, body) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    clearTimeout(id);
    let data;
    try { data = await res.json(); } catch { data = { message: "Response bukan JSON" }; }
    return { status: res.status, data };
  } catch (e) {
    clearTimeout(id);
    return { status: 504, data: { message: `TIMEOUT/ERROR: ${e.message}` } };
  }
}

async function runTests() {
  console.log("🧹 Membersihkan database...");
  await prisma.setoran_Tahsin.deleteMany();
  await prisma.setoran_Murajaah.deleteMany();
  await prisma.setoran_Hafalan.deleteMany();
  await prisma.halaqoh.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.user.deleteMany();
  await prisma.surah.deleteMany();

  await prisma.surah.createMany({
    data: [
      { no_surah: 78, nama_surah: "An-Naba", jumlah_ayat: 40 },
      { no_surah: 1, nama_surah: "Al-Fatihah", jumlah_ayat: 7 }
    ]
  });

  const hashedPassword = await bcrypt.hash("rahasia2026", 10);
  await prisma.user.create({
    data: { nama: "Super Admin", email: "admin@test.com", password: hashedPassword, no_telp: "081234567890", role: "SUPER_ADMIN" }
  });

  console.log("\n🚀 Memulai pengujian semua endpoint...\n");

  // ───────────────────────────────────────────────
  // AUTH
  // ───────────────────────────────────────────────
  console.log("📌 AUTH");
  const loginBody = { email: "admin@test.com", password: "rahasia2026" };
  const loginRes = await req("POST", "/auth/login", { "Content-Type": "application/json" }, loginBody);
  logReport(0, "AUTH", "Login (public endpoint)", "POST", "/api/auth/login", loginBody, loginRes.status, loginRes.data);
  const token = loginRes.data?.data?.token;
  const H = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

  // ───────────────────────────────────────────────
  // USER
  // ───────────────────────────────────────────────
  console.log("📌 USER");
  const createUserBody = { nama: "Ust Muhaffidz", email: "muhaffidz@test.com", password: "password", no_telp: "08111", role: "MUHAFFIDZ" };
  const createUserRes = await req("POST", "/user", H, createUserBody);
  logReport(1, "USER", "Tambah User (Muhaffidz)", "POST", "/api/user", createUserBody, createUserRes.status, createUserRes.data);
  const muhaffidzId = createUserRes.data?.data?.id;

  const createMushassinBody = { nama: "Ust Muhassin", email: "muhassin@test.com", password: "password", no_telp: "08222", role: "MUHASSIN" };
  const createMuhassinRes = await req("POST", "/user", H, createMushassinBody);
  logReport(1, "USER", "Tambah User (Muhassin)", "POST", "/api/user", createMushassinBody, createMuhassinRes.status, createMuhassinRes.data);
  const muhassinId = createMuhassinRes.data?.data?.id;

  const editUserBody = { nama: "Ust Muhaffidz (Updated)", no_telp: "08999" };
  const editUserRes = await req("PUT", `/user/${muhaffidzId}`, H, editUserBody);
  logReport(2, "USER", "Edit User", "PUT", `/api/user/${muhaffidzId}`, editUserBody, editUserRes.status, editUserRes.data);

  const getUsersRes = await req("GET", "/users", H);
  logReport(3, "USER", "Dapatkan Semua User", "GET", "/api/users", null, getUsersRes.status, getUsersRes.data);

  const getUserRes = await req("GET", `/user/${muhaffidzId}`, H);
  logReport(4, "USER", "Dapatkan Detail User", "GET", `/api/user/${muhaffidzId}`, null, getUserRes.status, getUserRes.data);

  // ───────────────────────────────────────────────
  // SISWA
  // ───────────────────────────────────────────────
  console.log("📌 SISWA");
  const createSiswaBody = { nis: "112233", nama: "Siswa Teladan", jenis_kelamin: "LAKI_LAKI", tanggal_lahir: "2010-01-01T00:00:00Z", alamat: "Jl. Kebajikan No 1", nama_wali: "Bapak Wali", no_telp: "08555", kelas: "1A", tahapan_tahsin: "JILID_DASAR" };
  const createSiswaRes = await req("POST", "/siswa", H, createSiswaBody);
  logReport(7, "SISWA", "Tambah Siswa", "POST", "/api/siswa", createSiswaBody, createSiswaRes.status, createSiswaRes.data);

  const getAllSiswaRes = await req("GET", "/students", H);
  logReport(8, "SISWA", "Dapatkan Semua Siswa", "GET", "/api/students", null, getAllSiswaRes.status, getAllSiswaRes.data);

  const getSiswaRes = await req("GET", "/student/112233", H);
  logReport(9, "SISWA", "Dapatkan Detail Siswa", "GET", "/api/student/112233", null, getSiswaRes.status, getSiswaRes.data);

  const editSiswaBody = { nama: "Siswa Teladan (Edited)", kelas: "2A" };
  const editSiswaRes = await req("PUT", "/student/112233", H, editSiswaBody);
  logReport(10, "SISWA", "Edit Siswa", "PUT", "/api/student/112233", editSiswaBody, editSiswaRes.status, editSiswaRes.data);

  // ───────────────────────────────────────────────
  // HALAQOH
  // ───────────────────────────────────────────────
  console.log("📌 HALAQOH");
  const createHalTahfidzBody = { nama: "Halaqoh Tahfidz Umar", kategori: "TAHFIDZ", userId: muhaffidzId, nis_siswa: ["112233"] };
  const createHalTahfidzRes = await req("POST", "/halaqoh", H, createHalTahfidzBody);
  logReport(12, "HALAQOH", "Tambah Halaqoh Tahfidz", "POST", "/api/halaqoh", createHalTahfidzBody, createHalTahfidzRes.status, createHalTahfidzRes.data);
  const halTahfidzId = createHalTahfidzRes.data?.data?.id;

  const createHalTahsinBody = { nama: "Halaqoh Tahsin Abu Bakar", kategori: "TAHSIN", userId: muhassinId, nis_siswa: ["112233"] };
  const createHalTahsinRes = await req("POST", "/halaqoh", H, createHalTahsinBody);
  logReport(12, "HALAQOH", "Tambah Halaqoh Tahsin", "POST", "/api/halaqoh", createHalTahsinBody, createHalTahsinRes.status, createHalTahsinRes.data);
  const halTahsinId = createHalTahsinRes.data?.data?.id;

  const getAllHalRes = await req("GET", "/halaqoh", H);
  logReport(13, "HALAQOH", "Dapatkan Semua Halaqoh", "GET", "/api/halaqoh", null, getAllHalRes.status, getAllHalRes.data);

  const getHalRes = await req("GET", `/halaqoh/${halTahfidzId}`, H);
  logReport(14, "HALAQOH", "Dapatkan Detail Halaqoh", "GET", `/api/halaqoh/${halTahfidzId}`, null, getHalRes.status, getHalRes.data);

  const editHalBody = { nama: "Halaqoh Tahfidz Umar (Updated)", kategori: "TAHFIDZ", userId: muhaffidzId, nis_siswa: ["112233"] };
  const editHalRes = await req("PUT", `/halaqoh/${halTahfidzId}`, H, editHalBody);
  logReport(15, "HALAQOH", "Edit Halaqoh", "PUT", `/api/halaqoh/${halTahfidzId}`, editHalBody, editHalRes.status, editHalRes.data);

  // ───────────────────────────────────────────────
  // TAHFIDZ — pakai token Muhaffidz
  // ───────────────────────────────────────────────
  console.log("📌 TAHFIDZ");
  const loginMuhaffidzRes = await req("POST", "/auth/login", { "Content-Type": "application/json" }, { email: "muhaffidz@test.com", password: "password" });
  const tokenMuhaffidz = loginMuhaffidzRes.data?.data?.token;
  const HM = { "Content-Type": "application/json", "Authorization": `Bearer ${tokenMuhaffidz}` };

  const addHafalanBody = { halaqohId: halTahfidzId, no_surah: 78, ayat_awal: 1, ayat_akhir: 10, durasi_baca: 5, toggle_tarjamah: true, jumlah_salah: 1, murajaah: 8, tajwid: 85 };
  const addHafalanRes = await req("POST", "/assessment/tahfidz/hafalan/112233", HM, addHafalanBody);
  logReport(17, "HAFALAN", "Tambah Hafalan Baru", "POST", "/api/assessment/tahfidz/hafalan/112233", addHafalanBody, addHafalanRes.status, addHafalanRes.data);

  const getRiwayatHafalanRes = await req("GET", "/assessment/tahfidz/hafalan/112233", H);
  logReport(18, "HAFALAN", "Riwayat Hafalan", "GET", "/api/assessment/tahfidz/hafalan/112233", null, getRiwayatHafalanRes.status, getRiwayatHafalanRes.data);

  const addMurajaahBody = { halaqohId: halTahfidzId, no_surah: 78, ayat_awal: 1, ayat_akhir: 5, jumlah_salah: 0, murajaah: 5, tajwid: 90 };
  const addMurajaahRes = await req("POST", "/assessment/tahfidz/murajaah/112233", HM, addMurajaahBody);
  logReport(19, "MURAJAAH", "Tambah Murajaah", "POST", "/api/assessment/tahfidz/murajaah/112233", addMurajaahBody, addMurajaahRes.status, addMurajaahRes.data);

  const getRiwayatMurajaahRes = await req("GET", "/assessment/tahfidz/murajaah/112233", H);
  logReport(20, "MURAJAAH", "Riwayat Murajaah", "GET", "/api/assessment/tahfidz/murajaah/112233", null, getRiwayatMurajaahRes.status, getRiwayatMurajaahRes.data);

  // ───────────────────────────────────────────────
  // TAHSIN — pakai token Muhassin
  // ───────────────────────────────────────────────
  console.log("📌 TAHSIN");
  const loginMuhassinRes = await req("POST", "/auth/login", { "Content-Type": "application/json" }, { email: "muhassin@test.com", password: "password" });
  const tokenMuhassin = loginMuhassinRes.data?.data?.token;
  const HMS = { "Content-Type": "application/json", "Authorization": `Bearer ${tokenMuhassin}` };

  const addTahsinBody = { halaqohId: halTahsinId, no_surah: 1, hafalan_surah: 78, hafalan_ayat_awal: 1, hafalan_ayat_akhir: 5, jilid: 1, bab: 2, ayat_awal: 1, ayat_akhir: 7, materi: "Pengenalan Huruf", nilai: "A", keterangan: "Bagus sekali" };
  const addTahsinRes = await req("POST", "/assessment/tahsin/112233", HMS, addTahsinBody);
  logReport(21, "TAHSIN", "Tambah Penilaian Tahsin", "POST", "/api/assessment/tahsin/112233", addTahsinBody, addTahsinRes.status, addTahsinRes.data);

  const getRiwayatTahsinRes = await req("GET", "/assessment/tahsin/112233", H);
  logReport(22, "TAHSIN", "Riwayat Tahsin", "GET", "/api/assessment/tahsin/112233", null, getRiwayatTahsinRes.status, getRiwayatTahsinRes.data);

  // ───────────────────────────────────────────────
  // DELETE — diletakkan terakhir agar data sudah ada
  // ───────────────────────────────────────────────
  console.log("📌 DELETE OPERATIONS");

  const deleteHalRes = await req("DELETE", `/halaqoh/${halTahsinId}`, H);
  logReport(16, "HALAQOH", "Hapus Halaqoh", "DELETE", `/api/halaqoh/${halTahsinId}`, null, deleteHalRes.status, deleteHalRes.data);

  const deleteSiswaRes = await req("DELETE", "/student/112233", H);
  logReport(11, "SISWA", "Hapus Siswa", "DELETE", "/api/student/112233", null, deleteSiswaRes.status, deleteSiswaRes.data);

  const deleteUserRes = await req("DELETE", `/user/${muhassinId}`, H);
  logReport(6, "USER", "Hapus User", "DELETE", `/api/user/${muhassinId}`, null, deleteUserRes.status, deleteUserRes.data);

  // LOGOUT — harus terakhir karena invalidates token
  const logoutRes = await req("DELETE", "/auth/logout", H);
  logReport(5, "AUTH", "Logout", "DELETE", "/api/auth/logout", null, logoutRes.status, logoutRes.data);

  // ───────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────
  reportMd += `## 📊 Ringkasan Hasil\n\n`;
  reportMd += `| Hasil | Jumlah |\n|-------|--------|\n`;
  reportMd += `| ✅ Berhasil (2xx) | ${passCount} |\n`;
  reportMd += `| ❌ Gagal / Error | ${failCount} |\n`;
  reportMd += `| **Total Endpoint Diuji** | **${passCount + failCount}** |\n`;

  fs.writeFileSync('./testing/test_report_full.md', reportMd);
  console.log(`\n✅ ${passCount} berhasil | ❌ ${failCount} gagal`);
  console.log("📄 Laporan disimpan di testing/test_report_full.md");
  process.exit(0);
}

runTests().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
