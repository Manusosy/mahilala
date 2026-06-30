import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
const ACTIVITIES = [
  { title: 'Mangrove Ecosystem Restoration', desc: 'Large-scale replanting and protection of mangrove forests that serve as natural flood barriers, carbon sinks, and fish nurseries for coastal communities.' },
  { title: 'Climate Risk Assessments', desc: 'Country-level and community-level vulnerability mapping that informs program design and resource allocation across the Alliance.' },
  { title: 'Watershed Protection', desc: 'Strengthening source water protection areas through land use agreements, reforestation, and community stewardship programs.' },
  { title: 'Coastal Ecosystem Rehabilitation', desc: 'Restoring degraded coral reefs, seagrass beds, and sand dunes that provide natural coastal protection against erosion and storms.' },
  { title: 'Early Warning Systems', desc: 'Building community-level climate early warning capacities that enable timely responses to extreme weather and sea-level anomalies.' },
  { title: 'Nature-Based Solutions Scaling', desc: 'Documenting, testing, and scaling indigenous and science-based nature-based solutions for climate adaptation across all four nations.' },
];

export default function ClimatePage() {
  return (
    <main>
      <PageHero
        label="THEMATIC PILLAR"
        heading="Restoring Ecosystems. Adapting to a Changing Climate."
        subheading="Nature-based solutions, ecosystem restoration, and climate resilience programs anchoring ESA-ORA's environmental mandate across four Indian Ocean nations."
        imageSrc="/images/sections/pillar-climate-action.jpg"
        breadcrumb="Climate Action"
        breadcrumbParent={{ label: 'Our Work', href: '/programs' }}
      />

      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#22C55E] uppercase tracking-widest text-xs font-bold block mb-4">Why This Pillar Matters</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">
                The Indian Ocean is Warming — and its Coastlines Are Paying the Price
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                The Indian Ocean has been warming at an accelerating rate since the 1990s, triggering mass coral bleaching events, disrupting monsoon patterns, intensifying cyclone frequency and severity, and threatening the coastal ecosystems that millions depend on for food, livelihoods, and climate protection.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                ESA-ORA's Climate Action pillar focuses on both mitigation — restoring the natural ecosystems that absorb carbon and buffer impacts — and adaptation — building the capacity of communities to thrive despite accelerating climate disruption.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '40%', label: 'Of mangroves lost since 1980 in the region' },
                { stat: '2°C+', label: 'Indian Ocean warming since pre-industrial' },
                { stat: '500km²', label: 'Target ecosystem restoration area' },
                { stat: '12K+', label: 'Households in early warning program catchment' },
              ].map((item) => (
                <div key={item.label} className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5">
                  <p className="text-3xl font-bold text-[#22C55E] font-display mb-1">{item.stat}</p>
                  <p className="text-brand-navy/70 text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F0F4F8] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#22C55E] uppercase tracking-widest text-xs font-bold block mb-3">What We Do</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Key Climate Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACTIVITIES.map((act, i) => (
              <div key={i} className="bg-white rounded-lg p-7 border border-black/5 hover:-translate-y-1 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] text-xs font-bold mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-brand-navy font-bold text-base mb-3">{act.title}</h3>
                <p className="text-[#718096] text-sm leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#22C55E] uppercase tracking-widest text-xs font-bold block mb-4">Country Programs</span>
          <h2 className="font-display text-4xl text-white font-bold mb-6">Four Nations, One Climate Strategy</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Each member nation implements climate activities adapted to its unique ecosystem, risk profile, and community needs — with cross-country learning coordinated by the Climate Action TWG.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { country: 'Kenya', href: '/countries/kenya' },
              { country: 'Tanzania', href: '/countries/tanzania' },
              { country: 'Mozambique', href: '/countries/mozambique' },
              { country: 'Madagascar', href: '/countries/madagascar' },
            ].map((c) => (
              <Link key={c.country} href={c.href} className="block bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 hover:border-[#22C55E]/50 transition-all group">
                <p className="text-white font-semibold text-sm group-hover:text-[#22C55E] transition-colors">{c.country}</p>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 text-white/30 group-hover:text-[#22C55E] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
