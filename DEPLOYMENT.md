# 🚀 راهنمای جامع دیپلوی روی سرور خام (Ubuntu)

این راهنما تمام مراحل لازم برای راه‌اندازی پروژه SmartFitHub روی یک سرور اوبونتو جدید را پوشش می‌دهد.

## ۱. آماده‌سازی سرور

ابتدا پکیج‌های سیستم را به‌روزرسانی کرده و ابزارهای ضروری را نصب کنید:

```bash
# به‌روزرسانی سیستم
sudo apt update && sudo apt upgrade -y

# نصب ابزارهای ضروری
sudo apt install -y curl git build-essential nginx
```

## ۲. نصب Node.js

ما از نسخه LTS (نسخه 20) استفاده می‌کنیم:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# بررسی نصب
node -v
npm -v
```

## ۳. نصب و تنظیم دیتابیس MySQL

```bash
# نصب MySQL
sudo apt install -y mysql-server

# ورود به کنسول MySQL
sudo mysql

# دستورات SQL زیر را اجرا کنید (جایگزین کردن رمز عبور دلخواه):
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourSecurePassword';
CREATE DATABASE smartfithub;
CREATE USER 'amin'@'localhost' IDENTIFIED BY 'ATat.13831383';
GRANT ALL PRIVILEGES ON smartfithub.* TO 'amin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## ۴. دریافت پروژه

```bash
# ایجاد دایرکتوری پروژه
sudo mkdir -p /var/www/projects
sudo chown -R $USER:$USER /var/www/projects
cd /var/www/projects

# کلون کردن مخزن (آدرس مخزن خود را جایگزین کنید)
git clone https://github.com/YOUR_USERNAME/smartfithub.git app-nerdznj-ir
cd app-nerdznj-ir
```

## ۵. راه‌اندازی Backend

```bash
cd backend

# نصب وابستگی‌ها
npm install

# ساخت فایل محیطی .env
nano .env
```

محتوای زیر را در `.env` قرار دهید:
```env
PORT=10000
NODE_ENV=production
DB_HOST=localhost
DB_USER=amin
DB_PASSWORD=ATat.13831383
DB_NAME=smartfithub
JWT_SECRET=YourSuperSecretKeyHere_ChangeIt
API_KEY=YOUR_OPENAI_OR_GEMINI_API_KEY
```

```bash
# بیلد کردن پروژه
npm run build

# نصب PM2 برای مدیریت پروسه
sudo npm install -g pm2

# اجرای سرور
pm2 start dist/server.js --name "smartfithub-backend"
pm2 save
pm2 startup
```

## ۶. راه‌اندازی Frontend

```bash
cd ../frontend-react

# نصب وابستگی‌ها
npm install

# ساخت فایل محیطی برای فرانت
nano .env
```

محتوای `.env`:
```env
VITE_API_URL=https://api.app.nerdznj.ir/api/v1
```

```bash
# بیلد کردن پروژه (با نادیده گرفتن خطاهای تایپ‌اسکریپت برای پروداکشن)
npm run build
```

## ۷. تنظیم Nginx (مهم)

فایل تنظیمات Nginx را ایجاد کنید:

```bash
sudo nano /etc/nginx/sites-available/smartfithub
```

محتوای زیر را قرار دهید:

```nginx
server {
    listen 80;
    server_name app.nerdznj.ir www.app.nerdznj.ir;

    # Frontend Static Files
    root /var/www/projects/app-nerdznj-ir/frontend-react/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

فعال‌سازی سایت:
```bash
sudo ln -s /etc/nginx/sites-available/smartfithub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## ۸. امنیت و SSL (اختیاری ولی توصیه شده)

اگر دامنه شما متصل است، برای دریافت HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.nerdznj.ir
```

---
**پروژه آماده استفاده است!**
آدرس: http://app.nerdznj.ir
