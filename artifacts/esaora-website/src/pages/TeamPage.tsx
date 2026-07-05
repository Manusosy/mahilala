import { useMemo, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHero } from '@/components/PageHero';
import { usePublishedTeam } from '@workspace/esaora-core/hooks/useData';
import { Mail, Plus, User, ArrowUpRight, GraduationCap, Award, MapPin, Quote } from 'lucide-react';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';

gsap.registerPlugin(ScrollTrigger);

/* ─── Founder content (authored in English; i18n auto-translates later) ───── */

const FOUNDER_CREDENTIALS = [
  { icon: GraduationCap, label: 'PhD, 2025' },
  { icon: Award, label: 'Mandela Washington Fellow 2017' },
  { icon: MapPin, label: 'IH.SM, University of Toliara' },
];

const FOUNDER_BIO = [
  'Rakotonjanahary Fidèle is a marine biologist, environmentalist, and committed leader for youth and sustainable development in Madagascar. His journey combines scientific research, community engagement, environmental education, and the mentoring of younger generations.',
  'A graduate of the Institute of Fisheries and Marine Sciences (IH.SM) at the University of Toliara, he earned a Professional Bachelor\u2019s Degree of the Sea and Coast, specializing in Marine and Coastal Environment and Biodiversity, in 2011, before continuing with a Master\u2019s (DEA) in Applied Oceanology in 2015. He became a Doctor (PhD) in April 2025.',
  'Beyond the scientific field, he developed a strong involvement in leadership and civic engagement early on. In 2017, he was selected for the prestigious Mandela Washington Fellowship for Young African Leaders, with a specialization in Civic Leadership. This experience strengthened his vision: helping young people discover their potential, develop their leadership, and become positive agents of change in their communities.',
  'This conviction gave rise to Mahilala, an initiative dedicated to youth orientation, personal development, leadership, and environmental education. Through Mahilala, he guides young people and students in discovering their vocation, choosing their academic and professional paths, and developing an entrepreneurial and civic culture.',
  'Fidèle is also involved in several community and associative initiatives. He has contributed to environmental education programmes in schools, training for fishing communities in southwestern Madagascar, and civic movements focused on civic-mindedness, patriotism, and the social responsibility of young people.',
  'As a coach and mentor in entrepreneurial programmes such as Techstars Startup Weekend, he also supports young people with innovative ideas and projects.',
  'His vision rests on a simple idea: science, education, leadership, and community engagement can together help build a Madagascar that is more sustainable, more conscious, and more inspiring for future generations.',
  'Through his journey, Rakotonjanahary Fidèle embodies a new generation of African leaders committed to the environment, youth, and positive change.',
];

const FOUNDER_MESSAGE = [
  'At Mahilala, we believe that life is a journey, and it is up to each person to make that journey meaningful, inspiring, and unforgettable.',
  'Success is a choice, much like preparing a good meal. The quality of the result depends on the ingredients we choose every day: our decisions, our values, our discipline, and the people we surround ourselves with. Wrong choices can sometimes change the direction of our lives, while reflection, learning, and continuous improvement help us grow and become better versions of ourselves.',
  'Just like a master chef constantly improves a recipe, we must also take time to learn, adapt, and refine our path throughout life.',
  'And finally, whether our presence on Earth was planned or unexpected, we believe that every life has a purpose. Nothing is completely by chance. Each person carries a mission, a reason to exist, and a unique contribution to bring to the world.',
  'The challenge is to discover that purpose and to use it to create a positive impact for ourselves, for others, and for future generations.',
];

export default function TeamPage() {
  const { members, loading } = usePublishedTeam();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.founder-portrait',
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: '.founder-spotlight', start: 'top 75%' } }
      );
      gsap.fromTo('.founder-copy',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: '.founder-spotlight', start: 'top 75%' } }
      );
      gsap.fromTo('.founder-chip',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.founder-spotlight', start: 'top 70%' } }
      );
      gsap.fromTo('.founder-message-panel',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: '.founder-message-section', start: 'top 70%' } }
      );
    });
    return () => { ctx.revert(); };
  }, [loading]);

  // Grouping logic for editorial structure
  const groupedMembers = useMemo(() => {
    return {
      leadership: members.filter(m => ['leadership', 'board'].includes(m.role.toLowerCase())),
      secretariat: members.filter(m => !['leadership', 'board'].includes(m.role.toLowerCase()))
    };
  }, [members]);

  // Slug helper
  const getSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  return (
    <main className="bg-white">
      <PageHero
        label="OUR TEAM"
        heading="The People Behind Mahilala"
        subheading="A founder and a dedicated team working together for Madagascar's youth through science, mentorship, environmental education, and community engagement."
        imageSrc="/images/hero/team-hero.jpg"
        breadcrumb="Our Team"
        breadcrumbParent={{ label: 'About', href: '/about' }}
      />

      {/* ── Founder Spotlight (Editorial Side-by-Side) ───────────────────── */}
      <section className="founder-spotlight py-24 md:py-32 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Portrait Column */}
            <div className="founder-portrait lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="bg-[#fcfcfa] rounded-[7px] border border-gray-100 p-3 shadow-sm">
                  {/* Portrait slot — drop the real founder photo at /images/team/founder.jpg */}
                  <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-brand-navy/5 border border-gray-50">
                    <img
                      src="/images/team/founder-fidele-speaking.png"
                      alt="Rakotonjanahary Fidèle, Founder of Mahilala Madagascar"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-white/90 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Founder</span>
                      <span className="text-white font-display text-xl font-bold leading-tight">Rakotonjanahary Fidèle</span>
                    </div>
                  </div>
                </div>

                {/* Credential chips */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {FOUNDER_CREDENTIALS.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="founder-chip inline-flex items-center gap-2 bg-[#F0F4F8] text-brand-navy text-[11px] font-bold px-3.5 py-2 rounded-[7px] border border-gray-100"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#204f79]" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="founder-copy lg:col-span-7">
              <span
                className="uppercase tracking-widest text-xs font-bold border px-4 py-1.5 rounded-lg leading-none inline-block mb-5"
                style={{ color: '#204f79', borderColor: '#204f79' }}
              >
                Founder
              </span>

              <h2 className="font-display text-4xl md:text-5xl text-[#111111] font-bold tracking-tight leading-[1.1] mb-4">
                Rakotonjanahary Fidèle
              </h2>
              <p className="text-[#204f79] text-sm md:text-base font-bold uppercase tracking-[0.15em] mb-10">
                Marine Biologist · Environmentalist · Youth Advocate
              </p>

              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed font-light max-w-2xl">
                {FOUNDER_BIO.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Founder's Message (Sticky cinematic background — same technique as HomePage QuoteSection) ── */}
      <section
        className="founder-message-section relative py-24 md:py-32 px-4 overflow-hidden"
        style={{ clipPath: 'inset(0)' }}
      >
        {/* Sticky/parallax background image */}
        <div
          className="fixed top-0 left-0 w-full h-[100vh] pointer-events-none overflow-hidden -z-10 bg-black bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero/hero-slide-outdoor-education.png')", backgroundPosition: 'center center' }}
        />

        {/* Dark scrim for text legibility — matches About Us quote section */}
        <div className="absolute inset-0 bg-black/30 -z-0 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <div className="founder-message-panel text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#204f79]/25 backdrop-blur-sm mb-8">
              <Quote className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/90 text-[10px] font-black uppercase tracking-[0.4em] block mb-6">
              A Message from the Founder
            </span>

            <div className="space-y-7 text-white/85 text-lg md:text-xl leading-relaxed font-light text-left">
              {FOUNDER_MESSAGE.map((paragraph, i) => (
                <p key={i} className={i === 0 ? 'text-white font-display text-2xl md:text-3xl leading-snug italic font-medium' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center gap-4">
              <span className="w-10 h-[1px] bg-white/30" />
              <span className="text-white/80 font-display italic text-base">
                Rakotonjanahary Fidèle, Founder
              </span>
              <span className="w-10 h-[1px] bg-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center">
              <span
                className="uppercase tracking-widest text-xs font-bold border px-4 py-1.5 rounded-lg leading-none inline-block mb-5"
                style={{ color: '#204f79', borderColor: '#204f79' }}
              >
                Leadership &amp; Team
              </span>
              <h3 className="font-display text-5xl text-[#111111] font-bold tracking-tight mb-6">The Leadership Team</h3>
              <p className="font-display text-2xl md:text-3xl text-gray-500 font-medium leading-tight max-w-3xl mx-auto mb-10">
                  Science, education, leadership, and community engagement working together for <span className="text-brand-cyan italic">Madagascar&apos;s youth.</span>
              </p>
              <div className="w-16 h-1 bg-brand-cyan mx-auto rounded-full" />
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col animate-pulse">
                    <div className="aspect-square w-full rounded-t-[7px] bg-gray-100 border-x border-t border-gray-100" />
                    <div className="w-full bg-[#fcfcfa] p-8 rounded-b-[7px] border-x border-b border-gray-100 space-y-3 flex flex-col items-center">
                      <div className="h-6 w-2/3 bg-gray-100 rounded" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {groupedMembers.leadership.map((member) => (
                <div key={member.id} className="group flex flex-col items-center text-center">
                   {/* Portrait with Hover Overlay */}
                   <Link href={`/team/${getSlug(member.name)}-bio`}>
                     <div className="relative aspect-square w-full rounded-t-[7px] overflow-hidden bg-gray-50 cursor-pointer border-x border-t border-gray-100 transition-all group-hover:border-brand-cyan/30 shadow-none">
                        {member.photo_url ? (
                            <img 
                                src={member.photo_url} 
                                alt={member.name} 
                                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-navy/5">
                                <User className="w-16 h-16 text-brand-navy/10" />
                            </div>
                        )}
                        
                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="bg-[#204f79] p-4 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                   </Link>

                   <div className="w-full bg-[#fcfcfa] p-8 rounded-b-[7px] border-x border-b border-gray-100 flex-1 flex flex-col justify-between">
                        <div>
                            <Link href={`/team/${getSlug(member.name)}-bio`}>
                               <h4 className="font-display text-2xl text-brand-navy font-bold leading-tight cursor-pointer hover:text-brand-cyan transition-colors">
                                   {member.name}
                               </h4>
                            </Link>
                            <p className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.3em] mt-3">
                                {member.role}
                            </p>
                            <p className="text-gray-500 font-medium text-sm mt-3 max-w-[280px] mx-auto italic leading-relaxed">
                                {member.title}
                            </p>
                        </div>

                        {/* Centered Social Media - Official Colors */}
                        <div className="mt-8 flex justify-center items-center gap-6">
                             {member.linkedin_url && (
                                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                    <LinkedInIcon size={18} />
                                </a>
                             )}
                             {member.email && (
                                <a href={`mailto:${member.email}`} className="text-[#204f79] hover:text-brand-navy transition-colors">
                                    <Mail size={18} />
                                </a>
                             )}
                        </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Members Section - Applying same centered design */}
      <section className="py-32 px-4 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
              <span
                className="uppercase tracking-widest text-xs font-bold border px-4 py-1.5 rounded-lg leading-none inline-block mb-5"
                style={{ color: '#204f79', borderColor: '#204f79' }}
              >
                Our People
              </span>
              <h3 className="font-display text-4xl text-[#111111] font-bold tracking-tight">Team Members</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {groupedMembers.secretariat.map((member) => (
                <div key={member.id} className="group flex flex-col items-center text-center">
                     <Link href={`/team/${getSlug(member.name)}-bio`}>
                        <div className="relative aspect-square w-full rounded-t-[7px] overflow-hidden bg-gray-50 cursor-pointer border-x border-t border-gray-100 transition-all group-hover:border-brand-cyan/30 shadow-none">
                            {member.photo_url ? (
                                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover grayscale-[0.3] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><User className="w-12 h-12 text-gray-200" /></div>
                            )}

                            {/* Hover Overlay Icon */}
                            <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center overflow-hidden">
                                <div className="bg-[#204f79] p-4 rounded-full shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-300">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                     </Link>

                     <div className="w-full bg-white p-8 rounded-b-[7px] border-x border-b border-gray-100 flex-1 flex flex-col justify-between">
                        <div>
                            <Link href={`/team/${getSlug(member.name)}-bio`}>
                               <h5 className="font-display text-xl text-brand-navy font-bold cursor-pointer hover:text-brand-cyan transition-colors">
                                   {member.name}
                               </h5>
                            </Link>
                            <p className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                                {member.role}
                            </p>
                            <p className="text-gray-400 text-xs font-bold leading-tight mt-3 italic">{member.title}</p>
                        </div>

                        {/* Centered Social Media - Official Colors */}
                        <div className="mt-8 flex justify-center items-center gap-6">
                             {member.linkedin_url && (
                                 <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                     <LinkedInIcon size={16} />
                                 </a>
                             )}
                             {member.email && (
                                 <a href={`mailto:${member.email}`} className="text-[#204f79] hover:text-brand-navy transition-colors">
                                     <Mail size={16} />
                                 </a>
                             )}
                        </div>
                     </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
