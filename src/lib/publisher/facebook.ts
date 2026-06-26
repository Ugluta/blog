export interface FacebookPostResult {
  id: string;
  url: string;
}

export async function postToFacebook(params: {
  message: string;
  link?: string;
  accessToken: string;
  pageId: string;
}): Promise<FacebookPostResult> {
  const body: Record<string, string> = {
    message: params.message,
    access_token: params.accessToken,
  };
  if (params.link) body.link = params.link;

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${params.pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Facebook API ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const postId = data.id as string;
  return {
    id: postId,
    url: `https://www.facebook.com/${postId.replace('_', '/posts/')}`,
  };
}

export function buildFacebookText(title: string, excerpt: string, url: string): string {
  return `${title}\n\n${excerpt ? excerpt.slice(0, 300) + '...' : ''}\n\n${url}`;
}
