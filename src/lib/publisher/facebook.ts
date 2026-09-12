import axios from "axios";

export interface FacebookPostResult {
  id: string;
}

export async function publishToFacebook(
  pageAccessToken: string,
  pageId: string,
  message: string,
  videoUrl?: string,
  imageUrl?: string
): Promise<FacebookPostResult> {
  const base = `https://graph.facebook.com/v19.0/${pageId}`;

  if (videoUrl) {
    const { data } = await axios.post(`${base}/videos`, {
      file_url: videoUrl,
      description: message,
      access_token: pageAccessToken,
    });
    return { id: data.id };
  }

  if (imageUrl) {
    const { data } = await axios.post(`${base}/photos`, {
      url: imageUrl,
      message,
      access_token: pageAccessToken,
    });
    return { id: data.id };
  }

  const { data } = await axios.post(`${base}/feed`, {
    message,
    access_token: pageAccessToken,
  });
  return { id: data.id };
}
