# Menggunakan image Node.js yang ringan
FROM node:20-alpine

# Prisma di Alpine butuh openssl untuk generate client.
RUN apk add --no-cache openssl

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Menginstal dependensi (termasuk prisma client)
RUN npm install --network-timeout=1000000

# Menyalin folder prisma (schema) untuk digenerate
COPY prisma ./prisma/

# Meng-generate Prisma Client
RUN npx prisma generate

# Menyalin seluruh kode backend
COPY . .

# Render memberi PORT via env (bisa berubah). main.js sudah handle
# process.env.PORT || 5000, jadi EXPOSE hanya dokumentatif.
EXPOSE 5000

# Saat container start: push schema ke DB (buat tabel) lalu jalankan server.
# db push idempoten — aman dijalankan ulang tiap deploy.
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node src/main.js"]
