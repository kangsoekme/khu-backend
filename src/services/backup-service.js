import { prismaClient } from "../application/database.js";

const getDatabaseBackup = async () => {
  const users = await prismaClient.user.findMany();
  const siswa = await prismaClient.siswa.findMany();
  const halaqoh = await prismaClient.halaqoh.findMany();
  const surah = await prismaClient.surah.findMany();
  const bab_jilid = await prismaClient.bab_Jilid.findMany();
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
    data: {
      users,
      siswa,
      halaqoh,
      surah,
      bab_jilid,
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

export default { getDatabaseBackup };
