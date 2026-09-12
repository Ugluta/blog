# ikie.net — Kurumsal Mimari (Web + Mobil, Milyon Ziyaret Ölçeği)

Bu doküman dört sabit öncelik etrafında kurgulanmıştır: **Tasarım, Hız, SEO, Güvenlik**.
Sıra önemli değil — dördü de "sonradan eklenecek özellik" değil, gün 1'den itibaren
mimarinin içine gömülü varsayımlardır.

## 1. Üst Düzey Mimari

```
                              ┌─────────────────────────┐
                              │   Cloudflare (CDN/WAF)   │
                              │  SSL, DDoS, edge cache,  │
                              │  rate limit, bot koruma  │
                              └────────────┬─────────────┘
                                           │
                 ┌─────────────────────────┼─────────────────────────┐
                 ▼                                                   ▼
        ┌─────────────────┐                                ┌──────────────────┐
        │   Web (Next.js)   │                                │  Mobil (RN/Expo)  │
        │  SSR + ISR blog   │                                │  App Store/Play   │
        │  + admin panel    │                                └─────────┬─────────┘
        └────────┬─────────┘                                          │
                 │                                                     │
                 │              ┌──────────────────────────┐          │
                 └─────────────▶│   Public API v1 (REST)    │◀─────────┘
                                │  /api/v1/* — JWT+refresh   │
                                └────────────┬───────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
           ┌────────────────┐      ┌──────────────────┐    ┌───────────────────┐
           │  PostgreSQL     │      │   Redis           │    │  Object Storage    │
           │  (Prisma)       │      │  cache + BullMQ   │    │  (R2/S3 uyumlu)    │
           │  primary+replica│      │  queue            │    │  medya/video/ses   │
           └────────┬────────┘      └────────┬──────────┘    └─────────┬──────────┘
                    │                        │                         │
                    └────────────┬───────────┴─────────────┬───────────┘
                                 ▼                          ▼
                        ┌─────────────────┐       ┌──────────────────────┐
                        │  Worker havuzu   │       │  Gözlemlenebilirlik    │
                        │  scrape/revise/  │       │  Sentry, uptime,       │
                        │  publish/video/  │       │  audit log, metrikler  │
                        │  sosyal paylaşım │       └──────────────────────┘
                        └─────────────────┘
```

**Neden bu katmanlar:**

- **Cloudflare en önde:** Tek VPS'iniz (Contabo, 2.27.101.227) doğrudan internete açıkken her istek
  sunucuya çarpıyor. Cloudflare araya girince statik/ISR sayfalar edge'de cache'lenir, DDoS ve bot
  trafiği sunucuya hiç ulaşmaz, SSL terminasyonu ücretsiz ve otomatik olur. **Milyon ziyaret hedefi
  için en yüksek getiri/efor oranına sahip tek adım budur** — sunucu değişmeden kapasite kat kat artar.
- **Public API v1 ayrımı:** Bugün mobil yok, admin panel API'leri (`/api/admin/*`) cookie+JWT ile
  çalışıyor. Mobil geldiğinde aynı auth modeli işlemez (mobil'de httpOnly cookie doğal değildir).
  Bu yüzden web/admin'den bağımsız, access+refresh token tabanlı, versiyonlu bir `/api/v1/*` katmanı
  planlanıyor — ileride web de aynı API'yi tüketebilir, tek doğruluk kaynağı olur.
- **Worker havuzu ayrı ölçeklenir:** AI revize, video render gibi CPU/IO-ağır işler web isteklerinden
  fiziksel olarak ayrı süreçte (`blog-worker`) — trafik arttığında web instance'larını çoğaltmak
  worker'ı etkilemez, video render yükü web'i yavaşlatmaz.

## 2. "Milyon Ziyaret" Gerçekte Neyi Zorlar?

Önemli bir netleştirme: trafik ölçeği (milyon ziyaretçi) ile veri ölçeği (milyon satır içerik)
**farklı problemlerdir**. Bir blog için içerik sayısı muhtemelen on binlerle ölçülür, ama okuyucu
sayısı milyonlarla ölçülebilir. Bu yüzden veritabanını "partition" etmek değil, **okuma trafiğini
veritabanına hiç düşürmemek** asıl çözümdür:

1. **Edge cache (Cloudflare):** Yayınlanan bir yazı sayfası edge'de cache'lenir, %95+ istek
   veritabanına hiç dokunmadan cevaplanır.
2. **ISR (Incremental Static Regeneration):** Next.js sayfaları statik gibi servis edilir,
   arka planda periyodik yenilenir (ör. 60 sn) — her istek DB sorgusu yapmaz.
3. **Redis cache katmanı:** Ana sayfa, kategori listeleri gibi sık sorgulanan ama sık değişmeyen
   veriler için ikinci savunma hattı.
4. **Analitik veriyi asla ana veritabanına yazmayın:** Sayfa görüntüleme (pageview) gibi yüksek
   hacimli olayları Postgres'e loglamak, transaction veritabanınızı trafikle birlikte çökertir.
   Bunun yerine Cloudflare Web Analytics / Plausible / GA4 kullanın — bunlar bu iş için tasarlanmış
   ayrı sistemlerdir.

Sonuç: Doğru mimaride, tek bir orta ölçekli Postgres + Redis, doğru cache stratejisiyle milyonlarca
sayfa görüntülemeyi kaldırır. Asıl darboğaz genelde önce **uygulama sunucusu (Node.js instance sayısı)**
ve **CDN cache oranı** olur, veritabanı değil.

## 3. Mobil Uygulama Yaklaşımı

Önerilen yığın: **React Native + Expo**.

- Web ekibi zaten TypeScript/React biliyor — öğrenme eğrisi yok.
- `packages/api-types` (Zod şemaları) hem web hem mobil tarafından paylaşılabilir — API sözleşmesi
  tek yerde tanımlanır, ikisi de senkron kalır.
- Expo Application Services (EAS) ile App Store/Play Store'a CI üzerinden otomatik build.
- Auth: kısa ömürlü access token (~15 dk) + refresh token; cihazda `expo-secure-store`
  (Keychain/Keystore) ile saklanır — asla `AsyncStorage`'a düz metin token yazılmaz.
- Push bildirim: Expo Push Service (FCM+APNs'i tek API arkasında birleştirir) — "yeni içerik
  yayınlandı" tetikleyicisi `publish` worker job'ına eklenir.
- Alternatif olarak Flutter da değerlendirilebilir ama ekip zaten TS/React bildiği için RN/Expo
  daha az sürtünmeli. **Bu bir karar noktası — sohbetin sonunda soruyorum.**

## 4. Tasarım Sistemi

- Renk/tipografi/spacing token'ları (`cream #F8F6F1`, `sax #3A6EA8`, `ink #111`, Inter) tek bir
  `packages/design-tokens` paketinde JSON/TS olarak tanımlanır.
- Web tarafı bunu `tailwind.config.ts`'e, mobil tarafı `theme.ts` içine import eder — tek kaynak,
  iki platform, hep senkron.
- Bileşen kütüphanesi: web'de `shadcn/ui` (Tailwind üzerine, kopyala-yapıştır kod, bağımlılık şişirmez);
  mobilde React Native Paper veya Tamagui (ikisi de tema token'larını okuyabilir).
- Erişilebilirlik: WCAG AA kontrast oranı, semantic HTML, mobilde `accessibilityLabel` zorunluluğu.

## 5. Gözlemlenebilirlik (millions of visits olduğunda gözünüz kapalı olmasın)

- **Hata izleme:** Sentry (hem Next.js hem worker hem RN için resmi SDK'ları var) — üretimde
  sessizce patlayan bir job'u ancak bu sayede fark edersiniz.
- **Uptime:** Basit bir healthcheck endpoint'i (`/api/health` — DB+Redis ping) + harici bir
  uptime monitörü (UptimeRobot/BetterStack) `blog` ve `blog-worker` için ayrı ayrı.
- **Audit log:** Kim, ne zaman, hangi içeriği onayladı/reddetti/yayınladı — bkz. `docs/DATABASE.md`
  içindeki `AuditLog` modeli. Kurumsal/güvenlik denetimi için zorunlu, bugünden eklenmeli.
