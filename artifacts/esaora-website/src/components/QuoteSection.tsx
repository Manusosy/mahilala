import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function QuoteSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative z-10 -mb-px h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      style={{ clipPath: 'inset(0)' }}
    >
      {/* Sticky Background Image */}
      <div 
        className="fixed top-0 left-0 w-full h-[100vh] pointer-events-none overflow-hidden -z-10 bg-black bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/founder-fidele.png')", backgroundPosition: 'top center' }}
      />
      
      {/* Light Black Overlay */}
      <div className="absolute inset-0 bg-black/30 -z-0 pointer-events-none" />

      {/* Content */}
      <div ref={quoteRef} className="relative z-10 text-center px-6 max-w-3xl mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-1 bg-[#204f79] mx-auto mb-6 rounded-full" />
        <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-white leading-snug mb-6">
          &ldquo;{t.videoQuote.quote}&rdquo;
        </blockquote>
        <p className="text-white/60 text-sm tracking-wider">{t.videoQuote.attribution}</p>
      </div>

      {/* Bottom wave — white curve into the section below */}
      <div className="absolute bottom-0 inset-x-0 z-20 leading-[0] pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          className="block w-full [filter:drop-shadow(0_2px_0_#ffffff)]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
