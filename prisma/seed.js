import "dotenv/config";

import { prismaClient } from "../src/application/database.js";

import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("passwordrahasia", 10);

  const admin = await prismaClient.user.upsert({
    where: { email: "admin@mail.com" },
    update: {},
    create: {
      nama: "Super Admin Testing",
      email: "admin@mail.com",
      no_telp: "08123456789",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Berhasil membuat user admin pertama : ", admin.email);

  const guru = await prismaClient.user.upsert({
    where: { email: "muhassin@mail.com" },
    update: {},
    create: {
      nama: "Muhassin Testing",
      email: "muhassin@mail.com",
      no_telp: "08123456789",
      password: hashedPassword,
      role: "MUHASSIN",
    },
  });
  console.log("Berhasil membuat user guru pertama : ", guru.email);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
