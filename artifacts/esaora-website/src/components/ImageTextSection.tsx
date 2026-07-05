import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'wouter';
import { ArrowRight, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface ImageTextSectionProps {
  /** Short uppercase label above the heading (e.g. "Who We Are"). */
  eyebrow?: string;
  /** Main section heading. */
  heading: string;
  /** Body copy — a single string or multiple paragraphs. */
  body: string | string[];
  /** Optional highlight bullets rendered with brand-orange check icons. */
  bullets?: string[];
  /** Image source (must already exist in /public). */
  imageSrc: string;
  /** Accessible alt text for the image. */
  imageAlt: string;
  /** Optional CTA link. */
  cta?: { label: string; href: string };
  /** When true, image is placed on the RIGHT and text on the LEFT. */
  reverse?: boolean;
  /** Background tone. Defaults to white. */
  background?: 'white' | 'offwhite';
}

const BRAND_BLUE = '#204f79';
const ACCENT_ORANGE = '#F78A28';

export function ImageTextSection({
  eyebrow,
  heading,
  body,
  bullets,
  imageSrc,
  imageAlt,
  cta,
  reverse = false,
  background = 'white',
}: ImageTextSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReduced) {
      gsap.set([imageRef.current, textRef.current], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: reverse ? 40 : -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: scope, start: 'top 80%' },
        },
      );
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: scope, start: 'top 80%' },
        },
      );
    }, scope);

    return () => ctx.revert();
  }, [reverse]);

  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <section
      ref={sectionRef}
      className={`py-20 sm:py-24 px-4 overflow-hidden ${
        background === 'offwhite' ? 'bg-[#F7F8FC]' : 'bg-white'
      }`}
    >
      <div
        className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
          reverse ? 'lg:[direction:rtl]' : ''
        }`}
      >
        {/* Image */}
        <div
          ref={imageRef}
          className="relative lg:[direction:ltr] w-full aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-brand-navy/5"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* subtle brand corner accent */}
          <div
            className="absolute bottom-0 left-0 w-1.5 h-24"
            style={{ backgroundColor: ACCENT_ORANGE }}
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div ref={textRef} className="lg:[direction:ltr]">
          {eyebrow && (
            <span
              className="uppercase tracking-widest text-xs font-bold border px-4 py-1.5 rounded-lg leading-none inline-block"
              style={{ color: BRAND_BLUE, borderColor: BRAND_BLUE }}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl sm:text-4xl text-[#111111] mt-4 font-bold tracking-tight">
            {heading}
          </h2>

          <div className="mt-5 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A5568] text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {bullets && bullets.length > 0 && (
            <ul className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: ACCENT_ORANGE }}
                    aria-hidden="true"
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[#4A5568] text-base leading-snug">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-3 mt-8 py-3.5 px-7 rounded-lg bg-[#204f79] text-white font-bold text-sm hover:bg-[#F78A28] hover:gap-5 transition-all active:scale-95"
            >
              {cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
