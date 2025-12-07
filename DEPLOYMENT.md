# 🚀 راهنمای جامع و حرفه‌ای دیپلوی SmartFitHub روی سرور اوبونتو (Production)

این مستند مراحل دقیق راه‌اندازی پروژه **SmartFitHub** را بر روی یک سرور خام (Fresh Ubuntu Server 20.04/22.04/24.04) توضیح می‌دهد. این راهنما شامل پیکربندی امنیتی، دیتابیس، وب‌سرور و مدیریت پروسه‌ها است.

---

## 📋 فهرست مراحل
1. [پیش‌نیازها و دسترسی‌ها](#۱-پیش‌نیازها-و-دسترسی‌ها)
2. [امنیت اولیه سرور و فایروال](#۲-امنیت-اولیه-سرور-و-فایروال)
3. [نصب محیط اجرایی (Node.js, Git, PM2)](#۳-نصب-محیط-اجرایی)
4. [نصب و پیکربندی MySQL](#۴-نصب-و-پیکربندی-mysql)
5. [دریافت پروژه و تنظیمات](#۵-دریافت-پروژه-و-تنظیمات)
6. [راه‌اندازی Backend](#۶-راه‌اندازی-backend)
7. [راه‌اندازی Frontend](#۷-راه‌اندازی-frontend)
8. [پیکربندی حرفه‌ای Nginx](#۸-پیکربندی-حرفه‌ای-nginx)
9. [فعال‌سازی SSL (HTTPS)](#۹-فعال‌سازی-ssl-https)
10. [عیب‌یابی و مانیتورینگ](#۱۰-عیب‌یابی-و-مانیتورینگ)

---

## ۱. پیش‌نیازها و دسترسی‌ها

*   یک سرور مجازی (VPS) با سیستم عامل Ubuntu.
*   دسترسی SSH با کاربر `root` یا کاربری با دسترسی `sudo`.
*   یک دامنه متصل شده به IP سرور (مثلاً `app.nerdznj.ir`).

---

## ۲. امنیت اولیه سرور و فایروال

قبل از نصب نرم‌افزارها، پکیج‌ها را آپدیت کرده و فایروال را فعال کنید.

```bash
# به‌روزرسانی لیست پکیج‌ها و سیستم عامل
sudo apt update && sudo apt upgrade -y

# نصب ابزارهای ضروری
sudo apt install -y curl git build-essential ufw htop unzip

# تنظیم فایروال (UFW)
# اجازه دادن به SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
# فعال‌سازی فایروال
sudo ufw enable
```

---

## ۳. نصب محیط اجرایی

ما از نسخه LTS نود جی‌اس (نسخه 20) استفاده می‌کنیم.

```bash
# افزودن مخزن Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# نصب Node.js
sudo apt install -y nodejs

# نصب PM2 (مدیریت پروسه‌ها) به صورت گلوبال
sudo npm install -g pm2

# بررسی نصب
node -v
npm -v
pm2 -v
```

---

## ۴. نصب و پیکربندی MySQL

```bash
# نصب سرور MySQL
sudo apt install -y mysql-server

# افزایش امنیت نصب (تعیین رمز روت، حذف کاربران ناشناس و ...)
# در این مرحله به سوالات پاسخ Y بدهید و رمز روت را تعیین کنید.
sudo mysql_secure_installation

# ورود به کنسول MySQL
sudo mysql -u root -p

# --- داخل محیط SQL دستورات زیر را خط به خط اجرا کنید ---

-- 1. ساخت دیتابیس
CREATE DATABASE IF NOT EXISTS smartfithub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. ساخت کاربر مخصوص پروژه (امنیت بیشتر)
-- رمز عبور داخل پرانتز را با یک رمز قوی جایگزین کنید
CREATE USER 'amin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ATat.13831383';

-- 3. اعطای دسترسی‌ها
GRANT ALL PRIVILEGES ON smartfithub.* TO 'amin'@'localhost';

-- 4. اعمال تغییرات
FLUSH PRIVILEGES;
EXIT;
```

---

## ۵. دریافت پروژه و تنظیمات

```bash
# ایجاد دایرکتوری پروژه‌ها
sudo mkdir -p /var/www/projects
# تغییر مالکیت پوشه به کاربر فعلی (جایگزینی $USER با نام کاربری خودتان)
sudo chown -R $USER:$USER /var/www/projects

cd /var/www/projects

# کلون کردن پروژه
git clone https://github.com/YOUR_GITHUB_ID/smartfithub.git app-nerdznj-ir

cd app-nerdznj-ir
```

---

## ۶. راه‌اندازی Backend

```bash
cd backend

# نصب پکیج‌ها
npm ci

# ساخت فایل تنظیمات محیطی
nano .env
```

**محتویات فایل `.env` (مقادیر را پر کنید):**
```env
PORT=10000
NODE_ENV=production

# Database Config
DB_HOST=localhost
DB_PORT=3306
DB_USER=amin
DB_PASSWORD=ATat.13831383
DB_NAME=smartfithub

# Security Secrets (حتما مقادیر رندوم و طولانی قرار دهید)
JWT_SECRET=Your_Very_Long_Random_Secret_Key_Here_Change_This
REFRESH_TOKEN_SECRET=Your_Another_Secret_Key

# External APIs
API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**بیلد و اجرا:**
```bash
# کامپایل کدهای TypeScript
npm run build

# اجرای مایگریشن‌های دیتابیس (ساخت جداول)
# نکته: در این پروژه از sequelize.sync در کد استفاده شده، اما اگر مایگریشن جدا دارید اجرا کنید.

# اجرای پروژه با PM2
pm2 start dist/server.js --name "smartfithub-backend"

# ذخیره وضعیت PM2 برای اجرا بعد از ریستارت سرور
pm2 save
pm2 startup
```

---

## ۷. راه‌اندازی Frontend

در محیط پروداکشن، ما فرانت‌اسکریپت را "بیلد" می‌کنیم و فایل‌های استاتیک HTML/JS/CSS حاصل را توسط Nginx سرو می‌کنیم (به جای اجرا روی پورت جداگانه). این روش بسیار سریع‌تر و بهینه‌تر است.

```bash
cd ../frontend-react

# نصب پکیج‌ها
npm ci

# تنظیم متغیرهای محیطی برای بیلد
nano .env.production
```

**محتویات `.env.production`:**
```env
VITE_API_URL=https://app.nerdznj.ir/api/v1
```

**بیلد پروژه:**
```bash
# ایجاد پوشه dist نهایی
# این دستور کدهای React را به فایل‌های استاتیک تبدیل می‌کند
npm run build
```

---

## ۸. پیکربندی حرفه‌ای Nginx

در این مرحله Nginx را تنظیم می‌کنیم تا:
1. فایل‌های استاتیک Frontend را نمایش دهد.
2. درخواست‌های API را به Backend (پورت 10000) هدایت کند (Reverse Proxy).

```bash
# نصب Nginx (اگر نصب نیست)
sudo apt install -y nginx

# ایجاد فایل کانفیگ سایت
sudo nano /etc/nginx/sites-available/smartfithub
```

**محتویات فایل کانفیگ (کد زیر را دقیق کپی کنید):**

```nginx
server {
    listen 80;
    server_name app.nerdznj.ir;

    # مسیر فایل‌های بیلد شده فرانت‌اند
    root /var/www/projects/app-nerdznj-ir/frontend-react/dist;
    index index.html;

    # تنظیمات لاگ
    access_log /var/log/nginx/smartfithub_access.log;
    error_log /var/log/nginx/smartfithub_error.log;

    # تنظیمات Gzip برای افزایش سرعت
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend Routing
    # تمام درخواست‌ها را به index.html می‌فرستد تا React Router مدیریت کند
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://127.0.0.1:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # افزایش حجم آپلود (برای عکس پروفایل)
        client_max_body_size 10M;
    }

    # Caching Static Files (Optional)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

**فعال‌سازی:**
```bash
# ایجاد لینک سمبولیک
sudo ln -s /etc/nginx/sites-available/smartfithub /etc/nginx/sites-enabled/

# حذف کانفیگ پیش‌فرض (اختیاری)
sudo rm /etc/nginx/sites-enabled/default

# تست تنظیمات
sudo nginx -t

# ریستارت سرویس
sudo systemctl restart nginx
```

---

## ۹. فعال‌سازی SSL (HTTPS)

استفاده از Certbot برای دریافت گواهی رایگان Let's Encrypt.

```bash
# نصب Certbot
sudo apt install -y certbot python3-certbot-nginx

# دریافت گواهی (ایمیل معتبر وارد کنید)
sudo certbot --nginx -d app.nerdznj.ir
```
*   گزینه Redirect HTTP to HTTPS را انتخاب کنید.

---

## ۱۰. عیب‌یابی و مانیتورینگ

**دستورات مفید:**

*   **مشاهده لاگ‌های زنده Backend:**
    ```bash
    pm2 logs smartfithub-backend
    ```
*   **مشاهده وضعیت سرویس‌ها:**
    ```bash
    pm2 status
    sudo systemctl status nginx
    ```
*   **مشاهده لاگ‌های خطای Nginx:**
    ```bash
    sudo tail -f /var/log/nginx/smartfithub_error.log
    ```
*   **آپدیت پروژه:**
    ```bash
    cd /var/www/projects/app-nerdznj-ir
    git pull
    
    # آپدیت بک‌اند
    cd backend
    npm install
    npm run build
    pm2 restart smartfithub-backend
    
    # آپدیت فرانت‌اند
    cd ../frontend-react
    npm install
    npm run build
    # نیازی به ریستارت Nginx نیست
    ```

---
**Developed with ❤️ by NerdzNJ Team**
