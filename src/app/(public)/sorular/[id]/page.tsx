import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { HelpCircle, User, BarChart2, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import type { Difficulty, QuestionType } from '@prisma/client';
import CevapGoster from './CevapGoster';
import Link from 'next/link';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: 'Kolay', MEDIUM: 'Orta', HARD: 'Zor', EXPERT: 'Uzman',
};
const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-red-100 text-red-700',
  EXPERT: 'bg-purple-100 text-purple-700',
};
const TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: 'Çoktan Seçmeli',
  TRUE_FALSE: 'Doğru-Yanlış',
  SHORT_ANSWER: 'Kısa Cevap',
  ESSAY: 'Uzun Cevap',
  FILL_BLANK: 'Boşluk Doldurma',
  MATCHING: 'Eşleştirme',
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const q = await db.question.findUnique({ where: { id } });
  if (!q) return { title: 'Soru Bulunamadı' };
  return {
    title: `${TYPE_LABELS[q.type]} Sorusu | Soru Bankası`,
    description: q.content.slice(0, 160),
  };
}

export default async function SoruDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const q = await db.question.findUnique({
    where: { id, isPublic: true, isApproved: true },
    include: {
      author: { select: { name: true } },
      subject: { select: { name: true, color: true } },
      grade: { select: { name: true } },
    },
  });

  if (!q) notFound();

  await db.question.update({ where: { id }, data: { useCount: { increment: 1 } } });

  const options = q.options as Array<{ label: string; text: string; isCorrect: boolean }> | null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/sorular" className="hover:text-blue-600">Soru Bankası</Link>
              <span>›</span>
              <span>{TYPE_LABELS[q.type]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {q.subject && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                  {q.subject.name}
                </span>
              )}
              {q.grade && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {q.grade.name}
                </span>
              )}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[q.difficulty]}`}>
                {DIFFICULTY_LABELS[q.difficulty]}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {TYPE_LABELS[q.type]}
              </span>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-900 font-medium text-base leading-relaxed pt-1">{q.content}</p>
              </div>

              {options && options.length > 0 && (
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div key={opt.label}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {opt.label}
                      </span>
                      <span className="text-sm text-gray-700">{opt.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <CevapGoster answer={q.answer} explanation={q.explanation} />

              <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-50 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />{q.author.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" />{q.useCount} kez kullanıldı
                </span>
                {q.tags.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />{q.tags.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link href="/sorular"
                className="text-sm text-blue-600 hover:underline">
                ← Soru Bankasına Dön
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
