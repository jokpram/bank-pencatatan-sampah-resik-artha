# Panduan Deployment ke VPS Ubuntu (Resik Artha)

Dokumen ini menjelaskan langkah-langkah untuk men-deploy aplikasi Resik Artha (Backend Express & Frontend React) ke VPS Ubuntu.

## 1. Persiapan Server
Pastikan VPS Ubuntu Anda telah terinstall:
- Node.js (v20+)
- PostgreSQL
- Nginx
- PM2 (Process Manager)
- Git

### Install Node.js & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Install Nginx
```bash
sudo apt install nginx
```

## 2. Setup Database
Masuk ke PostgreSQL dan buat database.
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE resik_artha;
CREATE USER resik_user WITH ENCRYPTED PASSWORD 'password_aman_anda';
GRANT ALL PRIVILEGES ON DATABASE resik_artha TO resik_user;
\q
```

## 3. Deployment Backend

1. **Clone/Copy Project** ke server (misal di `/var/www/resik-artha`).
2. Masuk ke folder backend:
   ```bash
   cd /var/www/resik-artha/backend
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Setup Environment Variables**:
   Buat file `.env`:
   ```bash
   nano .env
   ```
   Isi sesuai konfigurasi VPS:
   ```env
   PORT=5000
   DB_USER=resik_user
   DB_PASSWORD=password_aman_anda
   DB_NAME=resik_artha
   DB_HOST=127.0.0.1
   DB_PORT=5432
   JWT_SECRET=rahasia_jwt_super_aman
   SESSION_SECRET=rahasia_session_super_aman
   NODE_ENV=production
   CORS_ORIGIN=http://your-domain.com
   ```
5. **Jalankan Seed Data** (PENTING):
   Ini akan membuat database, user default, dan mengisi harga sampah.
   ```bash
   # Jalankan server sebentar untuk sync database (jika belum ada tabel)
   node server.js
   # (Tekan Ctrl+C setelah muncul "Database synced")

   # Jalankan seed harga sampah
   npm run seed:prices
   ```
6. **Jalankan dengan PM2**:
   ```bash
   pm2 start server.js --name "resik-backend"
   pm2 save
   pm2 startup
   ```

## 4. Deployment Frontend

1. Masuk ke folder frontend:
   ```bash
   cd /var/www/resik-artha/frontend
   ```
2. **Setup Environment**:
   Buat file `.env`:
   ```bash
   nano .env
   ```
   Isi URL backend VPS Anda:
   ```env
   VITE_API_BASE_URL=http://your-domain.com/api
   ```
3. **Install & Build**:
   ```bash
   npm install
   npm run build
   ```
   Hasil build akan ada di folder `dist`.

## 5. Konfigurasi Nginx (Reverse Proxy)

Buat konfigurasi server block:
```bash
sudo nano /etc/nginx/sites-available/resik-artha
```

Isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name your-domain.com; # Ganti dengan domain/IP Anda

    # Frontend (Serve Static Files)
    location / {
        root /var/www/resik-artha/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API (Reverse Proxy)
    location /api/ {
        proxy_pass http://localhost:5000; # Sesuai PORT backend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve Uploaded Images
    location /uploads/ {
        alias /var/www/resik-artha/backend/uploads/;
    }
}
```

Aktifkan konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/resik-artha /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Selesai
Aplikasi sekarang dapat diakses melalui domain atau IP VPS Anda.
- Admin Login: admin@resik.com / @Jokopramono1453
