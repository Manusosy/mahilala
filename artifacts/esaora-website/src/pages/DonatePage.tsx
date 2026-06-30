import { PageHero } from '@/components/PageHero';
export default function DonatePage() {
  return (
    <main>
      <PageHero
        label="SUPPORT OUR MISSION"
        heading="Donate to ESA-ORA"
        subheading="Your contribution supports regional climate resilience, sustainable blue economy, and community health initiatives across East and Southern Africa."
        imageSrc="/images/hero/hero-bg-9.jpg"
        breadcrumb="Donate"
      />
      
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl text-brand-navy font-bold mb-6">Online Donations Coming Soon</h2>
          <p className="text-[#4A5568] text-lg mb-8 leading-relaxed">
            We are currently setting up our secure online donation portal. In the meantime, if you represent an organization or philanthropic foundation looking to fund specific ESA-ORA programs, please contact our Secretariat.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center bg-[#001BB7] hover:bg-[#F78A28] text-white px-8 py-4 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-navy/10"
          >
            Contact the Secretariat
          </a>
        </div>
      </section>
    </main>
  );
}
