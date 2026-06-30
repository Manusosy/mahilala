import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface CounterStatProps {
  target: number;
  label: string;
  suffix?: string;
  prefix?: string;
  active: boolean;
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    startTimeRef.current = start;

    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, active]);

  return count;
}

function CounterStat({ target, label, suffix = '', prefix = '', active }: CounterStatProps) {
  const count = useCountUp(target, 2000, active);
  return (
    <div className="text-center flex-1 min-w-[120px]">
      <div className="text-4xl sm:text-5xl font-bold text-[#111111] font-sora mb-1">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-[#111111]/70 uppercase tracking-widest font-medium">{label}</div>
    </div>
  );
}

function StaticStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center flex-1 min-w-[120px]">
      <div className="text-4xl sm:text-5xl font-bold text-[#111111] font-sora mb-1">{value}</div>
      <div className="text-sm text-[#111111]/70 uppercase tracking-widest font-medium">{label}</div>
    </div>
  );
}

export function StatsBar() {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white py-14 px-4 border-b border-gray-100">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-0 md:divide-x md:divide-[#E5E7EB]">
        <CounterStat target={7} label={t.stats.countries} active={active} />
        <CounterStat target={3} label={t.stats.objectives} active={active} />
        <StaticStat value="Toliara" label={t.stats.alliance} />
        <CounterStat target={10} label={t.stats.pillars} active={active} />
      </div>
    </section>
  );
}
