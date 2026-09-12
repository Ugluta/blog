"use client";

import { useState } from "react";
import { codeExamples } from "@/lib/mockData";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 font-inter ${
        copied
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200 border border-slate-600"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Kopyalandı!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Kopyala
        </>
      )}
    </button>
  );
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  JavaScript: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Python: "bg-green-500/20 text-green-400 border border-green-500/30",
  Go: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
};

function CodeBlock({ example }: { example: (typeof codeExamples)[0] }) {
  const langCls = languageColors[example.language] ?? "bg-slate-700 text-slate-400";

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${langCls}`}>
              {example.language}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-100">{example.title}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed font-inter">{example.description}</p>
        </div>
        <CopyButton code={example.code} />
      </div>

      {/* Code */}
      <div className="code-block overflow-x-auto" style={{ backgroundColor: "#0d1117" }}>
        <pre className="p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-slate-300">{example.code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function CodeExamples() {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold section-header" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kod Örnekleri
          </h2>
          <p className="text-sm text-slate-400 mt-1 ml-4 font-inter">
            Gerçek dünya kullanım senaryoları ve en iyi pratikler
          </p>
        </div>
        <a
          href="/kod-ornekleri"
          className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-inter flex items-center gap-1"
        >
          Tümünü Gör
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {codeExamples.map((example) => (
          <CodeBlock key={example.id} example={example} />
        ))}
      </div>
    </section>
  );
}
