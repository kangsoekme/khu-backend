import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

// Format file backup terenkripsi (V2). Backup V1 (plain JSON, tanpa password)
// masih diterima untuk kompatibilitas, namun tidak bisa memulihkan akun user.
const BACKUP_FORMAT = "KHU-BACKUP-V2";

// Urutan tabel yang di-restore. Tabel "replace" dikosongkan lalu diisi ulang
// dari file backup; tabel "merge" (data referensi statis) tidak dikosongkan
// agar data yang lebih baru tidak hilang saat restore file lama.
const REPLACE_TABLES = [
  "users",
  "siswa",
  "halaqoh",
  "riwayat_kelas",
  "setoran_hafalan",
  "setoran_murajaah",
  "setoran_tahsin",
  "ujian_kenaikan",
  "ujian_pretest",
  "pengajuan_ujian",
];
const MERGE_TABLES = ["surah", "tahun_akademik"];

const MODEL_BY_TABLE = {
  users: "user",
  siswa: "siswa",
  halaqoh: "halaqoh",
  surah: "surah",
  tahun_akademik: "tahun_Akademik",
  riwayat_kelas: "riwayat_Kelas",
  setoran_hafalan: "setoran_Hafalan",
  setoran_murajaah: "setoran_Murajaah",
  setoran_tahsin: "setoran_Tahsin",
  ujian_kenaikan: "ujian_Kenaikan",
  ujian_pretest: "ujian_Pretest",
  pengajuan_ujian: "pengajuan_Ujian",
};

// ---------------------------------------------------------------------------
// Enkripsi file backup: AES-256-GCM dengan kunci turunan scrypt(passphrase).
// Hash password akun ikut disimpan AGAR restore bisa memulihkan login, namun
// tidak pernah tersimpan sebagai plaintext di file backup (SEC-5 tetap terjaga:
// file yang bocor tanpa passphrase tidak bisa dibaca).
// ---------------------------------------------------------------------------

const deriveKey = (passphrase, salt) =>
  crypto.scryptSync(passphrase, salt, 32, { N: 16384, r: 8, p: 1 });

const encryptBackup = (plainObject, passphrase) => {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    deriveKey(passphrase, salt),
    iv,
  );
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(plainObject), "utf8"),
    cipher.final(),
  ]);
  return {
    format: BACKUP_FORMAT,
    note: "File backup terenkripsi AES-256-GCM. Simpan passphrase dengan aman — tanpa passphrase file ini TIDAK bisa dipulihkan.",
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  };
};

const decryptBackup = (file, passphrase) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      deriveKey(passphrase, Buffer.from(file.salt, "base64")),
      Buffer.from(file.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(file.tag, "base64"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(file.data, "base64")),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString("utf8"));
  } catch {
    // GCM auth tag gagal = passphrase salah ATAU file berubah/rusak.
    throw new ResponseError(
      400,
      "Passphrase salah atau file backup rusak/tidak utuh.",
    );
  }
};

// ---------------------------------------------------------------------------
// Pengumpulan data backup
// ---------------------------------------------------------------------------

const collectBackupData = async () => {
  const users = await prismaClient.user.findMany();
  const siswa = await prismaClient.siswa.findMany({
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,
      profile_photo: true,
      updatedAt: true,
      createdAt: true,
      halaqoh_tahsin_id: true,
      halaqoh_tahfidz_id: true,
      tahapan_tahsin: true,
      // token sengaja TIDAK diikutsertakan (sudah pindah ke tabel Session)
    },
  });
  const halaqoh = await prismaClient.halaqoh.findMany();
  const surah = await prismaClient.surah.findMany();
  const tahun_akademik = await prismaClient.tahun_Akademik.findMany();
  const riwayat_kelas = await prismaClient.riwayat_Kelas.findMany();
  const setoran_hafalan = await prismaClient.setoran_Hafalan.findMany();
  const setoran_murajaah = await prismaClient.setoran_Murajaah.findMany();
  const setoran_tahsin = await prismaClient.setoran_Tahsin.findMany();
  const ujian_kenaikan = await prismaClient.ujian_Kenaikan.findMany();
  const ujian_pretest = await prismaClient.ujian_Pretest.findMany();
  const pengajuan_ujian = await prismaClient.pengajuan_Ujian.findMany();

  return {
    timestamp: new Date().toISOString(),
    data: {
      users,
      siswa,
      halaqoh,
      surah,
      tahun_akademik,
      riwayat_kelas,
      setoran_hafalan,
      setoran_murajaah,
      setoran_tahsin,
      ujian_kenaikan,
      ujian_pretest,
      pengajuan_ujian,
    },
  };
};

const getDatabaseBackup = async (passphrase) => {
  if (!passphrase || passphrase.length < 8) {
    throw new ResponseError(
      400,
      "Passphrase backup wajib minimal 8 karakter (untuk enkripsi file).",
    );
  }
  const backupData = await collectBackupData();
  // Hash password ikut di dalam file, tapi seluruh file terenkripsi AES-256-GCM.
  return encryptBackup(backupData, passphrase);
};

// ---------------------------------------------------------------------------
// Restore
// ---------------------------------------------------------------------------

// Kompatibilitas backup lama: field `token` dulu disimpan di tabel users/siswa,
// sekarang sudah pindah ke tabel Session → strip sebelum insert.
const stripLegacyToken = (rows) =>
  Array.isArray(rows) ? rows.map(({ token, ...rest }) => rest) : rows;

// Simpan snapshot kondisi database SAAT INI sebelum menimpa dengan restore —
// jaring pengaman bila file backup ternyata salah/rusak. File disimpan di
// folder ./backups milik server (tidak pernah dikirim ke client).
const writeSafetySnapshot = async (passphrase) => {
  const snapshot = await collectBackupData();
  const backupDir = path.join(process.cwd(), "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date(Date.now() + 7 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[:.]/g, "-");
  const payload = passphrase
    ? encryptBackup(snapshot, passphrase)
    : { format: "KHU-BACKUP-PLAIN-SAFETY", ...snapshot };
  const filePath = path.join(backupDir, `pre-restore-${stamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
};

const restoreDatabaseBackup = async (backupFile, passphrase, opts = {}) => {
  // ---- 1. Kenali format file & dekripsi bila perlu ----
  let backupData;
  if (backupFile?.format === BACKUP_FORMAT) {
    if (!passphrase) {
      throw new ResponseError(
        400,
        "File backup terenkripsi — passphrase wajib diisi untuk memulihkan.",
      );
    }
    backupData = decryptBackup(backupFile, passphrase);
  } else {
    // File lama (plain JSON tanpa enkripsi)
    backupData = backupFile;
  }

  const { data } = backupData || {};
  if (!data || typeof data !== "object") {
    throw new ResponseError(
      400,
      "Format file backup tidak valid — struktur 'data' tidak ditemukan.",
    );
  }

  // ---- 2. Validasi struktur sebelum menyentuh database ----
  for (const table of [...REPLACE_TABLES, ...MERGE_TABLES]) {
    if (data[table] !== undefined && !Array.isArray(data[table])) {
      throw new ResponseError(
        400,
        `Format file backup tidak valid — tabel '${table}' bukan berisi daftar.`,
      );
    }
  }
  const users = stripLegacyToken(data.users);
  const siswa = stripLegacyToken(data.siswa);
  if (users?.length && users.some((u) => !u.password)) {
    throw new ResponseError(
      400,
      "File backup lama tidak memuat password akun sehingga akun user tidak dapat dipulihkan (login akan terkunci). Buat ulang backup dengan aplikasi versi terbaru, atau hapus blok 'users' dari file untuk memulihkan data non-akun saja.",
    );
  }

  // ---- 3. Jaring pengaman: snapshot kondisi saat ini ----
  const safetyPath = await writeSafetySnapshot(passphrase || null);

  // Pertahankan session admin yang sedang merestore agar tidak ter-logout
  // di tengah proses (user dihapus → session ikut cascade-delete).
  let currentSession = null;
  if (opts.currentToken) {
    currentSession = await prismaClient.session.findUnique({
      where: { token: opts.currentToken },
    });
  }

  const summary = {};

  // ---- 4. Eksekusi dalam satu transaction (gagal 1 tabel = rollback semua) ----
  await prismaClient.$transaction(async (tx) => {
    // DELETE: anak dulu → siswa → halaqoh → user (FK RESTRICT)
    await tx.pengajuan_Ujian.deleteMany();
    await tx.ujian_Pretest.deleteMany();
    await tx.ujian_Kenaikan.deleteMany();
    await tx.setoran_Tahsin.deleteMany();
    await tx.setoran_Murajaah.deleteMany();
    await tx.setoran_Hafalan.deleteMany();
    await tx.riwayat_Kelas.deleteMany();
    await tx.siswa.deleteMany();
    await tx.halaqoh.deleteMany();
    await tx.user.deleteMany();

    // INSERT: induk dulu (user → tahun_akademik/surah → halaqoh → siswa → anak)
    // Tabel "replace" TIDAK pakai skipDuplicates — tabel sudah kosong, jadi
    // duplikat = file korup dan harus gagal keras, bukan dilewati diam-diam.
    if (users?.length) {
      await tx.user.createMany({ data: users });
    }
    summary.users = users?.length || 0;

    for (const table of MERGE_TABLES) {
      const rows = data[table];
      if (rows?.length) {
        // Data referensi statis: merge, jangan timpuk data yang lebih baru.
        await tx[MODEL_BY_TABLE[table]].createMany({
          data: rows,
          skipDuplicates: true,
        });
      }
      summary[table] = rows?.length || 0;
    }

    if (data.halaqoh?.length) {
      await tx.halaqoh.createMany({ data: data.halaqoh });
    }
    if (siswa?.length) {
      await tx.siswa.createMany({ data: siswa });
    }
    const childOrder = [
      "riwayat_kelas",
      "setoran_hafalan",
      "setoran_murajaah",
      "setoran_tahsin",
      "ujian_kenaikan",
      "ujian_pretest",
      "pengajuan_ujian",
    ];
    for (const table of childOrder) {
      const rows = data[table];
      if (rows?.length) {
        await tx[MODEL_BY_TABLE[table]].createMany({ data: rows });
      }
      summary[table] = rows?.length || 0;
    }
    summary.halaqoh = data.halaqoh?.length || 0;
    summary.siswa = siswa?.length || 0;

    // ---- 5. Verifikasi jumlah baris (deteksi restore bolong) ----
    for (const table of REPLACE_TABLES) {
      const expected = summary[table] || 0;
      const actual = await tx[MODEL_BY_TABLE[table]].count();
      if (actual !== expected) {
        throw new ResponseError(
          500,
          `Verifikasi gagal untuk tabel '${table}': diharapkan ${expected} baris, masuk ${actual}. Restore dibatalkan.`,
        );
      }
    }
    for (const table of MERGE_TABLES) {
      const expected = summary[table] || 0;
      const actual = await tx[MODEL_BY_TABLE[table]].count();
      if (actual < expected) {
        throw new ResponseError(
          500,
          `Verifikasi gagal untuk tabel '${table}': ${actual} baris < ${expected} baris di file. Restore dibatalkan.`,
        );
      }
    }

    // ---- 6. Pulihkan session admin yang sedang login ----
    if (currentSession?.user_id && users.some((u) => u.id === currentSession.user_id)) {
      await tx.session.create({
        data: {
          token: currentSession.token,
          user_id: currentSession.user_id,
          expires_at: currentSession.expires_at,
          user_agent: currentSession.user_agent,
          ip_address: currentSession.ip_address,
        },
      });
    }
  });

  const total = Object.entries(summary)
    .filter(([t]) => t !== "surah" && t !== "tahun_akademik")
    .reduce((acc, [, n]) => acc + n, 0);
  return {
    message: `Database berhasil dipulihkan (${total} baris data) dan diverifikasi utuh.`,
    detail: summary,
    safetyBackup: path.basename(safetyPath),
  };
};

export default { getDatabaseBackup, restoreDatabaseBackup };
