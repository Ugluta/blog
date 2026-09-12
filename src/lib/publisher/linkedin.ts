import axios from "axios";

export interface LinkedInPostResult {
  id: string;
}

export async function publishToLinkedIn(
  accessToken: string,
  personUrn: string,
  text: string,
  articleUrl?: string
): Promise<LinkedInPostResult> {
  const authorUrn = personUrn.startsWith("urn:li:") ? personUrn : `urn:li:person:${personUrn}`;

  const body: Record<string, unknown> = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: articleUrl ? "ARTICLE" : "NONE",
        ...(articleUrl
          ? { media: [{ status: "READY", originalUrl: articleUrl }] }
          : {}),
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const { data } = await axios.post("https://api.linkedin.com/v2/ugcPosts", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  const rawId: string = data.id ?? "";
  return { id: rawId.replace(/^urn:li:share:/, "") };
}
