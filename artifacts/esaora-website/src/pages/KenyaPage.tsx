import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
const FOCUS_AREAS = [
  { name: 'Marine Conservation', color: '#001BB7', href: '/our-work/blue-economy', desc: 'Protecting Kenya\'s coral reefs, sea-grass beds, and marine protected areas through community co-management and science-driven conservation frameworks.' },
  { name: 'Climate-Resilient WASH', color: '#001BB7', href: '/our-work/wash', desc: 'Rehabilitating coastal water points, improving sanitation infrastructure, and building system resilience against saltwater intrusion and drought cycles.' },
  { name: 'Blue Economy', color: '#22C55E', href: '/our-work/blue-economy', desc: 'Supporting sustainable fisheries, youth-led aquaculture enterprises, and eco-tourism development along Kenya\'s 536km Indian Ocean coastline.' },
];

const TWG_PRESENCE = ['WASH Technical Working Group', 'Blue Economy Technical Working Group', 'Climate Action Technical Working Group', 'Research & Innovation TWG'];

export default function KenyaPage() {
  return (
    <main>
      <PageHero
        label="MEMBER NATION — KENYA"
        heading="Kenya: East Africa's Gateway to the Indian Ocean"
        subheading="536 km of coastline, rich coral heritage, and a founding role in ESA-ORA's regional mission to protect and restore the Western Indian Ocean."
        imageSrc="/images/hero/hero-bg-6.jpg"
        breadcrumb="Kenya"
        breadcrumbParent={{ label: 'Countries', href: '/about' }}
      />

      {/* Profile */}
      <section className="bg-white py-16 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Indian Ocean Coastline', value: '536 km' },
              { label: 'Capital City', value: 'Nairobi' },
              { label: 'Coastal Hub', value: 'Mombasa' },
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

      {/* ESA-ORA Presence */}
      <section className="bg-[#F0F4F8] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">ESA-ORA in Kenya</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">
                Kenya's Role in the Alliance
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                Kenya is a founding member of ESA-ORA and holds a permanent seat on the Steering Committee. As East Africa's largest coastal economy, Kenya anchors the Alliance's eastern flank — bringing deep expertise in marine conservation, decades of WASH programming, and a burgeoning blue economy sector.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-8">
                Kenya's Mombasa coastline, Zanzibar channel waters, and northern coral reef systems are critical biodiversity zones that sit at the heart of ESA-ORA's regional conservation agenda.
              </p>
              <div className="space-y-3">
                {TWG_PRESENCE.map((twg) => (
                  <div key={twg} className="flex items-center gap-3 text-[#4A5568] text-sm bg-white rounded-lg px-4 py-3 border border-black/5">
                    <span className="w-2 h-2 rounded-full bg-[#001BB7] flex-shrink-0" />
                    {twg}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-navy rounded-lg p-8">
              <p className="text-[#001BB7] text-xs uppercase tracking-widest font-bold mb-4">Country Snapshot</p>
              <div className="space-y-4 text-white/70 text-sm">
                {[
                  { label: 'Primary Focus', value: 'Marine Conservation, WASH, Blue Economy' },
                  { label: 'Active TWGs', value: '4 of 5 Technical Working Groups' },
                  { label: 'Coastline', value: '536 km (Indian Ocean)' },
                  { label: 'Key Cities', value: 'Mombasa, Lamu, Malindi, Kilifi' },
                  { label: 'Alliance Role', value: 'Eastern regional anchor & marine program lead' },
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

      {/* Focus Areas */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Program Focus</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Kenya's ESA-ORA Focus Areas</h2>
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
          <p className="text-[#718096] mb-8">Together, four nations safeguard over 8,000 km of Indian Ocean coastline.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[{ name: 'Tanzania', href: '/countries/tanzania' }, { name: 'Mozambique', href: '/countries/mozambique' }, { name: 'Madagascar', href: '/countries/madagascar' }].map((c) => (
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
