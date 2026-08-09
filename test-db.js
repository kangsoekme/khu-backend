import { prismaClient } from './src/application/database.js';

async function run() {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: '20260004' },
    include: {
      riwayatKelas: {
        where: { status: 'AKTIF' },
        include: { tahun_akademik: true },
      },
      setoranTahsin: true
    }
  });
  console.log('Siswa:', siswa.nama);
  console.log('Total setoran:', siswa.setoranTahsin.length);
  if (siswa.setoranTahsin.length > 0) {
    console.log('First setoran date:', siswa.setoranTahsin[0].timestamp);
  }
}
run().catch(console.error).finally(() => prismaClient.$disconnect());
