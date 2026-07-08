import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { HeroSliderBackground } from '@/components/HeroSliderBackground';
import { PAGE_HERO_SLIDES } from '@/constants/pageHeroSlides';

export function HeroSection() {
  const { t } = useLanguage();

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .fromTo(subRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
  }, []);

  const lines = t.hero.headline.split('\n');

  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-brand-navy">
      <HeroSliderBackground slides={PAGE_HERO_SLIDES.home} />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-20" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20 md:pt-28">
        <div className="mb-8 text-xs sm:text-sm text-white/90 uppercase tracking-[0.2em] font-bold leading-normal">
          {t.hero.welcome}
        </div>

        <h1 ref={headlineRef} className="font-display text-hero text-white mb-6 leading-tight">
          {lines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>

        <p ref={subRef} className="text-lg sm:text-xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
          {t.hero.subheadline}
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/programs" className="bg-[#204f79] hover:bg-[#F78A28] text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors duration-200 hover:scale-105">
            {t.hero.discoverWork}
          </Link>
          <Link href="/about" className="border-2 border-white text-white hover:bg-[#F78A28] hover:border-[#F78A28] px-8 py-3.5 rounded-lg font-semibold text-base transition-colors duration-200 text-center">
            {t.hero.joinAlliance}
          </Link>
        </div>
      </div>
    </section>
  );
}
