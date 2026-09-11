import type { ContentItem } from "@prisma/client";

export interface Publisher {
  platform: string;
  isConfigured(): Promise<boolean>;
  publish(item: ContentItem): Promise<void>;
}
