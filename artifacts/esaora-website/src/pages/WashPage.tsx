import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
const ACTIVITIES = [
  { title: 'WASH Infrastructure Rehabilitation', desc: 'Repairing and upgrading water supply systems, sanitation facilities, and hygiene stations in underserved coastal communities.' },
  { title: 'Community Hygiene Behaviour Change', desc: 'Sustained campaigns and education programs driving lasting adoption of safe hygiene practices at household and community level.' },
  { title: 'Climate-Resilient Water Systems', desc: 'Designing water infrastructure that can withstand the increasing frequency of droughts, floods, and saltwater intrusion events.' },
  { title: 'WASH in Schools & Health Facilities', desc: 'Ensuring all schools and primary healthcare facilities in program areas have functional WASH infrastructure and trained staff.' },
  { title: 'Data Systems & WASH Monitoring', desc: 'Building country-level WASH data systems to track coverage, quality, and equity — enabling evidence-based decision-making.' },
  { title: 'Regional WASH Policy Advocacy', desc: 'Elevating WASH priorities to national and regional policy agendas using cross-country evidence from all four member nations.' },
];

const COUNTRY_SPOTLIGHTS = [
  { country: 'Kenya', coastline: '536 km', focus: 'Marine Conservation & Climate-Resilient WASH', detail: 'Coastal water point rehabilitation and integrated WASH-health programs targeting underserved fishing communities.' },
  { country: 'Tanzania', coastline: '1,424 km', focus: 'Community Water Access', detail: 'Island-based WASH program integration across the Zanzibar archipelago and mainland coastal districts.' },
  { country: 'Mozambique', coastline: '2,470 km', focus: 'Post-disaster WASH Recovery', detail: 'Cyclone-resilient water and sanitation infrastructure following recurring extreme weather events along the northern coast.' },
  { country: 'Madagascar', coastline: '4,828 km', focus: 'Rural Coastal WASH', detail: 'Extending safe water and sanitation access to remote coastal and island communities with historically limited government services.' },
];

export default function WashPage() {
  return (
    <main>
      <PageHero
        label="THEMATIC PILLAR"
        heading="Safe Water for Every Coastal Community"
        subheading="Water, sanitation, and hygiene interventions that build lasting health and resilience in climate-vulnerable communities across East and Southern Africa."
        imageSrc="/images/sections/pillar-wash.jpeg"
        breadcrumb="WASH"
        breadcrumbParent={{ label: 'Our Work', href: '/programs' }}
      />

      {/* Pillar Overview */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Why This Pillar Matters</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">
                The Water Crisis is the Climate Crisis
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                Water insecurity is the primary crisis driver identified in the ESA-ORA charter. Across all four member nations, coastal communities face a water crisis intensified by climate change — saltwater intrusion into freshwater sources, erratic rainfall, flooding of sanitation infrastructure, and drought.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                ESA-ORA's WASH pillar addresses this crisis not as a standalone technical intervention, but as an integrated part of climate resilience, public health, and community empowerment. Our approach combines infrastructure rehabilitation, behavior change, policy advocacy, and cross-country learning.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '65%+', label: 'Coastal households without safe water' },
                { stat: '4', label: 'Nations, 1 coordinated WASH strategy' },
                { stat: '2M+', label: 'People in program catchment areas' },
                { stat: '100%', label: 'Community-led program design' },
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

      {/* Key Activities */}
      <section className="bg-[#F0F4F8] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">What We Do</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Key WASH Activities</h2>
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

      {/* Country Spotlights */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Where We Work</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Country-Level WASH Programs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COUNTRY_SPOTLIGHTS.map((c) => (
              <div key={c.country} className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5 hover:-translate-y-1 transition-all">
                <h3 className="text-brand-navy font-bold text-lg mb-1">{c.country}</h3>
                <p className="text-[#001BB7] text-xs font-bold uppercase tracking-widest mb-3">{c.coastline} coastline</p>
                <p className="text-[#718096] text-sm leading-relaxed mb-3">{c.detail}</p>
                <Link href={`/countries/${c.country.toLowerCase()}`} className="flex items-center gap-2 text-[#001BB7] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
                  View Country <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
