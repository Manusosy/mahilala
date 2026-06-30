import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/i18n/LanguageContext';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';

gsap.registerPlugin(ScrollTrigger);

const BRAND_BLUE = '#001BB7';
const ACCENT_ORANGE = '#F78A28';

const FALLBACK_IMAGES = [
  '/images/sections/our-mission.jpg',
  '/images/sections/our-vision.jpg',
  '/images/sections/who-we-are.jpg',
  '/images/sections/pillar-sekoly-manga.jpg',
];

type ImpactItem = {
  title: string;
  pillar: string;
  description: string;
  activities: string[];
  imageSrc?: string;
  imageAlt?: string;
};

export function ObjectivesSlider() {
  const { t } = useLanguage();
  const items = t.objectives.items as ImpactItem[];
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([introRef.current, '[data-impact-card]'], { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        },
      );

      gsap.from('[data-impact-card]', {
        opacity: 0,
        y: 36,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: 'top 72%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-20 sm:py-24 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Intro — same eyebrow / heading / body pattern as Mission & Vision */}
        <div ref={introRef} className="max-w-3xl mx-auto text-center mb-14 sm:mb-16">
          <span
            className="uppercase tracking-widest text-xs font-bold border px-4 py-1.5 rounded-lg leading-none inline-block"
            style={{ color: BRAND_BLUE, borderColor: BRAND_BLUE }}
          >
            {t.objectives.sectionLabel || 'Our Impact'}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#111111] mt-4 font-bold tracking-tight">
            {t.objectives.headline}
          </h2>
          <p className="text-[#4A5568] text-lg leading-relaxed mt-5">
            {t.objectives.subheadline}
          </p>
        </div>

        {/* Impact cards — image box + text box */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {items.map((item, i) => {
            const imageSrc = item.imageSrc || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            const imageAlt = item.imageAlt || item.title;

            return (
              <article
                key={item.title}
                data-impact-card
                className="group flex flex-col rounded-lg overflow-hidden border border-brand-navy/5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image box */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute bottom-0 left-0 w-1.5 h-20"
                    style={{ backgroundColor: ACCENT_ORANGE }}
                    aria-hidden
                  />
                  <span
                    className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-white backdrop-blur-sm"
                    style={{ backgroundColor: `${BRAND_BLUE}dd` }}
                  >
                    {item.pillar}
                  </span>
                </div>

                {/* Text box */}
                <div className="flex flex-col flex-1 p-6 sm:p-7 bg-[#F7F8FC]">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111111] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#4A5568] text-base leading-relaxed mt-3">
                    {item.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {item.activities.map((activity) => (
                      <li key={activity} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: ACCENT_ORANGE }}
                          aria-hidden
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-[#4A5568] text-sm sm:text-base leading-snug">
                          {activity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/programs"
            className="inline-flex items-center gap-3 py-3.5 px-7 rounded-lg bg-[#001BB7] text-white font-bold text-sm hover:bg-[#F78A28] hover:gap-5 transition-all active:scale-95"
          >
            Explore our programmes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
