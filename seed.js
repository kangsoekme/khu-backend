import "dotenv/config";
import { prismaClient as prisma } from "./src/application/database.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Memulai inisialisasi data awal (Seeding)...");

  // 1. Enkripsi password menggunakan Bcrypt dengan salt 10
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Buat Akun SUPER_ADMIN (Menggunakan upsert agar tidak error jika dijalankan 2x)
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@mail.com" },
    update: {},
    create: {
      nama: "Super Admin Khoiru Ummah",
      email: "superadmin@mail.com",
      password: hashedPassword,
      no_telp: "081234567890",
      role: "SUPER_ADMIN",
      jenis_kelamin: "LAKI_LAKI",
      is_sertifikasi: true,
    },
  });
  console.log("✅ Berhasil membuat akun Super Admin:", superAdmin.email);

  // 3. Buat Akun DIREKTUR
  const direktur = await prisma.user.upsert({
    where: { email: "direktur@mail.com" },
    update: {},
    create: {
      nama: "Direktur Khoiru Ummah",
      email: "direktur@mail.com",
      password: hashedPassword,
      no_telp: "081234567891",
      role: "DIREKTUR",
      jenis_kelamin: "LAKI_LAKI",
      is_sertifikasi: true,
    },
  });
  console.log("✅ Berhasil membuat akun Direktur:", direktur.email);

  // 4. [PERBAIKAN] Buat Tahun Akademik Aktif Pertama menggunakan kolom 'nama_tahun'
  const tahunAkademik = await prisma.tahun_Akademik.findFirst({
    where: { is_active: true },
  });

  if (!tahunAkademik) {
    const newTahun = await prisma.tahun_Akademik.create({
      data: {
        nama_tahun: "2026/2027 Ganjil", // <--- Disesuaikan 100% dengan schema.prisma!
        is_active: true,
      },
    });
    console.log("✅ Berhasil membuat Tahun Akademik Aktif:", newTahun.nama_tahun);
  } else {
    console.log("ℹ️ Tahun Akademik aktif sudah ada:", tahunAkademik.nama_tahun);
  }

  console.log("🎉 Seeding selesai! Database siap digunakan 100%.");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });