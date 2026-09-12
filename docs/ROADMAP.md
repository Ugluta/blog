# Birleşik Yol Haritası — 8 Modül + Kurumsal Sertleştirme + Mobil

Faz 1'deki 8 modül yol haritasına, bu oturumda konuşulan dört sabit öncelik
(Tasarım/Hız/SEO/Güvenlik) ve mobil uygulama hedefi eklenmiş, tek fazlı plana
birleştirilmiş halidir. **Sıralama bilinçli:** güvenlik ve SEO temelleri, üstüne
bir şey inşa etmeden önce (mobil dahil) atılmalı — sonradan eklemek çok daha pahalı.

| Faz | İçerik | Durum |
|-----|--------|-------|
| **1** | Çekirdek döngü: scrape→havuz→AI revize→moderasyon→yayın (tek VPS, web-only) | ✅ Tamamlandı |
| **2** | **Güvenlik sertleştirme** — SSRF guard, security header'ları, login rate limit, RBAC, AuditLog (bkz. `SECURITY.md`) | ⏳ Sırada |
| **3** | **Cloudflare'e geçiş** — CDN+WAF+SSL, ikie.net DNS proxy modu, edge cache kuralları | ⏳ |
| **4** | **SEO temelleri** — sitemap.xml, robots.txt, JSON-LD (Article/Organization), OG/Twitter card, ISR, Core Web Vitals ölçümü | ⏳ |
| **5** | **Tasarım sistemi kristalizasyonu** — `design-tokens` paketi, shadcn/ui bileşenleri, erişilebilirlik denetimi | ⏳ |
| **6** | Modül 2: sınırsız alt-kategori UI + tam moderasyon paneli | ⏳ |
| **7** | Modül 4: kullanıcı/rol yönetimi UI (RBAC'ın üstüne) | ⏳ |
| **8** | **Ölçekleme altyapısı** — PgBouncer, Redis cache katmanı, PM2 cluster/çoklu instance, Sentry+healthcheck | ⏳ |
| **9** | **Public API v1** — mobil için versiyonlu REST + access/refresh token akışı | ⏳ |
| **10** | **Mobil uygulama** — Expo iskeleti, temel akışlar (listeleme/detay/bildirim), EAS ile store'a yayın | ⏳ |
| **11** | Modül 6: gerçek sosyal medya API entegrasyonları (Twitter/FB/LinkedIn/IG/YouTube) | ⏳ |
| **12** | Modül 5: ses→klip/video render (YouTube/TikTok) | ⏳ |
| **13** | Modül 7: Suno müzik API entegrasyonu | ⏳ |
| **14** | Modül 3: gelişmiş reklam modülü | ⏳ |
| **15** | Modül 8: gelişmiş ayarlar + site yönetimi (kalan kısımlar) | ⏳ |

## Neden güvenlik/SEO mobilden önce?

- Mobil uygulama, web'deki aynı `/api/v1` katmanını tüketecek. Bu katman güvensiz
  (rate limit yok, RBAC yok) kurulursa, mobil onu kullanmaya başladığı an saldırı
  yüzeyi ikiye katlanır — tek seferlik düzeltmek yerine iki platformda düzeltmek
  gerekir.
- SEO (ISR, sitemap, structured data) tamamen web'e özgüdür ve organik trafiğin
  büyük kısmı (arama motorları) buradan gelir — mobil kullanıcı kazanımı genelde
  zaten var olan web trafiğinden ("uygulamayı indir" banner'ı) beslenir. Önce web
  trafiğini büyütmek, mobilin kazanım kanalını da güçlendirir.

## Sonraki oturumda ne yapılacak (önerim)

1. `SECURITY.md`'deki 6 maddelik öncelik listesini uygula (SSRF guard, header'lar,
   rate limit, RBAC, AuditLog, AI içerik sanitizasyonu).
2. Cloudflare'e geçiş için DNS/SSL adımlarını `scripts/` altına script olarak ekle.
3. Mobil stack kararını netleştir (React Native/Expo önerim — bkz. `ARCHITECTURE.md §3`)
   ve onaylanırsa monorepo migration'ını (`FILE_STRUCTURE.md`) başlat.
