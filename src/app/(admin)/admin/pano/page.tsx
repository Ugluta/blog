import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { MessageSquare, Pin, Eye } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pano' };

export default async function PanoPage() {
  const posts = await db.boardPost.findMany({
    include: {
      author: { select: { name: true } },
      group: { select: { name: true } },
      _count: { select: { replies: true } },
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Pano
          </h1>
          <p className="text-gray-500 text-sm">{posts.length} gönderi</p>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {post.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                  {post.group && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{post.group.name}</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{post.author.name}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post._count.replies} yanıt</span>
                </div>
              </div>
              <Link href={`/admin/pano/${post.id}`}
                className="ml-4 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg shrink-0">
                İncele
              </Link>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Henüz gönderi yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
