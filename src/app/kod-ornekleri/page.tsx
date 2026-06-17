"use client";

import { useState } from "react";
import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import { codeExamples } from "@/lib/mockData";

const EXTRA_EXAMPLES = [
  {
    id: 5,
    title: "BullMQ ile Arka Plan İş Kuyruğu",
    language: "TypeScript",
    description: "Next.js API route'larından BullMQ ile asenkron iş kuyruğu oluşturma ve işleme.",
    code: `import { Queue, Worker } from 'bullmq'
import { redis } from '@/lib/redis'

export const emailQueue = new Queue('emails', { connection: redis })

// Worker
new Worker('emails', async (job) => {
  const { to, subject, html } = job.data
  await sendEmail({ to, subject, html })
}, { connection: redis })

// Kuyruğa ekle
await emailQueue.add('welcome', {
  to: user.email,
  subject: 'Hoş Geldiniz!',
  html: welcomeTemplate(user),
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
})`,
  },
  {
    id: 6,
    title: "Zod ile API Validasyonu",
    language: "TypeScript",
    description: "Next.js API route'larında Zod şema doğrulaması ve tip güvenli istek işleme.",
    code: `import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const CreatePostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
  categoryId: z.string().cuid().optional(),
  tags: z.array(z.string()).max(10).default([]),
  publishedAt: z.coerce.date().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = CreatePostSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    )
  }

  const post = await prisma.post.create({ data: result.data })
  return NextResponse.json(post, { status: 201 })
}`,
  },
  {
    id: 7,
    title: "Python ile Web Scraping",
    language: "Python",
    description: "BeautifulSoup ve aiohttp kullanarak asenkron web scraping ve veri çekme.",
    code: `import asyncio
import aiohttp
from bs4 import BeautifulSoup
from dataclasses import dataclass

@dataclass
class Article:
    title: str
    url: str
    published_at: str

async def scrape_page(session: aiohttp.ClientSession, url: str) -> list[Article]:
    async with session.get(url, headers={"User-Agent": "Mozilla/5.0"}) as resp:
        html = await resp.text()

    soup = BeautifulSoup(html, "html.parser")
    articles = []

    for item in soup.select("article.news-item"):
        articles.append(Article(
            title=item.select_one("h2").get_text(strip=True),
            url=item.select_one("a")["href"],
            published_at=item.select_one("time")["datetime"],
        ))

    return articles

async def main():
    async with aiohttp.ClientSession() as session:
        results = await asyncio.gather(*[
            scrape_page(session, f"https://news.example.com/page/{i}")
            for i in range(1, 6)
        ])
    return [a for page in results for a in page]`,
  },
  {
    id: 8,
    title: "Go ile High-Performance API",
    language: "Go",
    description: "Gin framework ile Go'da yüksek performanslı REST API ve middleware yapısı.",
    code: `package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/redis/go-redis/v9"
)

func cacheMiddleware(rdb *redis.Client) gin.HandlerFunc {
    return func(c *gin.Context) {
        key := "cache:" + c.Request.URL.String()
        if val, err := rdb.Get(c, key).Bytes(); err == nil {
            c.Header("X-Cache", "HIT")
            c.Data(http.StatusOK, "application/json", val)
            c.Abort()
            return
        }
        c.Next()
    }
}

func main() {
    r := gin.Default()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})

    api := r.Group("/api/v1")
    api.Use(cacheMiddleware(rdb))
    {
        api.GET("/news", getNewsHandler)
        api.POST("/news", createNewsHandler)
    }

    r.Run(":8080")
}`,
  },
];

const allExamples = [...codeExamples, ...EXTRA_EXAMPLES];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  JavaScript: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Python: "bg-green-500/20 text-green-400 border border-green-500/30",
  Go: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
};

const allLanguages = ["Tümü", ...Array.from(new Set(allExamples.map((e) => e.language)))];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(code).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        copied
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-slate-700 text-slate-400 hover:bg-slate-600 border-slate-600"
      }`}
    >
      {copied ? "✓ Kopyalandı" : "Kopyala"}
    </button>
  );
}

export default function KodOrnekleriPage() {
  const [lang, setLang] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = allExamples.filter((e) => {
    const matchLang = lang === "Tümü" || e.language === lang;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <MegaHeader />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-300">Kod Örnekleri</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kod Örnekleri
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm">
            Gerçek dünya senaryolarına dayalı, kopyalamaya hazır kod parçaları. TypeScript, Python, Go ve daha fazlası.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Kod ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
          <div className="flex gap-2 flex-wrap">
            {allLanguages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  lang === l
                    ? "bg-amber-500 border-amber-500 text-slate-900"
                    : "border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-5">{filtered.length} örnek</p>

        {/* Examples */}
        <div className="space-y-5">
          {filtered.map((example) => (
            <div key={example.id} className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-700/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${LANG_COLORS[example.language] ?? "bg-slate-700 text-slate-400"}`}>
                      {example.language}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{example.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{example.description}</p>
                </div>
                <CopyButton code={example.code} />
              </div>
              <div className="overflow-x-auto" style={{ backgroundColor: "#0d1117" }}>
                <pre className="p-4 text-[13px] leading-relaxed">
                  <code className="font-mono text-slate-300">{example.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Aramanızla eşleşen örnek bulunamadı.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
