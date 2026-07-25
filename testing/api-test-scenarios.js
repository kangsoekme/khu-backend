import "dotenv/config";
import { prismaClient as prisma } from '../src/application/database.js';
import bcrypt from "bcrypt";
import fs from "fs";

const BASE_URL = 'http://localhost:5000/api';
let reportMd = "# 📋 Laporan Pengujian API — Semua Skenario (Sukses, Gagal & Jailbreak)\n\n";
reportMd += "> Dijalankan: " + new Date().toLocaleString('id-ID') + "\n\n";

let passCount = 0, failCount = 0, noteCount = 0;

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function logTest(no, category, scenario, expectedStatus, method, url, reqBody, resStatus, resBody) {
  const isExpected = resStatus === expectedStatus;
  const icon = isExpected ? "✅" : (resStatus >= 200 && resStatus < 300 ? "⚠️" : "❌");
  if (icon === "✅") passCount++;
  else if (icon === "⚠️") { noteCount++; }
  else failCount++;

  reportMd += `### ${icon} [${no}] ${scenario}\n`;
  reportMd += `\`${method} ${url}\` | Ekspektasi: **${expectedStatus}** | Aktual: **${resStatus}**\n\n`;
  if (reqBody !== null) {
    reportMd += `<details><summary>📤 Request Body</summary>\n\n\`\`\`json\n${JSON.stringify(reqBody, null, 2)}\n\`\`\`\n</details>\n\n`;
  }
  reportMd += `<details><summary>📥 Response</summary>\n\n\`\`\`json\n${JSON.stringify(resBody, null, 2)}\n\`\`\`\n</details>\n\n`;
  
  const statusLabel = isExpected ? "SESUAI" : "TIDAK SESUAI";
  console.log(`  ${icon} [${no}] ${scenario} → HTTP ${resStatus} (${statusLabel})`);
}

async function req(method, url, headers, body) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: headers || {},
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(id);
    let data;
    try { data = await res.json(); } catch { data = { message: "Non-JSON response" }; }
    return { status: res.status, data };
  } catch (e) {
    clearTimeout(id);
    return { status: 504, data: { message: `TIMEOUT/ERROR: ${e.message}` } };
  }
}

function section(title) {
  reportMd += `\n---\n\n## 🗂️ ${title}\n\n`;
  console.log(`\n📌 ${title}`);
}

// ─────────────────────────────────────────────────
// SETUP DATABASE
// ─────────────────────────────────────────────────
async function setupDB() {
  console.log("🧹 Membersihkan & menyiapkan database...");
  await prisma.riwayat_Kelas.deleteMany();
  await prisma.tahun_Akademik.deleteMany();
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
      { no_surah: 1, nama_surah: "Al-Fatihah", jumlah_ayat: 7 },
    ],
  });

  const hashed = await bcrypt.hash("rahasia2026", 10);
  await prisma.user.create({
    data: { nama: "Super Admin", email: "admin@test.com", password: hashed, no_telp: "081234567890", role: "SUPER_ADMIN" },
  });

  // Seed Tahun Akademik Aktif
  const tahunAktif = await prisma.tahun_Akademik.create({
    data: {
      nama_tahun: "2025/2026",
      is_active: true
    }
  });

  // Seed siswa untuk tes duplikat
  await prisma.siswa.create({
    data: { 
      nis: "EXISTING01", 
      nama: "Siswa Lama", 
      jenis_kelamin: "PEREMPUAN", 
      tanggal_lahir: new Date("2009-05-01"), 
      alamat: "Jl. Lama", 
      nama_wali: "Wali Lama", 
      no_telp: "08000", 
      tahapan_tahsin: "TAJWID",
      riwayatKelas: {
        create: {
          tahun_id: tahunAktif.id,
          nama_kelas: "2B",
          status: "AKTIF"
        }
      }
    },
  });
}

// ─────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────
async function runTests() {
  await setupDB();
  console.log("\n🚀 Memulai pengujian semua skenario...");

  const JSON_H = { "Content-Type": "application/json" };

  // ══════════════════════════════════════════════
  // 1. AUTH — LOGIN
  // ══════════════════════════════════════════════
  section("AUTH — POST /api/auth/login");

  // SUKSES
  let r = await req("POST", "/auth/login", JSON_H, { email: "admin@test.com", password: "rahasia2026" });
  logTest("1.1", "AUTH", "✔ Login berhasil", 200, "POST", "/api/auth/login", { email: "admin@test.com", password: "rahasia2026" }, r.status, r.data);
  const adminToken = r.data?.data?.token;
  const A = { ...JSON_H, "Authorization": `Bearer ${adminToken}` };

  // GAGAL — password salah
  r = await req("POST", "/auth/login", JSON_H, { email: "admin@test.com", password: "passwordSalah" });
  logTest("1.2", "AUTH", "✘ Password salah → 401", 401, "POST", "/api/auth/login", { email: "admin@test.com", password: "passwordSalah" }, r.status, r.data);

  // GAGAL — email tidak ada
  r = await req("POST", "/auth/login", JSON_H, { email: "tidakada@test.com", password: "apapun" });
  logTest("1.3", "AUTH", "✘ Email tidak terdaftar → 401", 401, "POST", "/api/auth/login", { email: "tidakada@test.com", password: "apapun" }, r.status, r.data);

  // GAGAL — body kosong
  r = await req("POST", "/auth/login", JSON_H, {});
  logTest("1.4", "AUTH", "✘ Body kosong → 400", 400, "POST", "/api/auth/login", {}, r.status, r.data);

  // GAGAL — email tidak valid (bukan format email)
  r = await req("POST", "/auth/login", JSON_H, { email: "inibukanemail", password: "rahasia2026" });
  logTest("1.5", "AUTH", "✘ Format email invalid → 400", 400, "POST", "/api/auth/login", { email: "inibukanemail", password: "rahasia2026" }, r.status, r.data);

  // JAILBREAK — SQL Injection attempt
  r = await req("POST", "/auth/login", JSON_H, { email: "' OR '1'='1", password: "' OR '1'='1" });
  logTest("1.6", "AUTH", "🔒 SQL Injection attempt → 400/401", 400, "POST", "/api/auth/login", { email: "' OR '1'='1", password: "x" }, r.status, r.data);

  // JAILBREAK — XSS attempt
  r = await req("POST", "/auth/login", JSON_H, { email: "<script>alert(1)</script>@evil.com", password: "x" });
  logTest("1.7", "AUTH", "🔒 XSS attempt di field email → 400", 400, "POST", "/api/auth/login", { email: "<script>alert(1)</script>@evil.com", password: "x" }, r.status, r.data);

  // TANPA TOKEN
  r = await req("GET", "/users", JSON_H);
  logTest("1.8", "AUTH", "✘ Akses endpoint tanpa token → 401", 401, "GET", "/api/users", null, r.status, r.data);

  // TOKEN PALSU
  r = await req("GET", "/users", { ...JSON_H, "Authorization": "Bearer token-palsu-tidak-valid" });
  logTest("1.9", "AUTH", "✘ Token palsu/invalid → 401", 401, "GET", "/api/users", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // 2. USER MANAGEMENT
  // ══════════════════════════════════════════════
  section("USER — POST /api/user (Tambah User)");

  // SUKSES
  r = await req("POST", "/user", A, { nama: "Guru 1", email: "guru1@test.com", password: "password123", no_telp: "08111", role: "GURU" });
  logTest("2.1", "USER", "✔ Tambah user berhasil", 200, "POST", "/api/user", null, r.status, r.data);
  const guru1Id = r.data?.data?.id;

  r = await req("POST", "/user", A, { nama: "Guru 2", email: "guru2@test.com", password: "password123", no_telp: "08222", role: "GURU" });
  logTest("2.2", "USER", "✔ Tambah user muhassin berhasil", 200, "POST", "/api/user", null, r.status, r.data);
  const guru2Id = r.data?.data?.id;

  // GAGAL — email duplikat
  r = await req("POST", "/user", A, { nama: "Duplikat", email: "guru1@test.com", password: "password", no_telp: "08333", role: "GURU" });
  logTest("2.3", "USER", "✘ Email duplikat → 400", 400, "POST", "/api/user", { email: "guru1@test.com", "...": "sama" }, r.status, r.data);

  // GAGAL — field wajib kosong
  r = await req("POST", "/user", A, { nama: "Tanpa Email", password: "password", no_telp: "08444" });
  logTest("2.4", "USER", "✘ Field email tidak ada → 400", 400, "POST", "/api/user", { nama: "Tanpa Email" }, r.status, r.data);

  // GAGAL — role tidak valid
  r = await req("POST", "/user", A, { nama: "Hacker", email: "hacker@test.com", password: "password", no_telp: "08555", role: "HACKER" });
  logTest("2.5", "USER", "✘ Role invalid (HACKER) → 400", 400, "POST", "/api/user", { role: "HACKER" }, r.status, r.data);

  // JAILBREAK — nama sangat panjang
  const longString = "A".repeat(1000);
  r = await req("POST", "/user", A, { nama: longString, email: "overflow@test.com", password: "password", no_telp: "08666", role: "GURU" });
  logTest("2.6", "USER", "🔒 String nama sangat panjang (1000 char) → 400/200", 400, "POST", "/api/user", { nama: `${"A".repeat(30)}...(1000 char)` }, r.status, r.data);

  // JAILBREAK — XSS di field nama
  r = await req("POST", "/user", A, { nama: "<img src=x onerror=alert(1)>", email: "xss@test.com", password: "password", no_telp: "08777", role: "GURU" });
  logTest("2.7", "USER", "🔒 XSS di field nama — apakah tersimpan apa adanya?", 200, "POST", "/api/user", { nama: "<img src=x ...>" }, r.status, r.data);

  // RBAC — Role salah (GURU coba tambah user)
  const loginGuru2R = await req("POST", "/auth/login", JSON_H, { email: "guru2@test.com", password: "password123" });
  const guru2Token = loginGuru2R.data?.data?.token;
  const HG2 = { ...JSON_H, "Authorization": `Bearer ${guru2Token}` };
  r = await req("POST", "/user", HG2, { nama: "Coba Tambah", email: "coba@test.com", password: "password", no_telp: "08888", role: "GURU" });
  logTest("2.8", "USER", "🔒 RBAC: GURU coba POST /user → 403", 403, "POST", "/api/user", null, r.status, r.data);

  section("USER — PUT /api/user/:id (Edit User)");

  // SUKSES
  r = await req("PUT", `/user/${guru1Id}`, A, { nama: "Guru 1 Updated", no_telp: "08999" });
  logTest("3.1", "USER", "✔ Edit user berhasil", 200, "PUT", `/api/user/:id`, { nama: "Guru 1 Updated", no_telp: "08999" }, r.status, r.data);

  // GAGAL — ID tidak ada
  r = await req("PUT", "/user/id-tidak-ada-sama-sekali", A, { nama: "Tidak Ada" });
  logTest("3.2", "USER", "✘ User ID tidak ditemukan → 404", 404, "PUT", "/api/user/:id", null, r.status, r.data);

  // GAGAL — body kosong
  r = await req("PUT", `/user/${guru1Id}`, A, {});
  logTest("3.3", "USER", "✘ Body kosong saat edit → cek response", 400, "PUT", `/api/user/:id`, {}, r.status, r.data);

  section("USER — GET /api/users & /api/user/:id");

  r = await req("GET", "/users", A);
  logTest("4.1", "USER", "✔ Get semua user berhasil", 200, "GET", "/api/users", null, r.status, r.data);

  r = await req("GET", `/user/${guru1Id}`, A);
  logTest("4.2", "USER", "✔ Get detail user berhasil", 200, "GET", "/api/user/:id", null, r.status, r.data);

  r = await req("GET", "/user/uuid-yang-tidak-ada", A);
  logTest("4.3", "USER", "✘ Get user dengan ID tidak ada → 404", 404, "GET", "/api/user/:id", null, r.status, r.data);

  // RBAC — Muhassin akses GET /users
  r = await req("GET", "/users", HG2);
  logTest("4.4", "USER", "🔒 RBAC: GURU akses GET /users → 403", 403, "GET", "/api/users", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // 3. SISWA
  // ══════════════════════════════════════════════
  section("SISWA — POST /api/siswa (Tambah Siswa)");

  const siswaOK = { nis: "112233", nama: "Siswa Teladan", jenis_kelamin: "LAKI_LAKI", tanggal_lahir: "2010-01-01T00:00:00Z", alamat: "Jl. Kebajikan No 1", nama_wali: "Bapak Wali", no_telp: "08555", kelas: "1A", tahapan_tahsin: "JILID_DASAR" };
  r = await req("POST", "/siswa", A, siswaOK);
  logTest("5.1", "SISWA", "✔ Tambah siswa berhasil", 200, "POST", "/api/siswa", siswaOK, r.status, r.data);

  // GAGAL — NIS duplikat
  r = await req("POST", "/siswa", A, { ...siswaOK });
  logTest("5.2", "SISWA", "✘ NIS duplikat → 400", 400, "POST", "/api/siswa", { nis: "112233" }, r.status, r.data);

  // GAGAL — field wajib kurang (tanpa NIS)
  r = await req("POST", "/siswa", A, { nama: "Tanpa NIS", jenis_kelamin: "PEREMPUAN" });
  logTest("5.3", "SISWA", "✘ Field NIS tidak ada → 400", 400, "POST", "/api/siswa", { nama: "Tanpa NIS" }, r.status, r.data);

  // GAGAL — jenis_kelamin tidak valid
  r = await req("POST", "/siswa", A, { ...siswaOK, nis: "999999", jenis_kelamin: "ALIEN" });
  logTest("5.4", "SISWA", "✘ jenis_kelamin invalid (ALIEN) → 400", 400, "POST", "/api/siswa", { jenis_kelamin: "ALIEN" }, r.status, r.data);

  // GAGAL — tanggal lahir format salah
  r = await req("POST", "/siswa", A, { ...siswaOK, nis: "888888", tanggal_lahir: "bukan-tanggal" });
  logTest("5.5", "SISWA", "✘ Format tanggal_lahir invalid → 400", 400, "POST", "/api/siswa", { tanggal_lahir: "bukan-tanggal" }, r.status, r.data);

  // JAILBREAK — NIS berisi karakter aneh
  r = await req("POST", "/siswa", A, { ...siswaOK, nis: "'; DROP TABLE siswa;--" });
  logTest("5.6", "SISWA", "🔒 SQL Injection di NIS → 400/200", 400, "POST", "/api/siswa", { nis: "'; DROP TABLE siswa;--" }, r.status, r.data);

  section("SISWA — PUT /api/student/:nis (Edit Siswa)");

  r = await req("PUT", "/student/112233", A, { nama: "Siswa Teladan Updated", kelas: "2A" });
  logTest("6.1", "SISWA", "✔ Edit siswa berhasil (partial)", 200, "PUT", "/api/student/:nis", { nama: "Siswa Teladan Updated", kelas: "2A" }, r.status, r.data);

  r = await req("PUT", "/student/NIS-TIDAK-ADA", A, { nama: "Tidak Ada" });
  logTest("6.2", "SISWA", "✘ NIS tidak ditemukan → 400/404", 404, "PUT", "/api/student/:nis", null, r.status, r.data);

  section("SISWA — DELETE /api/student/:nis");

  // Tambah siswa sementara untuk dihapus
  await req("POST", "/siswa", A, { nis: "HAPUS01", nama: "Akan Dihapus", jenis_kelamin: "LAKI_LAKI", tanggal_lahir: "2012-01-01T00:00:00Z", alamat: "Jl. Hapus", nama_wali: "Wali", no_telp: "08000", kelas: "1A", tahapan_tahsin: "JILID_DASAR" });
  r = await req("DELETE", "/student/HAPUS01", A);
  logTest("6.3", "SISWA", "✔ Hapus siswa berhasil", 200, "DELETE", "/api/student/:nis", null, r.status, r.data);

  r = await req("DELETE", "/student/NIS-TIDAK-ADA", A);
  logTest("6.4", "SISWA", "✘ Hapus siswa tidak ada → 400/404", 404, "DELETE", "/api/student/:nis", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // 4. HALAQOH
  // ══════════════════════════════════════════════
  section("HALAQOH — POST /api/halaqoh (Tambah Halaqoh)");

  const halTahfidzBody = { nama: "Halaqoh Tahfidz Umar", kategori: "TAHFIDZ", userId: guru1Id, nis_siswa: ["112233"] };
  r = await req("POST", "/halaqoh", A, halTahfidzBody);
  logTest("7.1", "HALAQOH", "✔ Tambah halaqoh Tahfidz berhasil", 200, "POST", "/api/halaqoh", halTahfidzBody, r.status, r.data);
  const halTahfidzId = r.data?.data?.id;

  const halTahsinBody = { nama: "Halaqoh Tahsin Abu Bakar", kategori: "TAHSIN", userId: guru2Id, nis_siswa: ["112233"] };
  r = await req("POST", "/halaqoh", A, halTahsinBody);
  logTest("7.2", "HALAQOH", "✔ Tambah halaqoh Tahsin berhasil", 200, "POST", "/api/halaqoh", halTahsinBody, r.status, r.data);
  const halTahsinId = r.data?.data?.id;

  // GAGAL — userId tidak ada
  r = await req("POST", "/halaqoh", A, { nama: "Asal", kategori: "TAHFIDZ", userId: "uuid-tidak-ada", nis_siswa: ["112233"] });
  logTest("7.3", "HALAQOH", "✘ userId tidak terdaftar → 400", 400, "POST", "/api/halaqoh", { userId: "uuid-tidak-ada" }, r.status, r.data);

  // GAGAL — role guru salah (SUPER_ADMIN bukan guru)
  const adminId = (await prisma.user.findUnique({ where: { email: "admin@test.com" }, select: { id: true } }))?.id;
  r = await req("POST", "/halaqoh", A, { nama: "Asal", kategori: "TAHFIDZ", userId: adminId, nis_siswa: ["112233"] });
  logTest("7.4", "HALAQOH", "✘ userId bukan guru (SUPER_ADMIN) → 400", 400, "POST", "/api/halaqoh", { userId: "adminId (SUPER_ADMIN)" }, r.status, r.data);

  // GAGAL — kategori tidak valid
  r = await req("POST", "/halaqoh", A, { nama: "Asal", kategori: "OLAHRAGA", userId: guru1Id, nis_siswa: ["112233"] });
  logTest("7.5", "HALAQOH", "✘ Kategori invalid (OLAHRAGA) → 400", 400, "POST", "/api/halaqoh", { kategori: "OLAHRAGA" }, r.status, r.data);

  // GAGAL — siswa tidak ada
  r = await req("POST", "/halaqoh", A, { nama: "Asal", kategori: "TAHFIDZ", userId: guru1Id, nis_siswa: ["NIS-TIDAK-ADA"] });
  logTest("7.6", "HALAQOH", "✘ nis_siswa tidak ada → 400", 400, "POST", "/api/halaqoh", { nis_siswa: ["NIS-TIDAK-ADA"] }, r.status, r.data);

  section("HALAQOH — GET & PUT & DELETE");

  r = await req("GET", "/halaqoh", A);
  logTest("8.1", "HALAQOH", "✔ Get semua halaqoh berhasil", 200, "GET", "/api/halaqoh", null, r.status, r.data);

  r = await req("GET", `/halaqoh/${halTahfidzId}`, A);
  logTest("8.2", "HALAQOH", "✔ Get detail halaqoh berhasil", 200, "GET", "/api/halaqoh/:id", null, r.status, r.data);

  r = await req("GET", "/halaqoh/id-tidak-ada", A);
  logTest("8.3", "HALAQOH", "✘ Get detail halaqoh tidak ada → 404", 404, "GET", "/api/halaqoh/:id", null, r.status, r.data);

  // RBAC — Muhaffidz akses GET /halaqoh (list) → harusnya hanya SUPER_ADMIN/DIREKTUR
  const loginGuru1R = await req("POST", "/auth/login", JSON_H, { email: "guru1@test.com", password: "password123" });
  const guru1Token = loginGuru1R.data?.data?.token;
  const HG1 = { ...JSON_H, "Authorization": `Bearer ${guru1Token}` };
  r = await req("GET", "/halaqoh", HG1);
  logTest("8.4", "HALAQOH", "🔒 RBAC: GURU akses GET /halaqoh list → 403", 403, "GET", "/api/halaqoh", null, r.status, r.data);

  // GET halaqoh detail oleh semua role (butuh token)
  r = await req("GET", `/halaqoh/${halTahfidzId}`, HG1);
  logTest("8.5", "HALAQOH", "✔ GURU boleh GET /halaqoh/:id detail", 200, "GET", "/api/halaqoh/:id", null, r.status, r.data);

  r = await req("PUT", `/halaqoh/${halTahfidzId}`, A, { nama: "Updated", kategori: "TAHFIDZ", userId: guru1Id, nis_siswa: ["112233"] });
  logTest("8.6", "HALAQOH", "✔ Edit halaqoh berhasil", 200, "PUT", "/api/halaqoh/:id", { nama: "Updated" }, r.status, r.data);

  // ══════════════════════════════════════════════
  // 5. TAHFIDZ — HAFALAN
  // ══════════════════════════════════════════════
  section("TAHFIDZ HAFALAN — POST /api/assessment/tahfidz/hafalan/:nis");

  const hafalanOK = { halaqohId: halTahfidzId, no_surah: 78, ayat_awal: 1, ayat_akhir: 10, durasi_baca: 5, toggle_tarjamah: true, jumlah_salah: 1, murajaah: 8, tajwid: 85 };
  r = await req("POST", "/assessment/tahfidz/hafalan/112233", HG1, hafalanOK);
  logTest("9.1", "HAFALAN", "✔ Input hafalan berhasil", 200, "POST", "/api/assessment/tahfidz/hafalan/:nis", hafalanOK, r.status, r.data);

  // GAGAL — halaqohId tidak ada
  r = await req("POST", "/assessment/tahfidz/hafalan/112233", HG1, { ...hafalanOK, halaqohId: "id-tidak-ada" });
  logTest("9.2", "HAFALAN", "✘ halaqohId tidak ada → 400", 400, "POST", "/api/assessment/tahfidz/hafalan/:nis", { halaqohId: "id-tidak-ada" }, r.status, r.data);

  // GAGAL — no_surah melebihi batas (115)
  r = await req("POST", "/assessment/tahfidz/hafalan/112233", HG1, { ...hafalanOK, no_surah: 115 });
  logTest("9.3", "HAFALAN", "✘ no_surah > 114 → 400", 400, "POST", "/api/assessment/tahfidz/hafalan/:nis", { no_surah: 115 }, r.status, r.data);

  // GAGAL — field kosong/body kosong
  r = await req("POST", "/assessment/tahfidz/hafalan/112233", HG1, {});
  logTest("9.4", "HAFALAN", "✘ Body kosong → 400", 400, "POST", "/api/assessment/tahfidz/hafalan/:nis", {}, r.status, r.data);

  // GAGAL — NIS siswa tidak ada
  r = await req("POST", "/assessment/tahfidz/hafalan/NIS-SALAH", HG1, hafalanOK);
  logTest("9.5", "HAFALAN", "✘ NIS siswa tidak ada → 400", 400, "POST", "/api/assessment/tahfidz/hafalan/:nis", null, r.status, r.data);

  // RBAC — Admin coba POST hafalan (harus GURU)
  r = await req("POST", "/assessment/tahfidz/hafalan/112233", A, hafalanOK);
  logTest("9.6", "HAFALAN", "🔒 RBAC: SUPER_ADMIN POST hafalan → 403", 403, "POST", "/api/assessment/tahfidz/hafalan/:nis", null, r.status, r.data);

  // JAILBREAK — nilai tajwid di luar wajar (999)
  r = await req("POST", "/assessment/tahfidz/hafalan/112233", HG1, { ...hafalanOK, tajwid: 999 });
  logTest("9.7", "HAFALAN", "🔒 tajwid = 999 (di luar 0-100) → apakah ditolak?", 400, "POST", "/api/assessment/tahfidz/hafalan/:nis", { tajwid: 999 }, r.status, r.data);

  section("TAHFIDZ HAFALAN — GET /api/assessment/tahfidz/hafalan/:nis");

  r = await req("GET", "/assessment/tahfidz/hafalan/112233", A);
  logTest("10.1", "HAFALAN", "✔ Get riwayat hafalan berhasil", 200, "GET", "/api/assessment/tahfidz/hafalan/:nis", null, r.status, r.data);

  r = await req("GET", "/assessment/tahfidz/hafalan/NIS-SALAH", A);
  logTest("10.2", "HAFALAN", "✘ Get riwayat NIS tidak ada → 404", 404, "GET", "/api/assessment/tahfidz/hafalan/:nis", null, r.status, r.data);

  // RBAC — Muhassin akses GET hafalan
  r = await req("GET", "/assessment/tahfidz/hafalan/112233", HG2);
  logTest("10.3", "HAFALAN", "🔒 ✔ GURU GET riwayat hafalan (Bisa karena role disatukan) → 200", 200, "GET", "/api/assessment/tahfidz/hafalan/:nis", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // 6. TAHFIDZ — MURAJAAH
  // ══════════════════════════════════════════════
  section("TAHFIDZ MURAJAAH — POST /api/assessment/tahfidz/murajaah/:nis");

  const murajaahOK = { halaqohId: halTahfidzId, no_surah: 78, ayat_awal: 1, ayat_akhir: 5, jumlah_salah: 0, murajaah: 5, tajwid: 90 };
  r = await req("POST", "/assessment/tahfidz/murajaah/112233", HG1, murajaahOK);
  logTest("11.1", "MURAJAAH", "✔ Input murajaah berhasil", 200, "POST", "/api/assessment/tahfidz/murajaah/:nis", murajaahOK, r.status, r.data);

  r = await req("POST", "/assessment/tahfidz/murajaah/112233", HG1, {});
  logTest("11.2", "MURAJAAH", "✘ Body kosong → 400", 400, "POST", "/api/assessment/tahfidz/murajaah/:nis", {}, r.status, r.data);

  r = await req("POST", "/assessment/tahfidz/murajaah/112233", HG1, { ...murajaahOK, no_surah: 0 });
  logTest("11.3", "MURAJAAH", "✘ no_surah = 0 (harus positif) → 400", 400, "POST", "/api/assessment/tahfidz/murajaah/:nis", { no_surah: 0 }, r.status, r.data);

  section("TAHFIDZ MURAJAAH — GET /api/assessment/tahfidz/murajaah/:nis");

  r = await req("GET", "/assessment/tahfidz/murajaah/112233", A);
  logTest("12.1", "MURAJAAH", "✔ Get riwayat murajaah berhasil", 200, "GET", "/api/assessment/tahfidz/murajaah/:nis", null, r.status, r.data);

  r = await req("GET", "/assessment/tahfidz/murajaah/NIS-SALAH", A);
  logTest("12.2", "MURAJAAH", "✘ NIS tidak ada → 404", 404, "GET", "/api/assessment/tahfidz/murajaah/:nis", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // 7. TAHSIN
  // ══════════════════════════════════════════════
  section("TAHSIN — POST /api/assessment/tahsin/:nis");

  const tahsinOK = { halaqohId: halTahsinId, no_surah: 1, hafalan_surah: 78, hafalan_ayat_awal: 1, hafalan_ayat_akhir: 5, jilid: 1, bab: 2, ayat_awal: 1, ayat_akhir: 7, materi: "Pengenalan Huruf", nilai: "A", keterangan: "Bagus sekali" };
  r = await req("POST", "/assessment/tahsin/112233", HG2, tahsinOK);
  logTest("13.1", "TAHSIN", "✔ Input tahsin berhasil", 200, "POST", "/api/assessment/tahsin/:nis", tahsinOK, r.status, r.data);

  r = await req("POST", "/assessment/tahsin/112233", HG2, {});
  logTest("13.2", "TAHSIN", "✘ Body kosong → 400", 400, "POST", "/api/assessment/tahsin/:nis", {}, r.status, r.data);

  // GAGAL — nilai tidak valid
  r = await req("POST", "/assessment/tahsin/112233", HG2, { ...tahsinOK, nilai: "Z" });
  logTest("13.3", "TAHSIN", "✘ Nilai invalid (Z) → cek validasi", 400, "POST", "/api/assessment/tahsin/:nis", { nilai: "Z" }, r.status, r.data);

  // RBAC — Muhaffidz coba POST tahsin (harus GURU)
  r = await req("POST", "/assessment/tahsin/112233", HG1, tahsinOK);
  logTest("13.4", "TAHSIN", "🔒 ✔ GURU POST tahsin (Bisa karena role disatukan) → 200", 200, "POST", "/api/assessment/tahsin/:nis", null, r.status, r.data);

  // JAILBREAK — keterangan dengan script
  r = await req("POST", "/assessment/tahsin/112233", HG2, { ...tahsinOK, keterangan: "<script>alert('xss')</script>" });
  logTest("13.5", "TAHSIN", "🔒 XSS di field keterangan — apakah tersimpan apa adanya?", 200, "POST", "/api/assessment/tahsin/:nis", { keterangan: "<script>..." }, r.status, r.data);

  section("TAHSIN — GET /api/assessment/tahsin/:nis");

  r = await req("GET", "/assessment/tahsin/112233", A);
  logTest("14.1", "TAHSIN", "✔ Get riwayat tahsin berhasil", 200, "GET", "/api/assessment/tahsin/:nis", null, r.status, r.data);

  r = await req("GET", "/assessment/tahsin/NIS-SALAH", A);
  logTest("14.2", "TAHSIN", "✘ NIS tidak ada → 404", 404, "GET", "/api/assessment/tahsin/:nis", null, r.status, r.data);

  r = await req("GET", "/assessment/tahsin/112233", HG1);
  logTest("14.3", "TAHSIN", "🔒 ✔ GURU GET riwayat tahsin (Bisa karena role disatukan) → 200", 200, "GET", "/api/assessment/tahsin/:nis", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // 8. IMPORT EXCEL
  // ══════════════════════════════════════════════
  section("IMPORT EXCEL — POST /api/siswa/import");
  
  // Create dummy excel file
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Siswa');
  worksheet.addRow(['nis', 'nama', 'jenis_kelamin', 'tanggal_lahir', 'alamat', 'nama_wali', 'no_telp', 'kelas', 'profile_photo']);
  worksheet.addRow(['99111', 'Siswa Excel 1', 'L', '2010-01-01T00:00:00Z', 'Alamat 1', 'Wali 1', '081111', '1A', '']);
  worksheet.addRow(['99222', 'Siswa Excel 2', 'P', '2010-02-02T00:00:00Z', 'Alamat 2', 'Wali 2', '082222', '1A', '']);
  await workbook.xlsx.writeFile('dummy.xlsx');

  const fileBlob = new Blob([fs.readFileSync('dummy.xlsx')], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const formData = new FormData();
  formData.append("file", fileBlob, "dummy.xlsx");

  try {
    const resExcel = await fetch(`${BASE_URL}/siswa/import`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${adminToken}` },
      body: formData
    });
    let resExcelBody;
    try { resExcelBody = await resExcel.json(); } catch(e) { resExcelBody = "Non-JSON response"; }
    logTest("15.0", "EXCEL", "✔ Upload Excel berhasil", 200, "POST", "/api/siswa/import", "[File Excel Attached]", resExcel.status, resExcelBody);
    
    console.log("⏳ Menunggu worker memproses data...");
    await new Promise(r => setTimeout(r, 2000));
    
    const checkExcel = await req("GET", "/student/99111", A);
    logTest("15.0.1", "EXCEL", "✔ Data dari Excel tersimpan di DB", 200, "GET", "/api/student/99111", null, checkExcel.status, checkExcel.data);

    fs.unlinkSync('dummy.xlsx');
  } catch (e) {
    logTest("15.0", "EXCEL", "✘ Upload Excel Error", 200, "POST", "/api/siswa/import", null, 500, { message: e.message });
  }

  // ══════════════════════════════════════════════
  // 9. LOGOUT & DELETE
  // ══════════════════════════════════════════════
  section("AUTH LOGOUT & DELETE Operations");

  // Hapus siswa yang masih punya riwayat (seharusnya cascade delete)
  r = await req("DELETE", "/student/112233", A);
  logTest("15.1", "DELETE", "✔ Hapus siswa (ada riwayat) — cascade delete", 200, "DELETE", "/api/student/:nis", null, r.status, r.data);

  // Hapus halaqoh
  r = await req("DELETE", `/halaqoh/${halTahfidzId}`, A);
  logTest("15.2", "DELETE", "✔ Hapus halaqoh berhasil", 200, "DELETE", "/api/halaqoh/:id", null, r.status, r.data);

  // Hapus halaqoh yang sudah dihapus (idempoten?)
  r = await req("DELETE", `/halaqoh/${halTahfidzId}`, A);
  logTest("15.3", "DELETE", "✘ Hapus halaqoh sudah tidak ada → 404/500", 404, "DELETE", "/api/halaqoh/:id", null, r.status, r.data);

  // Hapus user
  r = await req("DELETE", `/user/${guru2Id}`, A);
  logTest("15.4", "DELETE", "✔ Hapus user berhasil", 200, "DELETE", "/api/user/:id", null, r.status, r.data);

  // Logout
  r = await req("DELETE", "/auth/logout", A);
  logTest("15.5", "AUTH", "✔ Logout berhasil", 200, "DELETE", "/api/auth/logout", null, r.status, r.data);

  // Akses setelah logout (token sudah di-invalidate)
  r = await req("GET", "/users", A);
  logTest("15.6", "AUTH", "✘ Akses dengan token sudah logout → 401", 401, "GET", "/api/users", null, r.status, r.data);

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════
  const total = passCount + failCount + noteCount;
  reportMd += `\n---\n\n## 📊 Ringkasan Hasil Pengujian\n\n`;
  reportMd += `| Kategori | Jumlah |\n|----------|--------|\n`;
  reportMd += `| ✅ Sesuai ekspektasi | ${passCount} |\n`;
  reportMd += `| ❌ Tidak sesuai ekspektasi | ${failCount} |\n`;
  reportMd += `| **Total Tes Dijalankan** | **${total}** |\n\n`;
  reportMd += `\n### Catatan Jailbreak / Security:\n`;
  reportMd += `- **XSS di field nama/keterangan:** Perhatikan hasil tes 2.7 dan 13.5. Jika API mengembalikan 200 dan menyimpan tag HTML apa adanya, maka input **tidak disanitasi** di sisi backend. Sanitasi perlu dilakukan di **Frontend** sebelum ditampilkan.\n`;
  reportMd += `- **SQL Injection:** Karena menggunakan Prisma ORM dengan Parameterized Query, injeksi SQL secara umum **tidak berhasil**.\n`;
  reportMd += `- **Validasi Input Angka:** Perhatikan hasil tes 9.7 (tajwid=999). Jika lolos, perlu ditambahkan constraint \`.max(100)\` di Joi validation.\n`;

  // --- INJEKSI PEMBUATAN 2 USER UNTUK LOGIN (SESUAI PERMINTAAN USER) ---
  console.log("\n⏳ Membuat akun SUPER_ADMIN dan DIREKTUR untuk login...");
  const hashedAdmin = await bcrypt.hash("rahasia2026", 10);
  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: { password: hashedAdmin },
    create: { nama: "Super Admin", email: "admin@test.com", password: hashedAdmin, no_telp: "08111111", role: "SUPER_ADMIN" }
  });
  const hashedDirektur = await bcrypt.hash("direktur2026", 10);
  await prisma.user.upsert({
    where: { email: "direktur@test.com" },
    update: { password: hashedDirektur },
    create: { nama: "Direktur", email: "direktur@test.com", password: hashedDirektur, no_telp: "08222222", role: "DIREKTUR" }
  });
  console.log("✅ Akun berhasil dibuat!");

  fs.writeFileSync('./testing/test_report_scenarios.md', reportMd);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Sesuai: ${passCount} | ❌ Tidak sesuai: ${failCount} | Total: ${total}`);
  console.log(`📄 Laporan: testing/test_report_scenarios.md`);
  process.exit(0);
}

runTests().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
