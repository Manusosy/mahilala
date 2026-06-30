import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
const ACTIVITIES = [
  { title: 'Sustainable Fisheries Management', desc: 'Implementing science-based fishing quotas, marine protected area governance, and community co-management frameworks to restore fish stocks.' },
  { title: 'Marine Conservation Zones', desc: 'Establishing and strengthening locally-managed marine protected areas in partnership with coastal communities and national authorities.' },
  { title: 'Ocean-Based Entrepreneurship', desc: 'Incubating and scaling sustainable ocean businesses — seaweed cultivation, aquaculture, eco-tourism, and marine crafts — with priority for youth and women.' },
  { title: 'Seaweed Cultivation Programs', desc: 'Training coastal communities in seaweed farming techniques that generate income while contributing to marine ecosystem health.' },
  { title: 'Eco-Tourism Development', desc: 'Building community-led eco-tourism experiences that generate sustainable livelihoods while incentivizing marine conservation.' },
  { title: 'Blue Finance & Policy', desc: 'Advocating for blue bond instruments, ocean-friendly fishing subsidies, and marine spatial planning frameworks at national and regional level.' },
];

export default function BlueEconomyPage() {
  return (
    <main>
      <PageHero
        label="THEMATIC PILLAR"
        heading="Oceans as Opportunity — Sustainably Governed"
        subheading="Responsible marine development that builds livelihoods, protects ecosystems, and empowers coastal communities — especially youth and women."
        imageSrc="/images/sections/pillar-blueeconomy.jpeg"
        breadcrumb="Blue Economy"
        breadcrumbParent={{ label: 'Our Work', href: '/programs' }}
      />

      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Why This Pillar Matters</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">
                The Ocean is a Resource — and a Responsibility
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                For the four ESA-ORA nations, the ocean is not a backdrop — it is a primary source of food, income, culture, and identity. Yet extractive practices, poor governance, and external pressures are depleting marine resources faster than they can recover.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                ESA-ORA's Blue Economy pillar bridges conservation and development — proving that sustainable ocean governance is not just ecologically necessary but economically superior in the long run. We do this through enterprise development, conservation finance, and community co-management.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '1.4M', label: 'Artisanal fishers across 4 member nations' },
                { stat: '30%', label: 'Fish stock decline in Indian Ocean since 2000' },
                { stat: '$2.5B', label: 'Potential Blue Economy GDP contribution' },
                { stat: '60%', label: 'Youth in coastal communities dependent on ocean livelihoods' },
              ].map((item) => (
                <div key={item.label} className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5">
                  <p className="text-3xl font-bold text-[#001BB7] font-display mb-1">{item.stat}</p>
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
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">What We Do</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Key Blue Economy Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACTIVITIES.map((act, i) => (
              <div key={i} className="bg-white rounded-lg p-7 border border-black/5 hover:-translate-y-1 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#001BB7]/10 flex items-center justify-center text-[#001BB7] text-xs font-bold mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-brand-navy font-bold text-base mb-3">{act.title}</h3>
                <p className="text-[#718096] text-sm leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
