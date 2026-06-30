import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  environment: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7 7 4 10.5 4 14a8 8 0 0 0 16 0c0-3.5-3-7-8-12z" />
    </svg>
  ),
  orientation: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 11 11 8.5 15.5 13 13 15.5 8.5" />
    </svg>
  ),
  civics: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M17 6.5a3 3 0 0 1 0 5.8M20.5 20a5.5 5.5 0 0 0-4-5.3" />
    </svg>
  ),
  mentoring: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14v6M7.5 11v4.2c0 1 2 2.3 4.5 2.3s4.5-1.3 4.5-2.3V11" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};

/** Match a pillar label to an icon by keyword (locale-aware, order-independent). */
function getIconForPillar(pillar: string): React.ReactNode {
  const p = pillar.toLowerCase();
  if (/(wash|eau|água|maji|eah|climate|clima|hali|environ|mazingira|marine|blue|bleu|azul|bluu|économie|ambiente|oc[eé]an)/.test(p)) {
    return ICONS.environment;
  }
  if (/(orient|mwelekeo|toroy|guidance)/.test(p)) return ICONS.orientation;
  if (/(civic|civique|cívica|uraia|raia|citizen)/.test(p)) return ICONS.civics;
  if (/(communit|communaut|comunidade|jamii)/.test(p)) return ICONS.community;
  if (/(mentor|ushauri|mentorat|mentoria)/.test(p)) return ICONS.mentoring;
  return ICONS.default;
}

const ACCENT = '#F78A28';

export function ObjectivesSlider() {
  const { t } = useLanguage();
  const items = t.objectives.items;

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const hasMountedRef = useRef(false);
  const reducedRef = useRef(false);

  // Keep the active index valid if the item list changes (e.g. language switch).
  useEffect(() => {
    setActiveIndex((prev) => (prev >= items.length ? 0 : prev));
  }, [items.length]);

  // Entrance animation (scoped + reduced-motion aware, single binding).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-impact-head] > *', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.from('[data-impact-row]', {
        opacity: 0,
        x: -16,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.from('[data-impact-panel]', {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Gentle auto-advance, paused on hover/focus and disabled for reduced motion.
  useEffect(() => {
    if (reducedRef.current || items.length <= 1) return;
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items.length]);

  // Crossfade the detail panel when the active item changes (after first paint).
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (reducedRef.current || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    }
  };

  const active = items[activeIndex] ?? items[0];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#001BB7] py-24 px-4 overflow-hidden"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
      onFocusCapture={() => { isPausedRef.current = true; }}
      onBlurCapture={() => { isPausedRef.current = false; }}
    >
      {/* Depth + warmth decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 90% at 85% 0%, rgba(255,255,255,0.10), transparent 55%), radial-gradient(90% 80% at 0% 100%, rgba(247,138,40,0.18), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(80% 70% at 50% 30%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(80% 70% at 50% 30%, #000, transparent 75%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: heading + index list */}
        <div className="lg:col-span-5">
          <div data-impact-head>
            <span className="inline-flex items-center gap-2 text-white/80 uppercase tracking-widest text-xs font-bold border border-white/20 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
              {/* @ts-ignore - sectionLabel is optional across locales */}
              {t.objectives.sectionLabel || 'Strategic Impact'}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-white mt-6 font-bold tracking-tight">
              {t.objectives.headline}
            </h2>
            <p className="text-white/70 mt-4 text-lg leading-relaxed max-w-xl">
              {t.objectives.subheadline}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={t.objectives.headline}
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            className="mt-10 border-t border-white/10"
          >
            {items.map((item, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={`${item.title}-${i}`}
                  data-impact-row
                  role="tab"
                  id={`impact-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls="impact-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(i)}
                  className="group relative w-full text-left flex items-center gap-4 py-4 border-b border-white/10 transition-colors duration-300 outline-none focus-visible:bg-white/5"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-0.5 rounded-full transition-all duration-300"
                    style={{
                      background: ACCENT,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scaleY(1)' : 'scaleY(0.4)',
                    }}
                  />
                  <span
                    className="text-sm font-bold tabular-nums tracking-wider transition-colors duration-300"
                    style={{ color: isActive ? ACCENT : 'rgba(255,255,255,0.35)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`block truncate font-semibold transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="block text-xs uppercase tracking-wider text-white/40 mt-0.5">
                      {item.pillar}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`w-7 h-7 shrink-0 transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
                    }`}
                    style={{ color: isActive ? ACCENT : '#fff' }}
                  >
                    {getIconForPillar(item.pillar)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: detail panel */}
        <div className="lg:col-span-7 lg:sticky lg:top-28" data-impact-panel>
          <div
            ref={panelRef}
            id="impact-panel"
            role="tabpanel"
            aria-labelledby={`impact-tab-${activeIndex}`}
            className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm p-8 lg:p-12 min-h-[24rem]"
          >
            {/* Watermark index */}
            <span
              aria-hidden
              className="absolute -top-6 right-2 font-display font-bold leading-none select-none text-[7rem] lg:text-[9rem] text-white/[0.06]"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </span>

            <div className="relative">
              <div className="flex items-center gap-4">
                <span
                  className="grid place-items-center w-12 h-12 rounded-xl p-2.5"
                  style={{ background: 'rgba(247,138,40,0.15)', color: ACCENT }}
                  aria-hidden
                >
                  {getIconForPillar(active.pillar)}
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(247,138,40,0.15)', color: ACCENT }}
                >
                  {active.pillar}
                </span>
              </div>

              <h3 className="font-display text-2xl lg:text-3xl text-white font-bold mt-6 leading-snug">
                {active.title}
              </h3>
              <p className="text-white/75 mt-4 text-base lg:text-lg leading-relaxed max-w-2xl">
                {active.description}
              </p>

              <div className="h-px bg-white/10 my-8" />

              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {active.activities.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-white/90">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 mt-0.5 shrink-0"
                      fill="none"
                      stroke={ACCENT}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="4 12 9 17 20 6" />
                    </svg>
                    <span className="leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Progress dots (mobile-friendly, mirror the active state) */}
          <div className="flex items-center gap-2 mt-6 lg:hidden" aria-hidden>
            {items.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: activeIndex === i ? '28px' : '8px',
                  background: activeIndex === i ? ACCENT : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
