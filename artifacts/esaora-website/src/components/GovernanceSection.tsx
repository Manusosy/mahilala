import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'wouter';
import { ArrowRight, Info, Users, Briefcase, MapPin, Settings2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

type TierKey = 'steering' | 'secretariat' | 'countryLeads' | 'twgs';

const TIER_ICONS: Record<TierKey, React.ReactNode> = {
  steering: <Users className="w-7 h-7 text-[#001BB7]" />,
  secretariat: <Briefcase className="w-7 h-7 text-[#001BB7]" />,
  countryLeads: <MapPin className="w-7 h-7 text-[#001BB7]" />,
  twgs: <Settings2 className="w-7 h-7 text-[#001BB7]" />,
};

const TIER_DESCRIPTIONS: Record<TierKey, string> = {
  steering: 'The highest decision-making body composed of senior representatives from each founding organization. Provides strategic leadership, approves work plans and budgets, oversees financial management, and resolves disputes.',
  secretariat: 'Coordinates day-to-day operations, organizes Steering Committee meetings, maintains documentation, facilitates partner communication, and serves as primary contact for external stakeholders.',
  countryLeads: 'Designated lead organizations in each of the four member countries. Coordinate national-level implementation, liaise with local stakeholders, and report programmatic and financial progress to the Secretariat.',
  twgs: 'Provide specialized expertise across five thematic areas: WASH, Climate Action, Blue Economy, Public Health, and Research & Innovation. Support program design, implementation, and knowledge sharing.',
};

const TIER_RESPONSIBILITIES_LIST: Record<TierKey, string[]> = {
  steering: ['Strategic leadership & direction', 'Work plan & budget approval', 'Financial oversight & transparency', 'Dispute resolution', 'Partnership application review', 'Meets at least twice per year'],
  secretariat: ['Day-to-day operational coordination', 'Steering Committee meeting logistics', 'Partner communications', 'Program development support', 'Monitoring & consolidated reporting', 'Primary external stakeholder contact'],
  countryLeads: ['National implementation coordination', 'Local stakeholder consultations', 'Alignment with regional strategies', 'Programmatic & financial progress reports', 'Capacity building at country level'],
  twgs: ['WASH technical guidance', 'Climate & environmental expertise', 'Blue economy program design', 'Public health integration', 'Research & innovation support', 'Knowledge sharing across countries'],
};

export function GovernanceSection({ hideCTA = false }: { hideCTA?: boolean }) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const pyramidRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<TierKey | null>('steering');

  const tierKeys: TierKey[] = ['steering', 'secretariat', 'countryLeads', 'twgs'];

  useEffect(() => {
    const tiers = pyramidRef.current?.querySelectorAll('.pyramid-tier');
    if (!tiers) return;
    gsap.fromTo(
      Array.from(tiers),
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pyramidRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const tiers = t.governance.tiers;

  const TIER_WIDTHS: Record<TierKey, string> = {
    steering: 'max-w-[480px]',
    secretariat: 'max-w-[640px]',
    countryLeads: 'max-w-[800px]',
    twgs: 'max-w-[960px]',
  };
  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-4 overflow-hidden relative bg-white"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold border border-[#001BB7] px-4 py-1.5 rounded-lg leading-none inline-block">
            {t.governance.sectionLabel}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-[#111111] mt-3 font-bold tracking-tight">{t.governance.headline}</h2>
          <p className="text-[#718096] mt-4 text-lg max-w-2xl mx-auto leading-relaxed">{t.governance.subheadline}</p>
        </div>

        {/* Pyramid Structure */}
        <div ref={pyramidRef} className="max-w-4xl mx-auto flex flex-col items-center space-y-0 mb-16 relative">
          {tierKeys.map((key, i) => {
            const isActive = activeTier === key;
            
            // Standardized trapezoidal percentages for a perfectly straight edge
            const clipPaths = [
              'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              'polygon(11% 0%, 89% 0%, 100% 100%, 0% 100%)',
              'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
              'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)'
            ];

            return (
              <button
                key={key}
                onClick={() => setActiveTier(key)}
                className={`pyramid-tier w-full ${TIER_WIDTHS[key]} h-16 sm:h-20 group relative transition-all duration-500 hover:scale-[1.01] active:scale-95`}
              >
                {/* Background Layer */}
                <div 
                  className={`
                    absolute inset-0 transition-all duration-500
                    ${isActive 
                      ? 'bg-[#001BB7] shadow-lg border-b border-[#001BB7]' 
                      : 'bg-white border-y border-gray-200 shadow-sm'
                    }
                  `}
                  style={{ clipPath: clipPaths[i] }}
                />

                {/* Content Layer (NOT Clipped - Safe for Tooltips & Overlays) */}
                <div className="relative z-10 h-full flex items-center justify-center px-12 sm:px-16">
                  {/* Badge (Inside left) */}
                  <div className={`
                    absolute left-[10%] sm:left-[14%] w-6 h-6 sm:w-7 sm:h-7 rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-500
                    ${isActive ? 'bg-[#F78A28] text-white scale-110' : 'bg-[#E8EAF8] text-[#001BB7]'}
                  `}>
                    {i + 1}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-base sm:text-lg font-bold tracking-wide uppercase transition-colors duration-300 ${isActive ? 'text-white' : 'text-brand-navy/80 group-hover:text-brand-navy'}`}>
                      {tiers[key].title}
                    </span>
                    
                    {/* Info Icon & Tooltip - ONLY ON ACTIVE */}
                    {isActive && (
                      <div className="relative group/tooltip flex-shrink-0">
                        <Info className="w-4 h-4 text-[#001BB7] hover:text-white transition-colors cursor-help" />
                        
                        {/* Tooltip Content - Clean White/Black style, Sentence Case */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-white text-brand-navy text-[10px] font-bold rounded-sm opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-[100] shadow-2xl border border-brand-navy/5 pointer-events-none">
                          View detailed info about this below
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-[15%] right-[15%] h-1 bg-[#F78A28] pointer-events-none" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 sm:p-12 shadow-sm border border-brand-navy/5 min-h-[300px] flex flex-col">
          {activeTier && (
            <div key={activeTier} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-md bg-brand-navy/5 flex items-center justify-center">
                  {TIER_ICONS[activeTier]}
                </div>
                <div>
                  <h4 className="text-brand-navy text-2xl font-bold">{tiers[activeTier].title}</h4>
                  <p className="text-brand-navy/40 text-xs font-bold uppercase tracking-widest mt-1">Level 0{tierKeys.indexOf(activeTier) + 1}</p>
                </div>
              </div>

              <p className="text-[#4A5568] text-lg leading-relaxed mb-8">
                {tiers[activeTier].description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {tiers[activeTier].responsibilities.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#001BB7] flex-shrink-0" />
                    <span className="text-[#718096] text-base leading-snug">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!hideCTA && (
          <div className="text-center mt-16">
            <Link href="/vision" className="inline-flex items-center gap-3 py-4 px-8 rounded-lg bg-[#001BB7] text-white font-bold text-sm hover:bg-[#F78A28] hover:gap-5 transition-all active:scale-95">
              {t.governance.fullDetails} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
