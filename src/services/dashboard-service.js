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
    last_backup: new Date().toLocaleDateString("id-ID"),
    status: "Normal",
  };

  const recentSiswa = await prismaClient.siswa.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { nis: true, nama: true }
  });
  const recentUjian = await prismaClient.pengajuan_Ujian.findMany({
    orderBy: { id: "desc" },
    take: 2,
    include: { siswa: { select: { nama: true } } }
  });

  const logs = [];
  recentSiswa.forEach((s) => {
    logs.push({
      id: `s_${s.nis}`,
      type: "info",
      message: `Siswa baru ditambahkan: ${s.nama}`,
      time: "Baru saja"
    });
  });
  recentUjian.forEach((u) => {
    logs.push({
      id: `u_${u.id}`,
      type: "success",
      message: `Pengajuan ujian baru untuk: ${u.siswa?.nama || "Siswa"}`,
      time: "Baru saja"
    });
  });
  const systemLogs = logs.length > 0 ? logs.slice(0, 5) : [
    { id: 1, type: "info", message: "Sistem aktif dan berjalan normal", time: "08.00" }
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

  const allHalaqohId = allHalaqoh.map((h) => h.id);

  const siap_ujian = await prismaClient.pengajuan_Ujian.count({
    where: {
      siswa: {
        OR: [
          { halaqoh_tahsin_id: { in: allHalaqohId } },
          { halaqoh_tahfidz_id: { in: allHalaqohId } }
        ]
      }
    }
  });

  const perlu_evaluasi = await prismaClient.setoran_Tahsin.count({
    where: {
      id_kelompok: { in: allHalaqohId },
      status_kelanjutan: "MENGULANG"
    }
  });

  const progressAlert = {
    siap_ujian: siap_ujian,
    perlu_evaluasi: perlu_evaluasi,
  };

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
  const siswaStagnanCount = await prismaClient.setoran_Tahsin.count({
    where: { status_kelanjutan: "MENGULANG" }
  });
  const alerts = {
    menunggu_persetujuan: pendingUjian,
    siswa_stagnan: siswaStagnanCount,
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
