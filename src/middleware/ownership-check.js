import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

/**
 * Helper untuk pemeriksaan kepemilikan (ownership check) pada operasi assessment.
 *
 * Bug yang diperbaiki: GURU-1 — seorang guru dapat melakukan POST/PUT/DELETE
 * catatan penilaian pada halaqoh milik guru lain karena tidak ada verifikasi
 * bahwa halaqoh.userId === req.user.id.
 *
 * Catatan: SUPER_ADMIN dan DIREKTUR diizinkan melakukan semua operasi lintas-halaqoh
 * (mereka adalah pengawas). Hanya GURU yang dibatasi pada halaqoh miliknya.
 */

/**
 * Verifikasi bahwa seorang GURU memiliki akses ke halaqoh tertentu.
 * Super Admin & Direktur selalu diizinkan.
 *
 * @param {object} user      req.user (dari verifyToken)
 * @param {string} halaqohId ID halaqoh yang akan diakses
 * @throws {ResponseError} 403 jika guru bukan pemilik halaqoh
 */
const assertGuruOwnsHalaqoh = async (user, halaqohId) => {
  if (!halaqohId) return;
  // Super Admin & Direktur diizinkan lintas-halaqoh
  if (user.role === "SUPER_ADMIN" || user.role === "DIREKTUR") return;

  if (user.role === "GURU") {
    const halaqoh = await prismaClient.halaqoh.findUnique({
      where: { id: halaqohId },
      select: { userId: true },
    });
    if (!halaqoh) {
      throw new ResponseError(404, "Halaqoh tidak ditemukan");
    }
    if (halaqoh.userId !== user.id) {
      throw new ResponseError(
        403,
        "Akses ditolak: Anda bukan guru pemilik halaqoh ini",
      );
    }
  }
};

/**
 * Verifikasi bahwa seorang GURU memiliki akses ke siswa tertentu.
 * Siswa dianggap milik guru jika siswa terdaftar di salah satu halaqoh milik guru
 * (baik halaqoh tahsin maupun tahfidz).
 * Super Admin & Direktur selalu diizinkan.
 *
 * @param {object} user req.user (dari verifyToken)
 * @param {string} nis  NIS siswa yang akan diakses
 * @throws {ResponseError} 403 jika guru tidak mengajar siswa tersebut
 */
const assertGuruOwnsSiswa = async (user, nis) => {
  if (user.role === "SUPER_ADMIN" || user.role === "DIREKTUR") return;

  if (user.role === "GURU") {
    // Ambil semua halaqoh milik guru
    const halaqohMilikGuru = await prismaClient.halaqoh.findMany({
      where: { userId: user.id },
      select: { id: true },
    });
    const idHalaqohGuru = halaqohMilikGuru.map((h) => h.id);

    if (idHalaqohGuru.length === 0) {
      throw new ResponseError(
        403,
        "Akses ditolak: Anda belum memiliki halaqoh",
      );
    }

    // Cek apakah siswa terdaftar di salah satu halaqoh milik guru
    const siswa = await prismaClient.siswa.findUnique({
      where: { nis },
      select: { halaqoh_tahsin_id: true, halaqoh_tahfidz_id: true },
    });

    if (!siswa) {
      throw new ResponseError(404, "Data siswa tidak ditemukan");
    }

    const milikTahsin =
      siswa.halaqoh_tahsin_id &&
      idHalaqohGuru.includes(siswa.halaqoh_tahsin_id);
    const milikTahfidz =
      siswa.halaqoh_tahfidz_id &&
      idHalaqohGuru.includes(siswa.halaqoh_tahfidz_id);

    if (!milikTahsin && !milikTahfidz) {
      throw new ResponseError(
        403,
        "Akses ditolak: Siswa ini bukan anggota halaqoh Anda",
      );
    }
  }
};

/**
 * Verifikasi bahwa seorang GURU memiliki akses ke sebuah setoran (untuk edit/delete).
 * Setoran dianggap milik guru jika halaqoh setoran === halaqoh milik guru.
 *
 * @param {object} user        req.user
 * @param {string} setoranId   ID setoran
 * @param {string} tabelSetoran nama model Prisma: "setoran_Hafalan" | "setoran_Murajaah" | "setoran_Tahsin"
 * @param {string} fieldHalaqoh field yang merujuk ke halaqoh ("halaqohId" | "id_kelompok")
 * @throws {ResponseError} 404 jika setoran tidak ada, 403 jika bukan milik guru
 */
const assertGuruOwnsSetoran = async (user, setoranId, tabelSetoran, fieldHalaqoh) => {
  if (user.role === "SUPER_ADMIN" || user.role === "DIREKTUR") return;

  if (user.role === "GURU") {
    const setoran = await prismaClient[tabelSetoran].findUnique({
      where: { id: setoranId },
      select: { [fieldHalaqoh]: true },
    });

    if (!setoran) {
      throw new ResponseError(404, "Data setoran tidak ditemukan");
    }

    const halaqohId = setoran[fieldHalaqoh];
    if (!halaqohId) {
      // Setoran tanpa halaqoh (data lama) — tolak untuk guru demi keamanan
      throw new ResponseError(
        403,
        "Akses ditolak: Setoran ini tidak terikat pada halaqoh mana pun",
      );
    }

    await assertGuruOwnsHalaqoh(user, halaqohId);
  }
};

export default {
  assertGuruOwnsHalaqoh,
  assertGuruOwnsSiswa,
  assertGuruOwnsSetoran,
};
