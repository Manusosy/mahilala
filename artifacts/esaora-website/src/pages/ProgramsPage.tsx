import { Link } from 'wouter';
import { PageHero } from '@/components/PageHero';
import { PartnerMarquee } from '@/components/PartnerMarquee';
import { usePublishedPrograms } from '@workspace/esaora-core/hooks/usePrograms';
import { Calendar, Globe, ArrowRight } from 'lucide-react';

const CROSS_CUTTING = [
  { title: 'Toroy Izy', desc: 'Youth orientation and mentoring initiative with roots going back to 2016, helping young people discover purpose, choose direction, and believe in their potential.' },
  { title: 'Sekoly Manga', desc: 'The Blue School — environmental education connecting students, schools, and coastal communities to Madagascar\'s marine and coastal ecosystems.' },
  { title: 'Youth Mentoring', desc: 'Ongoing mentoring, coaching, and leadership activities connecting youth with values, role models, and positive community action.' },
  { title: 'Civic Engagement', desc: 'Community campaigns and collaborations such as Ady Fototra and Move On: Be Ready for Change, building civic responsibility in Atsimo-Andrefana.' },
];

export default function ProgramsPage() {
  return (
    <main>
      <PageHero
        label="WHAT WE DO"
        heading="Programmes Built for Youth, By People Who Care"
        subheading="Mahilala Madagascar combines mentoring, orientation, civic engagement, and environmental education to help young people grow with purpose and responsibility."
        imageSrc="/images/hero/hero-bg-2.jpg"
        breadcrumb="Programmes"
      />

      {/* Live Programs / Projects */}
      <LiveProgramsSection />

      {/* Cross-cutting themes */}
      <section className="bg-[#F0F4F8] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Our Core Programmes</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CROSS_CUTTING.map((item, i) => (
              <div key={i} className="bg-white rounded-[7px] p-7 border border-black/5 hover:-translate-y-1 transition-all">
                <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center text-[#001BB7] text-xs font-bold mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-[#111111] font-bold text-base mb-3">{item.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Marquee */}
      <PartnerMarquee />

      {/* Program Cycle */}
      <section className="bg-brand-navy py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold bg-[#001BB7]/10 px-4 py-1.5 rounded-lg inline-block mb-4">Programme Approach</span>
            <h2 className="font-display text-4xl text-white font-bold mt-4">How Mahilala Works With Youth</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { phase: 'Connect', num: '01', desc: 'Reach young people at schools, community gatherings, and orientation events across Toliara.' },
              { phase: 'Guide', num: '02', desc: 'Provide mentoring, academic orientation, and practical direction through Toroy Izy and youth programmes.' },
              { phase: 'Educate', num: '03', desc: 'Deliver environmental education through Sekoly Manga — in schools, outdoors, and in coastal communities.' },
              { phase: 'Engage', num: '04', desc: 'Build civic responsibility through community action, values workshops, and movements such as Ady Fototra.' },
              { phase: 'Inspire', num: '05', desc: 'Help young people discover purpose, develop leadership, and contribute positively to Madagascar\'s future.' },
            ].map((phase) => (
              <div key={phase.num} className="bg-white/5 border border-white/10 rounded-[7px] p-6 text-center">
                <div className="text-[#001BB7] font-bold text-2xl font-display mb-2">{phase.num}</div>
                <h3 className="text-white font-bold text-sm mb-3">{phase.phase}</h3>
                <p className="text-white/70 text-xs leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function LiveProgramsSection() {
  const { programs, loading } = usePublishedPrograms();

  if (loading) {
    return (
      <section className="bg-white py-24 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-3 animate-pulse">
            <div className="h-3 w-28 bg-gray-100 rounded" />
            <div className="h-9 w-64 bg-gray-100 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[7px] border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-100" />
                <div className="p-7 space-y-3">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-5 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (programs.length === 0) return null;

  return (
    <section className="bg-white py-24 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-brand-cyan uppercase tracking-[0.2em] text-[10px] font-black block mb-3">Active Projects</span>
            <h2 className="font-display text-4xl text-brand-navy font-black">Featured Initiatives</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.slice(0, 6).map(p => {
             const fundingPercent = p.funding_goal > 0 ? Math.min(Math.round((p.funding_raised / p.funding_goal) * 100), 100) : 0;
             return (
                <Link key={p.id} href={`/programs/${p.slug}`}>
                  <div className="group bg-white rounded-[7px] border border-gray-100 overflow-hidden transition-all h-full flex flex-col hover:border-brand-cyan/50">
                    {p.cover_image_url && (
                      <div className="h-56 overflow-hidden bg-gray-100 relative">
                        <img src={p.cover_image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 left-4">
                            <span className="px-2.5 py-1 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                                {p.pillar}
                            </span>
                        </div>
                      </div>
                    )}
                    <div className="p-7 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           <Globe className="w-3 h-3 text-brand-cyan" /> {p.countries?.length || 0} Member Nations
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter ${
                          p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          p.status === 'completed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-slate-500 border border-gray-200'
                        }`}>{p.status}</span>
                      </div>
                      
                      <h3 className="font-display text-xl text-[#111111] font-black mb-3 group-hover:text-gray-600 transition-colors leading-tight">{p.name}</h3>
                      <p className="text-slate-800 text-sm line-clamp-2 flex-1 mb-6 leading-relaxed">{p.summary}</p>
                      
                      {p.funding_goal > 0 && (
                        <div className="pt-5 border-t border-gray-50 mt-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Funding Support</span>
                                <span className="text-[10px] font-black text-brand-navy">{fundingPercent}%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-cyan transition-all duration-1000" style={{ width: `${fundingPercent}%` }} />
                            </div>
                        </div>
                      )}
                      
                      <div className="mt-6 flex items-center justify-between">
                         <div className="flex -space-x-2">
                             {p.countries?.slice(0, 3).map((c, i) => (
                                 <div key={i} className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[8px] font-bold text-brand-navy" title={c}>
                                     {c.substring(0, 2).toUpperCase()}
                                 </div>
                             ))}
                         </div>
                         <span className="text-[10px] font-black text-brand-navy uppercase tracking-widest group-hover:text-brand-cyan transition-colors flex items-center gap-2">
                            Program Details <ArrowRight className="w-3 h-3" />
                         </span>
                      </div>
                    </div>
                  </div>
                </Link>
             );
          })}
        </div>
      </div>
    </section>
  );
}
