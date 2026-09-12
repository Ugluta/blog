import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createHash, randomBytes } from "crypto";

function generateState(userId: string, platform: string): string {
  const ts = Date.now();
  const rand = randomBytes(8).toString("hex");
  const raw = `${userId}:${platform}:${ts}:${rand}`;
  const sig = createHash("sha256")
    .update(raw + (process.env.NEXTAUTH_SECRET ?? "secret"))
    .digest("hex")
    .substring(0, 16);
  return Buffer.from(`${raw}:${sig}`).toString("base64url");
}

function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

function twitterAuthUrl(state: string, codeVerifier: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.TWITTER_CLIENT_ID ?? "",
    redirect_uri: redirect,
    scope: "tweet.read tweet.write users.read offline.access",
    state,
    code_challenge: generateCodeChallenge(codeVerifier),
    code_challenge_method: "S256",
  });
  return `https://twitter.com/i/oauth2/authorize?${params}`;
}

function metaAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const scope =
    platform === "instagram"
      ? "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement"
      : "pages_manage_posts,publish_to_groups,pages_show_list";
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID ?? "",
    redirect_uri: redirect,
    scope,
    response_type: "code",
    state,
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
}

function googleAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirect,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function linkedinAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
    redirect_uri: redirect,
    scope: "w_member_social r_liteprofile r_emailaddress",
    state,
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
}

function tiktokAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY ?? "",
    redirect_uri: redirect,
    response_type: "code",
    scope: "user.info.basic,video.upload,video.publish",
    state,
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
}

function pinterestAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    client_id: process.env.PINTEREST_APP_ID ?? "",
    redirect_uri: redirect,
    response_type: "code",
    scope: "boards:read,pins:read,pins:write",
    state,
  });
  return `https://www.pinterest.com/oauth/?${params}`;
}

function redditAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_CLIENT_ID ?? "",
    response_type: "code",
    state,
    redirect_uri: redirect,
    duration: "permanent",
    scope: "submit identity",
  });
  return `https://www.reddit.com/api/v1/authorize?${params}`;
}

function mediumAuthUrl(state: string, platform: string): string {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const params = new URLSearchParams({
    client_id: process.env.MEDIUM_CLIENT_ID ?? "",
    scope: "basicProfile,publishPost",
    state,
    response_type: "code",
    redirect_uri: redirect,
  });
  return `https://medium.com/m/oauth/authorize?${params}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/giris", req.url));
  }

  const { platform } = await params;
  const state = generateState(session.user.id, platform);

  let authUrl: string;
  let codeVerifier: string | undefined;

  switch (platform) {
    case "twitter":
      codeVerifier = generateCodeVerifier();
      authUrl = twitterAuthUrl(state, codeVerifier, platform);
      break;
    case "instagram":
    case "facebook_page":
    case "facebook_group":
      authUrl = metaAuthUrl(state, platform);
      break;
    case "youtube":
      authUrl = googleAuthUrl(state, platform);
      break;
    case "linkedin":
      authUrl = linkedinAuthUrl(state, platform);
      break;
    case "tiktok":
      authUrl = tiktokAuthUrl(state, platform);
      break;
    case "pinterest":
      authUrl = pinterestAuthUrl(state, platform);
      break;
    case "reddit":
      authUrl = redditAuthUrl(state, platform);
      break;
    case "medium":
      authUrl = mediumAuthUrl(state, platform);
      break;
    default:
      return NextResponse.json({ error: "Desteklenmeyen platform" }, { status: 400 });
  }

  const response = NextResponse.redirect(authUrl);
  const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 600, sameSite: "lax" as const, path: "/" };
  response.cookies.set("oauth_state", state, cookieOpts);
  if (codeVerifier) {
    response.cookies.set("oauth_code_verifier", codeVerifier, cookieOpts);
  }

  return response;
}
