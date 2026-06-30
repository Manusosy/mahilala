import { PageHero } from '@/components/PageHero';
const LEGAL_CONTENT: Record<string, { intro: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    intro:
      'Mahilala Madagascar ("we", "our", or "us") is committed to protecting the privacy of visitors, partners, youth participants, and volunteers who use mahilalamadagascar.org and related digital services. This Privacy Policy explains what information we collect, how we use it, and the choices available to you.',
    sections: [
      {
        heading: 'Information We Collect',
        body:
          'We may collect information you provide directly — such as your name, email address, organisation, and message content when you contact us, register for programmes, or subscribe to updates. We may also collect limited technical data automatically, including browser type, device information, pages visited, and approximate location derived from IP address, to improve site performance and security.',
      },
      {
        heading: 'How We Use Your Information',
        body:
          'We use collected information to respond to inquiries, coordinate youth programmes and partnerships, send relevant updates you have requested, improve our website and services, and comply with applicable legal obligations. We do not sell personal data to third parties.',
      },
      {
        heading: 'Sharing & Storage',
        body:
          'We may share information with trusted service providers who help us operate our website, email communications, or programme administration, subject to appropriate confidentiality safeguards. Data may be processed on servers located outside Madagascar; where required, we take reasonable steps to ensure adequate protection.',
      },
      {
        heading: 'Your Rights',
        body:
          'Depending on applicable law, you may request access to, correction of, or deletion of your personal data, or withdraw consent for non-essential communications. To exercise these rights, contact us at info@mahilalamadagascar.org.',
      },
      {
        heading: 'Children & Youth',
        body:
          'Mahilala Madagascar works with young people. Where programme participants are minors, we collect personal information only with appropriate consent from a parent, guardian, or authorised school representative, and use it solely for programme-related purposes.',
      },
      {
        heading: 'Updates',
        body:
          'We may update this Privacy Policy from time to time. Material changes will be reflected on this page with an updated effective date. Continued use of our website after changes constitutes acceptance of the revised policy.',
      },
    ],
  },
  terms: {
    intro:
      'These Terms of Service govern your use of the Mahilala Madagascar website and digital platforms operated from Toliara, Madagascar. By accessing or using this site, you agree to these terms.',
    sections: [
      {
        heading: 'About Mahilala Madagascar',
        body:
          'Mahilala Madagascar is a youth empowerment, civic engagement, and environmental education organisation based in Toliara, in the Atsimo-Andrefana Region. Our programmes include Toroy Izy, Sekoly Manga, mentoring, and community initiatives.',
      },
      {
        heading: 'Acceptable Use',
        body:
          'You agree to use this website lawfully and respectfully. You may not attempt to disrupt site operation, access restricted areas without authorisation, upload malicious code, misrepresent your identity, or use site content in ways that harm Mahilala Madagascar, its partners, or programme participants.',
      },
      {
        heading: 'Intellectual Property',
        body:
          'Text, images, logos, programme materials, and other content on this site are owned by or licensed to Mahilala Madagascar unless otherwise noted. You may share links to our pages and quote brief excerpts with attribution. Reproduction of substantial content requires prior written permission.',
      },
      {
        heading: 'Programme Information',
        body:
          'Descriptions of programmes, events, and opportunities on this site are provided for general information. Participation may require separate registration, eligibility review, or agreement to programme-specific terms communicated at the time of enrolment.',
      },
      {
        heading: 'Disclaimer & Limitation of Liability',
        body:
          'We strive to keep information accurate and current but do not guarantee completeness or uninterrupted availability of the site. To the fullest extent permitted by law, Mahilala Madagascar is not liable for indirect or consequential damages arising from use of this website or reliance on its content.',
      },
      {
        heading: 'Governing Law & Contact',
        body:
          'These terms are governed by the laws of Madagascar. Questions about these Terms of Service may be directed to info@mahilalamadagascar.org.',
      },
    ],
  },
  cookies: {
    intro:
      'This Cookie Policy explains how Mahilala Madagascar uses cookies and similar technologies on mahilalamadagascar.org. It should be read together with our Privacy Policy.',
    sections: [
      {
        heading: 'What Are Cookies?',
        body:
          'Cookies are small text files stored on your device when you visit a website. They help the site remember preferences, maintain session state, and understand how visitors use our pages.',
      },
      {
        heading: 'Cookies We Use',
        body:
          'Essential cookies are required for core site functionality and cannot be disabled. Performance cookies help us understand anonymised usage patterns so we can improve load times and content. Functionality cookies remember choices such as language preference. Third-party cookies may be set by embedded video players, social media links, or analytics tools we use to measure reach and engagement.',
      },
      {
        heading: 'Managing Preferences',
        body:
          'When you first visit our site, you can accept all cookies, reject non-essential cookies, or customise your preferences through the cookie consent banner. You can also adjust browser settings to block or delete cookies, though some features may not work correctly if essential cookies are disabled.',
      },
      {
        heading: 'Third-Party Services',
        body:
          'Some embedded content or analytics services may place their own cookies and process data according to their privacy policies. We encourage you to review those policies if you interact with third-party features on our site.',
      },
      {
        heading: 'Updates & Contact',
        body:
          'We may revise this Cookie Policy as our website evolves. For questions about cookies or data use, contact info@mahilalamadagascar.org.',
      },
    ],
  },
};

export default function LegalPage({ title, type }: { title: string; type: string }) {
  const content = LEGAL_CONTENT[type] ?? LEGAL_CONTENT.privacy;

  return (
    <main>
      <PageHero
        label="LEGAL & COMPLIANCE"
        heading={title}
        subheading="Official policies governing Mahilala Madagascar and its digital platforms."
        imageSrc="/images/hero/hero-bg-12.jpg"
        breadcrumb={title}
      />

      <section className="bg-white py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <p className="text-[#718096] text-lg leading-relaxed mb-10">{content.intro}</p>

            {content.sections.map((section) => (
              <div key={section.heading} className="mb-10">
                <h2 className="font-display text-xl text-brand-navy font-bold mb-3">{section.heading}</h2>
                <p className="text-[#718096] leading-relaxed mb-0">{section.body}</p>
              </div>
            ))}

            <div className="mt-12 pt-8 border-t border-black/5 text-[#A0AEC0] text-sm">
              <p className="mb-1">Mahilala Madagascar · Toliara, Madagascar</p>
              <p className="mb-1">
                <a href="mailto:info@mahilalamadagascar.org" className="text-[#001BB7] hover:underline">
                  info@mahilalamadagascar.org
                </a>
              </p>
              <p className="italic mt-4 mb-0">Last updated: April 2025</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
