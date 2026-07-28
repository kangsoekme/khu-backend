import { prismaClient } from "../application/database.js";

const getSuperAdminDashboard = async () => {
  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  // Semua query dijalankan paralel dengan Promise.all
  const [
    totalSiswa,
    siswaLaki,
    siswaPerempuan,
    totalGuru,
    totalHalaqohTahsin,
    totalHalaqohTahfidz,
    totalSuperAdmin,
    totalDirektur,
    tahfidzData,
    tahsinData,
    recentSiswa,
    recentUjian,
  ] = await Promise.all([
    prismaClient.siswa.count(),
    prismaClient.siswa.count({ where: { jenis_kelamin: "LAKI_LAKI" } }),
    prismaClient.siswa.count({ where: { jenis_kelamin: "PEREMPUAN" } }),
    prismaClient.user.count({ where: { role: "GURU" } }),
    prismaClient.halaqoh.count({ where: { kategori: "TAHSIN" } }),
    prismaClient.halaqoh.count({ where: { kategori: "TAHFIDZ" } }),
    prismaClient.user.count({ where: { role: "SUPER_ADMIN" } }),
    prismaClient.user.count({ where: { role: "DIREKTUR" } }),
    prismaClient.setoran_Hafalan.findMany({
      where: { timestamp: { gte: tujuhHariLalu } },
      select: { timestamp: true },
    }),
    prismaClient.setoran_Tahsin.findMany({
      where: { timestamp: { gte: tujuhHariLalu } },
      select: { timestamp: true },
    }),
    prismaClient.siswa.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { nis: true, nama: true },
    }),
    prismaClient.pengajuan_Ujian.findMany({
      orderBy: { id: "desc" },
      take: 2,
      include: { siswa: { select: { nama: true } } },
    }),
  ]);

  // Bangun chart perkembangan 7 hari
  const perkembanganMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(tujuhHariLalu);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    perkembanganMap[dateStr] = { month: dateStr, tahfidz_quran: 0, tahsin_qiraah: 0 };
  }
  tahfidzData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahfidz_quran += 1;
  });
  tahsinData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahsin_qiraah += 1;
  });

  const logs = [];
  recentSiswa.forEach((s) => {
    logs.push({ id: `s_${s.nis}`, type: "info", message: `Siswa baru ditambahkan: ${s.nama}`, time: "Baru saja" });
  });
  recentUjian.forEach((u) => {
    logs.push({ id: `u_${u.id}`, type: "success", message: `Pengajuan ujian baru untuk: ${u.siswa?.nama || "Siswa"}`, time: "Baru saja" });
  });
  const systemLogs = logs.length > 0 ? logs.slice(0, 5) : [
    { id: 1, type: "info", message: "Sistem aktif dan berjalan normal", time: "08.00" },
  ];

  return {
    summary: {
      siswa: { total: totalSiswa, laki_laki: siswaLaki, perempuan: siswaPerempuan },
      guru: { total: totalGuru },
      halaqoh: { tahsin: totalHalaqohTahsin, tahfidz: totalHalaqohTahfidz },
    },
    system_status: { status: "Normal" },
    system_logs: systemLogs,
    chart_skema_pengguna: [
      { role: "super_admin", total: totalSuperAdmin, fill: "var(--color-super_admin)" },
      { role: "direktur", total: totalDirektur, fill: "var(--color-direktur)" },
      { role: "guru", total: totalGuru, fill: "var(--color-guru)" },
    ],
    chart_perkembangan: Object.values(perkembanganMap),
  };
};

const getGuruDashboard = async (userId) => {
  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  // Dua query pertama bergantung satu sama lain, lakukan bersamaan
  const [allHalaqoh, detailHalaqoh] = await Promise.all([
    prismaClient.halaqoh.findMany({
      where: { userId },
      select: { id: true },
    }),
    prismaClient.halaqoh.findMany({
      where: { userId },
      select: {
        id: true,
        nama: true,
        kategori: true,
        _count: { select: { siswaTahsin: true, siswaTahfidz: true } },
      },
    }),
  ]);

  const allHalaqohId = allHalaqoh.map((h) => h.id);
  const agendaHariIni = detailHalaqoh.map((h) => ({
    id: h.id,
    nama: h.nama,
    kategori: h.kategori,
    jumlah_siswa: h._count.siswaTahsin + h._count.siswaTahfidz,
  }));

  // Query lanjutan dijalankan paralel setelah dapat allHalaqohId
  const [
    siap_ujian,
    perlu_evaluasi,
    totalSiswaTahsin,
    totalSiswaTahfidz,
    tahsinData,
    tahfidzData,
  ] = await Promise.all([
    prismaClient.pengajuan_Ujian.count({
      where: {
        siswa: {
          OR: [
            { halaqoh_tahsin_id: { in: allHalaqohId } },
            { halaqoh_tahfidz_id: { in: allHalaqohId } },
          ],
        },
      },
    }),
    prismaClient.setoran_Tahsin.count({
      where: { id_kelompok: { in: allHalaqohId }, status_kelanjutan: "MENGULANG" },
    }),
    prismaClient.siswa.count({ where: { halaqoh_tahsin_id: { in: allHalaqohId } } }),
    prismaClient.siswa.count({ where: { halaqoh_tahfidz_id: { in: allHalaqohId } } }),
    prismaClient.setoran_Tahsin.findMany({
      where: { id_kelompok: { in: allHalaqohId }, timestamp: { gte: tujuhHariLalu } },
      select: { timestamp: true },
    }),
    prismaClient.setoran_Hafalan.findMany({
      where: { halaqohId: { in: allHalaqohId }, timestamp: { gte: tujuhHariLalu } },
      select: { timestamp: true },
    }),
  ]);

  const perkembanganMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(tujuhHariLalu);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    perkembanganMap[dateStr] = { month: dateStr, tahfidz_quran: 0, tahsin_qiraah: 0 };
  }
  tahfidzData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahfidz_quran += 1;
  });
  tahsinData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahsin_qiraah += 1;
  });

  return {
    summary: {
      total_siswa: totalSiswaTahsin + totalSiswaTahfidz,
      total_halaqoh: allHalaqohId.length,
    },
    agenda_hari_ini: agendaHariIni,
    progress_alert: { siap_ujian, perlu_evaluasi },
    chart_perkembangan: Object.values(perkembanganMap),
  };
};

const getDirekturDashboard = async () => {
  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  // Semua query dijalankan paralel
  const [
    totalGuru,
    totalSiswa,
    siswaLaki,
    siswaPerempuan,
    tahfidzGroups,
    tahsinGroups,
    pendingUjian,
    siswaStagnanCount,
    halaqohList,
    tahfidzData,
    tahsinData,
  ] = await Promise.all([
    prismaClient.user.count({ where: { role: "GURU" } }),
    prismaClient.siswa.count(),
    prismaClient.siswa.count({ where: { jenis_kelamin: "LAKI_LAKI" } }),
    prismaClient.siswa.count({ where: { jenis_kelamin: "PEREMPUAN" } }),
    prismaClient.setoran_Hafalan.groupBy({ by: ["predikat"], _count: { predikat: true } }),
    prismaClient.setoran_Tahsin.groupBy({ by: ["nilai"], _count: { nilai: true } }),
    prismaClient.pengajuan_Ujian.count(),
    prismaClient.setoran_Tahsin.count({ where: { status_kelanjutan: "MENGULANG" } }),
    prismaClient.halaqoh.findMany({
      select: {
        nama: true,
        kategori: true,
        user: { select: { nama: true } },
        _count: { select: { siswaTahfidz: true, siswaTahsin: true } },
      },
      take: 5,
    }),
    prismaClient.setoran_Hafalan.findMany({
      where: { timestamp: { gte: tujuhHariLalu } },
      select: { timestamp: true },
    }),
    prismaClient.setoran_Tahsin.findMany({
      where: { timestamp: { gte: tujuhHariLalu } },
      select: { timestamp: true },
    }),
  ]);

  const chart_tahfidz = tahfidzGroups.map((g) => ({
    predikat: g.predikat,
    total: g._count.predikat,
    fill: `var(--color-${g.predikat})`,
  }));

  const chart_tahsin = tahsinGroups.map((g) => ({
    nilai: g.nilai,
    total: g._count.nilai,
    fill: `var(--color-${g.nilai.replace("+", "_plus").replace("-", "_minus")})`,
  }));

  const performaHalaqoh = halaqohList.map((h) => ({
    nama_halaqoh: h.nama,
    kategori: h.kategori,
    guru: h.user.nama,
    jumlah_siswa: h._count.siswaTahsin + h._count.siswaTahfidz,
  }));

  const perkembanganMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(tujuhHariLalu);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    perkembanganMap[dateStr] = { month: dateStr, tahfidz_quran: 0, tahsin_qiraah: 0 };
  }
  tahfidzData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahfidz_quran += 1;
  });
  tahsinData.forEach((item) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    if (perkembanganMap[dateStr]) perkembanganMap[dateStr].tahsin_qiraah += 1;
  });

  return {
    summary: {
      siswa: { total: totalSiswa, laki_laki: siswaLaki, perempuan: siswaPerempuan },
      guru: { total: totalGuru },
    },
    alerts: { menunggu_persetujuan: pendingUjian, siswa_stagnan: siswaStagnanCount },
    performa_halaqoh: performaHalaqoh,
    chart_tahfidz,
    chart_tahsin,
    chart_perkembangan: Object.values(perkembanganMap),
  };
};

export default {
  getSuperAdminDashboard,
  getGuruDashboard,
  getDirekturDashboard,
};
