export interface InstagramPostResult {
  id: string;
  url: string;
}

export async function postToInstagram(params: {
  imageUrl: string;
  caption: string;
  accessToken: string;
  igUserId: string;
}): Promise<InstagramPostResult> {
  // Step 1: create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${params.igUserId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: params.imageUrl,
        caption: params.caption.slice(0, 2200),
        access_token: params.accessToken,
      }),
    }
  );

  if (!containerRes.ok) {
    const err = await containerRes.json().catch(() => ({}));
    throw new Error(`Instagram container ${containerRes.status}: ${JSON.stringify(err)}`);
  }

  const { id: creationId } = await containerRes.json();

  // Step 2: wait for container processing then publish
  await new Promise((r) => setTimeout(r, 3000));

  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${params.igUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: params.accessToken,
      }),
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.json().catch(() => ({}));
    throw new Error(`Instagram publish ${publishRes.status}: ${JSON.stringify(err)}`);
  }

  const data = await publishRes.json();
  const mediaId = data.id as string;
  return {
    id: mediaId,
    url: `https://www.instagram.com/p/${mediaId}/`,
  };
}

export function buildInstagramCaption(title: string, excerpt: string, tags: string[]): string {
  const hashTags = tags.slice(0, 10).map((t) => `#${t.replace(/\s+/g, '')}`).join(' ');
  return `${title}\n\n${excerpt ? excerpt.slice(0, 400) : ''}\n\n${hashTags}`;
}
