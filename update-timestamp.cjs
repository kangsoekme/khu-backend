const fs = require('fs');

// Fix BACKEND (Revert time addition)
const backendPath = 'C:/Users/PC_24/Documents/sj/project/BACKEND/src/services/export-service.js';
let content = fs.readFileSync(backendPath, 'utf8');

const wrongTimestampCode = 'tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} ${new Date().toLocaleTimeString("id-ID")}`,';
const correctTimestampCode = 'tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,';

content = content.replace(wrongTimestampCode, correctTimestampCode);
fs.writeFileSync(backendPath, content, 'utf8');

// Fix FRONTEND (Use Date.now() for filenames)
const frontendPath = 'C:/Users/PC_24/Documents/sj/project/FRONT END/src/pages/direktur/LaporanManagement.jsx';
let frontendContent = fs.readFileSync(frontendPath, 'utf8');

frontendContent = frontendContent.replace(/new Date\(\)\.toISOString\(\)\.split\("T"\)\[0\]/g, 'Date.now()');

fs.writeFileSync(frontendPath, frontendContent, 'utf8');

console.log('Update successful');
