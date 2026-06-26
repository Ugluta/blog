export interface TwitterPostResult {
  id: string;
  text: string;
  url: string;
}

export async function postToTwitter(params: {
  text: string;
  accessToken: string;
}): Promise<TwitterPostResult> {
  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: params.text.slice(0, 280) }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Twitter API ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const tweetId = data.data?.id as string;
  return {
    id: tweetId,
    text: data.data?.text ?? params.text,
    url: `https://twitter.com/i/web/status/${tweetId}`,
  };
}

export function buildTweetText(title: string, excerpt: string, url: string, tags: string[]): string {
  const hashTags = tags.slice(0, 3).map((t) => `#${t.replace(/\s+/g, '')}`).join(' ');
  const base = `${title}\n\n${url}`;
  const withTags = hashTags ? `${base}\n\n${hashTags}` : base;
  if (withTags.length <= 280) return withTags;
  const maxTitle = 280 - url.length - (hashTags ? hashTags.length + 4 : 0) - 4;
  return `${title.slice(0, maxTitle)}...\n\n${url}${hashTags ? `\n\n${hashTags}` : ''}`;
}
