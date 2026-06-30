import { useRef } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { StatsBar } from '@/components/StatsBar';
import { ImageTextSection } from '@/components/ImageTextSection';
import { BlueprintSection } from '@/components/BlueprintSection';
import { QuoteSection } from '@/components/QuoteSection';
import { ObjectivesSlider } from '@/components/ObjectivesSlider';
import { NewsSection } from '@/components/NewsSection';
import { PartnerMarquee } from '@/components/PartnerMarquee';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  // Subtle scroll-up reveal applied ONLY to blocks marked with `data-reveal`
  // (sections that don't already own a GSAP entrance animation).
  useScrollReveal({ scopeRef: mainRef });

  return (
    <main ref={mainRef}>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Who We Are — organization intro */}
      <ImageTextSection
        eyebrow="Who We Are"
        heading="A Youth-Centered Organization Rooted in Toliara"
        body={[
          'Mahilala Madagascar is a youth empowerment, civic engagement, and environmental education organization based in Toliara. Founded by marine biologist, environmentalist, and Mandela Washington Fellow Rakotonjanahary Fidèle, we help young Malagasy people discover purpose, access guidance, develop leadership, and contribute to a more sustainable future.',
          'The name "Mahilala" comes from a word meaning intelligence — not memorization or diplomas, but the deeper, lifelong intelligence that grows through experience, values, responsibility, and the courage to build a better future.',
        ]}
        bullets={[
          'Youth mentorship & academic orientation',
          'Civic engagement & leadership',
          'Marine & environmental education',
          'Community-driven, Toliara-based',
        ]}
        imageSrc="/images/sections/pillar-sekoly-manga.jpg"
        imageAlt="Mahilala environmental education and youth programmes in Madagascar"
        cta={{ label: 'Learn More About Us', href: '/about' }}
      />

      {/* 3. About at a glance — credibility stats */}
      <div data-reveal>
        <StatsBar />
      </div>

      {/* 4. Mission */}
      <ImageTextSection
        eyebrow="Our Mission"
        heading="Sensitize · Support · Inspire"
        body="To sensitize, support, and inspire young Malagasy people toward responsible citizenship, personal development, academic fulfillment, leadership, and environmental stewardship."
        bullets={[
          'Responsible citizenship',
          'Personal development',
          'Academic fulfillment & leadership',
          'Environmental stewardship',
        ]}
        imageSrc="/images/sections/impact-personal-growth.jpg"
        imageAlt="Young people building confidence through Mahilala programmes"
        reverse
        background="offwhite"
      />

      {/* 5. Vision */}
      <ImageTextSection
        eyebrow="Our Vision"
        heading="A Generation Ready to Lead and Protect"
        body="A generation of informed, confident, purpose-driven, and civically engaged Malagasy youth who contribute positively to their communities and protect Madagascar's marine and coastal ecosystems."
        bullets={[
          'Informed & confident youth',
          'Purpose-driven & civically engaged',
          'Stronger, more responsible communities',
          'Protected marine & coastal ecosystems',
        ]}
        imageSrc="/images/sections/pillar-toroy-izy.jpg"
        imageAlt="Youth orientation and mentoring with Mahilala Madagascar"
      />

      {/* 6. What We Do — programme pillars */}
      <BlueprintSection />

      {/* 7. Impact outcomes (distinct from programme pillars above) */}
      <ObjectivesSlider />

      {/* 8. Founder voice */}
      <QuoteSection />

      {/* 9. Latest news */}
      <NewsSection />

      {/* 10. Partners */}
      <div data-reveal>
        <PartnerMarquee />
      </div>
    </main>
  );
}
