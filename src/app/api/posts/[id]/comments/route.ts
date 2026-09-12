import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id: slug } = await params;
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1"));
  const limit = 20;

  const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId: post.id, status: "APPROVED", parentId: null },
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          where: { status: "APPROVED" },
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.comment.count({ where: { postId: post.id, status: "APPROVED", parentId: null } }),
  ]);

  return NextResponse.json({ comments, total, page, limit });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id: slug } = await params;
  const session = await auth();
  const body = await req.json();
  const { content, parentId, guestName, guestEmail } = body;

  if (!content?.trim() || content.trim().length < 2) {
    return NextResponse.json({ error: "Yorum çok kısa" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED", commentsEnabled: true },
    select: { id: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!session?.user?.id) {
    if (!guestName?.trim()) return NextResponse.json({ error: "İsim gerekli" }, { status: 400 });
    if (!guestEmail?.trim()) return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? null;

  const comment = await prisma.comment.create({
    data: {
      postId: post.id,
      userId: session?.user?.id ?? null,
      parentId: parentId ?? null,
      content: content.trim(),
      guestName: session?.user?.id ? null : guestName?.trim(),
      guestEmail: session?.user?.id ? null : guestEmail?.trim(),
      status: session?.user?.id ? "APPROVED" : "PENDING",
      ipAddress: ip,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
