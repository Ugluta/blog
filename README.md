# blog (ikie.net) — Müzik Blogu + AI İçerik Otomasyonu

## Faz 1 (bu commit): çekirdek döngü

`scrape → havuz → AI revize → moderasyon/onay → yayın` döngüsü çalışır durumda:

- `src/lib/scraper.ts` — RSS ve basit HTML kaynaklarını tarar, `ContentItem` havuzuna ekler (URL bazlı dedupe).
- `src/lib/ai-revise.ts` — Havuzdaki ham içerikleri Anthropic API ile özgün Türkçe blog metnine çevirir.
- `src/app/admin/pool` — Moderasyon ekranı: AI revize edilmiş içerikleri onayla/reddet.
- `src/lib/publish.ts` + `src/lib/publishers/*` — Onaylanan içeriği yayınlar; sosyal medya
  paylaşımı (Twitter/FB/LinkedIn/IG/YouTube) için iskelet var, gerçek API entegrasyonu sonraki faz.
- `src/worker.ts` — BullMQ + Redis ile scrape/revise/publish döngülerini periyodik çalıştırır (PM2 ile `blog-worker` süreci).

Varsayılan olarak **otomatik yayın kapalı** (`Setting.auto_publish`) — her içerik `/admin/pool`
üzerinden elle onaylanmadan yayınlanmaz. Ayarlar sayfasından açılabilir.

## Yerel geliştirme

```bash
cp .env.example .env   # değerleri doldurun
npm install
npx prisma db push
npm run db:seed
npm run dev             # web (localhost:3000)
npm run worker:dev      # ayrı terminalde worker
```

## VPS'e kurulum

Bu ortamın (Claude Code oturumu) sunucuya SSH erişimi yoktur — `scripts/setup-vps.sh`
dosyasını VPS'e kopyalayıp orada çalıştırın:

```bash
scp scripts/setup-vps.sh root@2.27.101.227:/root/
ssh root@2.27.101.227 'bash /root/setup-vps.sh'
```

Script Redis'i kurar, kodu çeker, `.env` şablonunu oluşturur (siz gerçek değerlerle
doldurursunuz: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `AUTH_SECRET`, admin bilgileri),
`prisma db push` + seed + build çalıştırır ve PM2'ye `blog` + `blog-worker` süreçlerini ekler.

## Yol haritası (8 modül)

1. ✅ (iskelet) AI destekli scraper — RSS/HTML → havuz → AI revize
2. 🚧 Sınırsız alt-kategori + full moderasyon — kategori ağacı DB'de hazır, admin UI'da alt-kategori yönetimi eksik
3. ⏳ Gelişmiş reklam modülü
4. ⏳ Gelişmiş kullanıcı yönetimi + izinler (rol enum'u hazır: ADMIN/EDITOR/MODERATOR/VIEWER)
5. ⏳ Ses → klip/video (YouTube/TikTok)
6. 🚧 Sosyal medya bağlama + oto-gönderim — `SocialAccount` modeli + publisher iskeleti hazır, gerçek API entegrasyonu yok
7. ⏳ Suno müzik API entegrasyonu
8. 🚧 Gelişmiş ayarlar + site yönetimi — `Setting` key/value tablosu hazır, tasarım (kremsi/saks mavi/Inter) `tailwind.config.ts`'te
