const fs = require('fs');

// Fix BACKEND (Timezone to Asia/Jakarta)
const backendPath = 'C:/Users/PC_24/Documents/sj/project/BACKEND/src/services/export-service.js';
let content = fs.readFileSync(backendPath, 'utf8');

const wrongTimestampCode = 'tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,';
const correctTimestampCode = 'tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })}`,';

content = content.replace(wrongTimestampCode, correctTimestampCode);

const wrongTimestampCode2 = 'const dateStr = p.timestamp ? new Date(p.timestamp).toLocaleDateString("id-ID") : "-";';
const correctTimestampCode2 = 'const dateStr = p.timestamp ? new Date(p.timestamp).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" }) : "-";';

content = content.replace(wrongTimestampCode2, correctTimestampCode2);

fs.writeFileSync(backendPath, content, 'utf8');

// Fix FRONTEND (Use readable date-time for filenames instead of Unix epoch)
const frontendPath = 'C:/Users/PC_24/Documents/sj/project/FRONT END/src/pages/direktur/LaporanManagement.jsx';
let frontendContent = fs.readFileSync(frontendPath, 'utf8');

// The helper function we will inject to format the date for filenames
const helperFunc = `
const getFilenameTimestamp = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return \`\${d.getFullYear()}-\${pad(d.getMonth()+1)}-\${pad(d.getDate())}_\${pad(d.getHours())}-\${pad(d.getMinutes())}-\${pad(d.getSeconds())}\`;
};
`;

if (!frontendContent.includes('getFilenameTimestamp')) {
  // Inject helper function after imports
  frontendContent = frontendContent.replace(
    'import { BASE_API_URL } from "../../store/baseApi";',
    'import { BASE_API_URL } from "../../store/baseApi";\n' + helperFunc
  );
}

// Replace Date.now() with getFilenameTimestamp()
frontendContent = frontendContent.replace(/Date\.now\(\)/g, 'getFilenameTimestamp()');

fs.writeFileSync(frontendPath, frontendContent, 'utf8');

console.log('Update successful');
