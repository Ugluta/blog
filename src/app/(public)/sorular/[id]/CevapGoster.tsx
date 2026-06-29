'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  answer: string | null;
  explanation: string | null;
}

export default function CevapGoster({ answer, explanation }: Props) {
  const [shown, setShown] = useState(false);

  if (!answer && !explanation) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => setShown(!shown)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
      >
        {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {shown ? 'Cevabı Gizle' : 'Cevabı Göster'}
      </button>

      {shown && (
        <div className="mt-4 space-y-3">
          {answer && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Doğru Cevap</p>
              <p className="text-green-900 font-medium">{answer}</p>
            </div>
          )}
          {explanation && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Açıklama</p>
              <p className="text-blue-900 text-sm leading-relaxed">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
