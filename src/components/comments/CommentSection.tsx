"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type CommentUser = { id: string; name?: string | null; image?: string | null };

type Comment = {
  id: string; content: string; status: string;
  guestName?: string | null; createdAt: string;
  user?: CommentUser | null;
  replies?: Comment[];
};

type Props = { slug: string; postTitle?: string };

function Avatar({ user, guestName }: { user?: CommentUser | null; guestName?: string | null }) {
  const name = user?.name ?? guestName ?? "?";
  return (
    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
      {user?.image ? (
        <img src={user.image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
          {name[0]?.toUpperCase()}
        </div>
      )}
    </div>
  );
}

function CommentForm({
  slug, parentId, onSuccess, onCancel,
}: {
  slug: string; parentId?: string; onSuccess: (c: Comment) => void; onCancel?: () => void;
}) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const INPUT = "w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-600";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId, guestName, guestEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Hata oluştu"); return; }
      onSuccess(data.comment);
      setContent(""); setGuestName(""); setGuestEmail("");
    } catch { setError("Hata oluştu"); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {!session?.user && (
        <div className="grid grid-cols-2 gap-3">
          <input value={guestName} onChange={e => setGuestName(e.target.value)}
            placeholder="Adınız *" className={INPUT} required />
          <input value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
            type="email" placeholder="E-posta *" className={INPUT} required />
        </div>
      )}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={parentId ? "Yanıtınız…" : "Yorumunuzu yazın…"}
        rows={parentId ? 2 : 3}
        className={`${INPUT} resize-none`}
        required
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            İptal
          </button>
        )}
        <button type="submit" disabled={submitting || !content.trim()}
          className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 rounded-lg transition-colors">
          {submitting ? "Gönderiliyor…" : parentId ? "Yanıtla" : "Yorum Gönder"}
        </button>
      </div>
      {!session?.user && (
        <p className="text-xs text-slate-600">
          Yorumunuz onaylandıktan sonra yayınlanacak.
        </p>
      )}
    </form>
  );
}

function CommentItem({
  comment, slug, depth = 0, onDelete,
}: {
  comment: Comment; slug: string; depth?: number; onDelete: (id: string) => void;
}) {
  const { data: session } = useSession();
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);

  const authorName = comment.user?.name ?? comment.guestName ?? "Misafir";
  const isOwn = session?.user?.id === comment.user?.id;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session?.user?.role as string);

  const handleDelete = async () => {
    if (!confirm("Yorumu silmek istiyor musunuz?")) return;
    await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
    onDelete(comment.id);
  };

  return (
    <div className={`flex gap-3 ${depth > 0 ? "ml-10 mt-3" : ""}`}>
      <Avatar user={comment.user} guestName={comment.guestName} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-white">{authorName}</span>
          {!comment.user && (
            <span className="text-[10px] text-slate-600 border border-slate-700 rounded px-1">misafir</span>
          )}
          <span className="text-xs text-slate-600">
            {new Date(comment.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{comment.content}</p>
        <div className="flex items-center gap-3 mt-2">
          {depth === 0 && (
            <button onClick={() => setShowReply(v => !v)}
              className="text-xs text-slate-500 hover:text-amber-400 transition-colors">
              Yanıtla
            </button>
          )}
          {(isOwn || isAdmin) && (
            <button onClick={handleDelete}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors">
              Sil
            </button>
          )}
        </div>
        {showReply && (
          <div className="mt-3">
            <CommentForm slug={slug} parentId={comment.id}
              onSuccess={c => { setReplies(p => [...p, c]); setShowReply(false); }}
              onCancel={() => setShowReply(false)} />
          </div>
        )}
        {replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} slug={slug} depth={depth + 1}
            onDelete={id => setReplies(p => p.filter(r => r.id !== id))} />
        ))}
      </div>
    </div>
  );
}

export default function CommentSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingMsg, setPendingMsg] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}/comments`)
      .then(r => r.json())
      .then(d => { setComments(d.comments ?? []); setTotal(d.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleNew = (comment: Comment) => {
    if (comment.status === "PENDING") { setPendingMsg(true); setTimeout(() => setPendingMsg(false), 5000); return; }
    setComments(p => [comment, ...p]);
    setTotal(t => t + 1);
  };

  return (
    <section className="mt-12 border-t border-slate-800 pt-10">
      <h2 className="text-xl font-bold text-white mb-6">
        Yorumlar {total > 0 && <span className="text-slate-500 font-normal text-base">({total})</span>}
      </h2>

      <CommentForm slug={slug} onSuccess={handleNew} />

      {pendingMsg && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
          Yorumunuz onay bekliyor. Onaylandıktan sonra yayınlanacak.
        </div>
      )}

      <div className="mt-8 space-y-6">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-3/4" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">Henüz yorum yok. İlk yorumu siz yapın.</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} slug={slug}
              onDelete={id => { setComments(p => p.filter(c => c.id !== id)); setTotal(t => t - 1); }} />
          ))
        )}
      </div>
    </section>
  );
}
