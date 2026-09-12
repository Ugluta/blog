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

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatCard({
  stat,
  visible,
}: {
  stat: (typeof stats)[0];
  visible: boolean;
}) {
  const count = useCountUp(stat.value, 2000, visible);

  return (
    <div className="text-center px-6 py-8">
      <div
        className="text-4xl font-black mb-2"
        style={{ color: "#F59E0B", fontFamily: "'Inter', sans-serif" }}
      >
        {visible ? formatNumber(count) : "0"}
        {stat.suffix}
      </div>
      <div className="text-sm font-medium uppercase tracking-widest text-slate-400">
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
      className="anim-fade-in anim-delay-200"
      style={{ backgroundColor: "#0F172A", borderTop: "1px solid rgba(51,65,85,0.4)", borderBottom: "1px solid rgba(51,65,85,0.4)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* Section label */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-medium">
            RAKAMLARLA KURUMSAL
          </p>
        </div>

        {/* Stats row with vertical dividers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-700/40">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
