import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { usePublishedTeam } from '@workspace/esaora-core/hooks/useData';
import { 
  Building2, Globe, ChevronRight, UserCheck, Mail, ArrowLeft
} from 'lucide-react';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { Link } from 'wouter';

export default function TeamMemberPage() {
  const [, params] = useRoute('/team/:slug');
  const { members, loading } = usePublishedTeam();
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    if (members.length > 0 && params?.slug) {
      const slug = params.slug.replace('-bio', '');
      const found = members.find(m => 
        m.name.toLowerCase().replace(/\s+/g, '-') === slug
      );
      setMember(found);
    }
  }, [members, params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-brand-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h2 className="font-display text-4xl text-brand-navy font-bold mb-4 text-center">Profile Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">The team member dossier you are looking for is currently unavailable.</p>
        <Link href="/team">
            <a className="bg-brand-navy text-white px-8 py-3 rounded-[7px] font-bold flex items-center gap-2 hover:bg-brand-navy/90 transition-all font-display text-sm uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
            </a>
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen" style={{ 
      backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
      backgroundSize: '32px 32px' 
    }}>
      {/* Standardized Breadcrumbs */}
      <div className="pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <Link href="/"><a className="hover:text-brand-cyan transition-colors">Home</a></Link>
                <ChevronRight className="w-3 h-3 text-gray-200" />
                <Link href="/team"><a className="hover:text-brand-cyan transition-colors">Our Team</a></Link>
                <ChevronRight className="w-3 h-3 text-gray-200" />
                <span className="text-brand-navy">{member.name}</span>
            </nav>
        </div>
      </div>

      <section className="pb-32 pt-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Portrait Column */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[7px] border border-gray-100 p-3">
                <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-gray-50 border border-gray-50">
                    {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-navy/5">
                        <UserCheck className="w-24 h-24 text-brand-navy/10" />
                    </div>
                    )}
                    
                </div>

                {/* Refined Social Row - Text on the left, refined icons */}
                <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-gray-50">
                    <Link href="/contact">
                        <a className="text-[10px] font-black text-brand-navy uppercase tracking-widest hover:text-brand-cyan transition-colors whitespace-nowrap border-r border-gray-100 pr-6">
                            Get In Touch
                        </a>
                    </Link>

                    <div className="flex items-center gap-5">
                        {member.linkedin_url && (
                            <a 
                                href={member.linkedin_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:scale-110 transition-transform active:scale-95 text-brand-navy opacity-40 hover:opacity-100"
                                title="LinkedIn Profile"
                            >
                                <LinkedInIcon size={18} color="currentColor" />
                            </a>
                        )}
                        {member.email && (
                            <a 
                                href={`mailto:${member.email}`} 
                                className="hover:scale-110 transition-transform active:scale-95 text-brand-navy opacity-40 hover:opacity-100"
                                title="Email Contact"
                            >
                                <Mail size={18} />
                            </a>
                        )}
                    </div>
                </div>
              </div>
            </div>

            {/* Narrative Column - Compact Professionalism */}
            <div className="lg:col-span-8">
              {/* Identity Block */}
              <div className="border-b border-gray-100 pb-12 mb-12">
                <span className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.4em] block mb-3">
                    {member.role || 'Member'}
                </span>
                <h1 className="font-display text-5xl md:text-6xl text-brand-navy font-bold tracking-tight leading-[1.1] mb-4">
                    {member.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 font-display italic leading-relaxed">
                    {member.title}
                </p>

                {/* Compact Data Row */}
                <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                    {member.organization && (
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-[#001BB7]" />
                            <div>
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest block leading-none mb-1">Affiliation</span>
                                <span className="text-brand-navy font-bold text-base leading-none">{member.organization}</span>
                            </div>
                        </div>
                    )}
                    {member.country && (
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-[#001BB7]" />
                            <div>
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest block leading-none mb-1">Region</span>
                                <span className="text-brand-navy font-bold text-base leading-none">{member.country}</span>
                            </div>
                        </div>
                    )}
                </div>
              </div>

              {/* Biography narrative */}
              <div className="max-w-2xl">
                <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em] block mb-6">Biography</span>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                    {member.bio || `The professional biography for ${member.name} is currently being verified by the Regional Secretariat. Official records reflect their current standing within the consortium governance.`}
                </div>
                
                <div className="mt-16">
                    <Link href="/team">
                        <a className="inline-flex items-center gap-2 text-brand-cyan text-[10px] font-black uppercase tracking-widest hover:text-brand-navy transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Return to Directory
                        </a>
                    </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
