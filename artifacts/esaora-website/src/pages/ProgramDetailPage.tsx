import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useProgramBySlug, usePublishedPrograms } from '@workspace/esaora-core/hooks/usePrograms';
import { ChevronRight, Target, TrendingUp, HelpCircle, MapPin, Layers, Calendar, PlayCircle, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

// ── Official Social Icons (SVG) ─────────────────────────────────────────────
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.23 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
  </svg>
);

export default function ProgramDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { program, loading } = useProgramBySlug(params.slug || '');

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 animate-pulse">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-3 w-24 bg-gray-100 rounded mb-5" />
          <div className="h-10 w-3/4 bg-gray-100 rounded mb-4" />
          <div className="h-4 w-1/2 bg-gray-100 rounded mb-10" />
          <div className="aspect-[16/9] w-full bg-gray-100 rounded-[7px] mb-10" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-11/12 bg-gray-100 rounded" />
            <div className="h-4 w-10/12 bg-gray-100 rounded" />
            <div className="h-4 w-9/12 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl text-brand-navy font-bold mb-4">Program Offline</h1>
        <p className="text-slate-800 mb-8 max-w-md">The requested program is currently unavailable or has been archived.</p>
        <Link href="/programs">
          <a className="bg-[#204f79] text-white px-8 py-3 rounded-[7px] font-bold transition-transform hover:scale-105">All Programs</a>
        </Link>
      </div>
    );
  }

  const fundingPercent = program.funding_goal > 0 ? Math.min(Math.round((program.funding_raised / program.funding_goal) * 100), 100) : 0;
  
  const formatDate = (dateStr: string | null) => {
      if (!dateStr) return null;
      try {
          return format(new Date(dateStr), 'MMM yyyy');
      } catch (e) {
          return dateStr;
      }
  };

  const startDate = formatDate(program.start_date);
  const endDate = formatDate(program.end_date);
  const timeline = startDate === endDate ? startDate : `${startDate} — ${endDate || 'Active'}`;

  const shareUrl = window.location.href;
  const shareTitle = `Mahilala Programme: ${program.name}`;

  return (
    <main className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 text-white hover:text-brand-cyan transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Program Detail" 
            className="max-w-full max-h-[90vh] rounded-[7px] object-contain"
          />
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-800 mb-8">
                <Link href="/"><a className="hover:text-brand-navy transition-colors">Home</a></Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/programs"><a className="hover:text-brand-navy transition-colors">Programs</a></Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-navy">{program.name}</span>
            </nav>
        </div>
      </div>

      {/* Hero / Header Section */}
      <header className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-6">
                      <span className="px-2.5 py-1 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                          {program.pillar}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[9px] uppercase tracking-wider">
                          <Layers className="w-3 h-3 text-brand-cyan" /> Strategic Programme
                      </div>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#111111] font-black leading-tight tracking-tight">
                      {program.name}
                  </h1>
              </div>
              <div className="flex items-center gap-4 pb-2">
                   <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Share Initiative</span>
                   <div className="flex items-center gap-3">
                       <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-[4px] text-slate-900 hover:text-[#1877F2] transition-colors"><FacebookIcon className="w-4 h-4" /></a>
                       <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-[4px] text-slate-900 hover:text-black transition-colors"><XIcon className="w-4 h-4" /></a>
                       <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-[4px] text-slate-900 hover:text-[#0077B5] transition-colors"><LinkedinIcon className="w-4 h-4" /></a>
                   </div>
              </div>
          </div>

          <div className="relative aspect-[21/9] rounded-[7px] overflow-hidden border border-gray-100">
             {program.cover_image_url ? (
               <img src={program.cover_image_url} alt={program.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-brand-navy flex items-center justify-center">
                 <p className="text-white/20 font-display text-4xl font-bold italic tracking-tighter uppercase">Mahilala Programme</p>
               </div>
             )}
          </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
              
              {/* Left Column: Narrative Content */}
              <div className="flex-1 min-w-0 space-y-16">
                  
                  {/* description */}
                  <article>
                      <div className="flex items-center gap-4 mb-10">
                         <div className="h-px bg-gray-200 flex-1" />
                         <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em]">Program Blueprint</span>
                         <div className="h-px bg-gray-200 w-12" />
                      </div>
                      <div 
                        className="prose prose-lg prose-slate max-w-none prose-p:text-slate-900 prose-p:leading-[1.9] prose-headings:font-display prose-headings:text-brand-navy prose-strong:text-brand-navy prose-a:text-brand-cyan"
                        dangerouslySetInnerHTML={{ __html: program.body }}
                      />
                  </article>

                  {/* Objectives & Impact Grid */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {program.objectives && (
                        <div className="bg-white p-8 rounded-[7px] border border-gray-100">
                            <h3 className="flex items-center gap-3 text-xs font-black text-brand-navy uppercase tracking-widest mb-6">
                                <Target className="w-4 h-4 text-brand-cyan" /> Core Objectives
                            </h3>
                            <div className="prose prose-sm prose-slate prose-p:leading-relaxed text-slate-900" dangerouslySetInnerHTML={{ __html: program.objectives }} />
                        </div>
                      )}
                      {program.impact && (
                        <div className="bg-white p-8 rounded-[7px] border border-gray-100">
                            <h3 className="flex items-center gap-3 text-xs font-black text-brand-navy uppercase tracking-widest mb-6">
                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Strategic Impact
                            </h3>
                            <div className="prose prose-sm prose-slate prose-p:leading-relaxed text-slate-900" dangerouslySetInnerHTML={{ __html: program.impact }} />
                        </div>
                      )}
                  </section>

                  {/* Challenges Section */}
                  {program.challenges && (
                    <section className="bg-white rounded-[7px] p-10 border border-gray-100">
                        <div className="max-w-2xl">
                            <h3 className="flex items-center gap-3 text-xs font-black text-slate-900 uppercase tracking-widest mb-8">
                                <HelpCircle className="w-4 h-4 text-[#204f79]" /> Challenges & Resilience
                            </h3>
                            <div className="prose prose-slate prose-p:text-slate-900 prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: program.challenges }} />
                        </div>
                    </section>
                  )}

                  {/* Gallery Section */}
                  {program.gallery && program.gallery.length > 0 && (
                    <section className="pt-12 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                           <h2 className="text-xl font-display font-black text-brand-navy uppercase tracking-tight">Project Documentation</h2>
                           <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{program.gallery.length} Verified Media Assets</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {program.gallery.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className="group relative aspect-[4/3] rounded-[7px] overflow-hidden border border-gray-100 transition-all hover:border-brand-cyan/40 cursor-zoom-in"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt={`${program.name} gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-brand-navy/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <PlayCircle className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                  )}

                  {/* Video Presentation */}
                  {program.video_url && (
                    <section className="pt-12 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-8">
                         <PlayCircle className="w-5 h-5 text-brand-cyan" />
                         <h2 className="text-xl font-display font-black text-brand-navy uppercase tracking-tight">Audio-Visual Presentation</h2>
                      </div>
                      <div className="aspect-video rounded-[7px] overflow-hidden border border-gray-100 bg-gray-100">
                         <iframe 
                            src={program.video_url.replace('watch?v=', 'embed/')} 
                            className="w-full h-full"
                            title={`${program.name} video`}
                            allowFullScreen
                         />
                      </div>
                    </section>
                  )}
              </div>

              {/* Right Column: Sidebar Stats */}
              <aside className="lg:w-80 xl:w-96 space-y-6">
                  
                  {/* Program Intelligence Card */}
                  <div className="bg-white rounded-[7px] p-8 border border-gray-200">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Program Meta</h4>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-600 border border-emerald-100">
                             <span className={`w-1.5 h-1.5 rounded-full ${program.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                             <span className="text-[8px] font-black uppercase tracking-widest">{program.status}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                          <div className="flex items-start gap-4">
                              <MapPin className="w-4 h-4 text-brand-cyan mt-1" />
                              <div>
                                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">Member Nations</p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                                      {program.countries?.map(c => (
                                          <span key={c} className="text-sm font-bold text-brand-navy">{c}</span>
                                      ))}
                                  </div>
                                  {program.countries?.length === 4 && (
                                      <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-2 bg-emerald-50 px-2 py-0.5 rounded inline-block">Region-wide Coverage</p>
                                  )}
                              </div>
                          </div>

                          <div className="flex items-start gap-4">
                              <Calendar className="w-4 h-4 text-brand-cyan mt-1" />
                              <div>
                                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">Operational Cycle</p>
                                  <p className="text-sm font-bold text-brand-navy">
                                      {timeline}
                                  </p>
                              </div>
                          </div>

                          {program.key_output && (
                              <div className="flex items-start gap-4">
                                  <Target className="w-4 h-4 text-brand-cyan mt-1" />
                                  <div>
                                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">Core Deliverable</p>
                                      <p className="text-sm font-bold text-brand-navy italic leading-snug">{program.key_output}</p>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Funding Tracker Card */}
                  <div className="bg-[#204f79] rounded-[7px] p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Funding Progress</h4>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter border border-white/20 ${
                                program.funding_status === 'partially funded' ? 'bg-[#204f79] text-white' : 'bg-white text-brand-navy'
                              }`}>
                                  {program.funding_status}
                              </span>
                          </div>

                          <div className="mb-8">
                              <div className="flex items-baseline justify-between mb-3">
                                  <p className="text-3xl font-black italic tracking-tighter text-white">${program.funding_raised.toLocaleString()}</p>
                                  <p className="text-[9px] font-bold text-white uppercase tracking-widest">of ${program.funding_goal.toLocaleString()} target</p>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mb-3">
                                  <div 
                                    className="h-full bg-white transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                                    style={{ width: `${fundingPercent}%` }}
                                  />
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-white">{fundingPercent}% COMPLETED</span>
                                  <span className="text-white opacity-80">PHASE 01</span>
                              </div>
                          </div>

                          <button disabled className="w-full bg-white/20 border border-white/30 text-white font-black uppercase tracking-widest py-4 rounded-[4px] text-[10px] cursor-not-allowed">
                              Donations Restricted
                          </button>
                          <p className="text-[8px] text-white text-center mt-5 font-bold uppercase tracking-[0.15em] leading-normal italic">
                              Funding governed by Steering Committee<br/>Public giving cycle pending
                          </p>
                      </div>
                  </div>

                  {/* Focus Areas Card */}
                  {program.focus_areas && program.focus_areas.length > 0 && (
                    <div className="bg-white rounded-[7px] p-8 border border-gray-200">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Strategic Focus areas</h4>
                        <div className="space-y-4">
                            {program.focus_areas.map((area, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm font-bold text-brand-navy leading-tight">
                                    <div className="w-1 h-1 rounded-full bg-brand-cyan" /> {area}
                                </div>
                            ))}
                        </div>
                    </div>
                  )}

              </aside>
          </div>
      </div>

      <RelatedProgramsSection currentPillar={program.pillar} currentId={program.id} />
    </main>
  );
}

function RelatedProgramsSection({ currentPillar, currentId }: { currentPillar: string, currentId: string }) {
    const { programs, loading } = usePublishedPrograms(currentPillar);
    const related = programs.filter(p => p.id !== currentId).slice(0, 3);

    if (loading || related.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 mt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <span className="text-brand-cyan uppercase tracking-[0.2em] text-[10px] font-black block mb-3">Contextual Initiatives</span>
                    <h2 className="font-display text-3xl text-brand-navy font-black italic">Related {currentPillar} Programs</h2>
                </div>
                <Link href="/programs">
                    <a className="text-[10px] font-black text-brand-navy uppercase tracking-widest hover:text-brand-cyan transition-colors">View All Programs —</a>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map(p => (
                    <Link key={p.id} href={`/programs/${p.slug}`}>
                        <div className="group bg-white rounded-[7px] border border-gray-200 overflow-hidden transition-all h-full flex flex-col hover:border-brand-cyan/50">
                            {p.cover_image_url && (
                                <div className="h-48 overflow-hidden bg-gray-100 relative">
                                    <img src={p.cover_image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-display text-lg text-[#111111] font-black mb-3 group-hover:text-gray-600 transition-colors leading-tight">{p.name}</h3>
                                <p className="text-xs text-slate-800 line-clamp-2 flex-1 mb-6 leading-relaxed">{p.summary}</p>
                                <span className="text-[10px] font-black text-brand-navy uppercase tracking-widest transition-colors flex items-center gap-2">
                                    Details <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
