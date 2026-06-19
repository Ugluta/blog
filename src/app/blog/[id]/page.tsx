import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

// Blog posts historically used numeric IDs from mockData.
// For real posts, resolve by id (cuid) or slug and redirect to canonical /haber/[slug].
export default async function BlogPostRedirect({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post
    .findFirst({
      where: { OR: [{ id }, { slug: id }], status: "PUBLISHED" },
      select: { slug: true },
    })
    .catch(() => null);

  if (post) redirect(`/blog/${post.slug}`);
  redirect("/blog");
}
