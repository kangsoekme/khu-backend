import "dotenv/config";
import { prismaClient } from "../src/application/database.js";

async function main() {
  // Cek apakah sudah ada tahun akademik
  const existingTahun = await prismaClient.tahun_Akademik.findFirst();

  if (!existingTahun) {
    const tahunBaru = await prismaClient.tahun_Akademik.create({
      data: {
        nama_tahun: 'Ganjil 2026/2027',
        is_active: true,
      },
    });
    console.log('✅ Berhasil menambahkan Tahun Akademik Aktif:', tahunBaru.nama_tahun);
  } else {
    // Jika sudah ada, pastikan setidaknya satu aktif
    await prismaClient.tahun_Akademik.updateMany({
      data: { is_active: false }
    });
    const tahunUpdate = await prismaClient.tahun_Akademik.update({
      where: { id: existingTahun.id },
      data: { is_active: true }
    });
    console.log('✅ Berhasil mengaktifkan Tahun Akademik:', tahunUpdate.nama_tahun);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
