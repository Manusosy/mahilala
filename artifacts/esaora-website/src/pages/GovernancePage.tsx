import { useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Activity, Hand, Briefcase, Users, Droplets, Leaf, Anchor, HeartPulse, Microscope } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { GovernanceSection } from '@/components/GovernanceSection';
gsap.registerPlugin(ScrollTrigger);

/* ─── Data ───────────────────────────────────────────────────────────────── */

const TWGS = [
  {
    name: 'WASH',
    full: 'Water, Sanitation & Hygiene',
    color: '#001BB7',
    icon: Droplets,
    mandate: 'Provide technical guidance on water infrastructure, behavior change, and climate-resilient sanitation systems across all four nations.',
    scope: ['Community water systems', 'WASH behavior change', 'Climate-resilient sanitation', 'Water quality monitoring'],
  },
  {
    name: 'Climate Action',
    full: 'Climate Action & Environmental Resilience',
    color: '#22C55E',
    icon: Leaf,
    mandate: 'Drive ecosystem restoration, climate adaptation programming, and regional coastal resilience interventions.',
    scope: ['Mangrove rehabilitation', 'Watershed protection', 'Climate risk assessments', 'Early warning systems'],
  },
  {
    name: 'Blue Economy',
    full: 'Sustainable Blue Economy',
    color: '#001BB7',
    icon: Anchor,
    mandate: 'Support sustainable fisheries, marine conservation, and ocean-based enterprise development benefiting coastal livelihoods.',
    scope: ['Fisheries management', 'Marine protected areas', 'Eco-tourism & seaweed', 'Youth enterprise'],
  },
  {
    name: 'Public Health',
    full: 'Public Health & Community Wellbeing',
    color: '#F59E0B',
    icon: HeartPulse,
    mandate: 'Integrate WASH and environmental programs with health system strengthening and disease prevention.',
    scope: ['Waterborne disease prevention', 'Maternal & child health', 'Health worker training', 'WASH-health integration'],
  },
  {
    name: 'Research & Innovation',
    full: 'Research, MEL & Innovation',
    color: '#8B5CF6',
    icon: Microscope,
    mandate: 'Generate evidence, manage regional knowledge, and drive innovation and adaptive learning across all thematic areas.',
    scope: ['MEL frameworks', 'Cross-country research', 'Knowledge management', 'Innovation incubation'],
  },
];

const CHARTER_OPERATIONS = [
  { 
    title: 'Procurement', 
    desc: 'Procurement adheres to principles of transparency, fairness, and value for money, ensuring the highest ethical standards across all member countries.',
    icon: 'briefcase'
  },
  { 
    title: 'Risk Management', 
    desc: 'Proactive management to identify, monitor, and mitigate operational, financial, and environmental risks, reviewed periodically by the Steering Committee.',
    icon: 'shield'
  },
  { 
    title: 'Safeguarding & Ethics', 
    desc: 'Zero tolerance for corruption, exploitation, or harassment. Strict protocols protect children, vulnerable individuals, and community participants.',
    icon: 'hand'
  },
  { 
    title: 'Gender & Inclusion', 
    desc: 'Mandatory equitable participation in decision-making and leadership. Programs actively promote gender equality and youth engagement.',
    icon: 'users'
  },
  { 
    title: 'Monitoring & Learning', 
    desc: 'A regional Monitoring, Evaluation, and Learning (MEL) framework tracks performance and assesses social and environmental impact for continuous improvement.',
    icon: 'activity'
  }
];

const FINANCE_CLAUSES = [
  {
    title: 'Financial Management',
    text: 'All funds mobilized are managed according to sound accounting principles. Periodic financial audits ensure full transparency and compliance with donor requirements.'
  },
  {
    title: 'Funding Distribution',
    text: 'Funds are allocated transparently and equitably based on program relevance and partner capacity, with direct oversight from the Steering Committee.'
  }
];

const RESOURCE_CLAUSES = [
  {
    title: 'Resource Mobilization',
    text: 'We collaborate to secure funding from philanthropic foundations, climate finance mechanisms, and impact investment platforms through joint regional proposals.'
  },
  {
    title: 'Investment Strategy',
    text: 'We pursue climate finance and blue economy opportunities including grants and blended finance to support ecosystem restoration and resilient infrastructure.'
  }
];

const CHARTER_STATS = [
  { v: '5yr',  sub: 'Charter Duration', note: '2025–2030, renewable' },
  { v: '75%',  sub: 'Amendment Threshold', note: 'SC vote required' },
  { v: '2/3',  sub: 'Partnership Approval', note: 'SC majority vote' },
  { v: '3',    sub: 'Dispute Resolution Stages', note: 'Negotiation → Mediation → Arbitration' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function GovernancePage() {
  const twgRef     = useRef<HTMLElement>(null);
  const financeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // TWG panels
      gsap.fromTo('.twg-panel',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: twgRef.current, start: 'top 70%' } }
      );
      // Finance items
      gsap.fromTo('.finance-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: financeRef.current, start: 'top 75%' } }
      );
      // Charter stats
      gsap.fromTo('.charter-stat',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.charter-stats-grid', start: 'top 80%' } }
      );
      // Ops cards
      gsap.fromTo('.ops-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: '.ops-grid', start: 'top 75%' } }
      );
    });
    return () => { ctx.revert(); };
  }, []);

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHero
        label="GOVERNANCE"
        heading="Transparent, Accountable, and Member-Led"
        subheading="A multi-tier governance structure designed to ensure strategic oversight, national representation, and full accountability across all four member nations."
        imageSrc="/images/hero/hero-bg-5.jpg"
        breadcrumb="Governance"
        breadcrumbParent={{ label: 'About', href: '/about' }}
      />

      {/* ── 01. Intro context band ──────────────────────────────────────── */}
      <section className="bg-[#001833] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { v: '4', label: 'Equal Founding Members', sub: 'Founding nations with permanent SC seats' },
              { v: '5', label: 'Technical Groups', sub: 'WASH, Climate, Blue Economy, Health, Research' },
              { v: '2x', label: 'Annual SC Meetings', sub: 'Regular sessions for strategic decision-making' },
            ].map((item) => (
              <div key={item.v} className="text-center group">
                <p className="font-display text-6xl text-[#001BB7] font-bold mb-2 transition-transform group-hover:scale-110 duration-500">{item.v}</p>
                <p className="text-white font-bold text-base mb-1">{item.label}</p>
                <p className="text-white/45 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02. Governance Pyramid — reused exactly from homepage ─────────── */}
      <GovernanceSection hideCTA={true} />

      {/* ── 03. Technical Working Groups — Light Institutional Design ────────── */}
      <section ref={twgRef} className="bg-[#FAF9F6] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold bg-[#001BB7]/10 px-4 py-1.5 rounded-lg inline-block mb-4">
              Cross-Country Technical Expertise
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold mt-4">5 Technical Working Groups</h2>
            <p className="text-[#718096] mt-4 text-base max-w-xl mx-auto leading-relaxed">
              Specialized cross-country groups providing thematic expertise that drives program quality and knowledge sharing across ESA-ORA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TWGS.map((twg, i) => (
              <div
                key={twg.name}
                className={`twg-panel group bg-white p-8 rounded-lg border border-brand-navy/5 hover:border-brand-navy/10 transition-all duration-500 hover:shadow-xl hover:shadow-brand-navy/5 flex flex-col ${i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: `${twg.color}10`, color: twg.color }}>
                    <twg.icon className="w-7 h-7" />
                  </div>
                </div>
                
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: twg.color }}>{twg.full}</p>
                <h3 className="text-brand-navy font-bold text-2xl mb-4">{twg.name} TWG</h3>
                <p className="text-[#4A5568] text-base leading-relaxed mb-6 flex-grow">{twg.mandate}</p>
                
                {/* Scope tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-brand-navy/5">
                  {twg.scope.map((s) => (
                    <span key={s} className="text-[10px] uppercase tracking-wider font-bold text-brand-navy/40 px-3 py-1 bg-brand-navy/5 rounded-sm">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04. Resource Mobilization & Investment Strategy (Strategic Financing) ── */}
      <section ref={financeRef} className="bg-[#001BB7] py-24 px-4 relative overflow-hidden">
        {/* Dotted Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        {/* Subtle decorative flow lines */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 800" fill="none" className="w-full h-full">
            <path d="M400 0C300 100 200 100 100 200C0 300 0 400 100 500C200 600 300 600 400 700" stroke="#001BB7" strokeWidth="2" strokeDasharray="8 8" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-white uppercase tracking-widest text-xs font-bold block mb-4 opacity-80">Strategic Financing</span>
              <h2 className="font-display text-4xl sm:text-5xl text-white font-bold leading-tight mb-6">
                Resource Mobilization<br />& Investment Strategy
              </h2>
              <p className="text-white text-lg leading-relaxed mb-10 opacity-90">
                We work as a unified regional body to secure the technical and financial capital required to drive large-scale coastal transitions.
              </p>
              
              <div className="space-y-6">
                {RESOURCE_CLAUSES.map((res, i) => (
                  <div key={i} className="flex gap-5 items-start bg-[#008694] border border-white/10 p-8 rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 text-[#001BB7] text-xs font-bold">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">{res.title}</h4>
                      <p className="text-white/90 text-base leading-relaxed">{res.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Visual Flowchart for Mobilization */}
              <div className="bg-white p-8 sm:p-12 rounded-lg text-brand-navy relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-navy rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />
                 <h4 className="text-[#004d40] text-sm font-bold uppercase tracking-widest mb-10 text-center">Mobilization Lifecycle</h4>
                 
                 <div className="space-y-12 relative z-10">
                    {[
                      { t: 'Joint Identification', d: 'Secretariat & Partners identify funding pools' },
                      { t: 'Consolidated Proposals', d: 'Unified regional bids for maximum scale' },
                      { t: 'Capital Inflow', d: 'Grants, Blended Finance & Impact Investment' },
                      { t: 'Regional Deployment', d: 'Targeted allocation to thematic TWGs' }
                    ].map((step, i) => (
                      <div key={i} className="relative flex items-center justify-center">
                        <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-lg px-8 py-6 w-full text-center relative z-10 transition-transform hover:translate-y-[-2px] duration-300">
                          <p className="text-[#001BB7] text-xs font-bold uppercase mb-2">Step 0{i+1}</p>
                          <p className="font-bold text-xl mb-2 text-brand-navy">{step.t}</p>
                          <p className="text-[#718096] text-sm font-medium">{step.d}</p>
                        </div>
                        {i < 3 && (
                          <div className="absolute top-full h-12 w-0.5 bg-gradient-to-b from-brand-navy/20 to-transparent" />
                        )}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05. Financial Management & Framework (Clauses 10 & 23) ───────── */}
      <section className="bg-[#FAF9F6] py-24 px-4 relative">
        {/* Dotted Whiteboard Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Financial Oversight</span>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-navy font-bold">Accountability & Frameworks</h2>
            <p className="text-[#718096] mt-4 text-base max-w-xl mx-auto leading-relaxed">
              Every dollar mobilized is tracked through a rigorous multi-tier audit system ensuring donor compliance and regional equity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FINANCE_CLAUSES.map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-lg border border-black/5 shadow-xl shadow-brand-navy/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-navy font-bold text-xs">
                    0{i+1}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-navy">{item.title}</h3>
                </div>
                <p className="text-[#4A5568] text-lg leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06. Operational Integrity Module (Clauses 11-15) ──────────────── */}
      <section className="bg-[#001833] py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy to-[#001833]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Operating Excellence</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white font-bold">Operational Integrity</h2>
            <p className="text-white/45 mt-4 text-base max-w-xl mx-auto leading-relaxed">
              Our institutional protocols ensure that every action taken by the Alliance is fair, safe, and measurable.
            </p>
          </div>

          <div className="ops-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHARTER_OPERATIONS.map((op, i) => {
              const IconComp = {
                briefcase: Briefcase,
                shield: Shield,
                activity: Activity,
                hand: Hand,
                users: Users
              }[op.icon] || Shield;

              return (
                <div key={i} className="ops-card bg-white/5 border border-white/10 p-8 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#001BB7]/10 flex items-center justify-center text-[#001BB7]">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-4">{op.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{op.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 06. Charter — full-bleed with background ─────────────────────── */}
      <section
        className="relative py-28 px-4 overflow-hidden"
        style={{ backgroundImage: `url('/images/hero/hero-bg-6.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#001833]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001833]/80 via-transparent to-[#001833]/60" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold bg-[#001BB7]/10 border border-[#001BB7]/20 px-4 py-1.5 rounded-lg inline-block mb-4">The Governing Document</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white font-bold mt-4">Charter Duration & Amendments</h2>
            <p className="text-white/90 mt-4 text-base max-w-xl mx-auto leading-relaxed">
              The ESA-ORA charter is a binding legal agreement - governing purpose, partnership, finances, and dispute resolution for the Alliance's 5-year founding period.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 charter-stats-grid">
            {CHARTER_STATS.map((s) => (
              <div key={s.v} className="charter-stat bg-[#001BB7] border border-white/10 rounded-lg p-7 text-center transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-black/20">
                <p className="font-display text-4xl text-white font-bold mb-2">{s.v}</p>
                <p className="text-white font-bold text-sm mb-1">{s.sub}</p>
                <p className="text-white/70 text-xs leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {/* Redundant buttons removed as requested */}
          </div>
        </div>
      </section>


    </main>
  );
}
