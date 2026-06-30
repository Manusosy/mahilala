import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Target, Eye, Heart } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
gsap.registerPlugin(ScrollTrigger);

const PURPOSE_TABS = [
  {
    key: 'mission',
    label: 'Mission',
    icon: Target,
    headline: 'Our Mission',
    body: 'To sensitize, support, and inspire young Malagasy people toward responsible citizenship, personal development, academic fulfillment, leadership, and environmental stewardship.',
    image: '/images/hero/hero-bg-10.jpg',
  },
  {
    key: 'vision',
    label: 'Vision',
    icon: Eye,
    headline: 'Our Vision',
    body: 'A generation of informed, confident, purpose-driven, and civically engaged Malagasy youth who contribute positively to their communities and protect Madagascar\u2019s marine and coastal ecosystems.',
    image: '/images/hero/hero-bg-2.jpg',
  },
  {
    key: 'values',
    label: 'Values',
    icon: Heart,
    headline: 'Our Values',
    body: 'The principles that shape how Mahilala accompanies young people in Toliara and across Madagascar.',
    values: ['Empowerment', 'Civic Responsibility', 'Environmental Consciousness', 'Community Action', 'Mentorship', 'Humility', 'Hope', 'Lifelong Learning'],
    image: '/images/sections/pillar-climate-action.jpg',
  },
] as const;

const CRISES = [
  {
    title: 'Lack of Guidance',
    body: 'Many young people grow up without strong guidance or inspiring role models around them — facing financial, social, family, and educational challenges that are less visible but equally real.',
    image: '/images/sections/pillar-wash.jpeg',
    color: '#001BB7',
  },
  {
    title: 'Limited Potential',
    body: 'The education system does not always allow every young person to fully develop their potential. Success should not depend only on memorization or academic performance.',
    image: '/images/sections/pillar-climate-action.jpg',
    color: '#22C55E',
  },
  {
    title: 'Environmental Disconnect',
    body: 'Young people also need human, social, emotional, creative, civic, and environmental intelligence to build a better future for themselves and for Madagascar.',
    image: '/images/sections/pillar-public-health.jpeg',
    color: '#F59E0B',
  },
  {
    title: 'Missed Opportunities',
    body: 'Many lessons discovered through years of study, work, leadership, and community engagement could have changed the course of life if they had been known earlier.',
    image: '/images/sections/pillar-blueeconomy.jpeg',
    color: '#001BB7',
  }
];

const MILESTONES = [
  {
    period: '2016',
    event: 'Youth Orientation Roots Begin',
    detail: 'The youth orientation initiative began informally, shaped by the founder\'s desire to help young people discover purpose, direction, and confidence.',
    image: '/images/hero/hero-bg-2.jpg'
  },
  {
    period: '2019',
    event: 'Mahilala Begins Informally',
    detail: 'Mahilala started informally as a response to the need for youth guidance, personal development, civic values, and environmental awareness. Sekoly Manga Madagascar page created.',
    image: '/images/hero/hero-bg-4.jpg'
  },
  {
    period: 'December 2023',
    event: 'TEDx Toliara Message',
    detail: 'The founder shared a personal story emphasizing that a person from a poor family background can still become an important contributor to society by discovering purpose.',
    image: '/images/hero/hero-bg-6.jpg'
  },
  {
    period: '2025',
    event: 'Official Recognition',
    detail: 'Mahilala was officially recognized by the Malagasy government. Collaboration with VOIZO Madagascar for marine bioecology training along the southwest coast.',
    image: '/images/hero/hero-bg-8.jpg'
  },
  {
    period: 'Beginning of 2026',
    event: 'Ady Fototra Movement',
    detail: 'Mahilala became involved in the launch of the Ady Fototra movement with Move On: Be Ready for Change, promoting civic responsibility and shared values.',
    image: '/images/hero/hero-bg-2.jpg'
  },
];

const PARTNERS = [
  { org: 'RAIKY', website: '#', logo: '/images/partners/Mariners-FA-official-logo.png', country: 'Madagascar', desc: 'Ongoing collaboration supporting youth and community initiatives in Toliara.' },
  { org: 'MOVE ON: Be Ready for Change', website: '#', logo: '/images/partners/wavu.png', country: 'Madagascar', desc: 'Partner in the Ady Fototra civic responsibility movement across Atsimo-Andrefana.' },
  { org: 'VOIZO Madagascar', website: '#', logo: '/images/partners/BEO-Logo.png', country: 'Madagascar', desc: 'Marine bioecology training for fishing communities along the southwest coast.' },
  { org: 'IH.SM', website: '#', logo: '/images/partners/Harona.png', country: 'Toliara', desc: 'BlueDays at School collaboration — student-led environmental education in schools.' },
];

export default function OurStoryPage() {
  const videoSectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values'>('mission');
  const active = PURPOSE_TABS.find((t) => t.key === activeTab) ?? PURPOSE_TABS[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro fade in
      gsap.fromTo('.story-intro-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.story-intro-content', start: 'top 80%' } }
      );

      // Crisis panels
      gsap.fromTo('.crisis-panel',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.crisis-panel-container', start: 'top 75%' } }
      );

      // Video quote parallax
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: videoSectionRef.current, start: 'top 60%' } }
      );

      // Milestones timeline
      gsap.fromTo('.timeline-item',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '.timeline-container', start: 'top 70%' } }
      );

      // Founding orgs
      gsap.fromTo('.org-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.org-card-container', start: 'top 80%' } }
      );
    });
    return () => { ctx.revert(); };
  }, []);

  return (
    <main className="bg-brand-navy">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        label="ABOUT US"
        heading="Who Is Mahilala Madagascar"
        subheading="Born from personal reflection, lived experience, and a desire to make guidance more accessible to young people in Toliara and across Madagascar."
        imageSrc="/images/hero/hero-bg-3.jpg"
        breadcrumb="About"
      />

      {/* ── The Catalyst (Premium Editorial Narrative) ──────────── */}
      <section className="bg-brand-navy py-24 md:py-32 px-4 relative overflow-hidden text-white border-b border-white/5">
        <div className="absolute inset-0 bg-[#001f4a] z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Visual Composition (Clean Staggered Grid) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center gap-4 sm:gap-6 lg:pr-8">
              {/* Left Image - Pushed Down */}
              <div className="w-1/2 pt-16 sm:pt-24">
                <div className="rounded-lg overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[480px] w-full relative border border-white/5">
                  <img src="/images/sections/pillar-climate-action.jpg" alt="Climate Action" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brand-navy/10 mix-blend-multiply" />
                </div>
              </div>
              {/* Right Image - Pulled Up */}
              <div className="w-1/2 pb-16 sm:pb-24">
                <div className="rounded-lg overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[480px] w-full relative border border-white/5">
                  <img src="/images/sections/pillar-blueeconomy.jpeg" alt="Blue Economy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brand-navy/10 mix-blend-multiply" />
                </div>
              </div>
            </div>

            {/* Narrative Prose */}
            <div className="w-full lg:w-1/2 story-intro-content">
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="w-12 h-[1px] bg-[#001BB7]"></span>
                <span className="text-[#001BB7] uppercase tracking-widest text-[10px] sm:text-xs font-bold">The Story Behind Mahilala</span>
              </div>
              
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl leading-[1.05] font-bold mb-10 text-white drop-shadow-lg">
                A Mission Born from Lived Experience
              </h2>
              
              <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-light">
                <p>
                  <span className="text-6xl text-[#001BB7] font-display float-left mr-4 mt-2 leading-[0.8] mb-1">M</span>
                  ahilala Madagascar was born from personal reflection and lived experience. Its founder recognized that many lessons discovered through years of study, work, leadership, and community engagement could have changed the course of life if they had been known earlier.
                </p>
                <p>
                  That realization became a mission: to support young people before they feel lost, isolated, or limited by their circumstances. Mahilala exists to become a source of inspiration, mentorship, practical direction, and empowerment for youth who need someone to believe in their potential.
                </p>
                
                <div className="my-10 py-3">
                  <p className="text-xl md:text-2xl text-white font-display italic leading-snug">
                    &ldquo;At Mahilala, intelligence is a lifelong journey of learning, awareness, responsibility, and positive impact.&rdquo;
                  </p>
                </div>
                
                <p className="text-white/90 font-medium">
                  Because the founder&apos;s background is rooted in marine science and environmental work, Mahilala also places environmental protection at the heart of its mission — supporting young people through guidance, inspiration, personal development, values, leadership, and confidence.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Mission · Vision · Values (Tabbed) ──────────────── */}
      <section className="bg-[#FAF9F6] py-24 px-4 relative overflow-hidden">
        {/* Dotted Whiteboard Pattern - Dimmed */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#94A3B8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6] z-0 pointer-events-none opacity-90" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-brand-navy/50 uppercase tracking-widest text-xs font-bold bg-white shadow-sm px-4 py-1.5 rounded-lg inline-block mb-4">Purpose &amp; Principles</span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold">Mission, Vision &amp; Values</h2>
            <p className="text-[#4A5568] mt-4 text-base max-w-2xl mx-auto">
              The aspirations and principles that guide every programme, partnership, and moment of mentorship at Mahilala Madagascar.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap justify-center gap-1 bg-white border border-black/5 rounded-[10px] p-1.5 shadow-sm">
              {PURPOSE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-[7px] text-sm font-bold transition-all ${
                      isActive ? 'bg-[#001BB7] text-white shadow-sm' : 'text-brand-navy/60 hover:text-brand-navy hover:bg-brand-navy/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Panel */}
          <div key={active.key} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-[10px] border border-black/5 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-10 lg:p-14">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-11 h-11 rounded-xl bg-[#001BB7]/10 flex items-center justify-center text-[#001BB7]">
                  <active.icon className="w-5 h-5" />
                </span>
                <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold">{active.headline}</span>
              </div>
              <p className="text-black text-base md:text-lg leading-relaxed font-light">{active.body}</p>

              {'values' in active && active.values && (
                <div className="flex flex-wrap gap-2.5 mt-8">
                  {active.values.map((v) => (
                    <span key={v} className="bg-[#F0F4F8] border border-black/5 text-brand-navy text-sm font-semibold px-4 py-2 rounded-full">
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative h-64 lg:h-full min-h-[340px]">
              <img src={active.image} alt={active.headline} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001833]/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Four Crises (Clean Card Grid) ──────────────────── */}
      <section className="bg-brand-navy py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] bg-[#001BB7]/10 px-4 py-1.5 rounded-lg uppercase tracking-widest text-xs font-bold block mb-4 mx-auto w-max">Why Mahilala Exists</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white font-bold">Challenges Young People Face</h2>
            <p className="text-white/50 mt-4 text-lg max-w-2xl mx-auto">
              Mahilala was created to respond to real challenges — not with charity alone, but with guidance, inspiration, and empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 crisis-panel-container">
            {CRISES.map((crisis, index) => (
              <div key={index} className="crisis-panel bg-white/5 border border-white/10 rounded-lg overflow-hidden group flex flex-col h-full">
                <div className="h-56 w-full relative overflow-hidden bg-brand-navy flex-shrink-0">
                  <img src={crisis.image} alt={crisis.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-brand-navy/30 pointer-events-none" />
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3">{crisis.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{crisis.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Quote (Parallax cinematic break) ──────────── */}
      <section
        ref={videoSectionRef}
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
        style={{ clipPath: 'inset(0)' }}
      >
        {/* Sticky Background Image */}
        <div 
          className="fixed top-0 left-0 w-full h-[100vh] pointer-events-none overflow-hidden -z-10 bg-black bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/sections/homearea.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/60 pointer-events-none" />

        <div ref={quoteRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-12 h-1 bg-[#001BB7] mx-auto mb-8 rounded-full" />
          <blockquote className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-6 drop-shadow-xl">
            &ldquo;Mahilala believes that every young person carries potential, purpose, and a contribution that Madagascar needs.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────── */}
      <section className="bg-[#FAF9F6] py-24 px-4 relative overflow-hidden">
        {/* Dotted Whiteboard Pattern - Dimmed */}
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(#94A3B8 1.5px, transparent 1.5px)', 
            backgroundSize: '32px 32px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6] z-0 pointer-events-none opacity-90" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 relative pt-8">
            <span className="text-brand-navy/50 uppercase tracking-widest text-xs font-bold block mb-4 mx-auto w-max bg-white px-3 py-1 rounded-lg shadow-sm">Milestones</span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold">Organization Timeline</h2>
            <p className="text-[#4A5568] mt-4 text-lg bg-white/50 inline-block px-4 py-1 rounded-lg">Key moments in Mahilala&apos;s journey from informal youth orientation to recognized organization.</p>
          </div>

          <div className="relative timeline-container">
            {/* Vertical connecting line */}
            <div className="absolute top-0 bottom-0 left-[27px] md:left-1/2 w-0.5 bg-brand-navy/10 -translate-x-1/2" />

            {MILESTONES.map((m, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="timeline-item relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 last:mb-0">
                  {/* Timeline Dot */}
                  <div className="absolute left-[27px] md:left-1/2 w-4 h-4 bg-[#001BB7] rounded-full -translate-x-1/2 mt-2 md:mt-0 z-10 ring-4 ring-[#FAF9F6]" />

                  {/* Left Side (Content for even, Image for odd) */}
                  <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'}`}>
                    <span className="text-[#001BB7] font-bold tracking-widest text-sm uppercase block mb-2">{m.period}</span>
                    <h3 className="font-display text-2xl text-brand-navy font-bold mb-3">{m.event}</h3>
                    <p className="text-[#4A5568] text-sm leading-relaxed">{m.detail}</p>
                  </div>

                  {/* Right Side (Image for even, Content for odd) */}
                  <div className={`hidden md:block w-[45%] ${isEven ? 'md:order-2 md:pl-12' : 'md:text-right md:pr-12'}`}>
                    <div className="rounded-lg overflow-hidden shadow-lg h-48 w-full relative bg-brand-navy">
                      <img src={m.image} alt={m.event} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brand-navy/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Founding Organizations ───────────────────────────── */}
      <section className="bg-white py-24 px-4 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Collaborations</span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold">Partners & Supporters</h2>
            <p className="text-[#4A5568] mt-4 text-base max-w-2xl mx-auto">
              Mahilala works with organizations that share our commitment to youth empowerment, civic engagement, and environmental education in Toliara and across Madagascar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 org-card-container">
            {PARTNERS.map((org, index) => (
              <div key={index} className="org-card bg-[#F0F4F8] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="h-40 w-full bg-white flex items-center justify-center p-6 border-b border-black/5 relative group-hover:bg-[#FAFAFA] transition-colors">
                  <img src={org.logo} alt={org.org} className="w-auto h-auto max-w-[150px] max-h-[75px] object-contain mix-blend-multiply flex-shrink-0" />
                </div>
                <div className="p-6 text-center flex-grow flex flex-col">
                  <span className="inline-block bg-[#001BB7]/15 text-[#001BB7] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm mb-3 self-center">
                    {org.country}
                  </span>
                  <h3 className="text-brand-navy font-bold text-base mb-3">{org.org}</h3>
                  <p className="text-[#718096] text-sm leading-relaxed mb-6 flex-grow">{org.desc}</p>
                  
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-wider hover:text-[#001BB7] transition-colors mt-auto pt-4 border-t border-black/5"
                  >
                    Visit Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
