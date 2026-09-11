#!/usr/bin/env bash
# Faz 1 kurulum scripti — Contabo VPS üzerinde SSH ile root olarak çalıştırın.
# Bu script bu oturumdan (Claude Code) ÇALIŞTIRILAMAZ — bu ortamın sunucuya
# SSH erişimi yok. Kopyalayıp kendiniz VPS'te çalıştırın, adım adım kontrol edin.
#
# Kullanım:
#   scp scripts/setup-vps.sh root@2.27.101.227:/root/
#   ssh root@2.27.101.227
#   bash /root/setup-vps.sh
set -euo pipefail

APP_DIR="/root/blog"   # gerekirse kendi yolunuzla değiştirin
BRANCH="claude/friendly-carson-k0k6zv"

echo "== 1) Redis kurulumu =="
apt-get update
apt-get install -y redis-server
# Ubuntu 24.04 paketi varsayılan olarak 127.0.0.1'e bind eder (supervised systemd).
sed -i 's/^supervised .*/supervised systemd/' /etc/redis/redis.conf
systemctl enable --now redis-server
redis-cli ping   # PONG dönmeli

echo "== 2) Uygulama kodu =="
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  git clone --branch "$BRANCH" https://github.com/Ugluta/blog "$APP_DIR"
  cd "$APP_DIR"
fi

echo "== 3) .env dosyası =="
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo ">>> $APP_DIR/.env oluşturuldu. ŞİMDİ DÜZENLEYİN:"
  echo "    - DATABASE_URL (gerçek DB şifresiyle)"
  echo "    - ANTHROPIC_API_KEY"
  echo "    - AUTH_SECRET   -> openssl rand -hex 32"
  echo "    - ADMIN_EMAIL / ADMIN_PASSWORD"
  echo "Düzenledikten sonra bu scripti tekrar çalıştırın (bu dosya varsa üzerine yazmaz)."
  exit 0
fi

echo "== 4) Bağımlılıklar + build =="
cd "$APP_DIR"
npm install
export $(grep -v '^#' .env | xargs -d '\n')
npx prisma generate
npx prisma db push
npm run db:seed
npm run build

echo "== 5) PM2 =="
npm install -g pm2 --no-fund --no-audit || true
pm2 delete blog blog-worker 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 5

echo "== Tamam =="
echo "pm2 status | pm2 logs blog | pm2 logs blog-worker  ile kontrol edin."
echo "http://2.27.101.227:3000 üzerinden test edin (SSL/ikie.net sonraki fazda)."
