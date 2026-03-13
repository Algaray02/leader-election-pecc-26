FROM node:24-alpine

WORKDIR /app

# Salin file konfigurasi paket
COPY package.json package-lock.json* ./

# Install dependencies di dalam kontainer
RUN npm install

# Salin semua kode sumber
COPY . .

# Beritahu port yang akan digunakan
EXPOSE 3000

# Jalankan server development
CMD ["npm", "run", "dev"]