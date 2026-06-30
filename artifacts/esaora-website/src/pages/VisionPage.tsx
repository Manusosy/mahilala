import { useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { ObjectivesSlider } from '@/components/ObjectivesSlider';
gsap.registerPlugin(ScrollTrigger);

/* ─── Data ───────────────────────────────────────────────────────────────── */

const CORE_VALUES = [
  {
    name: 'Empowerment',
    desc: 'Supporting young people to discover purpose, build confidence, and develop the intelligence that grows through experience, learning, and positive values.',
    color: '#001BB7',
    image: '/images/hero/hero-bg-2.jpg',
    num: '01',
  },
  {
    name: 'Civic Responsibility',
    desc: 'Building responsible citizenship through values, community action, and initiatives such as Ady Fototra that promote respect for society and public spaces.',
    color: '#001BB7',
    image: '/images/sections/pillar-wash.jpeg',
    num: '02',
  },
  {
    name: 'Environmental Consciousness',
    desc: 'Placing environmental protection at the heart of our mission — connecting youth and communities to Madagascar\'s marine and coastal ecosystems.',
    color: '#22C55E',
    image: '/images/sections/pillar-climate-action.jpg',
    num: '03',
  },
  {
    name: 'Lifelong Learning',
    desc: 'Humility, hope, mentorship, and community action — believing intelligence is a lifelong journey of learning, awareness, responsibility, and positive impact.',
    color: '#F59E0B',
    image: '/images/sections/pillar-blueeconomy.jpeg',
    num: '04',
  },
];

const MISSION_PILLARS = [
  { num: '01', text: 'Sensitize young Malagasy people toward responsible citizenship and environmental stewardship', color: '#001BB7' },
  { num: '02', text: 'Support youth through mentoring, orientation, and practical guidance at life crossroads', color: '#22C55E' },
  { num: '03', text: 'Inspire personal development, academic fulfillment, leadership, and self-belief', color: '#001BB7' },
  { num: '04', text: 'Connect environmental education with civic engagement and community action in Toliara', color: '#F59E0B' },
];



/* ─── Component ──────────────────────────────────────────────────────────── */

export default function VisionPage() {
  const visionRef  = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const valuesRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Vision statement — dramatic typewriter-like stagger
      gsap.fromTo('.vision-word',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: visionRef.current, start: 'top 65%' } }
      );

      // Mission pillars
      gsap.fromTo('.mission-pillar',
        { opacity: 0, x: 25 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: missionRef.current, start: 'top 75%' } }
      );

      // Values cards
      gsap.fromTo('.value-card',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.65, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 70%' } }
      );

    });

    return () => { ctx.revert(); };
  }, []);

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHero
        label="PURPOSE"
        heading="Mission, Vision & Values"
        subheading="The principles and aspirations that guide every programme, partnership, and moment of mentorship at Mahilala Madagascar."
        imageSrc="/images/hero/hero-bg-4.jpg"
        breadcrumb="Vision & Mission"
        breadcrumbParent={{ label: 'About', href: '/about' }}
      />

      {/* ── 01. Vision Statement — dark full-bleed with giant typography ──── */}
      <section className="bg-[#001833] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[68vh]">

          {/* Left - cinematic image */}
          <div
            className="relative min-h-[340px] lg:min-h-full"
            style={{
              backgroundImage: `url('/images/hero/hero-bg-2.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#001833]/0 to-[#001833]/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001833] via-transparent to-transparent" />

            {/* Water / ocean label overlay */}
            <div className="absolute top-8 left-8">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 bg-[#001833]/80 border border-white/15 px-3 py-1.5 rounded-lg">Our Vision</span>
            </div>
          </div>

          {/* Right - vision statement */}
          <div ref={visionRef} className="flex flex-col justify-center px-10 lg:px-16 py-20">
            <span className="text-[#001BB7] tracking-widest text-xs font-bold block mb-8">Our Vision</span>
            <div className="w-12 h-0.5 bg-[#001BB7] mb-10" />
            <blockquote className="font-display text-2xl sm:text-3xl text-white leading-[1.3] mb-8 font-light">
              {`A generation of informed, confident, purpose-driven, and civically engaged Malagasy youth who contribute positively to their communities and protect Madagascar's marine and coastal ecosystems.`.split(' ').map((word, i) => (
                <span key={i} className="vision-word inline-block mr-[0.28em]">{word}</span>
              ))}
            </blockquote>
            <p className="text-white/45 text-base leading-relaxed">
              This vision guides every Toroy Izy orientation session, every Sekoly Manga environmental activity, and every moment of youth mentoring at Mahilala Madagascar.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02. Mission — split with image and numbered list ──────────────── */}
      <section ref={missionRef} className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Our Mission</span>
              <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold leading-tight mb-7">
                How We Turn<br />Vision into Action
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-10">
                To sensitize, support, and inspire young Malagasy people toward responsible citizenship, personal development, academic fulfillment, leadership, and environmental stewardship.
              </p>
              <div className="space-y-4">
                {MISSION_PILLARS.map((p) => (
                  <div key={p.num} className="mission-pillar flex items-start gap-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs" style={{ background: p.color + '20', color: p.color }}>
                      {p.num}
                    </div>
                    <p className="text-[#4A5568] text-sm leading-relaxed">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - stacked images with overlay text */}
            <div className="relative">
              <div
                className="w-full rounded-lg overflow-hidden"
                style={{ height: '500px', backgroundImage: `url('/images/hero/hero-bg-10.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#001833]/80 via-transparent to-transparent rounded-lg" />
              </div>
              {/* Floating metric card */}
              <div className="absolute bottom-8 left-8 right-8 bg-brand-navy/90 border border-white/20 rounded-lg p-5">
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2">Mahilala Mission</p>
                <p className="text-white font-display text-2xl font-bold">Sensitize. Support. Inspire. — accompanying young people toward a more responsible, confident, and meaningful future.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. Core Values - editorial image cards ──────────────────────── */}
      <section ref={valuesRef} className="bg-[#FAF9F6] py-24 px-4 relative overflow-hidden text-center md:text-left">
        {/* Dotted Whiteboard Pattern - Dimmed */}
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(#94A3B8 1.5px, transparent 1.5px)', 
            backgroundSize: '32px 32px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6] z-0 pointer-events-none opacity-90" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 relative pt-8">
            <span className="text-brand-navy/50 uppercase tracking-widest text-xs font-bold bg-white shadow-sm px-4 py-1.5 rounded-lg inline-block mb-4">Our Principles</span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold mt-4">Core Values</h2>
            <p className="text-[#4A5568] mt-4 text-base max-w-lg mx-auto bg-white/50 inline-block px-4 py-1 rounded-lg leading-relaxed">
              The values that shape how Mahilala accompanies young people in Toliara and across Madagascar.
            </p>
          </div>

          {/* 4 image-backed value panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORE_VALUES.map((v) => (
              <div
                key={v.name}
                className="value-card group relative rounded-lg overflow-hidden min-h-[380px] flex flex-col justify-end cursor-default"
              >
                {/* BG */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
                  style={{ backgroundImage: `url('${v.image}')` }}
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                {/* Color tint on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" style={{ background: v.color }} />

                {/* Number watermark */}
                <div className="absolute top-5 right-6 text-white/8 font-display text-7xl font-bold leading-none select-none pointer-events-none">
                  {v.num}
                </div>

                {/* Content */}
                <div className="relative z-10 p-7">
                  <h3 className="text-white font-bold text-lg mb-3">{v.name}</h3>
                  <p className="text-white/58 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04. Strategic Objectives — reuse ObjectivesSlider as-is ──────── */}
      <ObjectivesSlider />

      {/* ── 06. Navigation — image-backed cards ─────────────────────────── */}
      <section className="bg-[#F0F4F8] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Continue</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Explore Mahilala</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Our Story',   sub: 'The founding narrative — personal reflection, lived experience, and a mission to support young people', href: '/our-story',   image: '/images/hero/hero-bg-3.jpg', color: '#001BB7' },
              { label: 'Founder',     sub: 'Meet Rakotonjanahary Fidèle — marine biologist, youth advocate, and founder of Mahilala Madagascar', href: '/team',         image: '/images/hero/hero-bg-5.jpg', color: '#001BB7' },
              { label: 'Programmes',  sub: 'Toroy Izy, Sekoly Manga, and youth mentoring & civic engagement in Toliara', href: '/programs',   image: '/images/sections/pillar-blueeconomy.jpeg', color: '#22C55E' },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block rounded-lg overflow-hidden relative min-h-[260px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-105" style={{ backgroundImage: `url('${card.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001833]/95 via-[#001833]/40 to-transparent" />
                <div className="relative z-10 p-8">
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#001BB7] transition-colors">{card.label}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-5">{card.sub}</p>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold group-hover:gap-3 transition-all" style={{ color: card.color }}>
                    <span>Explore</span><ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
