import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const getDatabaseBackup = async () => {
  // SEC-5: eksklusi field sensitif (password & token) dari backup
  // untuk mencegah kebocoran kredensial jika berkas backup bocor.
  const users = await prismaClient.user.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
      jenis_kelamin: true,
      is_sertifikasi: true,
      profile_photo: true,
      // password & token sengaja TIDAK diikutsertakan
    },
  });
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
      // token sengaja TIDAK diikutsertakan
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

  const backupData = {
    timestamp: new Date().toISOString(),
    note: "Backup tidak menyertakan password dan token (field sensitif).",
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

  return backupData;
};

const restoreDatabaseBackup = async (backupData) => {
  const { data } = backupData;
  if (!data) {
    throw new ResponseError(400, "Format file backup JSON tidak valid!");
  }

  // Kompatibilitas backup lama: field `token` dulu disimpan di tabel users/siswa,
  // sekarang sudah dipindah ke tabel Session. Backup file lama mungkin masih
  // mengandung field `token` → createMany akan error "unknown field".
  // Solusi: hapus field token dari setiap baris sebelum insert.
  const stripLegacyToken = (rows) =>
    Array.isArray(rows) ? rows.map(({ token, ...rest }) => rest) : rows;

  const users = stripLegacyToken(data.users);
  const siswa = stripLegacyToken(data.siswa);

  // Gunakan transaction agar jika 1 tabel gagal, semua otomatis dibatalkan (rollback)
  await prismaClient.$transaction(async (tx) => {
    // 💡 1. URUTAN DELETE (Anak dulu, baru Siswa, baru Halaqoh, baru User)
    // Karena relasi FK di Postgres adalah RESTRICT, siswa WAJIB dihapus sebelum halaqoh!
    await tx.pengajuan_Ujian.deleteMany();
    await tx.ujian_Pretest.deleteMany();
    await tx.ujian_Kenaikan.deleteMany();
    await tx.setoran_Tahsin.deleteMany();
    await tx.setoran_Murajaah.deleteMany();
    await tx.setoran_Hafalan.deleteMany();
    await tx.riwayat_Kelas.deleteMany();

    await tx.siswa.deleteMany(); // 👈 Siswa dulu
    await tx.halaqoh.deleteMany(); // 👈 Baru halaqoh
    await tx.user.deleteMany();
    // 💡 2. URUTAN INSERT (User -> Tahun Akademik -> Halaqoh -> Siswa -> Transaksi Anak)
    if (users?.length) {
      await tx.user.createMany({ data: users, skipDuplicates: true });
    }
    if (data.tahun_akademik?.length) {
      await tx.tahun_Akademik.createMany({
        data: data.tahun_akademik,
        skipDuplicates: true,
      });
    }
    if (data.halaqoh?.length) {
      await tx.halaqoh.createMany({ data: data.halaqoh, skipDuplicates: true }); // 👈 Halaqoh duluan
    }
    if (siswa?.length) {
      await tx.siswa.createMany({ data: siswa, skipDuplicates: true }); // 👈 Baru siswa
    }
    if (data.riwayat_kelas?.length) {
      await tx.riwayat_Kelas.createMany({
        data: data.riwayat_kelas,
        skipDuplicates: true,
      });
    }
    if (data.setoran_hafalan?.length) {
      await tx.setoran_Hafalan.createMany({
        data: data.setoran_hafalan,
        skipDuplicates: true,
      });
    }
    if (data.setoran_murajaah?.length) {
      await tx.setoran_Murajaah.createMany({
        data: data.setoran_murajaah,
        skipDuplicates: true,
      });
    }
    if (data.setoran_tahsin?.length) {
      await tx.setoran_Tahsin.createMany({
        data: data.setoran_tahsin,
        skipDuplicates: true,
      });
    }
    if (data.ujian_kenaikan?.length) {
      await tx.ujian_Kenaikan.createMany({
        data: data.ujian_kenaikan,
        skipDuplicates: true,
      });
    }
    if (data.ujian_pretest?.length) {
      await tx.ujian_Pretest.createMany({
        data: data.ujian_pretest,
        skipDuplicates: true,
      });
    }
    if (data.pengajuan_ujian?.length) {
      await tx.pengajuan_Ujian.createMany({
        data: data.pengajuan_ujian,
        skipDuplicates: true,
      });
    }
  });
  return "Database berhasil dipulihkan secara menyeluruh";
};
// 💡 2. Jangan lupa export fungsinya:
export default { getDatabaseBackup, restoreDatabaseBackup };
