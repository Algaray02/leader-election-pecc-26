FROM node:24-alpine

WORKDIR /app

# 1. Pasang dependencies dulu (biar cepat kalau ada cache)
COPY package*.json ./
RUN npm install

# 2. Salin kodingan kamu
COPY . .

# 3. Jalankan Prisma Generate & Build Next.js
# Kita lakukan ini SAAT BUILD image, bukan saat running container
RUN npx prisma generate
RUN npm run build

# 4. Expose port (biasanya 3000)
EXPOSE 3000

# 5. Jalankan perintah start (Production)
CMD ["npm", "start"]