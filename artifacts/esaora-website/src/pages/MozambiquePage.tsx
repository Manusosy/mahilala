import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
const FOCUS_AREAS = [
  { name: 'Mangrove Restoration', color: '#22C55E', href: '/our-work/climate', desc: 'Mozambique holds the largest mangrove forests in the Western Indian Ocean. ESA-ORA supports large-scale replanting and community-based protection of these critical ecosystems that protect coastlines and sustain fisheries.' },
  { name: 'Fisheries Development', color: '#001BB7', href: '/our-work/blue-economy', desc: 'Strengthening sustainable fisheries management and co-management frameworks for the 800,000+ artisanal fishers who depend on Mozambique\'s coastal waters for food and income security.' },
  { name: 'Public Health', color: '#F59E0B', href: '/our-work/public-health', desc: 'Addressing the high burden of waterborne disease in Mozambique\'s coastal communities through integrated WASH and community health programs, with priority for cyclone-affected and flood-prone areas.' },
];

export default function MozambiquePage() {
  return (
    <main>
      <PageHero
        label="MEMBER NATION — MOZAMBIQUE"
        heading="Mozambique: The Long Coast of Resilience"
        subheading="2,470 km of coastline — Africa's longest — home to critical mangrove ecosystems and a founding ESA-ORA nation anchoring restoration and blue economy in the southern Indian Ocean."
        imageSrc="/images/hero/hero-bg-8.jpg"
        breadcrumb="Mozambique"
        breadcrumbParent={{ label: 'Countries', href: '/about' }}
      />

      <section className="bg-white py-16 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Indian Ocean Coastline', value: '2,470 km' },
              { label: 'Capital City', value: 'Maputo' },
              { label: 'Coastal Hub', value: 'Beira & Pemba' },
              { label: 'Alliance Status', value: 'Founding Member' },
            ].map((s) => (
              <div key={s.label} className="text-center py-6 px-4 bg-[#F0F4F8] rounded-lg border border-black/5">
                <p className="text-3xl font-bold font-display text-brand-navy mb-1">{s.value}</p>
                <p className="text-[#718096] text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F0F4F8] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">ESA-ORA in Mozambique</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">Mozambique's Role in the Alliance</h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                With Africa's longest Indian Ocean coastline and some of the region's most extensive mangrove forests, Mozambique is a critical environmental anchor within ESA-ORA. The nation has faced repeated climate shocks — Cyclone Idai (2019), Kenneth (2019), and Freddy (2023) — making climate resilience a lived emergency, not an abstraction.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                Mozambique leads ESA-ORA's ecosystem restoration agenda, particularly mangrove rehabilitation, while anchoring public health programs in underserved northern coastal communities.
              </p>
            </div>
            <div className="bg-brand-navy rounded-lg p-8">
              <p className="text-[#001BB7] text-xs uppercase tracking-widest font-bold mb-4">Country Snapshot</p>
              <div className="space-y-4 text-white/70 text-sm">
                {[
                  { label: 'Primary Focus', value: 'Mangrove Restoration, Fisheries, Public Health' },
                  { label: 'Key Ecosystem', value: "Africa's largest mangrove forests" },
                  { label: 'Coastline', value: '2,470 km — Africa\'s longest' },
                  { label: 'Key Cities', value: 'Maputo, Beira, Quelimane, Pemba' },
                  { label: 'Alliance Role', value: 'Ecosystem restoration & southern anchor' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/45 font-medium">{item.label}</span>
                    <span className="text-white font-semibold text-right max-w-[55%]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Program Focus</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Mozambique's ESA-ORA Focus Areas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FOCUS_AREAS.map((area) => (
              <Link key={area.name} href={area.href} className="group block bg-[#F0F4F8] rounded-lg p-7 border border-black/5 hover:-translate-y-1 transition-all">
                <h3 className="text-brand-navy font-bold text-xl mb-4 group-hover:text-[#001BB7] transition-colors">{area.name}</h3>
                <p className="text-[#718096] text-sm leading-relaxed mb-5">{area.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#001BB7] group-hover:gap-3 transition-all">
                  <span>Learn More</span><ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F0F4F8] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl text-brand-navy font-bold mb-4">Explore All ESA-ORA Member Nations</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[{ name: 'Kenya', href: '/countries/kenya' }, { name: 'Tanzania', href: '/countries/tanzania' }, { name: 'Madagascar', href: '/countries/madagascar' }].map((c) => (
              <Link key={c.name} href={c.href} className="bg-white border border-brand-navy/10 hover:border-[#001BB7]/40 text-brand-navy hover:text-[#001BB7] px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
                {c.name} <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
