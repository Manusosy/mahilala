import { PageHero } from '@/components/PageHero';
const ACTIVITIES = [
  { title: 'Waterborne Disease Prevention', desc: 'Integrated WASH + health interventions targeting cholera, typhoid, and other waterborne diseases prevalent in coastal communities.' },
  { title: 'Maternal & Child Health', desc: 'Programs addressing the particular vulnerability of mothers and children to climate-related health risks in coastal environments.' },
  { title: 'Community Health Worker Training', desc: 'Building cadres of trained community health promoters embedded in coastal villages who carry frontline health services to their neighbours.' },
  { title: 'Hygiene Education Programs', desc: 'School and community-based hygiene promotion programs that build lasting knowledge and behaviour change across generations.' },
  { title: 'WASH-Health Integration', desc: 'Designing WASH infrastructure and health programs together so they reinforce each other — clean water supports health, healthy communities maintain their WASH systems.' },
  { title: 'Health Systems Strengthening', desc: 'Working with national health ministries to build the capacity, infrastructure, and data systems needed for coastal health equity.' },
];

export default function PublicHealthPage() {
  return (
    <main>
      <PageHero
        label="THEMATIC PILLAR"
        heading="Healthy Communities at the Heart of Every Program"
        subheading="Integrating public health with environmental and WASH programs to build communities where people — and their ecosystems — thrive together."
        imageSrc="/images/sections/pillar-public-health.jpeg"
        breadcrumb="Public Health"
        breadcrumbParent={{ label: 'Our Work', href: '/programs' }}
      />

      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#F59E0B] uppercase tracking-widest text-xs font-bold block mb-4">Why This Pillar Matters</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">
                You Cannot Have Environmental Resilience Without Healthy Communities
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                Public health is not a downstream consequence of ESA-ORA's work — it is a co-equal pillar. Degraded ecosystems breed disease. Contaminated water causes illness. Climate disruption amplifies health crises. ESA-ORA integrates health into every program from the design stage.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                Across all four nations, coastal communities bear a disproportionate burden of waterborne disease, malnutrition, and climate-related health emergencies — while receiving the least investment from national health infrastructure. ESA-ORA works to close this gap.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '2.3M', label: 'Annual waterborne disease cases in program areas' },
                { stat: '3×', label: 'Higher child mortality in unserved coastal zones' },
                { stat: '400+', label: 'Community health workers to be trained' },
                { stat: '100%', label: 'WASH-Health co-design across all programs' },
              ].map((item) => (
                <div key={item.label} className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5">
                  <p className="text-3xl font-bold text-[#F59E0B] font-display mb-1">{item.stat}</p>
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
            <span className="text-[#F59E0B] uppercase tracking-widest text-xs font-bold block mb-3">What We Do</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Key Public Health Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACTIVITIES.map((act, i) => (
              <div key={i} className="bg-white rounded-lg p-7 border border-black/5 hover:-translate-y-1 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] text-xs font-bold mb-4">
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
