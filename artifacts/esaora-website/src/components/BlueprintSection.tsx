import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';

gsap.registerPlugin(ScrollTrigger);

const BRAND_BLUE = '#001BB7';
const ACCENT_ORANGE = '#F78A28';

const PILLAR_KEYS = ['wash', 'climate', 'blueEconomy', 'publicHealth'] as const;
type PillarKey = typeof PILLAR_KEYS[number];

// Brand-aligned colour per pillar (brand blue + green + accent orange)
const PILLAR_COLORS: Record<PillarKey, string> = {
  wash: BRAND_BLUE,
  climate: '#22C55E',
  blueEconomy: BRAND_BLUE,
  publicHealth: ACCENT_ORANGE,
};

const PILLAR_IMAGES: Record<PillarKey, string> = {
  wash: '/images/hero/hero-slide-coastal-cleanup.png',
  climate: '/images/hero/hero-slide-youth-workshop.png',
  blueEconomy: '/images/sections/impact-civic-life.jpg',
  publicHealth: '/images/sections/impact-mentorship.jpg',
};

const PILLAR_LINKS: Record<PillarKey, string> = {
  wash: '/programs/toroy-izy',
  climate: '/programs',
  blueEconomy: '/programs/sekoly-manga',
  publicHealth: '/programs',
};

const PILLAR_ICONS: Record<PillarKey, React.ReactNode> = {
  wash: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2C7 7 4 10.5 4 14a8 8 0 0016 0c0-3.5-3-7-8-12z" />
      <path d="M8 17.5a4 4 0 008 0" strokeDasharray="2 2" />
    </svg>
  ),
  climate: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2v6M4.93 4.93l4.24 4.24M2 12h6M4.93 19.07l4.24-4.24M12 22v-6M19.07 19.07l-4.24-4.24M22 12h-6M19.07 4.93l-4.24 4.24" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  blueEconomy: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 15c2 0 3-2 5-2s3 2 5 2 3-2 5-2" />
      <path d="M3 19c2 0 3-2 5-2s3 2 5 2 3-2 5-2" />
      <path d="M12 3L9 8h6l-3-5z" /><path d="M9 8v4" /><path d="M15 8v4" />
    </svg>
  ),
  publicHealth: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

interface PillarDescCardProps {
  pillarKey: PillarKey;
  side: 'left' | 'right';
  active: boolean;
  onActivate: () => void;
}

function PillarDescCard({ pillarKey, side, active, onActivate }: PillarDescCardProps) {
  const { t } = useLanguage();
  const pillar = t.blueprint.pillars[pillarKey];
  const color = PILLAR_COLORS[pillarKey];

  return (
    <div
      className={`pillar-desc ${side === 'left' ? 'desc-left text-right' : 'desc-right text-left'} cursor-pointer group transition-all duration-300`}
      onClick={onActivate}
    >
      <h3
        className="font-bold text-base uppercase tracking-wide mb-1.5 transition-colors duration-200"
        style={{ color: active ? color : '#ffffff' }}
      >
        {pillar.name}
      </h3>
      {/* High-contrast description — white for legibility on brand blue */}
      <p className="text-white/90 text-sm leading-relaxed mb-2">{pillar.description}</p>
      <Link
        href={PILLAR_LINKS[pillarKey]}
        className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
        style={{ color: ACCENT_ORANGE }}
      >
        {side === 'right' && <><span>{t.blueprint.learnMore}</span><ArrowRight className="w-3 h-3" /></>}
        {side === 'left' && <><ArrowRight className="w-3 h-3 rotate-180" /><span>{t.blueprint.learnMore}</span></>}
      </Link>
    </div>
  );
}

export function BlueprintSection() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const centerLogoSrc = settings.favicon_url || '/favicon.png';
  const [activePillar, setActivePillar] = useState<PillarKey | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const circles = diagramRef.current?.querySelectorAll('.pillar-circle');
      const centerCircle = diagramRef.current?.querySelector('.center-circle');
      const header = section.querySelectorAll('.blueprint-reveal');
      const descLeft = section.querySelectorAll('.desc-left');
      const descRight = section.querySelectorAll('.desc-right');

      if (prefersReduced) {
        gsap.set(
          [
            ...Array.from(header),
            ...(circles ? Array.from(circles) : []),
            ...(centerCircle ? [centerCircle] : []),
            ...Array.from(descLeft),
            ...Array.from(descRight),
          ],
          { opacity: 1, x: 0, y: 0, scale: 1 }
        );
        return;
      }

      // Header copy
      gsap.fromTo(
        header,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      );

      // Petal circles bloom outward
      if (circles && circles.length) {
        gsap.fromTo(
          Array.from(circles),
          { opacity: 0, scale: 0.6, transformOrigin: 'center center' },
          {
            opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: section, start: 'top 70%' },
          }
        );
      }

      // Central logo pops in, then gently floats
      if (centerCircle) {
        gsap.fromTo(
          centerCircle,
          { opacity: 0, scale: 0, transformOrigin: 'center center' },
          {
            opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)', delay: 0.55,
            scrollTrigger: { trigger: section, start: 'top 70%' },
            onComplete: () => {
              gsap.to(centerCircle, {
                y: -7,
                duration: 2.6,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              });
            },
          }
        );
      }

      // Side description cards slide in from their respective edges
      gsap.fromTo(
        descLeft,
        { opacity: 0, x: -34 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 65%' },
        }
      );
      gsap.fromTo(
        descRight,
        { opacity: 0, x: 34 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 65%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const togglePillar = (key: PillarKey) => {
    setActivePillar(activePillar === key ? null : key);
  };

  // SVG diagram dimensions
  const S = 460;       // canvas size
  const cx = S / 2;    // center x
  const cy = S / 2;    // center y
  const R = 115;       // pillar circle radius
  const offset = 105;  // distance of each circle centre from canvas centre

  const positions: Record<PillarKey, { x: number; y: number }> = {
    wash:         { x: cx - offset, y: cy - offset },
    climate:      { x: cx + offset, y: cy - offset },
    blueEconomy:  { x: cx - offset, y: cy + offset },
    publicHealth: { x: cx + offset, y: cy + offset },
  };

  return (
    <section ref={sectionRef} className="bg-[#001BB7] py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="blueprint-reveal inline-block text-[#F78A28] uppercase tracking-widest text-sm font-semibold">
            {t.blueprint.sectionLabel}
          </span>
          <h2 className="blueprint-reveal font-display text-section text-white mt-2">{t.blueprint.headline}</h2>
          <p className="blueprint-reveal text-white/90 mt-3 text-sm max-w-xl mx-auto leading-relaxed">{t.blueprint.centerText}</p>
        </div>

        {/* ── MOBILE / TABLET: stacked circle + text rows ── */}
        <div className="md:hidden space-y-6 max-w-lg mx-auto">
          {PILLAR_KEYS.map((key) => {
            const pillar = t.blueprint.pillars[key];
            const color = PILLAR_COLORS[key];
            const isActive = activePillar === key;
            return (
              <div
                key={key}
                className="flex items-start gap-5 cursor-pointer"
                onClick={() => togglePillar(key)}
              >
                {/* Circle */}
                <div
                  className="flex-shrink-0 w-24 h-24 rounded-full flex flex-col items-center justify-center text-white text-center p-2 transition-all duration-300 overflow-hidden relative"
                  style={{
                    backgroundColor: color,
                    backgroundImage: `url(${PILLAR_IMAGES[key]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: isActive ? 'overlay' : 'multiply',
                    boxShadow: isActive ? `0 0 24px ${color}88` : 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-1 drop-shadow-md">{PILLAR_ICONS[key]}</div>
                    <span className="font-bold text-xs uppercase leading-tight drop-shadow-md">{pillar.name}</span>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 pt-2">
                  <h3 className="text-white font-bold text-base mb-1">{pillar.name}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{pillar.description}</p>
                  {isActive && (
                    <ul className="mt-2 space-y-1">
                      {pillar.activities.slice(0, 3).map((a) => (
                        <li key={a} className="flex items-center gap-2 text-white/75 text-xs">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={PILLAR_LINKS[key]}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold"
                    style={{ color: ACCENT_ORANGE }}
                  >
                    {t.blueprint.learnMore} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DESKTOP: flower diagram with side descriptions ── */}
        <div className="hidden md:grid grid-cols-[1fr_minmax(280px,460px)_1fr] gap-x-4 lg:gap-x-8 items-center">

          {/* LEFT descriptions: Toroy Izy (top-left) + Sekoly Manga (bottom-left) */}
          <div className="flex flex-col justify-center gap-12 pr-4">
            {(['wash', 'blueEconomy'] as PillarKey[]).map((key) => (
              <PillarDescCard
                key={key}
                pillarKey={key}
                side="left"
                active={activePillar === key}
                onActivate={() => togglePillar(key)}
              />
            ))}
          </div>

          {/* CENTER diagram */}
          <div ref={diagramRef} className="flex-shrink-0 w-full mx-auto" style={{ maxWidth: S }}>
            <svg width="100%" height="auto" viewBox={`0 0 ${S} ${S}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="pillar-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <clipPath id="center-clip">
                  <circle cx={cx} cy={cy} r="62" />
                </clipPath>
              </defs>

              {/* Pillar circles */}
              {PILLAR_KEYS.map((key) => {
                const pos = positions[key];
                const color = PILLAR_COLORS[key];
                const isActive = activePillar === key;
                const isOtherActive = activePillar !== null && activePillar !== key;
                const pillar = t.blueprint.pillars[key];

                return (
                  <g
                    key={key}
                    className="pillar-circle"
                    onClick={() => togglePillar(key)}
                    style={{ cursor: 'pointer' }}
                  >
                    <clipPath id={`clip-${key}`}>
                      <circle cx={pos.x} cy={pos.y} r={R} />
                    </clipPath>
                    {/* Background image constrained to circle */}
                    <image
                      x={pos.x - R}
                      y={pos.y - R}
                      width={R * 2}
                      height={R * 2}
                      href={PILLAR_IMAGES[key]}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#clip-${key})`}
                      opacity={isOtherActive ? 0.25 : isActive ? 1 : 0.9}
                      className="transition-all duration-300"
                    />
                    {/* Overlay colour for the venn/flower effect */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={R}
                      fill={color}
                      opacity={isActive ? 0.3 : 0.7}
                      style={{ mixBlendMode: isActive ? 'overlay' : 'multiply' }}
                      filter={isActive ? 'url(#pillar-glow)' : undefined}
                      className="transition-all duration-300 pointer-events-none"
                    />
                    {/* Border ring when active */}
                    {isActive && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={R}
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        opacity={0.7}
                      />
                    )}
                    {/* Icon */}
                    <foreignObject
                      x={pos.x - 18}
                      y={pos.y - 44}
                      width="36"
                      height="36"
                    >
                      <div
                        style={{
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          opacity: isOtherActive ? 0.4 : 1,
                        }}
                      >
                        {PILLAR_ICONS[key]}
                      </div>
                    </foreignObject>
                    {/* Pillar label */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="700"
                      letterSpacing="0.8"
                      opacity={isOtherActive ? 0.3 : 1}
                      className="transition-all duration-300 select-none uppercase"
                    >
                      {pillar.name.split(' ').map((word, wi) => (
                        <tspan key={wi} x={pos.x} dy={wi === 0 ? 0 : 13}>
                          {word}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {/* Center circle — Mahilala logo */}
              <g className="center-circle">
                <circle cx={cx} cy={cy} r="66" fill={BRAND_BLUE} opacity="0.95" />
                <circle cx={cx} cy={cy} r="62" fill="#ffffff" stroke={ACCENT_ORANGE} strokeWidth="2" />
                <clipPath id="logo-clip">
                  <circle cx={cx} cy={cy} r="60" />
                </clipPath>
                <image
                  x={cx - 48}
                  y={cy - 48}
                  width="96"
                  height="96"
                  href={centerLogoSrc}
                  clipPath="url(#logo-clip)"
                  preserveAspectRatio="xMidYMid meet"
                  className="object-contain"
                >
                  <title>{t.blueprint.headline}</title>
                </image>
                {/* Dot decorations on ring */}
                {[0, 90, 180, 270].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <circle
                      key={deg}
                      cx={cx + 62 * Math.cos(rad)}
                      cy={cy + 62 * Math.sin(rad)}
                      r="3"
                      fill={ACCENT_ORANGE}
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* RIGHT descriptions: Youth Mentoring (top-right) + Civic Engagement (bottom-right) */}
          <div className="flex flex-col justify-center gap-12 pl-4">
            {(['climate', 'publicHealth'] as PillarKey[]).map((key) => (
              <PillarDescCard
                key={key}
                pillarKey={key}
                side="right"
                active={activePillar === key}
                onActivate={() => togglePillar(key)}
              />
            ))}
          </div>
        </div>

        {/* Desktop: expanded activities panel below diagram */}
        {activePillar && (
          <div className="hidden md:block mt-8 max-w-2xl mx-auto">
            <div
              className="rounded-lg p-5 border"
              style={{
                background: PILLAR_COLORS[activePillar] + '22',
                borderColor: PILLAR_COLORS[activePillar] + '55',
              }}
            >
              <p className="text-[#F78A28] text-xs uppercase tracking-widest font-bold mb-3">{t.blueprint.keyActivities}</p>
              <ul className="grid grid-cols-2 gap-2">
                {t.blueprint.pillars[activePillar].activities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-white/90 text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: PILLAR_COLORS[activePillar] }}
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
