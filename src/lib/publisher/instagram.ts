import axios from "axios";

export interface InstagramPostResult {
  id: string;
}

export async function publishToInstagram(
  accessToken: string,
  igUserId: string,
  caption: string,
  imageUrl?: string,
  videoUrl?: string
): Promise<InstagramPostResult> {
  const payload: Record<string, string> = { caption, access_token: accessToken };

  if (videoUrl) {
    payload.media_type = "REELS";
    payload.video_url = videoUrl;
    payload.share_to_feed = "true";
  } else if (imageUrl) {
    payload.image_url = imageUrl;
  } else {
    throw new Error("Instagram publishing requires an image or video URL");
  }

  const { data: container } = await axios.post(
    `https://graph.facebook.com/v19.0/${igUserId}/media`,
    payload
  );

  if (videoUrl) {
    await pollContainerReady(accessToken, container.id);
  }

  const { data: published } = await axios.post(
    `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
    { creation_id: container.id, access_token: accessToken }
  );

  return { id: published.id };
}

async function pollContainerReady(
  accessToken: string,
  containerId: string,
  maxAttempts = 12
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await axios.get(
      `https://graph.facebook.com/v19.0/${containerId}`,
      { params: { fields: "status_code", access_token: accessToken } }
    );
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") throw new Error("Instagram media container failed");
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("Instagram media container timed out");
}
