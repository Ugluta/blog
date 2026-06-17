"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/mockData";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const initial = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.floor(initial + (target - initial) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatCard({
  stat,
  delay,
  visible,
}: {
  stat: (typeof stats)[0];
  delay: number;
  visible: boolean;
}) {
  const count = useCountUp(stat.value, 2000, visible);

  return (
    <div
      className="text-center px-6 py-8 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 stat-animated"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div
        className="text-4xl font-black mb-2 font-inter"
        style={{ color: "#F59E0B" }}
      >
        {visible ? formatNumber(count) : "0"}
        {stat.suffix}
      </div>
      <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-inter">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="my-10 rounded-2xl p-8"
      style={{ backgroundColor: "#1E293B" }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Rakamlarla KURUMSAL
        </h2>
        <p className="text-sm text-slate-400 font-inter">
          15 yıllık deneyimle Türkiye'nin önde gelen haber platformu
        </p>
        <div className="mt-3 h-0.5 w-20 mx-auto rounded" style={{ backgroundColor: "#F59E0B" }} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} delay={i * 150} visible={visible} />
        ))}
      </div>
    </section>
  );
}
