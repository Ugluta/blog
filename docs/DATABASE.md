# Veritabanı — Mevcut Şema, Eksikler, Ölçekleme

## Mevcut modeller (Faz 1)

`User`, `Category` (ağaç yapısı), `Source`, `ContentItem`, `SocialAccount`, `Setting`
— tam alanlar için `prisma/schema.prisma`'ya bakın.

## Kurumsal/ölçek için eklenmesi gereken modeller

```prisma
// Kim-ne-zaman-ne-yaptı denetim izi (Security A09, KVKK/denetim gereksinimleri için de gerekli)
model AuditLog {
  id         String   @id @default(cuid())
  actorId    String?
  actor      User?    @relation(fields: [actorId], references: [id])
  action     String   // "content.approve" | "content.reject" | "source.create" | ...
  targetType String   // "ContentItem" | "Source" | "User" ...
  targetId   String
  metadata   Json?
  ip         String?
  createdAt  DateTime @default(now())

  @@index([targetType, targetId])
  @@index([actorId, createdAt])
}

// Mobil için access/refresh token rotasyonu (cookie mobilde doğal değil)
model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  tokenHash String   @unique // ham token asla DB'ye yazılmaz, sadece hash'i
  deviceInfo String?
  revokedAt DateTime?
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
}

// Push bildirim için cihaz kaydı (mobil, modül: sosyal/bildirim)
model Device {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  pushToken  String   @unique
  platform   String   // "ios" | "android"
  createdAt  DateTime @default(now())
}

// Ses/video modülü (Modül 5) için medya kaydı
model Media {
  id            String   @id @default(cuid())
  contentItemId String?
  contentItem   ContentItem? @relation(fields: [contentItemId], references: [id])
  type          String   // "audio" | "video"
  storageUrl    String   // R2/S3 URL
  durationSec   Int?
  status        String   @default("PENDING") // PENDING|PROCESSING|READY|FAILED
  createdAt     DateTime @default(now())
}
```

## İndeks kontrolü

Prisma `@id`/`@unique` alanlar otomatik indekslenir. Ek olarak eklenmesi gereken
composite index'ler (havuz/moderasyon ekranı sık `status` ile filtreliyor):

```prisma
model ContentItem {
  // ...mevcut alanlar
  @@index([status, createdAt])
  @@index([categoryId, status])
}
```

## Ölçekleme sırası (gerçek darboğaz nerede çıkarsa)

1. **Connection pooling (PgBouncer)** — Next.js her serverless/instance'ın kendi Prisma
   connection pool'u olur; instance sayısı arttıkça Postgres'in `max_connections` sınırına
   çarpılır. PgBouncer transaction-mode pooling ile bunu çözer. **Instance sayısı 2'yi
   geçtiğinde** eklenmeli, öncesinde gereksiz karmaşıklık.
2. **Read replica** — Sadece okuma ağırlıklı sorgular (public blog listeleme) replica'ya
   yönlendirilir, yazma (admin onay/scrape insert) primary'de kalır. **Redis cache + CDN
   yetmemeye başladığında** düşünülmeli — çoğu durumda hiç gerekmez.
3. **Partition/sharding: muhtemelen hiç gerekmeyecek.** İçerik tablosu satır sayısı trafikle
   değil yayınlanan yazı sayısıyla büyür; on binler-yüz binler mertebesinde kalması beklenir.
   Erken partition'lamak gereksiz mühendislik yükü olur.

## Migration stratejisi notu

Şu an `prisma db push` kullanıyoruz (hızlı prototipleme için doğru araç). **Üretime gerçek
kullanıcı verisi girmeye başladığı an** (`prisma migrate dev` / `migrate deploy`) tabanlı
sürümlenmiş migration'lara geçilmeli — `db push` şema geçmişi tutmaz, veri kaybına yol açacak
bir "drift" durumunda geri dönüş imkânı sağlamaz. Bu geçiş modül 2-3 civarında, ilk gerçek
içerik havuzu oluşmadan önce yapılmalı.
