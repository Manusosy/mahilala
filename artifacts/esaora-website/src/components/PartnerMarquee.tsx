import { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePublishedPartners } from '@workspace/esaora-core/hooks/useData';

export function PartnerMarquee() {
  const { t } = useLanguage();
  const { partners, loading } = usePublishedPartners();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Only partners that actually have a logo to display in the strip.
  const logoPartners = useMemo(
    () => partners.filter((p) => p.logo_url && p.logo_url.trim() !== ''),
    [partners]
  );

  // Build the looping track: repeat the base list until it's wide enough to
  // fill the screen, then duplicate that block once so animating x to -50%
  // produces a seamless, gapless loop regardless of how many partners exist.
  const displayPartners = useMemo(() => {
    if (logoPartners.length === 0) return [];
    const MIN_ITEMS = 8;
    const filled = [...logoPartners];
    while (filled.length < MIN_ITEMS) {
      filled.push(...logoPartners);
    }
    return [...filled, ...filled];
  }, [logoPartners]);

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;
    if (displayPartners.length === 0) return;

    const track = trackRef.current;

    // GSAP Marquee Animation
    // The track holds two identical halves, so moving it left by 50% (one half)
    // lands exactly where it started — a seamless loop for any partner count.
    const animation = gsap.to(track, {
      x: `-50%`,
      duration: 35, // Adjust speed here for "professional" feel
      ease: 'none',
      repeat: -1,
      paused: false
    });

    // Pause on hover for a premium feel
    const handleMouseEnter = () => {
      gsap.to(animation, { timeScale: 0.2, duration: 1, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
      gsap.to(animation, { timeScale: 1, duration: 1, ease: 'power2.inOut' });
    };

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      animation.kill();
      gsap.set(track, { x: 0 });
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [displayPartners]);

  // Hide the whole section while loading or when there are no logo partners,
  // so we never render a broken/empty strip.
  if (loading || logoPartners.length === 0) return null;

  return (
    <section className="bg-white py-16 px-4 overflow-hidden border-t border-brand-navy/[0.03]">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-2">
          <span className="text-[#001BB7] uppercase tracking-[0.25em] text-[10px] font-extrabold block">
            {t.partners.headline}
          </span>
          <h2 className="text-[#111111] text-2xl font-bold tracking-tight">
            {t.partners.marqueeHeadline}
          </h2>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative mask-fade-edges max-w-[1600px] mx-auto overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div 
          ref={trackRef}
          className="flex items-center gap-12 sm:gap-20 w-max"
        >
          {displayPartners.map((partner, i) => {
            const logo = (
              <img
                src={partner.logo_url ?? ''}
                alt={partner.name}
                className="max-h-12 w-auto object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 will-change-transform"
                loading="lazy"
              />
            );

            return (
              <div
                key={`${partner.id}-${i}`}
                className="flex-shrink-0 flex items-center justify-center py-4 px-2 rounded-xl group transition-all duration-300"
              >
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={partner.name}
                    className="flex items-center justify-center"
                  >
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-12">
        <button className="group inline-flex items-center gap-2 text-brand-navy/60 font-bold text-xs uppercase tracking-widest hover:text-[#001BB7] transition-all duration-300">
          <span className="relative">
            {t.partners.becomeMember}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#001BB7] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}} />
    </section>
  );
}

