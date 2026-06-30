import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollRevealOptions {
  /** Container scoped for the reveal query. */
  scopeRef: RefObject<HTMLElement | null>;
}

/**
 * Subtle, professional "scroll up" reveal for homepage blocks that do NOT
 * already own a GSAP/ScrollTrigger entrance animation.
 *
 * Targets only elements marked with `data-reveal` inside the scope, so it never
 * double-animates sections like BlueprintSection, QuoteSection, ObjectivesSlider,
 * GovernanceSection or NewsSection (which animate themselves).
 *
 * - Each target fades in + rises (opacity 0→1, y 40→0) once as it enters view.
 * - Direct children of an element marked `data-reveal-stagger` animate with a
 *   small stagger instead of the wrapper as a whole.
 * - Respects prefers-reduced-motion (content shown statically, no transforms).
 * - StrictMode-safe cleanup via gsap.context() + ctx.revert().
 */
export function useScrollReveal({ scopeRef }: UseScrollRevealOptions) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const targets = Array.from(
      scope.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    if (targets.length === 0) return;

    if (prefersReduced) {
      gsap.set(targets, { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        const staggered = el.hasAttribute('data-reveal-stagger');
        const items = staggered
          ? (Array.from(el.children) as HTMLElement[])
          : [el];
        if (items.length === 0) return;

        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: staggered ? 0.12 : 0,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef]);
}
