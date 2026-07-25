import "dotenv/config";
import amqp from "amqplib";
import ExcelJS from "exceljs";
import fs from "fs";
import { prismaClient } from "../application/database.js";

const formatKelas = (kelasInput) => {
  if (!kelasInput) return kelasInput;

  const regex = /^([1-6]|I{1,3}|IV|V|VI)[\s-]*([a-zA-Z])$/i;

  const match = kelasInput.match(regex);

  if (match) {
    const angkaRomawi = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
    };
    const romawi = angkaRomawi[match[1]] || match[1].toUpperCase();

    const huruf = match[2].toUpperCase();

    return `${romawi}-${huruf}`;
  }

  return kelasInput.toUpperCase();
};

const startWorker = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "import_siswa_queue";

    await channel.assertQueue(queueName, { durable: true });

    channel.prefetch(1);
    console.log("Please wait, file is in process");

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const task = JSON.parse(msg.content.toString());
        console.log(`\n Start processing file : ${task.filePath}`);

        try {
          const tahunAkademik = await prismaClient.tahun_Akademik.findFirst({
            where: {
              is_active: true,
            },
          });

          if (!tahunAkademik) {
            throw new Error("Tahun akademik tidak ditemukkan");
          }

          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(task.filePath);

          const worksheet = workbook.getWorksheet(1);

          let barisPertama = 1;
          const dataSiswa = [];
          const dataRiwayat = [];

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const siswa = {
                nis: row.getCell(1).value?.toString(),
                nama: row.getCell(2).value?.toString(),
                jenis_kelamin:
                  row.getCell(3).value?.toString() === "L"
                    ? "LAKI_LAKI"
                    : "PEREMPUAN",
                tanggal_lahir: new Date(row.getCell(4).value),
                alamat: row.getCell(5).value?.toString(),
                nama_wali: row.getCell(6).value?.toString(),
                no_telp: row.getCell(7).value?.toString(),
                profile_photo: row.getCell(9).value?.toString(),
              };

              const kelas = formatKelas(row.getCell(8).value?.toString());

              if (siswa.nis && siswa.nama) {
                dataSiswa.push(siswa);

                dataRiwayat.push({
                  nis_siswa: siswa.nis,
                  tahun_id: tahunAkademik.id,
                  nama_kelas: kelas,
                  status: "AKTIF",
                });
              }
            }
          });

          if (dataSiswa.length > 0) {
            await prismaClient.siswa.createMany({
              data: dataSiswa,
              skipDuplicates: true,
            });

            await prismaClient.riwayat_Kelas.createMany({
              data: dataRiwayat,
              skipDuplicates: true,
            });
          }
        } catch (error) {
          console.error(`Gagal proses file ${task.filePath}:`, error);
        } finally {
          if (fs.existsSync(task.filePath)) {
            fs.unlinkSync(task.filePath);
          }
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error("Koneksi Worker ke RabbitMQ gagal : ", error);
  }
};

startWorker();
