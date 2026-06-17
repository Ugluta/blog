# KURUMSAL — Kurulum Kılavuzu

## Gereksinimler

- **Node.js** 20+
- **PostgreSQL** 15+
- **Redis** 7+ (BullMQ kuyruğu için)

## Hızlı Kurulum

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. Ortam değişkenlerini ayarla
```bash
cp .env.example .env
```
`.env` dosyasını açıp en az şu alanları doldurun:
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `NEXTAUTH_SECRET` — rastgele güçlü bir string (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — sitenin tam URL'si (prod'da `https://siteadi.com`)

### 3. Veritabanını hazırla
```bash
# Migrasyon oluştur ve uygula
npx prisma migrate dev --name init

# Prisma client üret
npx prisma generate
```

### 4. (İsteğe bağlı) Seed verisi ekle
```bash
npm run db:seed
```

### 5. Geliştirme sunucusunu başlat
```bash
npm run dev
```
→ http://localhost:3000

### 6. (İsteğe bağlı) Worker'ı başlat
BullMQ iş kuyruğu için ayrı bir terminalde:
```bash
npm run worker
```

---

## Üretim (Production) Kurulumu

```bash
npm run build
npm run start
```

### Vercel'e Deploy
```bash
npx vercel --prod
```
Ortam değişkenlerini Vercel dashboard'dan girin.

---

## Temel Özellikler ve Gerekli Servisler

| Özellik | Gerekli Servis |
|---|---|
| Haber/Blog CMS | PostgreSQL |
| Sosyal medya girişi (OAuth) | Twitter, Google, Facebook API key |
| Yayın zamanlama | Redis |
| AI içerik işleme | Anthropic / OpenAI / Gemini API key |
| Video oluşturma | ffmpeg (otomatik kurulur) |
| Metin-ses dönüştürme | AWS Polly |
| Ödeme sistemi | Stripe |
| Medya yükleme | S3 uyumlu depolama (AWS S3, R2, MinIO) |
| E-posta (newsletter, davet) | SMTP (Gmail, Mailgun vb.) |

---

## Admin Paneline Erişim

1. `/kayit` ile hesap oluşturun
2. Veritabanında ilk kullanıcının rolünü `SUPER_ADMIN` yapın:
   ```sql
   UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'email@adresiniz.com';
   ```
3. `/admin` adresine gidin

---

## Proje Yapısı

```
src/
  app/
    admin/          ← Admin paneli
    uygulama/       ← Kullanıcı dashboard'u
    api/            ← API route'ları
    haber/          ← Haber detay sayfaları
    galeri/         ← Galeri sayfaları
    ...
  components/
    layout/         ← Header, Footer, Sidebar
    comments/       ← Yorum bileşenleri
prisma/
  schema.prisma     ← Veritabanı şeması
  seed.ts           ← Test verisi
```
