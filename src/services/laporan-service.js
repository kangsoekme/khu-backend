import { prismaClient } from "../application/database.js";

const getLaporanTahfidz = async () => {
  const allHalaqoh = await prismaClient.halaqoh.findMany({
    where: { kategori: "TAHFIDZ" },
    include: {
      user: { select: { nama: true } },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,
          setoranHafalan: {
            orderBy: { timestamp: "desc" },
            take: 1,
            select: { predikat: true, rata_rata: true, timestamp: true },
          },
        },
      },
    },
  });

  const rows = [];

  allHalaqoh.forEach((halaqoh) => {
    halaqoh.siswaTahfidz.forEach((siswa) => {
      const setoranTerakhir = siswa.setoranHafalan[0];
      rows.push({
        "Nama Halaqoh": halaqoh.nama,
        Guru: halaqoh.user?.nama || "-",
        NIS: siswa.nis,
        "Nama Siswa": siswa.nama,
        "Predikat Terakhir": setoranTerakhir?.predikat || "Belum Ada",
        "Rata-rata Terakhir": setoranTerakhir?.rata_rata || "-",
        "Tanggal Setoran": setoranTerakhir?.timestamp
          ? new Date(setoranTerakhir.timestamp).toLocaleDateString("id-ID")
          : "Belum Ada",
      });
    });
  });

  return rows;
};

const getLaporanTahsin = async () => {
  const allHalaqoh = await prismaClient.halaqoh.findMany({
    where: { kategori: "TAHSIN" },
    include: {
      user: { select: { nama: true } },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,
          setoranTahsin: {
            orderBy: { timestamp: "desc" },
            take: 1,
            select: { nilai: true, keterangan: true, timestamp: true },
          },
        },
      },
    },
  });

  const rows = [];

  allHalaqoh.forEach((halaqoh) => {
    halaqoh.siswaTahsin.forEach((siswa) => {
      const setoranTerakhir = siswa.setoranTahsin[0];

      rows.push({
        "Nama Halaqoh": halaqoh.nama,
        Guru: halaqoh.user?.nama || "-",
        NIS: siswa.nis,
        "Nama Siswa": siswa.nama,
        "Nilai Terakhir": setoranTerakhir?.nilai || "Belum Ada",
        Keterangan: setoranTerakhir?.keterangan || "-",
        "Tanggal Setoran": setoranTerakhir?.timestamp
          ? new Date(setoranTerakhir.timestamp).toLocaleDateString("id-ID")
          : "Belum Ada",
      });
    });
  });

  return rows;
};

const getLaporanGuruTahfidz = async (userId) => {
  return await prismaClient.halaqoh.findMany({
    where: { kategori: "TAHFIDZ", userId: userId },
    include: {
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,
          riwayatKelas: { select: { nama_kelas: true } },
          setoranHafalan: {
            orderBy: { timestamp: "desc" },
            select: {
              predikat: true,
              rata_rata: true,
              timestamp: true,
              no_surah: true,
              ayat_awal: true,
              ayat_akhir: true,
            },
          },
        },
      },
    },
  });
};

const getLaporanGuruTahsin = async (userId) => {
  return await prismaClient.halaqoh.findMany({
    where: { kategori: "TAHSIN", userId: userId },
    include: {
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,
          riwayatKelas: { select: { nama_kelas: true } },
          setoranTahsin: {
            orderBy: { timestamp: "desc" },
            select: {
              nilai: true,
              keterangan: true,
              timestamp: true,
              tahapan: true,
              jilid: true,
            },
          },
        },
      },
    },
  });
};

export default {
  getLaporanTahfidz,
  getLaporanTahsin,
  getLaporanGuruTahfidz,
  getLaporanGuruTahsin,
};
