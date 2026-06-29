export function PageHero({
  eyebrow, title, subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(99,102,241,0.30),transparent)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
        {eyebrow && (
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-3">{eyebrow}</span>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-300 text-lg mt-4 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
