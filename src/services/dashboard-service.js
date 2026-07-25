import { prismaClient } from "../application/database.js";

const getSuperAdminDashboard = async () => {
  // TOTAL SISWA
  const totalSiswa = await prismaClient.siswa.count();
  const siswaLaki = await prismaClient.siswa.count({
    where: { jenis_kelamin: "LAKI_LAKI" },
  });

  const siswaPerempuan = await prismaClient.siswa.count({
    where: { jenis_kelamin: "PEREMPUAN" },
  });

  //   TOTAL GURU

  const totalGuru = await prismaClient.user.count({ where: { role: "GURU" } });

  const totalHalaqohTahsin = await prismaClient.halaqoh.count({
    where: { kategori: "TAHSIN" },
  });

  const totalHalaqohTahfidz = await prismaClient.halaqoh.count({
    where: { kategori: "TAHFIDZ" },
  });

  //   distribusi role
  const totalSuperAdmin = await prismaClient.user.count({
    where: { role: "SUPER_ADMIN" },
  });
  const totalDirektur = await prismaClient.user.count({
    where: { role: "DIREKTUR" },
  });

  //   analisis perkembangan

  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  //   ambil riwayat tahsin dan tahfidz
  const tahfidzData = await prismaClient.setoran_Hafalan.findMany({
    where: { timestamp: { gte: tujuhHariLalu } },
    select: { timestamp: true },
  });

  const tahsinData = await prismaClient.setoran_Tahsin.findMany({
    where: { timestamp: { gte: tujuhHariLalu } },
    select: { timestamp: true },
  });

  const perkembanganMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(tujuhHariLalu);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    perkembanganMap[dateStr] = {
      month: dateStr,
      tahfidz_quran: 0,
      tahsin_qiraah: 0,
    };
  }

  //   isi kalender dengan jumlah setoran tahfidz tahsin
  tahfidzData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahfidz_quran += 1;
  });

  tahsinData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahsin_qiraah += 1;
  });

  const chart_perkembangan = Object.values(perkembanganMap);

  const systemStatus = {
    last_backup: "Belum pernah",
    status: "Normal",
  }; // dummies

  const systemLogs = [
    {
      id: 1,
      type: "success",
      message: "Sinkronisasi siswa berhasil",
      time: "10.00",
    },
    {
      id: 2,
      type: "error",
      message: "Gagal mengirim notifikasi",
      time: "09.30",
    },
    {
      id: 3,
      type: "info",
      message: "Super Admin Login",
      time: "08.15",
    },
  ];

  return {
    summary: {
      siswa: {
        total: totalSiswa,
        laki_laki: siswaLaki,
        perempuan: siswaPerempuan,
      },
      guru: {
        total: totalGuru,
      },
      halaqoh: {
        tahsin: totalHalaqohTahsin,
        tahfidz: totalHalaqohTahfidz,
      },
    },
    system_status: systemStatus,
    system_logs: systemLogs,
    chart_skema_pengguna: [
      {
        role: "super_admin",
        total: totalSuperAdmin,
        fill: "var(--color-super_admin)",
      },
      {
        role: "direktur",
        total: totalDirektur,
        fill: "var(--color-direktur)",
      },
      {
        role: "guru",
        total: totalGuru,
        fill: "var(--color-guru)",
      },
    ],
    chart_perkembangan: chart_perkembangan,
  };
};

const getGuruDashboard = async (userId) => {
  const allHalaqoh = await prismaClient.halaqoh.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  const detailHalaqoh = await prismaClient.halaqoh.findMany({
    where: { userId: userId },
    select: {
      id: true,
      nama: true,
      kategori: true,
      _count: {
        select: {
          siswaTahsin: true,
          siswaTahfidz: true,
        },
      },
    },
  });

  const agendaHariIni = detailHalaqoh.map((h) => ({
    id: h.id,
    nama: h.nama,
    kategori: h.kategori,
    jumlah_siswa: h._count.siswaTahsin + h._count.siswaTahfidz,
  }));

  const progressAlert = {
    siap_ujian: 2,
    perlu_evaluasi: 1,
  }; // dummies

  const allHalaqohId = allHalaqoh.map((h) => h.id);

  const totalSiswaTahsin = await prismaClient.siswa.count({
    where: { halaqoh_tahsin_id: { in: allHalaqohId } },
  });

  const totalSiswaTahfidz = await prismaClient.siswa.count({
    where: { halaqoh_tahfidz_id: { in: allHalaqohId } },
  });

  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  const tahsinData = await prismaClient.setoran_Tahsin.findMany({
    where: {
      id_kelompok: {
        in: allHalaqohId,
      },
      timestamp: {
        gte: tujuhHariLalu,
      },
    },
  });

  const tahfidzData = await prismaClient.setoran_Hafalan.findMany({
    where: {
      halaqohId: {
        in: allHalaqohId,
      },
      timestamp: {
        gte: tujuhHariLalu,
      },
    },
    select: { timestamp: true },
  });

  const perkembanganMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(tujuhHariLalu);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    perkembanganMap[dateStr] = {
      month: dateStr,
      tahfidz_quran: 0,
      tahsin_qiraah: 0,
    };
  }

  tahfidzData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahfidz_quran += 1;
  });

  tahsinData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahsin_qiraah += 1;
  });

  return {
    summary: {
      total_siswa: totalSiswaTahsin + totalSiswaTahfidz,
      total_halaqoh: allHalaqohId.length,
    },
    agenda_hari_ini: agendaHariIni,
    progress_alert: progressAlert,
    chart_perkembangan: Object.values(perkembanganMap),
  };
};

const getDirekturDashboard = async () => {
  const totalGuru = await prismaClient.user.count({ where: { role: "GURU" } });

  const totalSiswa = await prismaClient.siswa.count();
  const siswaLaki = await prismaClient.siswa.count({
    where: { jenis_kelamin: "LAKI_LAKI" },
  });

  const siswaPerempuan = await prismaClient.siswa.count({
    where: { jenis_kelamin: "PEREMPUAN" },
  });

  const tahfidzGroups = await prismaClient.setoran_Hafalan.groupBy({
    by: ["predikat"],
    _count: { predikat: true },
  });

  const chart_tahfidz = tahfidzGroups.map((g) => ({
    predikat: g.predikat,
    total: g._count.predikat,
    fill: `var(--color-${g.predikat})`,
  }));

  const tahsinGroups = await prismaClient.setoran_Tahsin.groupBy({
    by: ["nilai"],
    _count: { nilai: true },
  });

  const chart_tahsin = tahsinGroups.map((g) => ({
    nilai: g.nilai,
    total: g._count.nilai,
    fill: `var(--color-${g.nilai.replace("+", "_plus").replace("-", "_minus")})`,
  }));

  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  const pendingUjian = await prismaClient.pengajuan_Ujian.count();
  const alerts = {
    menunggu_persetujuan: pendingUjian,
    siswa_stagnan: 3, // dummy
  };

  const halaqohList = await prismaClient.halaqoh.findMany({
    select: {
      nama: true,
      kategori: true,
      user: { select: { nama: true } },
      _count: {
        select: {
          siswaTahfidz: true,
          siswaTahsin: true,
        },
      },
    },
    take: 5,
  });

  const performaHalaqoh = halaqohList.map((h) => ({
    nama_halaqoh: h.nama,
    kategori: h.kategori,
    guru: h.user.nama,
    jumlah_siswa: h._count.siswaTahsin + h._count.siswaTahfidz,
  }));

  const tahfidzData = await prismaClient.setoran_Hafalan.findMany({
    where: { timestamp: { gte: tujuhHariLalu } },
    select: { timestamp: true },
  });

  const tahsinData = await prismaClient.setoran_Tahsin.findMany({
    where: { timestamp: { gte: tujuhHariLalu } },
    select: { timestamp: true },
  });

  const perkembanganMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(tujuhHariLalu);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    perkembanganMap[dateStr] = {
      month: dateStr,
      tahfidz_quran: 0,
      tahsin_qiraah: 0,
    };
  }

  tahfidzData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahfidz_quran += 1;
  });

  tahsinData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahsin_qiraah += 1;
  });

  return {
    summary: {
      siswa: {
        total: totalSiswa,
        laki_laki: siswaLaki,
        perempuan: siswaPerempuan,
      },
      guru: {
        total: totalGuru,
      },
    },
    alerts: alerts,
    performa_halaqoh: performaHalaqoh,
    chart_tahfidz: chart_tahfidz,
    chart_tahsin: chart_tahsin,
    chart_perkembangan: Object.values(perkembanganMap),
  };
};

export default {
  getSuperAdminDashboard,
  getGuruDashboard,
  getDirekturDashboard,
};
