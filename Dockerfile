# Menggunakan image Node.js yang ringan
FROM node:20-alpine

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin folder prisma untuk digenerate
COPY prisma ./prisma/

# Meng-generate Prisma Client
RUN npx prisma generate

# Menyalin seluruh kode backend
COPY . .

# Mengekspos port (Sesuaikan dengan port di aplikasi Anda, biasanya 5000 atau 3000)
EXPOSE 5000

# Menjalankan aplikasi untuk production
# Anda bisa mengubahnya jika ada script build khusus
CMD ["node", "src/main.js"]
