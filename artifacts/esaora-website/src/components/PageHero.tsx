import { useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';

export interface PageHeroProps {
  label: string;
  heading: string;
  subheading?: string;
  imageSrc: string;
  breadcrumb?: string;
  /** Optional second breadcrumb segment for nested pages e.g. "About > Our Story" */
  breadcrumbParent?: { label: string; href: string };
}

export function PageHero({
  label,
  heading,
  subheading,
  imageSrc,
  breadcrumb,
  breadcrumbParent,
}: PageHeroProps) {
  const labelRef   = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.25'
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.45'
      );

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative w-full min-h-[420px] md:min-h-[540px] flex flex-col justify-end overflow-hidden bg-brand-navy">
      {/* Background image — starts below fixed nav */}
      <div
        className="absolute top-16 md:top-20 left-0 right-0 bottom-0"
        style={{
          backgroundImage: `url('${imageSrc}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Base dark overlay */}
      <div className="absolute inset-0 bg-black/52 pointer-events-none" />

      {/* Gradient vignette towards bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#001833]/90 via-black/15 to-transparent pointer-events-none" />

      {/* Left-side navy vignette for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Content — anchored to the bottom */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-14 md:pb-20 pt-28 md:pt-36">

        {/* Breadcrumb */}
        {(breadcrumb || breadcrumbParent) && (
          <nav className="flex items-center gap-1.5 text-white/45 text-xs mb-5 font-medium tracking-wide">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            {breadcrumbParent && (
              <>
                <span className="opacity-40">/</span>
                <Link href={breadcrumbParent.href} className="hover:text-white/80 transition-colors">
                  {breadcrumbParent.label}
                </Link>
              </>
            )}
            {breadcrumb && (
              <>
                <span className="opacity-40">/</span>
                <span className="text-white/70">{breadcrumb}</span>
              </>
            )}
          </nav>
        )}

        {/* Label block */}
        <div ref={labelRef}>
          <div className="mb-6 text-[11px] sm:text-xs text-white/90 uppercase tracking-[0.2em] font-bold leading-normal">
            {label}
          </div>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-white leading-[1.08] mb-5 max-w-3xl"
        >
          {heading}
        </h1>

        {/* Optional sub-heading */}
        {subheading && (
          <p
            ref={subRef}
            className="text-base sm:text-lg text-white/72 max-w-2xl leading-relaxed"
          >
            {subheading}
          </p>
        )}
      </div>
    </section>
  );
}
