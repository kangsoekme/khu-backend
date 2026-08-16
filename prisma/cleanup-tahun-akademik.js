import "dotenv/config";
import { prismaClient } from "../src/application/database.js";

// Format valid hasil form: "YYYY/YYYY SEMESTER", contoh: "2025/2026 GANJIL"
const FORMAT_VALID = /^\d{4}\/\d{4} (GANJIL|GENAP)$/;

// Mode pratinjau secara default; tambahkan --delete untuk benar-benar menghapus
const apply = process.argv.includes("--delete");

async function main() {
  const rows = await prismaClient.tahun_Akademik.findMany({
    include: { _count: { select: { riwayatKelas: true } } },
  });

  const invalid = rows.filter((r) => !FORMAT_VALID.test(r.nama_tahun));

  if (invalid.length === 0) {
    console.log("✅ Semua data tahun akademik sudah berformat valid.");
    return;
  }

  console.log(`Ditemukan ${invalid.length} data dengan format tidak valid:\n`);

  for (const r of invalid) {
    const referensi = r._count.riwayatKelas;
    // Hanya data non-aktif tanpa riwayat kelas yang aman dihapus otomatis
    const amanDihapus = !r.is_active && referensi === 0;

    console.log(
      `- "${r.nama_tahun}" (aktif: ${r.is_active}, riwayat kelas: ${referensi}) → ${
        amanDihapus
          ? "aman dihapus"
          : "TIDAK dihapus otomatis (sedang aktif / memiliki riwayat kelas)"
      }`,
    );

    if (apply && amanDihapus) {
      await prismaClient.tahun_Akademik.delete({ where: { id: r.id } });
      console.log("  🗑️  Dihapus");
    }
  }

  console.log(
    apply
      ? "\nSelesai. Data yang sedang aktif / ber-riwayat perlu diperbaiki manual (mis. via Prisma Studio)."
      : "\nMode pratinjau (dry-run). Jalankan dengan --delete untuk menghapus data yang aman dihapus.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
