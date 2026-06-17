import { notFound } from "next/navigation";
import PostEditor from "../PostEditor";

export const dynamic = "force-dynamic";

async function getPost(id: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true, icon: true } },
      },
    });
  } catch {
    return null;
  }
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <PostEditor
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        coverImage: post.coverImage ?? "",
        status: post.status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED",
        categoryId: post.categoryId ?? "",
        tags: post.tags,
        featured: post.featured,
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
      }}
    />
  );
}
