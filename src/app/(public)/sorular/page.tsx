import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { SCHOOL_TYPE_LABELS } from '@/lib/utils';
import { HelpCircle, Filter } from 'lucide-react';
import type { Metadata } from 'next';
import type { Difficulty, QuestionType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Soru Bankası',
  description: 'Tüm dersler için sınav soruları, test soruları ve egzersizler.',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: 'Kolay',
  MEDIUM: 'Orta',
  HARD: 'Zor',
  EXPERT: 'Uzman',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: 'text-green-700 bg-green-50',
  MEDIUM: 'text-amber-700 bg-amber-50',
  HARD: 'text-red-700 bg-red-50',
  EXPERT: 'text-purple-700 bg-purple-50',
};

const TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: 'Çoktan Seçmeli',
  TRUE_FALSE: 'Doğru-Yanlış',
  SHORT_ANSWER: 'Kısa Cevap',
  ESSAY: 'Uzun Cevap',
  FILL_BLANK: 'Boşluk Doldurma',
  MATCHING: 'Eşleştirme',
};

export default async function SorularPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = Number(searchParams.sayfa) || 1;
  const perPage = 20;
  const subjectId = searchParams.ders;
  const gradeId = searchParams.sinif;
  const difficulty = searchParams.zorluk as Difficulty;
  const type = searchParams.tur as QuestionType;

  const where = {
    isPublic: true,
    isApproved: true,
    ...(subjectId && { subjectId }),
    ...(gradeId && { gradeId }),
    ...(difficulty && { difficulty }),
    ...(type && { type }),
  };

  const [questions, total, subjects, grades] = await Promise.all([
    db.question.findMany({
      where,
      include: {
        author: { select: { name: true } },
        subject: { select: { name: true, color: true } },
        grade: { select: { name: true } },
      },
      orderBy: { useCount: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.question.count({ where }),
    db.subject.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    db.grade.findMany({ orderBy: { level: 'asc' } }),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Soru Bankası</h1>
                <p className="text-gray-500 text-sm">{total.toLocaleString()} soru mevcut</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex gap-6">
            {/* Filter */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold text-sm">Filtrele</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ders</p>
                    {subjects.map((s) => (
                      <a key={s.id} href={`/sorular?ders=${s.id}`} className="block py-1 px-2 text-sm rounded hover:bg-gray-50 text-gray-600 hover:text-blue-600">{s.name}</a>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Zorluk</p>
                    {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
                      <a key={val} href={`/sorular?zorluk=${val}`} className={`block py-1 px-2 text-sm rounded hover:bg-gray-50 ${difficulty === val ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>{label}</a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Questions */}
            <div className="flex-1 space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {q.subject && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{q.subject.name}</span>
                      )}
                      {q.grade && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{q.grade.name}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[q.difficulty]}`}>
                        {DIFFICULTY_LABELS[q.difficulty]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {TYPE_LABELS[q.type]}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-900 font-medium text-sm leading-relaxed">{q.content}</p>

                  {q.options && Array.isArray(q.options) && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {(q.options as Array<{label: string; text: string; isCorrect: boolean}>).map((opt) => (
                        <div key={opt.label} className="flex items-start gap-2 p-2 rounded-lg border border-gray-100 text-sm">
                          <span className="font-semibold text-blue-600 shrink-0">{opt.label})</span>
                          <span className="text-gray-700">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                    <span>{q.author.name}</span>
                    <span>{q.useCount} kez kullanıldı</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
