import slugify from "slugify";
import { prisma } from "./prisma";
import { getAnthropicClient, AI_REVISE_MODEL } from "./anthropic";
import type { ContentItem } from "@prisma/client";

const SYSTEM_PROMPT = `Sen bir müzik blogu için içerik editörüsün. Sana ham bir kaynak
makalesi (başlık + içerik) verilecek. Görevin:
1. İçeriği özgün, akıcı, SEO uyumlu Türkçe bir blog makalesine dönüştürmek
   (doğrudan kopyalama/çeviri değil, yeniden yazım).
2. Dikkat çekici ama tıklama tuzağı olmayan bir başlık üretmek.
3. Telif/hakaret/yanıltıcı içerik varsa YAYINLAMA, bunun yerine "reject" alanını true yap.

Sadece şu JSON şemasıyla cevap ver, başka hiçbir metin ekleme:
{"title": string, "content": string (markdown), "reject": boolean, "rejectReason": string|null}`;

type ReviseResult = {
  title: string;
  content: string;
  reject: boolean;
  rejectReason: string | null;
};

function parseReviseResponse(raw: string): ReviseResult {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI yanıtından JSON çıkarılamadı");
  }
  const parsed = JSON.parse(jsonMatch[0]);
  return {
    title: String(parsed.title || "").trim(),
    content: String(parsed.content || "").trim(),
    reject: Boolean(parsed.reject),
    rejectReason: parsed.rejectReason ? String(parsed.rejectReason) : null,
  };
}

async function uniqueSlug(base: string): Promise<string> {
  const baseSlug = slugify(base, { lower: true, strict: true, locale: "tr" });
  let candidate = baseSlug;
  let n = 1;
  while (await prisma.contentItem.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
  return candidate;
}

export async function reviseContentItem(item: ContentItem): Promise<void> {
  await prisma.contentItem.update({
    where: { id: item.id },
    data: { status: "REVISING" },
  });

  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: AI_REVISE_MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `BAŞLIK: ${item.rawTitle}\n\nİÇERİK:\n${item.rawContent}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("AI yanıtında metin bloğu yok");
    }

    const result = parseReviseResponse(textBlock.text);

    if (result.reject) {
      await prisma.contentItem.update({
        where: { id: item.id },
        data: {
          status: "REJECTED",
          failureReason: result.rejectReason || "AI tarafından reddedildi",
        },
      });
      return;
    }

    const slug = await uniqueSlug(result.title);

    await prisma.contentItem.update({
      where: { id: item.id },
      data: {
        aiTitle: result.title,
        aiContent: result.content,
        slug,
        status: "IN_REVIEW",
      },
    });
  } catch (err) {
    await prisma.contentItem.update({
      where: { id: item.id },
      data: {
        status: "FAILED",
        failureReason: err instanceof Error ? err.message : "bilinmeyen hata",
      },
    });
    throw err;
  }
}

export async function reviseScrapedBatch(limit = 5): Promise<number> {
  const items = await prisma.contentItem.findMany({
    where: { status: "SCRAPED" },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  let revised = 0;
  for (const item of items) {
    try {
      await reviseContentItem(item);
      revised += 1;
    } catch (err) {
      console.error(`[ai-revise] öğe hatası ${item.id}:`, err);
    }
  }
  return revised;
}
