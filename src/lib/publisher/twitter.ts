import axios from "axios";

export interface TwitterPostResult {
  id: string;
  text: string;
}

export async function publishTweet(
  accessToken: string,
  text: string,
  mediaIds?: string[]
): Promise<TwitterPostResult> {
  const body: Record<string, unknown> = { text };
  if (mediaIds?.length) {
    body.media = { media_ids: mediaIds };
  }

  const { data } = await axios.post("https://api.twitter.com/2/tweets", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return data.data as TwitterPostResult;
}

export async function refreshTwitterToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }> {
  const clientId = process.env.TWITTER_CLIENT_ID!;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET!;

  const { data } = await axios.post(
    "https://api.twitter.com/2/oauth2/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
    {
      auth: { username: clientId, password: clientSecret },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}
