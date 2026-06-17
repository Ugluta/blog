'use client';
import { useState, useEffect, useCallback } from 'react';
import { HelpCircle, Plus, Bot, Sparkles, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: string;
  content: string;
  type: string;
  difficulty: string;
  options?: Array<{ label: string; text: string; isCorrect: boolean }>;
  answer?: string;
  explanation?: string;
  isApproved: boolean;
  isAiGenerated: boolean;
  useCount: number;
  subject?: { name: string };
  grade?: { name: string };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: 'success', MEDIUM: 'warning', HARD: 'destructive', EXPERT: 'default',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Kolay', MEDIUM: 'Orta', HARD: 'Zor', EXPERT: 'Uzman',
};

export default function AdminSorularPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [aiForm, setAiForm] = useState({ subject: '', grade: '', topic: '', count: 5, type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM' });
  const [generating, setGenerating] = useState(false);

  const loadQuestions = useCallback(() => {
    fetch('/api/sorular?admin=1').then((r) => r.json()).then((d) => setQuestions(d.data || []));
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const generateWithAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/sorular/ai-olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm),
      });
      const data = await res.json();
      alert(`${data.count || 0} soru oluşturuldu!`);
      loadQuestions();
      setShowAI(false);
    } catch {
      alert('Hata oluştu');
    }
    setGenerating(false);
  };

  const approve = async (id: string, approved: boolean) => {
    await fetch(`/api/sorular/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: approved }),
    });
    loadQuestions();
  };

  const remove = async (id: string) => {
    if (!confirm('Soru silinsin mi?')) return;
    await fetch(`/api/sorular/${id}`, { method: 'DELETE' });
    loadQuestions();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Soru Bankası
          </h1>
          <p className="text-gray-500 text-sm">{questions.length} soru</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowAI(!showAI)}>
            <Sparkles className="w-4 h-4" /> AI ile Oluştur
          </Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Soru Ekle</Button>
        </div>
      </div>

      {showAI && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">AI ile Soru Oluştur</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Ders</label>
              <input value={aiForm.subject} onChange={(e) => setAiForm({ ...aiForm, subject: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Matematik" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Sınıf</label>
              <input value={aiForm.grade} onChange={(e) => setAiForm({ ...aiForm, grade: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="8. Sınıf" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Konu</label>
              <input value={aiForm.topic} onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Denklemler" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Soru Sayısı</label>
              <input type="number" min={1} max={20} value={aiForm.count}
                onChange={(e) => setAiForm({ ...aiForm, count: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Soru Tipi</label>
              <select value={aiForm.type} onChange={(e) => setAiForm({ ...aiForm, type: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="MULTIPLE_CHOICE">Çoktan Seçmeli</option>
                <option value="TRUE_FALSE">Doğru-Yanlış</option>
                <option value="SHORT_ANSWER">Kısa Cevap</option>
                <option value="FILL_BLANK">Boşluk Doldurma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Zorluk</label>
              <select value={aiForm.difficulty} onChange={(e) => setAiForm({ ...aiForm, difficulty: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="EASY">Kolay</option>
                <option value="MEDIUM">Orta</option>
                <option value="HARD">Zor</option>
                <option value="EXPERT">Uzman</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={generateWithAI} loading={generating}>
              <Sparkles className="w-4 h-4" /> Oluştur
            </Button>
            <Button variant="outline" onClick={() => setShowAI(false)}>İptal</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {q.subject && <Badge variant="default">{q.subject.name}</Badge>}
                  {q.grade && <Badge variant="outline">{q.grade.name}</Badge>}
                  <Badge variant={(DIFFICULTY_COLORS[q.difficulty] as 'success' | 'warning' | 'destructive' | 'default')}>
                    {DIFFICULTY_LABELS[q.difficulty]}
                  </Badge>
                  {q.isAiGenerated && <Badge variant="secondary"><Bot className="w-3 h-3 mr-1" />AI</Badge>}
                  {q.isApproved
                    ? <Badge variant="success">Onaylı</Badge>
                    : <Badge variant="warning">Beklemede</Badge>}
                </div>
                <p className="text-sm text-gray-900 font-medium">{q.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!q.isApproved && (
                  <button onClick={() => approve(q.id, true)}
                    className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check className="w-4 h-4" /></button>
                )}
                <button onClick={() => remove(q.id)}
                  className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
