import { prismaClient } from "./src/application/database.js";

async function test() {
  const siswaList = await prismaClient.siswa.findMany({
    include: {
      riwayatKelas: { where: { status: "AKTIF" } },
      ujianPretest: { orderBy: { id: "desc" }, take: 1 },
    }
  });

  const classCounts = {};
  const tahapanCounts = {};

  for (const s of siswaList) {
    const k = s.riwayatKelas?.[0]?.nama_kelas || "NONE";
    classCounts[k] = (classCounts[k] || 0) + 1;

    const currentTahap = String(
      s.tahapan_tahsin ||
      s.ujianPretest?.[0]?.tahapan ||
      ""
    ).toUpperCase();
    tahapanCounts[currentTahap] = (tahapanCounts[currentTahap] || 0) + 1;
  }

  console.log("Classes found:");
  console.log(classCounts);
  console.log("\nTahapan found:");
  console.log(tahapanCounts);
}

test()
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
