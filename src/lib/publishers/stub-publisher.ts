import { prisma } from "../prisma";
import type { ContentItem } from "@prisma/client";
import type { Publisher } from "./types";

/**
 * Faz 1 iskeleti: her platform için SocialAccount tablosunda "active: true"
 * bir kayıt var mı diye bakar. Yoksa sessizce atlar (log basar, hata fırlatmaz).
 * Gerçek API entegrasyonu (Twitter/FB/LinkedIn/IG/YouTube) sonraki fazda
 * bu dosyanın publish() gövdesine eklenecek.
 */
export function createStubPublisher(platform: string): Publisher {
  return {
    platform,
    async isConfigured() {
      const account = await prisma.socialAccount.findFirst({
        where: { platform, active: true },
      });
      return Boolean(account);
    },
    async publish(item: ContentItem) {
      const configured = await this.isConfigured();
      if (!configured) {
        console.log(`[publisher:${platform}] yapılandırılmamış, atlanıyor (item ${item.id})`);
        return;
      }
      console.log(
        `[publisher:${platform}] TODO gerçek API çağrısı — item "${item.aiTitle}" (${item.id})`
      );
    },
  };
}
