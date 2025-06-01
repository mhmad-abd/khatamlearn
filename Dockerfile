# از ایمیج رسمی Node.js استفاده می‌کنیم
FROM node:20

# دایرکتوری کاری کانتینر
WORKDIR /app

# کپی package.json و package-lock.json برای نصب سریع‌تر
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی کل سورس پروژه
COPY . .

# تنظیم پورت (بر اساس app.listen توی server.js یا app.js)
EXPOSE 443


COPY ssl/key.pem ssl/cert.pem ./

# نقطه ورود به سرور
CMD ["node", "server.js"]
