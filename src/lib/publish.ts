import { prisma } from "./prisma";
import type { ContentItem } from "@prisma/client";
import { allPublishers } from "./publishers";

/**
 * IN_REVIEW bir öğeyi yayına alır (moderasyon onayından geçmiş demektir).
 * Ardından yapılandırılmış her sosyal platform yayıncısını dener; bir
 * platform hata verse dahi diğerleri denenir ve blog yayını geri alınmaz.
 */
export async function publishContentItem(item: ContentItem): Promise<void> {
  if (!item.aiTitle || !item.aiContent || !item.slug) {
    throw new Error("Yayınlanacak öğede AI içeriği veya slug eksik");
  }

  const published = await prisma.contentItem.update({
    where: { id: item.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  for (const publisher of allPublishers) {
    try {
      await publisher.publish(published);
    } catch (err) {
      console.error(`[publish] ${publisher.platform} yayın hatası (item ${item.id}):`, err);
    }
  }
}

export async function autoPublishApprovedBatch(limit = 10): Promise<number> {
  const autoPublishSetting = await prisma.setting.findUnique({ where: { key: "auto_publish" } });
  if (autoPublishSetting?.value !== "true") {
    return 0;
  }

  const items = await prisma.contentItem.findMany({
    where: { status: "IN_REVIEW" },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  let count = 0;
  for (const item of items) {
    await publishContentItem(item);
    count += 1;
  }
  return count;
}
