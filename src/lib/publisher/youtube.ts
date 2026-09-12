import axios from "axios";

export interface YouTubeUploadResult {
  id: string;
  url: string;
}

export async function publishToYouTube(
  accessToken: string,
  videoUrl: string,
  title: string,
  description: string,
  tags: string[] = []
): Promise<YouTubeUploadResult> {
  const videoResponse = await axios.get<ArrayBuffer>(videoUrl, { responseType: "arraybuffer" });
  const videoBuffer = Buffer.from(videoResponse.data);

  const initResponse = await axios.post(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      snippet: {
        title: title.substring(0, 100),
        description,
        tags: tags.slice(0, 30),
        categoryId: "22",
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": videoBuffer.byteLength,
        "X-Upload-Content-Type": "video/mp4",
      },
    }
  );

  const uploadUrl = initResponse.headers.location as string;
  if (!uploadUrl) throw new Error("No YouTube resumable upload URL returned");

  const { data } = await axios.put(uploadUrl, videoBuffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "video/mp4",
      "Content-Length": videoBuffer.byteLength,
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  return { id: data.id, url: `https://youtube.com/watch?v=${data.id}` };
}

export async function refreshGoogleToken(
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: Date }> {
  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}
