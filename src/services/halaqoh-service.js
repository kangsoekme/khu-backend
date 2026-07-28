import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  editHalaqohValidation,
  halaqohValidation,
} from "../validation/halaqoh-validation.js";
import { validate } from "../validation/validation.js";

const addHalaqoh = async (request) => {
  const halaqoh = validate(halaqohValidation, request);

  const guru = await prismaClient.user.findUnique({
    where: { id: halaqoh.userId },
  });

  if (!guru) {
    throw new ResponseError(404, "Data user tidak ditemukan");
  }

  if (guru.role !== "GURU") {
    throw new ResponseError(400, "User bukan Muhassin / Muhaffidz");
  }

  return prismaClient.halaqoh.create({
    data: {
      nama: halaqoh.nama,
      kategori: halaqoh.kategori,
      user: { connect: { id: halaqoh.userId } },
      ...(halaqoh.kategori === "TAHSIN"
        ? {
            siswaTahsin: {
              connect: halaqoh.nis_siswa.map((nis) => ({ nis: nis })),
            },
          }
        : {
            siswaTahfidz: {
              connect: halaqoh.nis_siswa.map((nis) => ({ nis: nis })),
            },
          }),
    },
    include: {
      user: {
        select: {
          id: true,
          nama: true,
          no_telp: true,
        },
      },
      siswaTahsin:
        halaqoh.kategori === "TAHSIN"
          ? {
              select: {
                nis: true,
                nama: true,
                tahapan_tahsin: true,

                riwayatKelas: {
                  where: { status: "AKTIF" },
                  select: { nama_kelas: true },
                },

                alamat: true,
                no_telp: true,
                setoranTahsin: {
                  orderBy: { timestamp: "desc" },
                  take: 1,
                  include: { surah: true },
                },
                ujianPretest: {
                  orderBy: { id: "desc" },
                  take: 1,
                  select: {
                    tahapan: true,
                    keterangan: true,
                  },
                },
              },
            }
          : false,
      siswaTahfidz:
        halaqoh.kategori === "TAHFIDZ"
          ? {
              select: {
                nis: true,
                nama: true,

                riwayatKelas: {
                  where: { status: "AKTIF" },
                  select: { nama_kelas: true },
                },

                alamat: true,
                no_telp: true,
              },
            }
          : false,
    },
  });
};

const getAllHalaqoh = async () => {
  return prismaClient.halaqoh.findMany({
    include: {
      user: {
        select: { id: true, nama: true, no_telp: true },
      },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,
          tahapan_tahsin: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
          setoranTahsin: {
            orderBy: { timestamp: "desc" },
            take: 1,
            include: { surah: true },
          },
          ujianPretest: {
            orderBy: { id: "desc" },
            take: 1,
            select: {
              tahapan: true,
              keterangan: true,
            },
          },
        },
      },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
    },
  });
};

const getHalaqoh = async (halaqohId) => {
  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: { id: halaqohId },
    include: {
      user: {
        select: { id: true, nama: true, no_telp: true },
      },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,
          tahapan_tahsin: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
          setoranTahsin: {
            orderBy: { timestamp: "desc" },
            take: 1,
            include: { surah: true },
          },
          ujianPretest: {
            orderBy: { id: "desc" },
            take: 1,
            select: {
              tahapan: true,
              keterangan: true,
            },
          },
        },
      },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
          setoranHafalan: {
            orderBy: { timestamp: "desc" },
            take: 1,
            include: { surah: true },
          },
        },
      },
    },
  });

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh tidak ditemukan");
  }

  return halaqoh;
};

const editHalaqoh = async (halaqohId, request) => {
  const halaqoh = validate(editHalaqohValidation, request);

  const exitingHalaqoh = await prismaClient.halaqoh.findUnique({
    where: {
      id: halaqohId,
    },
  });

  if (!exitingHalaqoh) {
    throw new ResponseError(404, "Halaqoh not found");
  }

  const guru = await prismaClient.user.findUnique({
    where: { id: halaqoh.userId },
  });

  if (!guru) {
    throw new ResponseError(404, "Data user tidak ditemukan");
  }

  if (guru.role !== "GURU") {
    throw new ResponseError(400, "User bukan Muhassin / Muhaffidz");
  }

  return prismaClient.halaqoh.update({
    where: { id: halaqohId },
    data: {
      nama: halaqoh.nama,
      kategori: halaqoh.kategori,
      user: { connect: { id: halaqoh.userId } },
      siswaTahsin: {
        set:
          halaqoh.kategori === "TAHSIN"
            ? halaqoh.nis_siswa.map((nis) => ({ nis: nis }))
            : [],
      },
      siswaTahfidz: {
        set:
          halaqoh.kategori === "TAHFIDZ"
            ? halaqoh.nis_siswa.map((nis) => ({ nis: nis }))
            : [],
      },
    },
    include: {
      user: {
        select: { id: true, nama: true, no_telp: true },
      },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,
          tahapan_tahsin: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
          setoranTahsin: {
            orderBy: { timestamp: "desc" },
            take: 1,
            include: { surah: true },
          },
          ujianPretest: {
            orderBy: { id: "desc" },
            take: 1,
            select: {
              tahapan: true,
              keterangan: true,
            },
          },
        },
      },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
    },
  });
};

const deleteHalaqoh = async (halaqohId) => {
  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: {
      id: halaqohId,
    },
  });

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh not found");
  }

  return prismaClient.halaqoh.delete({
    where: {
      id: halaqohId,
    },
  });
};

const autoGenerateHalaqoh = async (kategori, targetSize = 11) => {
  // 1. Ambil semua siswa yang belum punya halaqoh di kategori tersebut
  const waitingStudents = await prismaClient.siswa.findMany({
    where:
      kategori === "TAHSIN"
        ? { halaqoh_tahsin_id: null }
        : { halaqoh_tahfidz_id: null },
    include: {
      ujianPretest: { orderBy: { id: "desc" }, take: 1 },
      setoranTahsin: { orderBy: { timestamp: "desc" }, take: 1 },
      setoranHafalan: { orderBy: { timestamp: "desc" }, take: 1 },
    },
  });

  if (waitingStudents.length === 0) {
    throw new ResponseError(400, "Tidak ada siswa yang menunggu kelompok");
  }

  // 💡 KRITERIA 2: Untuk TAHSIN, filter hanya siswa yang SUDAH PRETEST atau sudah ada progress setoran/tahapan
  let validStudents = waitingStudents;
  if (kategori === "TAHSIN") {
    validStudents = waitingStudents.filter(
      (s) =>
        (s.ujianPretest && s.ujianPretest.length > 0) ||
        (s.setoranTahsin && s.setoranTahsin.length > 0) ||
        s.tahapan_tahsin !== null,
    );
  }

  if (validStudents.length === 0) {
    throw new ResponseError(
      400,
      kategori === "TAHSIN"
        ? "Tidak ada siswa yang siap (Siswa untuk Tahsin wajib sudah melakukan Ujian Pretest atau memiliki riwayat Tahsin)."
        : "Tidak ada siswa yang menunggu kelompok Tahfidz.",
    );
  }

  // 💡 KRITERIA 1: Ambil guru GURU dan filter yang BELUM memegang halaqoh di kategori ini (1 Guru Max 1 Tahsin & 1 Tahfidz)
  const guruList = await prismaClient.user.findMany({
    where: { role: "GURU" },
    include: { halaqoh: true }, // Sertakan halaqoh yang sudah diajar
  });

  const availableGuru = guruList.filter((g) => {
    // Cek apakah guru ini sudah mengajar kategori yang sedang dibentuk
    const hasCurrentKategori = g.halaqoh.some((h) => h.kategori === kategori);
    return !hasCurrentKategori;
  });

  if (availableGuru.length === 0) {
    throw new ResponseError(
      400,
      `Semua guru sudah memegang maksimal 1 halaqoh ${kategori}. Tidak ada guru yang tersisa.`,
    );
  }

  // Urutkan guru yang tersedia: untuk TAHSIN, utamakan yang bersertifikasi (is_sertifikasi === true)
  const prioritizedGuru = [...availableGuru].sort((a, b) => {
    if (kategori === "TAHSIN") {
      const certA = a.is_sertifikasi === true ? 1 : 0;
      const certB = b.is_sertifikasi === true ? 1 : 0;
      return certB - certA;
    }
    return 0;
  });

  // 💡 KRITERIA 4: Kelompokkan siswa berdasarkan Jilid/Tahapan terlebih dahulu agar dalam 1 kelompok kemampuannya setara
  const grouped = validStudents.reduce((acc, s) => {
    let key = "Kelompok Umum";
    if (kategori === "TAHSIN") {
      key =
        s.setoranTahsin[0]?.tahapan ||
        s.ujianPretest[0]?.tahapan ||
        s.tahapan_tahsin ||
        "Ummi 1";
    } else {
      key = s.setoranHafalan[0]?.no_surah
        ? `Juz 30 (Surah ${s.setoranHafalan[0].no_surah})`
        : "Tahfidz";
    }
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  // 💡 KRITERIA 3: Cek jumlah halaqoh yang sudah ada di database untuk melacak nomor kelas berikutnya
  const existingCount = await prismaClient.halaqoh.count({
    where: { kategori: kategori },
  });
  let kelasCounter = existingCount + 1;
  const prefix = kategori === "TAHSIN" ? "Ummi" : "Tahfidz";

  // Pecah menjadi kelompok ukuran 8-13
  const halaqohToCreate = [];
  let guruIdx = 0;

  Object.entries(grouped).forEach(([groupName, students]) => {
    let i = 0;
    while (i < students.length) {
      let size = targetSize;
      const sisa = students.length - (i + size);
      if (sisa > 0 && sisa < 8) size += Math.floor(sisa / 2); // Hindari kelompok terlalu kecil (< 8)

      const chunk = students.slice(i, i + size);
      const assignedGuru = prioritizedGuru[guruIdx % prioritizedGuru.length];
      guruIdx++;

      // 💡 Penamaan baku: "Ummi - Kelas 1", "Ummi - Kelas 2" dst
      const namaHalaqoh = `${prefix} - Kelas ${kelasCounter++}`;

      halaqohToCreate.push({
        nama: namaHalaqoh,
        kategori: kategori,
        userId: assignedGuru.id,
        nisList: chunk.map((s) => s.nis),
      });

      i += size;
    }
  });

  // Validasi akhir kuota guru: pastikan jumlah kelompok tidak melebihi guru yang tersedia
  if (halaqohToCreate.length > prioritizedGuru.length) {
    throw new ResponseError(
      400,
      `Jumlah guru yang tersedia (${prioritizedGuru.length} guru) tidak mencukupi untuk memegang ${halaqohToCreate.length} kelompok ${kategori} baru. (Aturan: 1 guru maksimal 1 halaqoh ${kategori}).`,
    );
  }

  // 5. Simpan secara atomik dengan Prisma Transaction
  return prismaClient.$transaction(async (tx) => {
    const createdCount = [];
    for (const item of halaqohToCreate) {
      const newHalaqoh = await tx.halaqoh.create({
        data: {
          nama: item.nama,
          kategori: item.kategori,
          userId: item.userId,
          [kategori === "TAHSIN" ? "siswaTahsin" : "siswaTahfidz"]: {
            connect: item.nisList.map((nis) => ({ nis })),
          },
        },
      });
      createdCount.push(newHalaqoh);
    }
    return createdCount;
  });
};

export default {
  addHalaqoh,
  getAllHalaqoh,
  getHalaqoh,
  editHalaqoh,
  deleteHalaqoh,
  autoGenerateHalaqoh,
};
