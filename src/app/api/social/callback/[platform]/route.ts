import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import axios from "axios";

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

async function exchangeTwitter(
  code: string,
  codeVerifier: string,
  platform: string
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date; userId: string; username: string }> {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;
  const { data } = await axios.post(
    "https://api.twitter.com/2/oauth2/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect,
      code_verifier: codeVerifier,
    }),
    {
      auth: {
        username: process.env.TWITTER_CLIENT_ID!,
        password: process.env.TWITTER_CLIENT_SECRET!,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const { data: me } = await axios.get("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    userId: me.data.id,
    username: me.data.username,
  };
}

async function exchangeMeta(
  code: string,
  platform: string
): Promise<{ accessToken: string; userId: string; username: string; metadata: Record<string, string> }> {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;

  const { data: tokenData } = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
    params: {
      client_id: process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      redirect_uri: redirect,
      code,
    },
  });

  // Get long-lived token
  const { data: longToken } = await axios.get(
    "https://graph.facebook.com/v19.0/oauth/access_token",
    {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: tokenData.access_token,
      },
    }
  );

  const { data: me } = await axios.get("https://graph.facebook.com/v19.0/me", {
    params: { access_token: longToken.access_token, fields: "id,name" },
  });

  const metadata: Record<string, string> = {};

  if (platform === "instagram") {
    // Get IG business account
    const { data: pages } = await axios.get("https://graph.facebook.com/v19.0/me/accounts", {
      params: { access_token: longToken.access_token },
    });
    const page = pages.data?.[0];
    if (page) {
      const { data: igAccount } = await axios.get(
        `https://graph.facebook.com/v19.0/${page.id}`,
        { params: { fields: "instagram_business_account", access_token: page.access_token } }
      );
      if (igAccount.instagram_business_account) {
        metadata.ig_user_id = igAccount.instagram_business_account.id;
        metadata.page_id = page.id;
        metadata.page_access_token = page.access_token;
      }
    }
  } else {
    const { data: pages } = await axios.get("https://graph.facebook.com/v19.0/me/accounts", {
      params: { access_token: longToken.access_token },
    });
    const page = pages.data?.[0];
    if (page) {
      metadata.page_id = page.id;
      metadata.page_access_token = page.access_token;
    }
  }

  return {
    accessToken: longToken.access_token,
    userId: me.id,
    username: me.name,
    metadata,
  };
}

async function exchangeGoogle(
  code: string,
  platform: string
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date; userId: string; username: string; metadata: Record<string, string> }> {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;

  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirect,
    grant_type: "authorization_code",
  });

  const { data: channel } = await axios.get(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    { headers: { Authorization: `Bearer ${data.access_token}` } }
  );

  const ch = channel.items?.[0];
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    userId: ch?.id ?? "unknown",
    username: ch?.snippet?.title ?? "YouTube Channel",
    metadata: { channel_id: ch?.id ?? "" },
  };
}

async function exchangeLinkedIn(
  code: string,
  platform: string
): Promise<{ accessToken: string; expiresAt?: Date; userId: string; username: string; metadata: Record<string, string> }> {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;

  const { data } = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { data: me } = await axios.get("https://api.linkedin.com/v2/me", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });

  const personUrn = `urn:li:person:${me.id}`;
  const displayName = `${me.localizedFirstName} ${me.localizedLastName}`.trim();

  return {
    accessToken: data.access_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    userId: me.id,
    username: displayName,
    metadata: { person_urn: personUrn },
  };
}

async function exchangeTikTok(
  code: string,
  platform: string
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date; userId: string; username: string }> {
  const redirect = `${BASE_URL()}/api/social/callback/${platform}`;

  const { data } = await axios.post(
    "https://open.tiktokapis.com/v2/oauth/token/",
    new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirect,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { data: userInfo } = await axios.post(
    "https://open.tiktokapis.com/v2/user/info/",
    { fields: ["open_id", "display_name", "avatar_url"] },
    { headers: { Authorization: `Bearer ${data.data.access_token}` } }
  );

  return {
    accessToken: data.data.access_token,
    refreshToken: data.data.refresh_token,
    expiresAt: new Date(Date.now() + data.data.expires_in * 1000),
    userId: userInfo.data.user.open_id,
    username: userInfo.data.user.display_name,
  };
}

const PLATFORM_MAP: Record<string, string> = {
  twitter: "TWITTER",
  instagram: "INSTAGRAM",
  facebook_page: "FACEBOOK_PAGE",
  facebook_group: "FACEBOOK_GROUP",
  youtube: "YOUTUBE",
  linkedin: "LINKEDIN",
  tiktok: "TIKTOK",
  pinterest: "PINTEREST",
  reddit: "REDDIT",
  medium: "MEDIUM",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const redirectBase = new URL("/uygulama/sosyal-hesaplar", req.url);

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/giris", req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    redirectBase.searchParams.set("error", error ?? "no_code");
    return NextResponse.redirect(redirectBase);
  }

  const stateCookie = req.cookies.get("oauth_state")?.value;
  if (!stateParam || stateParam !== stateCookie) {
    redirectBase.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(redirectBase);
  }

  try {
    let tokenData: {
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
      userId: string;
      username: string;
      metadata?: Record<string, string>;
    };

    switch (platform) {
      case "twitter": {
        const codeVerifier = req.cookies.get("oauth_code_verifier")?.value ?? "";
        tokenData = await exchangeTwitter(code, codeVerifier, platform);
        break;
      }
      case "instagram":
      case "facebook_page":
      case "facebook_group":
        tokenData = await exchangeMeta(code, platform);
        break;
      case "youtube":
        tokenData = await exchangeGoogle(code, platform);
        break;
      case "linkedin":
        tokenData = await exchangeLinkedIn(code, platform);
        break;
      case "tiktok":
        tokenData = await exchangeTikTok(code, platform);
        break;
      default:
        redirectBase.searchParams.set("error", "unsupported_platform");
        return NextResponse.redirect(redirectBase);
    }

    const dbPlatform = PLATFORM_MAP[platform] ?? platform.toUpperCase();
    const { prisma } = await import("@/lib/prisma");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).socialAccount.upsert({
      where: {
        userId_platform_platformUserId: {
          userId: session.user.id,
          platform: dbPlatform,
          platformUserId: tokenData.userId,
        },
      },
      create: {
        userId: session.user.id,
        platform: dbPlatform,
        platformUserId: tokenData.userId,
        displayName: tokenData.username,
        username: tokenData.username,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken ?? null,
        tokenExpiresAt: tokenData.expiresAt ?? null,
        metadata: tokenData.metadata ?? {},
        isActive: true,
      },
      update: {
        displayName: tokenData.username,
        username: tokenData.username,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken ?? null,
        tokenExpiresAt: tokenData.expiresAt ?? null,
        metadata: tokenData.metadata ?? {},
        isActive: true,
      },
    });

    redirectBase.searchParams.set("connected", platform);
    const response = NextResponse.redirect(redirectBase);
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_code_verifier");
    return response;
  } catch (err) {
    console.error(`[OAuth callback] ${platform} error:`, err);
    redirectBase.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(redirectBase);
  }
}
