'use client';
import { useState } from 'react';
import { TrendingUp, Target, Info } from 'lucide-react';

type Mode = 'kar' | 'satis';
type Unit = 'percent' | 'amount';

function tl(n: number) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
}
function pct(n: number) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
}
const num = (s: string) => { const v = parseFloat(String(s).replace(',', '.')); return isFinite(v) ? v : 0; };

function Row({ label, value, strong, color }: { label: string; value: string; strong?: boolean; color?: string }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${strong ? 'border-t border-gray-200 mt-1 pt-3' : 'border-b border-gray-50'}`}>
      <span className={`text-sm ${strong ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm font-semibold ${color ?? (strong ? 'text-gray-900' : 'text-gray-700')} ${strong ? 'text-lg' : ''}`}>{value}</span>
    </div>
  );
}

function UnitInput({
  label, value, onValue, unit, onUnit, allowUnit = true, suffix,
}: {
  label: string; value: string; onValue: (v: string) => void;
  unit?: Unit; onUnit?: (u: Unit) => void; allowUnit?: boolean; suffix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex">
        <input
          type="number" inputMode="decimal" value={value} onChange={(e) => onValue(e.target.value)}
          placeholder="0"
          className="flex-1 h-11 px-3 text-sm border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
        />
        {allowUnit && unit && onUnit ? (
          <div className="flex border border-l-0 border-gray-200 rounded-r-xl overflow-hidden">
            <button type="button" onClick={() => onUnit('percent')} className={`px-3 text-sm font-medium ${unit === 'percent' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'}`}>%</button>
            <button type="button" onClick={() => onUnit('amount')} className={`px-3 text-sm font-medium ${unit === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'}`}>₺</button>
          </div>
        ) : (
          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl">{suffix ?? '₺'}</span>
        )}
      </div>
    </div>
  );
}

export function HesaplamaClient() {
  const [mode, setMode] = useState<Mode>('kar');

  // boş başlar — kullanıcı kendi rakamlarını girer
  const [alis, setAlis] = useState('');
  const [komisyon, setKomisyon] = useState('');
  const [komisyonU, setKomisyonU] = useState<Unit>('percent');
  const [kargo, setKargo] = useState('');
  const [ekstra, setEkstra] = useState('');
  const [ekstraU, setEkstraU] = useState<Unit>('percent');
  const [satis, setSatis] = useState('');
  const [hedefKar, setHedefKar] = useState('');

  const A = num(alis), K = num(kargo);

  // ---- KÂR MODU (ileri) ----
  const S = num(satis);
  const komF = komisyonU === 'percent' ? S * num(komisyon) / 100 : num(komisyon);
  const ekF = ekstraU === 'percent' ? S * num(ekstra) / 100 : num(ekstra);
  const netKar = S - komF - A - K - ekF;
  const karMarji = S > 0 ? (netKar / S) * 100 : 0;
  const roi = A > 0 ? (netKar / A) * 100 : 0;

  // ---- SATIŞ MODU (ters) ----
  const P = num(hedefKar);
  const pSum = (komisyonU === 'percent' ? num(komisyon) / 100 : 0) + (ekstraU === 'percent' ? num(ekstra) / 100 : 0);
  const fixed = A + P + K + (komisyonU === 'amount' ? num(komisyon) : 0) + (ekstraU === 'amount' ? num(ekstra) : 0);
  const gecersiz = pSum >= 1;
  const gerekenSatis = gecersiz ? Infinity : fixed / (1 - pSum);
  const sKom = komisyonU === 'percent' ? gerekenSatis * num(komisyon) / 100 : num(komisyon);
  const sEk = ekstraU === 'percent' ? gerekenSatis * num(ekstra) / 100 : num(ekstra);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* GIRDILER */}
      <div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          <button onClick={() => setMode('kar')} className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold transition-colors ${mode === 'kar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
            <TrendingUp className="w-4 h-4" /> Kâr Hesapla
          </button>
          <button onClick={() => setMode('satis')} className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold transition-colors ${mode === 'satis' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
            <Target className="w-4 h-4" /> Satış Fiyatı Bul
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <UnitInput label="Alış Fiyatı" value={alis} onValue={setAlis} allowUnit={false} />

          {mode === 'kar'
            ? <UnitInput label="Satış Fiyatı" value={satis} onValue={setSatis} allowUnit={false} />
            : <UnitInput label="Hedef Net Kâr" value={hedefKar} onValue={setHedefKar} allowUnit={false} />}

          <UnitInput label="Komisyon" value={komisyon} onValue={setKomisyon} unit={komisyonU} onUnit={setKomisyonU} />
          <UnitInput label="Kargo Maliyeti" value={kargo} onValue={setKargo} allowUnit={false} />
          <UnitInput label="Ekstra Maliyet (paketleme vb.)" value={ekstra} onValue={setEkstra} unit={ekstraU} onUnit={setEkstraU} />

          <p className="flex items-start gap-2 text-xs text-gray-400 pt-1">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Komisyon ve ekstra “%” seçiliyse <strong className="font-semibold text-gray-500">satış fiyatı</strong> üzerinden hesaplanır ve satıştan düşülür.
          </p>
        </div>
      </div>

      {/* SONUÇ */}
      <div className="lg:sticky lg:top-24 self-start">
        {mode === 'kar' ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className={`p-6 text-center ${netKar >= 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-rose-500 to-red-600'} text-white`}>
              <p className="text-sm text-white/80">Net Kâr</p>
              <p className="text-4xl font-extrabold mt-1">{tl(netKar)}</p>
              <div className="flex items-center justify-center gap-6 mt-3 text-sm">
                <span>Kâr Marjı: <strong>{pct(karMarji)}</strong></span>
                <span>ROI: <strong>{pct(roi)}</strong></span>
              </div>
            </div>
            <div className="p-6">
              <Row label="Satış Fiyatı" value={tl(S)} />
              <Row label={`Komisyon${komisyonU === 'percent' ? ` (%${num(komisyon)})` : ''}`} value={'− ' + tl(komF)} color="text-rose-600" />
              <Row label="Alış Fiyatı" value={'− ' + tl(A)} color="text-rose-600" />
              <Row label="Kargo" value={'− ' + tl(K)} color="text-rose-600" />
              <Row label={`Ekstra${ekstraU === 'percent' ? ` (%${num(ekstra)})` : ''}`} value={'− ' + tl(ekF)} color="text-rose-600" />
              <Row label="Net Kâr" value={tl(netKar)} strong color={netKar >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 text-center bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <p className="text-sm text-white/80">Önerilen Satış Fiyatı</p>
              <p className="text-4xl font-extrabold mt-1">{gecersiz ? '—' : tl(gerekenSatis)}</p>
              <p className="text-sm text-white/80 mt-2">{P > 0 ? `${tl(P)} net kâr için` : ''}</p>
            </div>
            <div className="p-6">
              {gecersiz ? (
                <p className="text-sm text-rose-600 text-center py-4">Komisyon + ekstra yüzdesi %100’ü geçemez. Değerleri düzeltin.</p>
              ) : (
                <>
                  <Row label="Önerilen Satış Fiyatı" value={tl(gerekenSatis)} strong color="text-blue-600" />
                  <Row label={`Komisyon${komisyonU === 'percent' ? ` (%${num(komisyon)})` : ''}`} value={'− ' + tl(sKom)} color="text-rose-600" />
                  <Row label="Alış Fiyatı" value={'− ' + tl(A)} color="text-rose-600" />
                  <Row label="Kargo" value={'− ' + tl(K)} color="text-rose-600" />
                  <Row label={`Ekstra${ekstraU === 'percent' ? ` (%${num(ekstra)})` : ''}`} value={'− ' + tl(sEk)} color="text-rose-600" />
                  <Row label="Kalan Net Kâr" value={tl(P)} strong color="text-emerald-600" />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
