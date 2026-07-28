import fs from "fs";
import ExcelJS from "exceljs";

import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  editSiswaValidation,
  siswaValidation,
} from "../validation/siswa-validation.js";
import { validate } from "../validation/validation.js";

const formatKelas = (kelasInput) => {
  if (!kelasInput) return kelasInput;
  const regex = /^([1-6]|I{1,3}|IV|V|VI)[\s-]*([a-zA-Z])$/i;
  const match = kelasInput.match(regex);
  if (match) {
    const angkaRomawi = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI" };
    const romawi = angkaRomawi[match[1]] || match[1].toUpperCase();
    return `${romawi}-${match[2].toUpperCase()}`;
  }
  return kelasInput.toUpperCase();
};

const importSiswaExcelSync = async (filePath) => {
  try {
    const tahunAkademik = await prismaClient.tahun_Akademik.findFirst({
      where: { is_active: true },
    });
    if (!tahunAkademik)
      throw new ResponseError(400, "Tahun akademik aktif tidak ditemukan");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    const dataSiswa = [];
    const dataRiwayat = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const nis = row.getCell(1).value?.toString();
        const nama = row.getCell(2).value?.toString();
        if (nis && nama) {
          dataSiswa.push({
            nis,
            nama,
            jenis_kelamin:
              row.getCell(3).value?.toString() === "L"
                ? "LAKI_LAKI"
                : "PEREMPUAN",
            tanggal_lahir: new Date(row.getCell(4).value || "2010-01-01"),
            alamat: row.getCell(5).value?.toString() || "-",
            nama_wali: row.getCell(6).value?.toString() || "-",
            no_telp: row.getCell(7).value?.toString() || "-",
            profile_photo: row.getCell(9).value?.toString() || null,
          });
          const kelas = formatKelas(row.getCell(8).value?.toString() || "I-A");
          dataRiwayat.push({
            nis_siswa: nis,
            tahun_id: tahunAkademik.id,
            nama_kelas: kelas,
            status: "AKTIF",
          });
        }
      }
    });
    if (dataSiswa.length > 0) {
      await prismaClient.$transaction(async (tx) => {
        await tx.siswa.createMany({ data: dataSiswa, skipDuplicates: true });
        await tx.riwayat_Kelas.createMany({
          data: dataRiwayat,
          skipDuplicates: true,
        });
      });
    }
    return { total_imported: dataSiswa.length };
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Hapus file temporer setelah selesai
  }
};

const addSiswa = async (request) => {
  if (request.kelas) {
    request.kelas = formatKelas(request.kelas);
  }

  const siswa = validate(siswaValidation, request);

  const countSiswa = await prismaClient.siswa.count({
    where: {
      nis: siswa.nis,
    },
  });

  if (countSiswa === 1) {
    throw new ResponseError(400, "Data siswa sudah terdaftar");
  }

  const tahunAkademik = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true },
  });

  if (!tahunAkademik) {
    throw new ResponseError(400, "Tahun akademik belum diatur");
  }

  return prismaClient.siswa.create({
    data: {
      nis: request.nis,
      nama: request.nama,
      jenis_kelamin: request.jenis_kelamin,
      tanggal_lahir: request.tanggal_lahir,
      alamat: request.alamat,
      nama_wali: request.nama_wali,
      no_telp: request.no_telp,
      profile_photo: request.profile_photo,

      riwayatKelas: {
        create: {
          tahun_id: tahunAkademik.id,
          nama_kelas: request.kelas,
          status: "AKTIF",
        },
      },
    },
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,

      tahapan_tahsin: true,
    },
  });
};

const editSiswa = async (nis, request) => {
  if (request.kelas) {
    request.kelas = formatKelas(request.kelas);
  }

  const siswa = validate(editSiswaValidation, request);

  const countSiswa = await prismaClient.siswa.count({
    where: {
      nis: nis,
    },
  });

  if (countSiswa === 0) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  const tahunAkademik = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true },
  });

  if (!tahunAkademik) {
    throw new ResponseError(400, "Tahun akademik belum diatur");
  }

  return prismaClient.siswa.update({
    where: { nis: nis },
    data: {
      nis: request.nis,
      nama: request.nama,
      jenis_kelamin: request.jenis_kelamin,
      tanggal_lahir: request.tanggal_lahir,
      alamat: request.alamat,
      nama_wali: request.nama_wali,
      no_telp: request.no_telp,
      profile_photo: request.profile_photo,

      riwayatKelas: {
        updateMany: {
          where: {
            status: "AKTIF",
          },
          data: {
            nama_kelas: request.kelas,
          },
        },
      },
    },
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,

      tahapan_tahsin: true,
    },
  });
};

const getAllSiswa = async () => {
  return await prismaClient.siswa.findMany({
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,

      tahapan_tahsin: true,

      setoranTahsin: {
        orderBy: { timestamp: "desc" },
        take: 1,
        select: {
          jilid: true,
          bab: true,
          materi: true,
          no_surah: true,
          ayat_akhir: true,
          tahapan: true,
          surah: {
            select: {
              nama_surah: true,
            },
          },
        },
      },
      setoranHafalan: {
        orderBy: { timestamp: "desc" },
        take: 1,
        select: {
          no_surah: true,
          ayat_akhir: true,
          surah: {
            select: {
              nama_surah: true,
            },
          },
        },
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
    orderBy: {
      nama: "asc",
    },
  });
};

const getSiswa = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: {
      nis: nis,
    },
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz: {
        select: { id: true, nama: true },
      },
      halaqoh_tahsin: {
        select: { id: true, nama: true },
      },

      tahapan_tahsin: true,

      setoranTahsin: {
        orderBy: { timestamp: "desc" },
        take: 1,
        select: {
          jilid: true,
          bab: true,
          materi: true,
          no_surah: true,
          ayat_akhir: true,
          tahapan: true,
          surah: {
            select: {
              nama_surah: true,
            },
          },
        },
      },
      setoranHafalan: {
        orderBy: { timestamp: "desc" },
        take: 1,
        select: {
          no_surah: true,
          ayat_akhir: true,
          surah: {
            select: {
              nama_surah: true,
            },
          },
        },
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
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa sudah terdaftar");
  }

  return siswa;
};

const deleteSiswa = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  await prismaClient.setoran_Hafalan.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.setoran_Tahsin.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.setoran_Murajaah.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.ujian_Kenaikan.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.ujian_Pretest.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.pengajuan_Ujian.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.riwayat_Kelas.deleteMany({
    where: { nis_siswa: nis },
  });

  return prismaClient.siswa.delete({
    where: { nis: nis },
  });
};

export default {
  importSiswaExcelSync,
  addSiswa,
  editSiswa,
  getAllSiswa,
  getSiswa,
  deleteSiswa,
};
