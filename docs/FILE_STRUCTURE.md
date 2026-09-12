# Dosya Sistemi — Bugün ve Hedef (Mobil Geldiğinde)

## Bugün (Faz 1, mevcut repo)

```
blog/
├── prisma/                schema.prisma, seed.ts
├── src/
│   ├── app/                Next.js App Router (public + /admin + /api)
│   ├── lib/                 framework'ten bağımsız iş mantığı
│   │   └── publishers/       sosyal medya yayıncı iskeleti
│   ├── worker.ts             BullMQ worker giriş noktası
│   └── middleware.ts
├── docs/                    bu dokümanlar
├── scripts/setup-vps.sh
└── ecosystem.config.js       PM2 (blog + blog-worker)
```

Bu yapı **tek uygulama** (web) için doğru ve yeterli — mobil çalışması başlamadan monorepo'ya
geçmek gereksiz karmaşıklık olur (henüz paylaşılacak ikinci bir tüketici yok).

## Hedef — Mobil Çalışması Başladığında (pnpm workspaces + Turborepo)

```
ikie/
├── apps/
│   ├── web/                 (bugünkü blog/ buraya taşınır, aynı kod)
│   ├── mobile/               React Native (Expo)
│   │   ├── app/                Expo Router ekranları
│   │   ├── components/
│   │   └── app.json
│   └── worker/                src/worker.ts + lib/ buraya ayrıştırılır
│       └── src/
├── packages/
│   ├── database/              prisma/ buraya taşınır — tek şema, web+worker+api ondan üretir
│   │   └── schema.prisma
│   ├── api-types/              Zod şemaları + türetilen TS tipleri
│   │   └── src/{post,auth,category}.schema.ts
│   ├── design-tokens/           renk/tipografi/spacing — web Tailwind + RN theme ortak kaynağı
│   │   └── src/tokens.ts
│   └── config/                  ortak eslint/tsconfig/prettier
├── infra/
│   ├── scripts/setup-vps.sh    (mevcuttan taşınır)
│   └── docker/                  (ileride konteynerleşme için)
├── docs/                        (mevcuttan taşınır)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Neden pnpm + Turborepo:** npm/yarn workspaces'e göre disk alanı ve kurulum hızında ciddi
fark var (pnpm'in content-addressable store'u); Turborepo ise değişmeyen paketlerin
build/test'ini cache'leyip CI süresini kısaltır — "milyon ziyaret" hedefiyle doğrudan
ilgisi yok ama geliştirme hızını (Hız pillar'ının bir parçası: *sizin* hızınız) korur.

**Migration planı (mobil çalışmasına başlarken, tek seferlik):**

1. `pnpm-workspace.yaml` + `turbo.json` eklenir, mevcut repo `apps/web/` altına taşınır
   (git history korunur — `git mv`, kod satırı değişmez).
2. `prisma/` → `packages/database/`, `src/lib/` içindeki Prisma import'ları güncellenir.
3. `apps/worker/` ayrıştırılır (bugün zaten `src/worker.ts` ayrı çalışıyor, sadece klasör
   sınırı netleşir).
4. `apps/mobile/` Expo ile sıfırdan `npx create-expo-app` başlatılır.
5. `packages/api-types/` içine önce mevcut admin API'lerinin Zod şemaları taşınır, sonra
   `/api/v1/*` mobil API'si bunları tüketir.

Bu migration'ı **şimdi değil, mobil geliştirmeye fiilen başlarken** yapmayı öneririm —
bugün yapılırsa 2-3 hafta boyunca tek kullanıcılı (web-only) bir monorepo'yu gereksiz yere
taşımış oluruz. Onay verirseniz sırayı değiştirip şimdi de başlatabilirim.
