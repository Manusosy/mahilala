import { Link } from 'wouter';
import { ArrowRight, Check, ExternalLink, Globe } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { usePublishedPartners } from '@workspace/esaora-core/hooks/useData';

const COLLABORATION_TYPES = [
  'Joint environmental education activities',
  'Youth orientation and mentoring partnerships',
  'Community events and civic engagement',
  'School outreach and field training',
  'Marine awareness and coastal community programmes',
];

const PARTNER_EXAMPLES = [
  'Youth and community organizations',
  'Schools and educational institutions',
  'Environmental and marine science groups',
  'Civic movements and volunteer networks',
  'Local NGOs and community-based organizations',
];

export default function PartnersPage() {
  const { partners, loading } = usePublishedPartners();

  return (
    <main>
      <PageHero
        label="PARTNERS & COLLABORATORS"
        heading="Working Together for Youth and the Environment"
        subheading="Mahilala Madagascar collaborates with organizations that share our commitment to youth empowerment, civic engagement, and environmental education in Toliara and across Madagascar."
        imageSrc="/images/hero/hero-bg-10.jpg"
        breadcrumb="Partners"
      />

      {/* Partners Grid */}
      <section className="bg-[#f8fafc] py-24 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Our Core Partners</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Leading Organizations</h2>
          </div>

          {loading ? (
             <div className="flex justify-center p-20">
               <div className="w-10 h-10 border-4 border-brand-navy border-t-[#001BB7] rounded-full animate-spin" />
             </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No partners publicly listed at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partners.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-black/5 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-brand-navy/5 transition-all duration-500 hover:-translate-y-1">
                  <div className="h-48 bg-white flex items-center justify-center p-8 border-b border-black/5">
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110" />
                    ) : (
                      <Globe className="w-16 h-16 text-gray-200" />
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col items-center text-center bg-[#F1F5F9]/30">
                    {p.country && (
                      <span className="bg-[#E8EAF8] text-[#001BB7] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg mb-4">
                        {p.country}
                      </span>
                    )}
                    <h3 className="text-brand-navy font-bold text-lg mb-4 leading-tight">{p.name}</h3>
                    {p.description && (
                      <p className="text-[#718096] text-sm leading-relaxed mb-8 flex-grow">
                        {p.description}
                      </p>
                    )}
                    
                    {p.website_url && (
                      <div className="w-full pt-6 border-t border-black/5">
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-widest group-hover:text-[#001BB7] transition-colors mx-auto">
                          VISIT WEBSITE <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Framework */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Partner With Us</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Collaborate With Mahilala</h2>
            <p className="text-[#718096] mt-4 text-base max-w-2xl mx-auto">
              Mahilala welcomes organizations, schools, and community groups that share our commitment to youth empowerment and environmental education in Toliara and across Madagascar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
            {[
              { step: '01', title: 'Who Can Partner', desc: 'Schools, youth groups, environmental organizations, civic movements, and community-based organizations in Madagascar.', items: PARTNER_EXAMPLES },
              { step: '02', title: 'How to Connect', desc: 'Reach out through our contact form to discuss collaboration on orientation, environmental education, or community events.', items: ['Contact us with your partnership idea', 'We respond within 2–3 business days', 'Discuss programme alignment and goals', 'Plan joint activities together'] },
              { step: '03', title: 'Collaboration Areas', desc: 'Partners work with Mahilala on activities that support young people and coastal communities.', items: COLLABORATION_TYPES.slice(0, 4) },
            ].map((block) => (
              <div key={block.step} className="bg-[#F0F4F8] rounded-lg p-8 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center text-[#001BB7] text-sm font-bold">{block.step}</div>
                  <h3 className="text-brand-navy font-bold text-lg">{block.title}</h3>
                </div>
                <p className="text-[#718096] text-sm leading-relaxed mb-5">{block.desc}</p>
                <ul className="space-y-2.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#4A5568] text-xs leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-[#001BB7] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/contact" className="inline-block bg-[#001BB7] hover:bg-[#F78A28] text-white px-10 py-4 rounded-lg font-bold text-base transition-all hover:scale-105 shadow-lg shadow-[#001BB7]/30">
              Contact Us About Partnership
            </Link>
            <p className="text-[#718096] text-xs mt-4">Questions? Contact <a href="mailto:info@mahilalamadagascar.org" className="text-[#001BB7] hover:underline">info@mahilalamadagascar.org</a></p>
          </div>
        </div>
      </section>

      {/* Collaboration Benefits */}
      <section className="bg-brand-navy py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold bg-[#001BB7]/10 px-4 py-1.5 rounded-lg inline-block mb-4">Collaboration Areas</span>
            <h2 className="font-display text-4xl text-white font-bold mt-4">Ways to Work Together</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLLABORATION_TYPES.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="w-7 h-7 bg-[#001BB7]/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#001BB7]" />
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="inline-block bg-[#001BB7] hover:bg-[#F78A28] text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-105">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* Supporter CTA */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Known Collaborators</span>
          <h2 className="font-display text-3xl text-brand-navy font-bold mb-5">Current & Ongoing Partnerships</h2>
          <p className="text-[#718096] text-lg leading-relaxed mb-8">
            Mahilala collaborates with organizations including RAIKY, MOVE ON: Be Ready for Change, VOIZO Madagascar, IH.SM (BlueDays at School), and Event+. Partner logos are displayed only with client permission.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3.5 rounded-lg font-bold text-sm hover:bg-brand-navy/90 transition-all hover:gap-3">
            Discuss a Partnership <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
