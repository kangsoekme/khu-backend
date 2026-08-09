import { prismaClient } from "./src/application/database.js";

async function test() {
  const allSiswa = await prismaClient.siswa.findMany({
    take: 5,
    include: {
      riwayatKelas: {
        where: { status: "AKTIF" },
        include: { tahun_akademik: true },
      },
      setoranTahsin: {
        orderBy: { timestamp: "asc" },
        include: { surah: true }
      }
    }
  });

  for (const siswa of allSiswa) {
    let startYear = new Date().getFullYear();
    if (new Date().getMonth() + 1 < 7) {
      startYear -= 1;
    }
    const namaTahun = siswa?.riwayatKelas?.[0]?.tahun_akademik?.nama_tahun || "";
    const match = namaTahun.match(/(\d{4})/);
    if (match && !isNaN(parseInt(match[1]))) {
      startYear = parseInt(match[1]);
    }
    const academicStartDate = new Date(`${startYear}-07-01T00:00:00.000Z`);

    const filtered = (siswa.setoranTahsin || []).filter(item => {
      if (!item.timestamp) return false;
      return new Date(item.timestamp) >= academicStartDate;
    });

    console.log(`Siswa: ${siswa.nama}`);
    console.log(`- startYear: ${startYear}, academicStartDate: ${academicStartDate}`);
    console.log(`- setoranTahsin total: ${siswa.setoranTahsin.length}`);
    console.log(`- setoranTahsin filtered: ${filtered.length}`);
    if (filtered.length > 0) {
      console.log(`  First filtered timestamp: ${filtered[0].timestamp}`);
    }
  }
}

test()
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
