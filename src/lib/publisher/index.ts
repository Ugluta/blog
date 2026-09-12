import { publishTweet } from "./twitter";
import { publishToInstagram } from "./instagram";
import { publishToYouTube } from "./youtube";
import { publishToLinkedIn } from "./linkedin";
import { publishToFacebook } from "./facebook";

export interface SocialAccountData {
  platform: string;
  accessToken: string;
  refreshToken?: string | null;
  platformUserId: string;
  metadata?: Record<string, string> | null;
}

export interface PublishJobData {
  caption?: string | null;
  hashtags?: string[];
  videoUrl?: string | null;
  imageUrl?: string | null;
  title?: string | null;
}

export interface PublishResult {
  platformPostId: string;
  platformUrl?: string;
}

export async function publishToPlatform(
  account: SocialAccountData,
  job: PublishJobData
): Promise<PublishResult> {
  const hashtagStr = (job.hashtags ?? []).map((h) => `#${h}`).join(" ");
  const text = [job.caption, hashtagStr].filter(Boolean).join("\n\n");

  switch (account.platform) {
    case "TWITTER": {
      const result = await publishTweet(account.accessToken, text);
      return {
        platformPostId: result.id,
        platformUrl: `https://twitter.com/i/web/status/${result.id}`,
      };
    }

    case "INSTAGRAM": {
      const meta = (account.metadata ?? {}) as Record<string, string>;
      const igUserId = meta.ig_user_id ?? account.platformUserId;
      const result = await publishToInstagram(
        account.accessToken,
        igUserId,
        text,
        job.imageUrl ?? undefined,
        job.videoUrl ?? undefined
      );
      return { platformPostId: result.id };
    }

    case "YOUTUBE": {
      if (!job.videoUrl) throw new Error("YouTube yayını için video URL gerekli");
      const result = await publishToYouTube(
        account.accessToken,
        job.videoUrl,
        job.title ?? text.substring(0, 100),
        text,
        job.hashtags ?? []
      );
      return { platformPostId: result.id, platformUrl: result.url };
    }

    case "LINKEDIN": {
      const meta = (account.metadata ?? {}) as Record<string, string>;
      const personUrn = meta.person_urn ?? account.platformUserId;
      const result = await publishToLinkedIn(
        account.accessToken,
        personUrn,
        text,
        job.imageUrl ?? undefined
      );
      return { platformPostId: result.id };
    }

    case "FACEBOOK_PAGE":
    case "FACEBOOK_GROUP": {
      const meta = (account.metadata ?? {}) as Record<string, string>;
      const pageId = meta.page_id ?? account.platformUserId;
      const pageToken = meta.page_access_token ?? account.accessToken;
      const result = await publishToFacebook(
        pageToken,
        pageId,
        text,
        job.videoUrl ?? undefined,
        job.imageUrl ?? undefined
      );
      return { platformPostId: result.id };
    }

    default:
      throw new Error(`Desteklenmeyen platform: ${account.platform}`);
  }
}
