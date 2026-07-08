import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PAGE_HERO_SLIDES } from '@/constants/pageHeroSlides';
const FOCUS_AREAS = [
  { name: 'Toroy Izy', color: '#204f79', href: '/programs/toroy-izy', desc: 'Youth orientation and mentoring helping young people in Toliara discover purpose, choose academic and career pathways, and grow through guidance.' },
  { name: 'Sekoly Manga', color: '#22C55E', href: '/programs/sekoly-manga', desc: 'Environmental education connecting students, schools, and coastal communities to Madagascar\'s marine and coastal ecosystems across the southwest coast.' },
  { name: 'Civic Engagement', color: '#F59E0B', href: '/programs', desc: 'Community action and shared values through initiatives such as Ady Fototra, building civic responsibility in the Atsimo-Andrefana Region.' },
];

export default function MadagascarPage() {
  return (
    <main>
      <PageHero
        label="TOLIARA, MADAGASCAR"
        heading="Mahilala Madagascar — Based in Toliara"
        subheading="Youth empowerment, civic engagement, and environmental education in the Atsimo-Andrefana Region of southwest Madagascar."
        slides={PAGE_HERO_SLIDES.madagascar}
        breadcrumb="Toliara"
        breadcrumbParent={{ label: 'About', href: '/about' }}
      />

      <section className="bg-white py-16 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Home Base', value: 'Toliara' },
              { label: 'Region', value: 'Atsimo-Andrefana' },
              { label: 'Country', value: 'Madagascar' },
              { label: 'Founded', value: '2019 (informal)' },
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
              <span className="text-[#204f79] uppercase tracking-widest text-xs font-bold block mb-4">Where We Work</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-6">Toliara & the Southwest Coast</h2>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-5">
                Mahilala Madagascar is based in Toliara, in the Atsimo-Andrefana Region. From schools and youth gatherings in the city to fishing communities along the southwest coast, we accompany young people through mentoring, orientation, civic engagement, and marine environmental education.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                Our programmes reach students, young adults, coastal communities, and anyone seeking accessible knowledge about Madagascar&apos;s marine and coastal environment.
              </p>
            </div>
            <div className="bg-brand-navy rounded-lg p-8">
              <p className="text-[#204f79] text-xs uppercase tracking-widest font-bold mb-4">Organization Snapshot</p>
              <div className="space-y-4 text-white/70 text-sm">
                {[
                  { label: 'Primary Focus', value: 'Youth mentoring, orientation, environmental education' },
                  { label: 'Key Programmes', value: 'Toroy Izy, Sekoly Manga, Civic Engagement' },
                  { label: 'Region', value: 'Atsimo-Andrefana, southwest Madagascar' },
                  { label: 'Official Recognition', value: '2025 — Malagasy government' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-white/50">{row.label}</span>
                    <span className="text-white font-medium text-right">{row.value}</span>
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
            <span className="text-[#204f79] uppercase tracking-widest text-xs font-bold block mb-3">Programmes in Toliara</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">What Mahilala Does Here</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FOCUS_AREAS.map((area) => (
              <Link key={area.name} href={area.href} className="group bg-[#F0F4F8] rounded-lg p-7 border border-black/5 hover:-translate-y-1 transition-all">
                <h3 className="text-brand-navy font-bold text-lg mb-3 group-hover:text-[#204f79] transition-colors">{area.name}</h3>
                <p className="text-[#718096] text-sm leading-relaxed mb-4">{area.desc}</p>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold" style={{ color: area.color }}>
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
