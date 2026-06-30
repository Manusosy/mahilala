import { useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PartnerMarquee } from '@/components/PartnerMarquee';
gsap.registerPlugin(ScrollTrigger);

/* ─── Data ───────────────────────────────────────────────────────────────── */

const ABOUT_SECTIONS = [
  {
    num: '01',
    label: 'Our Story',
    title: 'The Story Behind Mahilala',
    desc: 'Born from personal reflection and lived experience — a mission to make guidance more accessible to young people in Toliara and across Madagascar.',
    href: '/our-story',
    image: '/images/hero/hero-bg-3.jpg',
    color: '#001BB7',
  },
  {
    num: '02',
    label: 'Purpose & Principles',
    title: 'Vision & Mission',
    desc: 'Our mission to sensitize, support, and inspire young Malagasy people — and the values that guide every programme and partnership.',
    href: '/vision',
    image: '/images/hero/hero-bg-4.jpg',
    color: '#001BB7',
  },
  {
    num: '03',
    label: 'Leadership',
    title: 'Founder',
    desc: 'Meet Rakotonjanahary Fidèle — marine biologist, environmentalist, youth advocate, and founder of Mahilala Madagascar.',
    href: '/team',
    image: '/images/hero/hero-bg-5.jpg',
    color: '#22C55E',
  },
];

const PILLARS = [
  { key: 'Toroy Izy',          color: '#001BB7', href: '/programs/toroy-izy',   image: '/images/sections/pillar-wash.jpeg',         desc: 'Academic orientation, mentoring, and life guidance for young Malagasy people at important education and career crossroads.' },
  { key: 'Sekoly Manga',       color: '#001BB7', href: '/programs/sekoly-manga', image: '/images/sections/pillar-blueeconomy.jpeg', desc: 'Environmental education connecting youth and communities to Madagascar\'s marine and coastal ecosystems.' },
  { key: 'Youth Mentoring',    color: '#22C55E', href: '/programs',              image: '/images/sections/pillar-climate-action.jpg', desc: 'Coaching, leadership activities, and community initiatives that build responsibility, values, and positive action.' },
  { key: 'Civic Engagement',   color: '#F59E0B', href: '/programs',              image: '/images/sections/pillar-public-health.jpeg', desc: 'Community action and shared values through initiatives such as Ady Fototra and Move On: Be Ready for Change.' },
];

const KEY_FACTS = [
  { v: '2019',   sub: 'Informal Start', detail: 'Mahilala began as a response to youth guidance needs' },
  { v: '2025',   sub: 'Official Recognition', detail: 'Recognized by the Malagasy government' },
  { v: '3',      sub: 'Core Programmes', detail: 'Toroy Izy · Sekoly Manga · Youth Mentoring' },
  { v: 'Toliara', sub: 'Home Base', detail: 'Atsimo-Andrefana Region, Madagascar' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const pillarsRef = useRef<HTMLElement>(null);
  const factsRef   = useRef<HTMLElement>(null);
  const navRef     = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pillar panels
      gsap.fromTo('.about-pillar',
        { opacity: 0, y: 45 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 70%' } }
      );
      // Key facts
      gsap.fromTo('.key-fact',
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: factsRef.current, start: 'top 75%' } }
      );
      // Nav cards
      gsap.fromTo('.about-nav-card',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: navRef.current, start: 'top 75%' } }
      );
    });
    return () => { ctx.revert(); };
  }, []);

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHero
        label="ABOUT US"
        heading="Who Is Mahilala Madagascar"
        subheading="A youth empowerment, civic engagement, and environmental education organization based in Toliara, guiding young Malagasy people toward purpose, responsibility, and positive impact."
        imageSrc="/images/hero/hero-bg-10.jpg"
        breadcrumb="About"
      />

      {/* ── 01. Who We Are — cinematic split ─────────────────────────────── */}
      <section className="bg-[#001833] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[65vh]">

          {/* Left — stacked images panel */}
          <div className="relative min-h-[380px] lg:min-h-full overflow-hidden">
            {/* Primary image */}
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `url('/images/hero/hero-bg-11.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001833]/0 to-[#001833]/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001833] via-transparent to-transparent" />

            {/* Floating identity card */}
            <div className="absolute bottom-10 left-10 right-16 bg-[#001833]/85 border border-white/15 rounded-lg p-5">
              <p className="text-[#001BB7] text-[10px] uppercase tracking-widest font-bold mb-2">The Name Behind the Mission</p>
              <p className="text-white font-bold text-base leading-snug">
                Mahilala comes from a word meaning &ldquo;Intelligence&rdquo; in Southern Madagascar
              </p>
              <p className="text-white/50 text-xs mt-1">Toliara · Atsimo-Andrefana · Youth · Environment · Community</p>
            </div>
          </div>

          {/* Right — editorial narrative */}
          <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-6">Who We Are</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight mb-8">
              Intelligence for Life<br />and Impact
            </h2>
            <div className="space-y-5 text-white/60 text-lg leading-relaxed">
              <p>
                Mahilala Madagascar is a youth empowerment, civic engagement, and environmental education organization based in Toliara. Founded by marine biologist, environmentalist, and Mandela Washington Fellow Rakotonjanahary Fidèle, Mahilala helps young Malagasy people discover purpose, access guidance, develop leadership, and contribute to a more sustainable future.
              </p>
              <p>
                For Mahilala, intelligence is not limited to memorization, school results, or academic diplomas. It is a deeper form of intelligence shaped by life experience, learning, values, responsibility, civic engagement, environmental awareness, and the desire to build a better future for society, the environment, and the economy.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/our-story" className="inline-flex items-center gap-2 bg-[#001BB7] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#F78A28] transition-all hover:gap-3 hover:scale-105">
                Read Our Story <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/programs" className="inline-flex items-center gap-2 border-2 border-white/25 hover:border-white text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:bg-white/10">
                View Programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02. Key Facts Bar ─────────────────────────────────────────────── */}
      <section ref={factsRef} className="bg-white py-16 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {KEY_FACTS.map((f) => (
              <div key={f.v} className="key-fact text-center py-8 px-4 bg-[#F0F4F8] rounded-lg">
                <p className="font-display text-4xl sm:text-5xl text-brand-navy font-bold mb-1">{f.v}</p>
                <p className="text-[#001BB7] text-xs font-bold uppercase tracking-widest mb-1">{f.sub}</p>
                <p className="text-[#718096] text-xs">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03. About Subsections — 3 image nav cards ─────────────────────── */}
      <section ref={navRef} className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Explore Mahilala</span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold">About Mahilala Madagascar</h2>
            <p className="text-[#718096] mt-4 text-base max-w-xl mx-auto">Three chapters that tell who we are, what we stand for, and how we accompany young people.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ABOUT_SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="about-nav-card group block rounded-lg overflow-hidden relative min-h-[380px] flex flex-col justify-end hover:-translate-y-2 transition-all duration-400 shadow-sm hover:shadow-2xl"
              >
                {/* BG */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-105" style={{ backgroundImage: `url('${s.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001833] via-[#001833]/60 to-transparent" />
                {/* Top color bar */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: s.color }} />
                {/* Number watermark */}
                <div className="absolute top-5 right-7 text-white/8 font-display text-8xl font-bold select-none pointer-events-none">{s.num}</div>

                {/* Content */}
                <div className="relative z-10 p-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: s.color }}>{s.label}</p>
                  <h3 className="text-white font-bold text-2xl mb-3 group-hover:text-[#001BB7] transition-colors">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">{s.desc}</p>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold group-hover:gap-3 transition-all" style={{ color: s.color }}>
                    <span>Explore</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04. Our Work — 4 Pillar image panels ─────────────────────────── */}
      <section ref={pillarsRef} className="bg-[#001833] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold bg-[#001BB7]/10 px-4 py-1.5 rounded-lg inline-block mb-4">What We Do</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white font-bold mt-4">Our Programmes</h2>
            <p className="text-white/45 mt-4 text-base max-w-lg mx-auto leading-relaxed">Mentoring, orientation, civic engagement, and environmental education for young people in Toliara and the southwest coast.</p>
          </div>

          {/* 4 image-backed panels — 2-2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map((p) => (
              <Link
                key={p.key}
                href={p.href}
                className="about-pillar group relative rounded-lg overflow-hidden min-h-[320px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-106" style={{ backgroundImage: `url('${p.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" style={{ background: p.color }} />

                <div className="relative z-10 p-7">
                  <h3 className="text-white font-bold text-xl mb-2">{p.key}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{p.desc}</p>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 group-hover:gap-3 transition-all" style={{ color: p.color }}>
                    <span>Explore Programme</span><ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/programs" className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-[#001BB7]/60 text-white hover:text-[#001BB7] px-8 py-3.5 rounded-lg font-bold text-sm transition-all hover:gap-3">
              View All Programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 05. Partners Marquee — reused from homepage ───────────────────── */}
      <PartnerMarquee />
    </main>
  );
}
