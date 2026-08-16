// =============================================================================
// reset-test-data.mjs
// Membersihkan data dummy hasil run koleksi Postman "KHU API - Lengkap".
//
// AMAN: hanya menghapus data bertanda dummy, yaitu:
//   - Siswa         : nis dalam [9001001, 9001002, 9001999]
//   - User guru     : email berakhiran "@khu.test"
//   - Halaqoh       : nama mengandung "Postman"
//   - Tahun Akademik: marker lama "Postman" (pra-validasi format, run lama)
//                     ATAU marker baru "2099/xxxx" (valid format YYYY/YYYY
//                     GANJIL|GENAP sekaligus tidak dipakai data asli)
//
// KHUSUS TAHUN AKADEMIK: folder Transisi Semester (18.1) pada run sebelumnya
// dapat MENGAKTIFKAN dummy. Sebelum menghapus dummy, script otomatis
// me-re-aktivasi tahun akademik ASLI (non-dummy) pertama agar tidak ada
// periode aktif yang hilang.
//
// TIDAK PERNAH menyentuh:
//   - Akun SuperAdmin & Direktur
//   - Data asli / hasil input pengguna sebenarnya (termasuk tahun akademik asli)
//
// Berkat cascade pada skema Prisma, menghapus Siswa & User guru akan
// otomatis membersihkan: Riwayat_Kelas, Setoran (Hafalan/Tahsin/Murajaah),
// Ujian_Kenaikan, Ujian_Pretest, Pengajuan_Ujian, Session, dan Halaqoh milik
// guru tersebut.
//
// Pemakaian:
//   node scripts/reset-test-data.mjs           # DRY-RUN (lihat target, TIDAK hapus)
//   node scripts/reset-test-data.mjs --apply   # benar-benar hapus
//   npm run test:reset                          # shortcut = --apply
//   npm run test:reset:dry                      # shortcut = dry-run
// =============================================================================

import "dotenv/config";
import { prismaClient } from "../src/application/database.js";

const APPLY = process.argv.includes("--apply");

// Filter tahun akademik dummy — dipakai untuk pencarian, deteksi dummy aktif,
// dan pengecualian tahun asli (marker lama "Postman" + marker baru "2099/").
const isTahunDummy = {
  OR: [
    { nama_tahun: { contains: "Postman" } },
    { nama_tahun: { startsWith: "2099/" } },
  ],
};

// Kondisi pencarian data dummy (marker ketat, lihat header).
const where = {
  siswa: { nis: { in: ["9001001", "9001002", "9001999"] } },
  guru: { email: { endsWith: "@khu.test" } },
  halaqoh: { nama: { contains: "Postman" } },
  tahun: isTahunDummy,
};

// Guard: env DB harus ada.
if (!process.env.DATABASE_URL) {
  console.error("\u2717 DATABASE_URL tidak ditemukan. Pastikan file .env ada di root backend.\n");
  process.exit(1);
}

// Tampilkan apa yang AKAN dihapus tanpa benar-benar menghapus.
const dryRun = async () => {
  const [siswa, guru, halaqoh, tahun] = await Promise.all([
    prismaClient.siswa.findMany({
      where: where.siswa,
      select: { nis: true, nama: true },
    }),
    prismaClient.user.findMany({
      where: where.guru,
      select: { id: true, email: true, nama: true },
    }),
    prismaClient.halaqoh.findMany({
      where: where.halaqoh,
      select: { id: true, nama: true },
    }),
    prismaClient.tahun_Akademik.findMany({
      where: where.tahun,
      select: { id: true, nama_tahun: true, is_active: true },
    }),
  ]);

  console.log("\n=== DRY RUN \u2014 data dummy yang AKAN dihapus ===");
  console.log(`Siswa (${siswa.length}):`);
  siswa.forEach((s) => console.log(`   - ${s.nis}  ${s.nama}`));
  console.log(`User guru (${guru.length}):`);
  guru.forEach((g) => console.log(`   - ${g.email}  (${g.nama})`));
  console.log(`Halaqoh (${halaqoh.length}):`);
  halaqoh.forEach((h) => console.log(`   - ${h.nama}  ${h.id}`));
  console.log(`Tahun akademik dummy (${tahun.length}):`);
  tahun.forEach((t) =>
    console.log(`   - "${t.nama_tahun}"  active=${t.is_active}`),
  );
  console.log(
    "\n(Dry-run) Tidak ada data dihapus. Jalankan dengan --apply untuk menghapus.",
  );
};

// Hapus data dummy dalam satu transaksi (urutan FK-aman).
const applyReset = async () => {
  const result = await prismaClient.$transaction(async (t) => {
    // 1) Siswa dummy dulu -> cascade: riwayat, setoran x3, ujian x2,
    //    pengajuan (sisi siswa), session.
    const siswa = await t.siswa.deleteMany({ where: where.siswa });
    // 2) User guru dummy -> cascade: halaqoh miliknya, pengajuan (sisi guru),
    //    session.
    const guru = await t.user.deleteMany({ where: where.guru });
    // 3) Halaqoh sisa (pengaman untuk orphan yang tidak ikut cascade guru).
    const halaqoh = await t.halaqoh.deleteMany({ where: where.halaqoh });
    // 4) Tahun akademik dummy (tidak punya endpoint DELETE di API).
    //    Aman karena riwayat_kelas sudah tercascade pada langkah 1.
    //    Jika ada dummy yang sedang AKTIF (efek folder Transisi Semester 18.1),
    //    re-aktivasi tahun akademik ASLI pertama agar tidak ada periode aktif hilang.
    const dummyAktif = await t.tahun_Akademik.findFirst({
      where: { AND: [isTahunDummy, { is_active: true }] },
      select: { id: true },
    });
    let tahunAsliDireaktifkan = null;
    if (dummyAktif) {
      const asli = await t.tahun_Akademik.findFirst({
        where: { NOT: isTahunDummy },
        orderBy: { nama_tahun: "asc" },
        select: { id: true, nama_tahun: true },
      });
      if (asli) {
        await t.tahun_Akademik.update({
          where: { id: asli.id },
          data: { is_active: true },
        });
        tahunAsliDireaktifkan = asli.nama_tahun;
      }
    }
    const tahun = await t.tahun_Akademik.deleteMany({ where: where.tahun });
    return { siswa, guru, halaqoh, tahun, tahunAsliDireaktifkan };
  });

  console.log("\n\u2713 Reset selesai (dalam 1 transaksi):");
  console.log(
    `   Siswa          : ${result.siswa.count} dihapus (cascade: riwayat, setoran, ujian, pengajuan, session)`,
  );
  console.log(
    `   User guru      : ${result.guru.count} dihapus (cascade: halaqoh, pengajuan, session)`,
  );
  console.log(`   Halaqoh sisa   : ${result.halaqoh.count} dihapus`);
  console.log(
    `   Tahun akademik : ${result.tahun.count} dihapus` +
      (result.tahunAsliDireaktifkan
        ? ` (tahun asli "${result.tahunAsliDireaktifkan}" di-re-aktivasi)`
        : ""),
  );
};

try {
  console.log(
    APPLY ? "Mode: APPLY (hapus data dummy)" : "Mode: DRY-RUN (tidak menghapus)",
  );
  if (APPLY) {
    await applyReset();
  } else {
    await dryRun();
  }
} catch (e) {
  console.error("\n\u2717 Gagal reset:", e.message);
  if (e.code === "P2003") {
    console.error(
      "  -> Konflik foreign key. Periksa apakah ada data asli yang masih memakai dummy ini.",
    );
  }
  process.exitCode = 1;
} finally {
  await prismaClient.$disconnect();
}
