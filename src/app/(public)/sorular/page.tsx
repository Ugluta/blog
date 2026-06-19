import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { Pagination } from '@/components/ui/Pagination';
import { HelpCircle, Filter } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Difficulty, QuestionType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Soru Bankası',
  description: 'Tüm dersler için sınav soruları, test soruları ve egzersizler.',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: 'Kolay', MEDIUM: 'Orta', HARD: 'Zor', EXPERT: 'Uzman',
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

export default async function SorularPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const page = Number(params.sayfa) || 1;
  const perPage = 20;
  const subjectId = params.ders;
  const gradeId = params.sinif;
  const difficulty = params.zorluk as Difficulty | undefined;
  const type = params.tur as QuestionType | undefined;

  const where = {
    isPublic: true,
    isApproved: true,
    ...(subjectId && { subjectId }),
    ...(gradeId && { gradeId }),
    ...(difficulty && { difficulty }),
    ...(type && { type }),
  };

  const [questions, total, subjects] = await Promise.all([
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
  ]);

  const totalPages = Math.ceil(total / perPage);
  const activeFilters: Record<string, string> = {};
  if (params.ders) activeFilters.ders = params.ders;
  if (params.zorluk) activeFilters.zorluk = params.zorluk;

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
                <p className="text-gray-500 text-sm">{total.toLocaleString('tr-TR')} soru mevcut</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex gap-6">
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold text-sm">Filtrele</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ders</p>
                    <Link href="/sorular" className={`block py-1 px-2 text-sm rounded hover:bg-gray-50 ${
                      !subjectId ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}>Tümü</Link>
                    {subjects.map((s) => (
                      <Link key={s.id} href={`/sorular?ders=${s.id}`}
                        className={`block py-1 px-2 text-sm rounded hover:bg-gray-50 ${
                          subjectId === s.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                        }`}>{s.name}</Link>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Zorluk</p>
                    {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
                      <Link key={val} href={`/sorular?zorluk=${val}`}
                        className={`block py-1 px-2 text-sm rounded hover:bg-gray-50 ${
                          difficulty === val ? 'text-blue-600 font-medium' : 'text-gray-600'
                        }`}>{label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="space-y-4">
                {questions.map((q) => (
                  <Link key={q.id} href={`/sorular/${q.id}`}
                    className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-blue-100 transition-all">
                    <div className="flex flex-wrap gap-2 mb-3">
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
                    <p className="text-gray-900 font-medium text-sm leading-relaxed line-clamp-2">{q.content}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                      <span>{q.author.name}</span>
                      <span>{q.useCount} kez kullanıldı</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} baseUrl="/sorular" searchParams={activeFilters} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
