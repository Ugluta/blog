# Güvenlik — OWASP Top 10 Üzerinden Durum ve Yapılacaklar

Bu tablo mevcut koda (Faz 1) göre gerçek durumu gösterir — "her şey hazır" demiyoruz,
somut olarak ne var ne yok, hangisi öncelikli net yazılıyor.

| # | Risk | Durum | Not |
|---|------|-------|-----|
| A01 | Broken Access Control | 🟡 Kısmi | `middleware.ts` `/admin/*`'i korur, API route'ları `requireSession()` kontrol eder. **Eksik:** Rol bazlı yetkilendirme yok — her giriş yapan kullanıcı her admin işlemini yapabiliyor (`Role` alanı DB'de var ama hiçbir route'ta kontrol edilmiyor). Modül 4 ile birlikte çözülecek. |
| A02 | Cryptographic Failures | ✅ | Şifreler bcrypt (cost 12) ile hash'leniyor, JWT HS256+güçlü secret. **Yapılacak:** Production'da HTTPS zorunlu kılınmalı (Cloudflare Full-Strict SSL modu). |
| A03 | Injection | ✅ | Prisma parametrize sorgular kullanıyor, ham SQL string birleştirme yok. Zod ile giriş doğrulama admin route'larının çoğunda var, hepsine yaygınlaştırılmalı. |
| A04 | Insecure Design | 🟡 Kısmi | `auto_publish` varsayılan kapalı (bilinçli tasarım kararı). **Eksik:** Login endpoint'inde rate limit yok — brute force'a açık. |
| A05 | Security Misconfiguration | 🔴 Eksik | **Güvenlik header'ları hiç ayarlanmamış** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). Next.js `next.config.mjs` içine `headers()` ile eklenmeli — aşağıda örnek var. |
| A06 | Vulnerable/Outdated Components | ✅ | Faz 1'de `npm audit` kritik/yüksek açıklar temizlendi. **Yapılacak:** Dependabot/Renovate ile otomatik takip kurulmalı, elle kontrol sürdürülebilir değil. |
| A07 | Auth Failures | 🟡 Kısmi | Şifre hash'leme güvenli. **Eksik:** Hesap kilitleme yok (sınırsız deneme), 2FA yok, mobil için henüz refresh-token rotasyonu tasarlanmadı (bkz. ARCHITECTURE.md §3). |
| A08 | Software/Data Integrity | 🟡 Kısmi | Build/typecheck manuel doğrulanıyor. **Yapılacak:** CI (GitHub Actions) ile her PR'da otomatik lint+typecheck+build zorunlu kılınmalı — insan hatasına bağlı kalmasın. |
| A09 | Logging/Monitoring Failures | 🔴 Eksik | Şu an sadece `console.log`. Üretimde bu kaybolur. `AuditLog` modeli + Sentry entegrasyonu gerekli (bkz. DATABASE.md, ARCHITECTURE.md §5). |
| A10 | SSRF | 🔴 **Gerçek açık** | `POST /api/admin/sources` herhangi bir URL'i kaynak olarak kabul ediyor. Bir admin hesabı ele geçirilirse (veya ileride çoklu-kullanıcı/self-servis kaynak eklemeye açılırsa) `http://localhost:5432`, `http://169.254.169.254/...` (cloud metadata) gibi iç adreslere scraper üzerinden istek attırılabilir. **Öncelikli düzeltme.** |

## Öncelik Sırası (bir sonraki oturumda uygulanacak)

1. **SSRF guard** — `Source` oluşturma/güncellemede URL'i doğrula: sadece `http(s)`, private/loopback/
   link-local IP aralıklarını (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`,
   `169.254.0.0/16`) ve DNS ile bunlara çözülen host'ları reddet.
2. **Security header'ları** — `next.config.mjs`:
   ```js
   async headers() {
     return [{
       source: "/:path*",
       headers: [
         { key: "X-Content-Type-Options", value: "nosniff" },
         { key: "X-Frame-Options", value: "DENY" },
         { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
         { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
         { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;" },
       ],
     }];
   }
   ```
3. **Login rate limiting** — Redis tabanlı sabit pencere sayaç (`ratelimit:login:<ip>`), 5 deneme/15 dk.
4. **RBAC middleware** — `requireSession()`'a `requireRole(["ADMIN"])` varyasyonu eklenip her route'a
   uygun rol atanmalı (ör. kaynak silme sadece ADMIN, moderasyon EDITOR+ADMIN).
5. **AuditLog** modeli + her onay/red/yayın/kaynak-değişikliği işleminde bir satır yazılması.
6. **AI içeriğinin XSS'e karşı sanitize edilmesi** — `aiContent` markdown olarak saklanıyor; ileride
   HTML'e render edilirken (`react-markdown` + `rehype-sanitize` gibi) mutlaka sanitize edilmeli,
   scraped kaynaktan modele sızan bir `<script>` etiketi kullanıcıya kadar ulaşmamalı.

## Zaten Doğru Yapılanlar (bozmayın)

- Gerçek sırlar (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `AUTH_SECRET`, admin şifresi) hiçbir zaman
  koda/`.env.example`'a yazılmıyor, `.gitignore`'da.
- `bcryptjs` Edge middleware bundle'ından izole edildi (`lib/jwt.ts` vs `lib/password.ts` ayrımı) —
  edge runtime'da desteklenmeyen Node API'lerinin middleware'e sızmasını önler.
- Cookie `httpOnly + sameSite=lax + secure(prod)` ile ayarlanıyor.
- Sunucu tarafında ufw + fail2ban zaten aktif (VPS seviyesinde ilk savunma hattı).
