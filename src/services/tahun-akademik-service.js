import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createTahunAkademikValidation,
  transisiSemesterValidation,
} from "../validation/tahun-akademik-validation.js";

const getAllTahunAkademik = async () => {
  return await prismaClient.tahun_Akademik.findMany({
    orderBy: { nama_tahun: "desc" },
  });
};

const getActiveTahunAkademik = async () => {
  const active = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true },
  });
  if (!active) {
    throw new ResponseError(404, "Tidak ada tahun akademik yang aktif");
  }
  return active;
};

const createTahunAkademik = async (request) => {
  const data = validate(createTahunAkademikValidation, request);

  const existing = await prismaClient.tahun_Akademik.findFirst({
    where: { nama_tahun: data.nama_tahun },
  });

  if (existing) {
    throw new ResponseError(
      400,
      "Tahun akademik dengan nama tersebut sudah ada",
    );
  }

  return await prismaClient.tahun_Akademik.create({
    data: {
      nama_tahun: data.nama_tahun,
      is_active: data.is_active || false,
    },
  });
};

const incrementClass = (className) => {
  const parts = className.split('-');
  if (parts.length !== 2) return className; 
  
  const grade = parts[0];
  const section = parts[1];
  const romanMap = {
    "I": "II", "II": "III", "III": "IV", "IV": "V", "V": "VI", "VI": "LULUS",
    "1": "2", "2": "3", "3": "4", "4": "5", "5": "6", "6": "LULUS"
  };
  
  const nextGrade = romanMap[grade.toUpperCase()];
  if (!nextGrade) return className;
  if (nextGrade === "LULUS") return "LULUS";
  
  return `${nextGrade}-${section}`;
};

const transisiSemester = async (request) => {
  const { tahun_tujuan_id } = validate(transisiSemesterValidation, request);

  const tahunTujuan = await prismaClient.tahun_Akademik.findUnique({
    where: { id: tahun_tujuan_id },
  });

  if (!tahunTujuan) {
    throw new ResponseError(404, "Tahun akademik tujuan tidak ditemukan");
  }

  const activeTahun = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true }
  });

  const isNewAcademicYear = activeTahun && (activeTahun.nama_tahun.split(' ')[0] !== tahunTujuan.nama_tahun.split(' ')[0]);

  // Lakukan seluruh transisi secara aman dalam Prisma Transaction
  return await prismaClient.$transaction(async (tx) => {
    // 1. Nonaktifkan semua tahun akademik, lalu aktifkan tahun tujuan
    await tx.tahun_Akademik.updateMany({
      data: { is_active: false },
    });
    const updatedTahun = await tx.tahun_Akademik.update({
      where: { id: tahun_tujuan_id },
      data: { is_active: true },
    });

    // 2. Ambil seluruh riwayat kelas siswa yang saat ini berstatus "AKTIF"
    const riwayatAktif = await tx.riwayat_Kelas.findMany({
      where: { status: "AKTIF" },
    });

    // 3. Ubah status riwayat lama menjadi "SELESAI"
    await tx.riwayat_Kelas.updateMany({
      where: { status: "AKTIF" },
      data: { status: "SELESAI" },
    });

    // 4. Buatkan riwayat kelas baru untuk semester/tahun baru
    const droppedNisList = [];
    if (riwayatAktif.length > 0) {
      const dataRiwayatBaru = riwayatAktif.map((r) => {
        let newClassName = r.nama_kelas;
        if (isNewAcademicYear) {
           newClassName = incrementClass(r.nama_kelas);
        }
        
        if (newClassName === "LULUS") {
          droppedNisList.push(r.nis_siswa);
          return null;
        }

        return {
          nis_siswa: r.nis_siswa,
          tahun_id: tahun_tujuan_id,
          nama_kelas: newClassName,
          status: "AKTIF",
        };
      }).filter(Boolean); // Hapus elemen null (siswa LULUS)

      if (dataRiwayatBaru.length > 0) {
        await tx.riwayat_Kelas.createMany({
          data: dataRiwayatBaru,
          skipDuplicates: true,
        });
      }
    }

    // 4.5. Hapus permanen (drop) siswa kelas 6
    if (droppedNisList.length > 0) {
      await tx.siswa.deleteMany({
        where: {
          nis: { in: droppedNisList }
        }
      });
    }

    // 5. Reset halaqoh siswa menjadi null agar siap di-plotting ulang
    await tx.siswa.updateMany({
      data: {
        halaqoh_tahsin_id: null,
        halaqoh_tahfidz_id: null,
      },
    });

    await tx.halaqoh.deleteMany();

    return {
      message: "Transisi semester berhasil dilakukan",
      tahun_aktif_baru: updatedTahun.nama_tahun,
      total_siswa_ditransisikan: riwayatAktif.length,
      is_kenaikan_kelas: !!isNewAcademicYear
    };
  });
};

const activateTahunAkademik = async (id) => {
  const tahunAkademik = await prismaClient.tahun_Akademik.findUnique({
    where: { id: parseInt(id) }
  });

  if (!tahunAkademik) {
    throw new ResponseError(404, "Tahun akademik tidak ditemukan");
  }

  return await prismaClient.$transaction(async (tx) => {
    await tx.tahun_Akademik.updateMany({
      data: { is_active: false },
    });
    return await tx.tahun_Akademik.update({
      where: { id: parseInt(id) },
      data: { is_active: true },
    });
  });
};

export default {
  getAllTahunAkademik,
  getActiveTahunAkademik,
  createTahunAkademik,
  transisiSemester,
  activateTahunAkademik,
};
