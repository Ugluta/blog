"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Comment = {
  id: string; content: string; status: string;
  guestName?: string | null; guestEmail?: string | null;
  createdAt: string; ipAddress?: string | null;
  user?: { id: string; name?: string | null; email: string; image?: string | null } | null;
  post: { id: string; title: string; slug: string };
};

const STATUS_OPTS = [
  { key: "", label: "Tümü" },
  { key: "PENDING", label: "Bekleyen" },
  { key: "APPROVED", label: "Onaylı" },
  { key: "REJECTED", label: "Reddedildi" },
  { key: "SPAM", label: "Spam" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-[#EBF2FA] text-[#666666]",
  SPAM: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor", APPROVED: "Onaylı", REJECTED: "Reddedildi", SPAM: "Spam",
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/comments?${params}`);
      const data = await res.json();
      setComments(data.comments ?? []);
      setTotal(data.total ?? 0);
    } catch { setComments([]); }
    finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast(STATUS_LABELS[status] + " olarak işaretlendi");
  };

  const deleteComment = async (id: string) => {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setComments(prev => prev.filter(c => c.id !== id));
    setTotal(t => t - 1);
    showToast("Yorum silindi");
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#FFFFFF] border border-[#3A6EA8]/40 text-[#3A6EA8] px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111111]">Yorum Moderasyonu</h1>
          <p className="text-sm text-[#666666] mt-0.5">{total} yorum</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-[#FFFFFF] rounded-xl p-1 border border-[#E7E2D8] w-fit">
        {STATUS_OPTS.map(opt => (
          <button key={opt.key} onClick={() => { setStatusFilter(opt.key); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === opt.key ? "bg-[#3A6EA8] text-white" : "text-[#666666] hover:text-[#111111]"
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-[#FFFFFF] animate-pulse" />)}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E7E2D8]">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-[#666666]">Bu kategoride yorum yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => {
            const author = comment.user?.name ?? comment.guestName ?? "Misafir";
            const email = comment.user?.email ?? comment.guestEmail;
            return (
              <div key={comment.id} className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-[#111111]">{author}</span>
                      {email && <span className="text-xs text-[#666666]">{email}</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[comment.status] ?? STATUS_COLORS.PENDING}`}>
                        {STATUS_LABELS[comment.status] ?? comment.status}
                      </span>
                      <span className="text-xs text-[#666666]">
                        {new Date(comment.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-[#444444] leading-relaxed line-clamp-3">{comment.content}</p>
                    <Link href={`/haberler/${comment.post.slug}`} target="_blank"
                      className="text-xs text-[#3A6EA8]/70 hover:text-[#3A6EA8] mt-1 inline-block transition-colors">
                      {comment.post.title} ↗
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {comment.status !== "APPROVED" && (
                      <button onClick={() => updateStatus(comment.id, "APPROVED")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors">
                        Onayla
                      </button>
                    )}
                    {comment.status !== "REJECTED" && (
                      <button onClick={() => updateStatus(comment.id, "REJECTED")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#666666] transition-colors">
                        Reddet
                      </button>
                    )}
                    {comment.status !== "SPAM" && (
                      <button onClick={() => updateStatus(comment.id, "SPAM")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#EBF2FA] hover:bg-orange-500/20 text-[#666666] hover:text-orange-400 transition-colors">
                        Spam
                      </button>
                    )}
                    <button onClick={() => deleteComment(comment.id)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[#EBF2FA] hover:bg-red-100 text-[#666666] hover:text-red-700 transition-colors">
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#444444] disabled:opacity-40 transition-colors">
            ← Önceki
          </button>
          <span className="text-xs text-[#666666]">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#444444] disabled:opacity-40 transition-colors">
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
