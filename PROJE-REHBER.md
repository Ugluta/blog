# PROJE REHBERİ — ikie.net İçerik & Otomasyon Platformu

> Bu belge projenin **tek referans kaynağı** ve **devir brifingidir**. Yeni bir Claude oturumu
> açıldığında ilk okunacak dosya budur. Amaç, mimari, yol haritası, kodlama kuralları ve
> alınan kararları içerir.

Son güncelleme: 2026-09-12 · Branch: `claude/corporate-dashboard-ui-wdptsi`

---

## 1. AMAÇ & VİZYON

Yapay zeka destekli, **tek panelden yönetilen içerik üretim ve dağıtım platformu**.
Sahibi bir müzik blogcusu; hem yazı/blog içeriği üretiyor hem de kendi müziklerini paylaşıyor.

Temel iş döngüsü (çekirdek):

```
KAYNAK (site/RSS/konu) → SCRAPE (çek) → HAVUZ (content pool)
   → AI REVİZE (deep-agent mantığı) → YAYINA HAZIR → YAYINLA
   → SOSYAL MEDYAYA OTO-DAĞITIM (Twitter/FB/IG/LinkedIn/YouTube/TikTok)
```

Hedef sistem nitelikleri: **güvenli**, **hızlı**, **SEO canavarı** (yüksek index/görünürlük),
tutarlı **tek renk paleti** (kremsi zemin + saks mavi + siyah tipografi + Inter).

---

## 2. HEDEF 8 MODÜL (ve mevcut durum)

| # | Modül | Açıklama | Durum |
|---|-------|----------|-------|
| 1 | **AI Scraper** | Site/konu arayıp içerik çek → havuz → AI ile revize → yayına hazır (deep-agent) | 🟢 İskelet var (RSS+HTML). AI derinleştirme + worker gerek |
| 2 | **İçerik & Moderasyon** | Sınırsız alt-kategori, full moderasyon (onay/red/dönüştür) | 🟢 Var (ContentItem, Category, Comment) |
| 3 | **Reklam Modülü** | Gelişmiş reklam slotları/yerleşim | 🟡 Ayarlar var, yerleşim test edilmeli |
| 4 | **Kullanıcı & İzinler** | Roller, ekip daveti, yetkilendirme | 🟢 Var (UserRole, TeamInvite) |
| 5 | **Ses → Video/Klip** | Ses dosyasından YouTube/TikTok klip üretimi | 🟡 TTS + render iskeleti var, ffmpeg pipeline test |
| 6 | **Sosyal Oto-Gönderim** | Hesap bağlama (OAuth) + otomatik yayın | 🟢 5 platform publisher + kuyruk var |
| 7 | **Suno Müzik + API** | Suno entegrasyonu, müzik üretim püf noktaları | 🔴 Yok — eklenecek |
| 8 | **Gelişmiş Ayarlar** | Site yönetimi, tema, SEO, monetizasyon | 🟢 Geniş admin paneli var |

**Özet:** ~%75 iskelet hazır. Eksik: çalışma zamanı (Redis+worker+API anahtarları), Suno, SEO cilası.

---

## 3. TEKNOLOJİ MİMARİSİ

### Stack
- **Next.js 16.2.9** (Turbopack, App Router) + **React 19.2**
- **TypeScript**
- **Tailwind CSS v4** (`@import "tailwindcss"` — cascade layer tabanlı)
- **Prisma 6.19** → PostgreSQL 16. Client `src/generated/prisma`'ya üretiliyor
- **Auth.js v5** (next-auth beta) + Prisma adapter, **JWT** session, `trustHost: true`
- **BullMQ + ioredis** → arka plan iş kuyruğu (`src/worker.ts`)
- **PM2** → süreç yöneticisi (prod)

### Entegrasyonlar
- **Scraper:** `rss-parser` + `cheerio` + `axios`
- **Publisher:** `axios` ile Twitter/Facebook/Instagram/LinkedIn/YouTube API'leri
- **AI:** `@anthropic-ai/sdk`, `openai`, `@google/generative-ai`
- **TTS:** `@aws-sdk/client-polly`
- **Ödeme:** `stripe` + RevenueCat (mobil)
- **Depolama:** S3 / R2 / MinIO uyumlu

### Veri Modeli (24 model)
`User, Account, Session, VerificationToken, Package, Subscription, UsageStat,
SocialAccount, MediaFile, VideoProject, Scene, PublishJob, Category, Post, Comment,
NewsletterSubscriber, NewsletterCampaign, PasswordResetToken, ScraperSource, SiteSetting,
GalleryAlbum, GalleryImage, TeamInvite, ContentItem`

Enum'lar: `UserRole, SubscriptionStatus, BillingPeriod, SocialPlatform, MediaType,
ProjectStatus, AspectRatio, JobStatus, CommentStatus, PostStatus, SubscriberStatus, CampaignStatus`

### Klasör Yapısı (özet)
```
src/
  app/
    (public)         → anasayfa, blog, haberler, galeri, iletişim vb.
    uygulama/        → son-kullanıcı paneli (içerik, scraper, sosyal, video…)
    admin/           → yönetici paneli (users, settings/*, publisher, moderation…)
    api/             → REST uçları (auth, posts, scraper, publisher, social, ai, tts, video…)
  components/
    layout/          → MegaHeader, Footer, Sidebar
    home/            → anasayfa bölüm bileşenleri
    ThemeProvider    → DB'den CSS değişkeni enjekte eder (tema sistemi)
  lib/
    ai/ scraper/ publisher/ tts/ video/  → iş mantığı
    auth.ts prisma.ts siteSettings.ts    → çekirdek
  generated/prisma/  → Prisma client (üretilmiş)
  worker.ts          → BullMQ worker (scraper+publisher işleri)
prisma/
  schema.prisma      → 24 model
  seed.ts            → admin + paketler + kategoriler + demo scraper kaynağı
```

---

## 4. YOL HARİTASI (fazlar)

**Faz 0 — Deploy & Tasarım** ✅ *(TAMAM)*
Sunucu kurulumu, güvenlik, PostgreSQL, build, PM2, açık tema.

**Faz 1 — Çekirdek Motor** *(SIRADAKİ)*
- Redis kur, `worker`'ı PM2'ye ikinci süreç ekle: `pm2 start npm --name blog-worker -- run worker`
- `ANTHROPIC_API_KEY` ekle → scraper çektiğini AI ile revize etsin
- **Test:** 1 RSS kaynağı → çek → havuz → AI revize → yayınla (kalp atışı)

**Faz 2 — Sosyal Dağıtım**
1 hesap bağla (Twitter/X en kolay) → oto-gönderim testi → diğer platformlar.

**Faz 3 — SEO Canavarı**
- Domain (ikie.net) + Let's Encrypt SSL + Nginx reverse proxy *(IP:port index'lenmez, şart)*
- `robots.txt` + `sitemap.xml` (var) + `feed.xml` (var) → Search Console
- Her sayfaya dinamik metadata (title/description/OG/canonical)
- JSON-LD structured data (Article, BreadcrumbList, Organization)
- ISR/revalidate (blog'da 60sn), OG görsel üretimi, Core Web Vitals

**Faz 4 — Suno + Video/Klip**
Suno API entegrasyonu + ffmpeg ses→video pipeline.

**Faz 5 — Reklam + İnce Ayar + Ölçek.**

---

## 5. KODLAMA YAPISI & KRİTİK NOTLAR (tuzaklar)

Bu proje **standart Next.js değil** — kırıcı değişiklikler var. `AGENTS.md` diyor ki:
kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili kılavuzu oku.

Yaşanmış ve çözülmüş tuzaklar (yeni oturum bunları tekrar yaşamasın):

1. **Tailwind v4 — cascade layer.** Layer DIŞI (`@layer` içinde olmayan) global kurallar
   Tailwind utility'lerini **ezer**. `* { margin:0; padding:0 }` gibi bir reset tüm `py-*`,
   `mt-*` boşluklarını yok eder → her şey üst üste biner. **Çözüm:** temel element stillerini
   `@layer base { }` içine al; `*` reset'ten margin/padding çıkar (preflight zaten hallediyor).

2. **ThemeProvider çakışması.** `src/components/ThemeProvider.tsx` DB'deki `SiteSetting`'lerden
   `<head>`'e `<style>` enjekte eder ve `body`'yi ezer. DB boşsa `DEFAULTS`'a düşer.
   DEFAULTS artık yeni palete ayarlı (saks/kremsi). Renkler beklenmedik çıkarsa **buraya bak**.

3. **Prisma + `prisma.config.ts`.** Bu dosya varken Prisma CLI `.env`'i **otomatik okumaz**
   ("skipping environment variable loading"). CLI komutlarından önce elle export gerek:
   `export DATABASE_URL="postgresql://blog:...@localhost:5432/blog?schema=public"`
   (Next.js runtime `.env`'i otomatik okur; sorun sadece `prisma generate/db push` CLI'da.)

4. **Migration yok.** `prisma/migrations` boş. Şema değişiminde `npx prisma db push` kullan
   (migrate deploy değil).

5. **Server vs Client Components.** Server Component'lerde event handler (`onMouseEnter`,
   `onClick`…) **kullanılamaz** → build "Event handlers cannot be passed to Client Component
   props" hatası verir. Hover efektlerini CSS class ile yap (`.card-lift`, `.social-icon-btn`),
   ya da bileşeni `"use client"` yap (MegaHeader gibi).

6. **`useSearchParams()` Suspense.** `<Suspense>` sınırı olmadan kullanılırsa build patlar.
   Çocuk bileşene çıkarıp `<Suspense fallback={null}>` ile sar.

7. **Build süresi.** Zayıf makinede (Windows) 50+ dk sürebilir; güçlü VPS'te birkaç dakika.
   Prod'da her zaman `npm run build && pm2 restart` — dev modu yavaş.

### Palet (tek kaynak — her yerde bu)
| Rol | Değer |
|-----|-------|
| Zemin (kremsi) | `#F8F6F1` |
| Kart/panel (beyaz) | `#FFFFFF` |
| Aktif/hover açık zemin | `#EBF2FA` |
| Vurgu (saks mavi) | `#3A6EA8` |
| Vurgu hover | `#2D5A8E` |
| Kenarlık | `#DDD8CF` / `#E7E2D8` |
| Metin (siyah) | `#111111` |
| İkincil metin | `#444444` / `#666666` |
| Font | Inter |

---

## 6. HAM SOHBET ÖZETİ — KARARLAR, HASSAS NOKTALAR, ÖNLEMLER

### 🔴 En kritik olay: İlk sunucu HACKLENMİŞTİ
- İlk VPS'te (Contabo, eski IP `185.237.252.224`) **kripto madenci malware** bulundu
  (`/0QPVEy3r`, `/RCLLmEgA5`) ve **3 yabancı IP root olarak bağlıydı** (`88.237.230.160` vb.).
- **Karar:** O sunucu tamamen terk edildi, üzerindeki tüm şifreler yanık sayıldı.
- **Önlem:** Yeni temiz sunucu (`2.27.101.227`) kuruldu ve baştan sertleştirildi.

### 🔒 Güvenlik önlemleri (yeni sunucuda uygulandı)
- Root şifresi `passwd` ile değiştirildi (kullanıcı belirledi, kimseyle paylaşılmadı).
- `ufw` firewall: yalnız 22, 80, 443, 3000 açık; reboot'ta aktif.
- `fail2ban` kuruldu (SSH brute-force koruması).
- **Bekleyen önlem:** SSH key ile giriş + şifreli girişi tamamen kapatmak (henüz yapılmadı).

### ⚠️ Hassas nokta: Şifreler sohbete yazıldı
- Kullanıcı bir noktada eski root şifresini sohbete yapıştırdı → o şifre geçersiz kılındı.
- **Kural:** Şifreler bir daha sohbete yazılmayacak; kullanıcı kendi güvenli yerinde tutar.
- **DB şifresi** (`.env` içinde) sadece localhost'ta kullanılıyor, dışarı açık değil.

### 🎨 Tasarım kararı (kullanıcının net talebi)
- "Turuncu, kırmızı, yeşil, lacivert karışmış" → **tek renk şeması** istendi.
- **Karar:** Kremsi zemin + saks mavi (`#3A6EA8`) + siyah tipografi + Inter. Modern sans-serif.
- Tüm panel (uygulama + admin) ve footer koyu temadan **açık temaya** çevrildi (51+ dosya).

### 🧭 İş akışı kararı
- Uzun kurulum thread'i yerine **feature geliştirmeye temiz yeni oturumla** devam edilecek.
- Bu belge (`PROJE-REHBER.md`) devir brifingi olarak repoda tutuluyor.

### Ortam gerçekleri (kafa karışıklığı yaşandı, netleştirildi)
- Kullanıcının makineleri: Windows + WSL (`DESKTOP-EFTD97K`) — sadece lokal.
- Canlı ortam: **Contabo Linux VPS `2.27.101.227`** (asıl deploy burada).
- `~/koli` diye AYRI bir yazılım daha var — bu projeyle ilgisiz, dokunulmaz.

---

## 7. SUNUCU & ERİŞİM BİLGİLERİ

| Öğe | Değer |
|-----|-------|
| VPS | Contabo, `2.27.101.227`, Ubuntu 24.04 |
| Erişim | `ssh root@2.27.101.227` (root şifresi kullanıcıda) |
| Proje yolu | `/root/blog` |
| Çalıştırma | PM2, süreç adı `blog`, port `3000` |
| DB | PostgreSQL 16 — db=`blog`, user=`blog`, pass=`.env`'de |
| Domain | `ikie.net` (A kaydı → `2.27.101.227`; SSL henüz yok) |
| Admin giriş | `admin@kurumsal.com` / `Admin123!` *(canlıda değiştir)* |
| Test URL | `http://2.27.101.227:3000` |

### Sık kullanılan komutlar
```bash
# Güncelle + yeniden yayınla
cd ~/blog && git pull && npm run build && pm2 restart blog

# Prisma (CLI'da önce export şart)
export DATABASE_URL="postgresql://blog:<sifre>@localhost:5432/blog?schema=public"
npx prisma db push && npm run db:seed

# Worker (Faz 1)
pm2 start npm --name blog-worker -- run worker

# Loglar
pm2 logs blog --lines 50
```

---

## 8. GÜVENLİK YAPILACAKLAR (öncelikli)
- [ ] SSH key kur + `PasswordAuthentication no` (şifreli girişi kapat)
- [ ] Admin şifresini (`Admin123!`) değiştir
- [ ] `.env` içindeki tüm secret'ları güçlü/rastgele yap (`openssl rand -base64 32`)
- [ ] Domain + SSL (Let's Encrypt) → HTTPS zorunlu
- [ ] Düzenli DB yedeği (cron `pg_dump`)
