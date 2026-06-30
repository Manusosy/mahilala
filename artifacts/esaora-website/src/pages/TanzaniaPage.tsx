import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
const FOCUS_AREAS = [
  { name: 'Seaweed Cultivation', color: '#001BB7', href: '/our-work/blue-economy', desc: 'Tanzania is a global leader in seaweed farming. ESA-ORA supports scaling seaweed cultivation as a sustainable livelihood for women-led coastal cooperatives, particularly across the Zanzibar archipelago.' },
  { name: 'Sustainable Fisheries', color: '#001BB7', href: '/our-work/blue-economy', desc: 'Supporting science-based fisheries management across Tanzania\'s territorial waters — implementing community co-management frameworks that balance conservation with the livelihoods of 300,000+ artisanal fishers.' },
  { name: 'Coastal Resilience', color: '#22C55E', href: '/our-work/climate', desc: 'Building adaptive capacity in coastal communities through ecosystem restoration, early warning systems, and climate-smart livelihood diversification in areas most exposed to sea-level rise and storm surge.' },
];

export default function TanzaniaPage() {
  return (
    <main>
      <PageHero
        label="MEMBER NATION — TANZANIA"
        heading="Tanzania: Home of Zanzibar and Africa's Indian Ocean Heart"
        subheading="1,424 km of coastline, extraordinary marine biodiversity, and a founding seat in the ESA-ORA Alliance — shaping sustainable fisheries and coastal resilience across the region."
        imageSrc="/images/hero/hero-bg-7.jpg"
        breadcrumb="Tanzania"
        breadcrumbParent={{ label: 'Countries', href: '/about' }}
      />

      <section className="bg-white py-16 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Indian Ocean Coastline', value: '1,424 km' },
              { label: 'Capital City', value: 'Dodoma' },
              { label: 'Coastal Hub', value: 'Dar es Salaam' },
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
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">ESA-ORA in Tanzania</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">Tanzania's Role in the Alliance</h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                Tanzania's extraordinary coastline — from the Swahili coast to the Zanzibar archipelago — is one of the world's most biologically rich marine environments. As a founding ESA-ORA member, Tanzania brings deep experience in coastal fisheries, seaweed aquaculture, and island-based community development.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                Tanzania anchors ESA-ORA's seaweed and sustainable fisheries agenda, sharing knowledge and models that are being adapted across Kenya, Mozambique, and Madagascar.
              </p>
            </div>
            <div className="bg-brand-navy rounded-lg p-8">
              <p className="text-[#001BB7] text-xs uppercase tracking-widest font-bold mb-4">Country Snapshot</p>
              <div className="space-y-4 text-white/70 text-sm">
                {[
                  { label: 'Primary Focus', value: 'Seaweed, Sustainable Fisheries, Coastal Resilience' },
                  { label: 'Key Ecosystem', value: 'Zanzibar coral reefs & seagrass beds' },
                  { label: 'Coastline', value: '1,424 km (mainland + islands)' },
                  { label: 'Key Cities', value: 'Dar es Salaam, Zanzibar, Tanga, Lindi' },
                  { label: 'Alliance Role', value: 'Blue Economy & fisheries program lead' },
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
            <h2 className="font-display text-4xl text-brand-navy font-bold">Tanzania's ESA-ORA Focus Areas</h2>
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
            {[{ name: 'Kenya', href: '/countries/kenya' }, { name: 'Mozambique', href: '/countries/mozambique' }, { name: 'Madagascar', href: '/countries/madagascar' }].map((c) => (
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
