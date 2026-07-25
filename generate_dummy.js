import ExcelJS from "exceljs";
import fs from "fs";

async function generate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Siswa");

  worksheet.addRow([
    "NIS",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Tanggal Lahir",
    "Alamat",
    "Nama Wali",
    "No Telepon",
    "Kelas",
    "Foto Profil"
  ]);

  const firstNames = ["Ahmad", "Budi", "Citra", "Dewi", "Eko", "Faisal", "Gita", "Hadi", "Intan", "Joko", "Kiki", "Lina", "Mira", "Nanda", "Omar", "Putri", "Qori", "Rizky", "Siti", "Tari"];
  const lastNames = ["Saputra", "Wijaya", "Lestari", "Kurniawan", "Hidayat", "Pratama", "Sari", "Nugroho", "Wulandari", "Santoso"];

  for (let i = 1; i <= 20; i++) {
    const nis = `442023${i.toString().padStart(4, "0")}`;
    const nama = `${firstNames[i - 1]} ${lastNames[i % lastNames.length]}`;
    const jk = i % 2 === 0 ? "L" : "P";
    const tgl = "2010-05-15"; 
    const alamat = `Jalan Dummy No. ${i}, Malang`;
    const wali = `Bapak ${lastNames[i % lastNames.length]}`;
    const telp = `0812345678${i.toString().padStart(2, "0")}`;
    const kelas = `${Math.floor((i % 6) + 1)}a`; // Misal 1a, 2a, dll (untuk ngetes auto format Romawi)
    
    worksheet.addRow([nis, nama, jk, tgl, alamat, wali, telp, kelas, ""]);
  }

  await workbook.xlsx.writeFile("/home/kangsoekme/dummy_students.xlsx");
  console.log("File Excel berhasil dibuat di /home/kangsoekme/dummy_students.xlsx");
}

generate();
