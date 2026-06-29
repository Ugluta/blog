export const ART = [
  'from-fuchsia-500 via-purple-500 to-indigo-600',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-blue-500 via-indigo-500 to-violet-600',
  'from-pink-500 via-rose-500 to-orange-400',
  'from-cyan-400 via-sky-500 to-blue-600',
];

export function artFor(i: number) {
  return ART[((i % ART.length) + ART.length) % ART.length];
}

export function ArtThumb({
  i = 0, label, className,
}: {
  i?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${artFor(i)} ${className ?? 'aspect-[16/9]'}`}>
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:14px_14px]" />
      {label && (
        <div className="absolute bottom-3 left-4">
          <span className="font-mono text-white/90 text-base font-bold tracking-tight drop-shadow">{label}</span>
        </div>
      )}
    </div>
  );
}
