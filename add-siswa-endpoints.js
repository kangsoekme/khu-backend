const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'services', 'siswa-service.js');
let code = fs.readFileSync(file, 'utf8');

const selectBlock = {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,
      riwayatKelas: { where: { status: 'AKTIF' }, select: { nama_kelas: true } },
      profile_photo: true,
      createdAt: true,
      updatedAt: true,
      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,
      tahapan_tahsin: true,
      setoranTahsin: {
        orderBy: { timestamp: 'desc' },
        take: 1,
        select: {
          jilid: true,
          bab: true,
          materi: true,
          no_surah: true,
          ayat_akhir: true,
          tahapan: true,
          surah: { select: { nama_surah: true } }
        }
      },
      setoranHafalan: {
        orderBy: { timestamp: 'desc' },
        take: 1,
        select: {
          no_surah: true,
          ayat_akhir: true,
          surah: { select: { nama_surah: true } }
        }
      },
      ujianPretest: {
        orderBy: { id: 'desc' },
        take: 1,
        select: { tahapan: true, keterangan: true }
      }
    };

const newMethods = \
const getWaitingPretest = async () => {
  const data = await prismaClient.siswa.findMany({
    where: { tahapan_tahsin: null },
    select: \,
    orderBy: { nama: 'asc' },
  });
  return { data };
};

const getWaitingHalaqoh = async (kategori) => {
  let where = {};
  if (kategori === 'TAHSIN') {
    where = {
      halaqoh_tahsin_id: null,
      OR: [
        { ujianPretest: { some: {} } },
        { setoranTahsin: { some: {} } },
        { tahapan_tahsin: { not: null } }
      ]
    };
  } else {
    where = { halaqoh_tahfidz_id: null };
  }

  const data = await prismaClient.siswa.findMany({
    where,
    select: \,
    orderBy: { nama: 'asc' },
  });
  return { data };
};
\;

code = code.replace('export default {', newMethods + '\nexport default {');
code = code.replace('export default {', 'export default {\n  getWaitingPretest,\n  getWaitingHalaqoh,');

fs.writeFileSync(file, code);
console.log('Added endpoints to siswa-service.js');

