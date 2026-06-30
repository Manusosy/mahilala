import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { FaLinkedin, FaXTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa6';
import { PageHero } from '@/components/PageHero';
import { supabase } from '@workspace/esaora-core/lib/supabase';

const BRAND_BLUE = '#001BB7';

const PURPOSES = ['I am a young person', 'I want to volunteer / mentor', 'Partnership & Collaboration', 'Environmental Education Request', 'Media Inquiry', 'General Question'];

const CONTACT_INFO = {
  location: 'Toliara, Madagascar',
  region: 'Atsimo-Andrefana Region',
  email: 'info@mahilalamadagascar.org',
  responseTime: 'We aim to respond within 2 to 3 business days.',
};

const SOCIAL_LINKS = [
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaXTwitter, href: '#', label: 'Twitter' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
];

const FAQ = [
  { q: 'What is Mahilala Madagascar?', a: 'Mahilala Madagascar is a youth empowerment, civic engagement, and environmental education organization based in Toliara. We guide young Malagasy people toward purpose, responsibility, and positive impact.' },
  { q: 'What programmes does Mahilala offer?', a: 'Our core programmes include Toroy Izy (academic orientation and mentoring), Sekoly Manga (marine environmental education), and ongoing youth mentoring and civic engagement activities.' },
  { q: 'Where does Mahilala operate?', a: 'We are based in Toliara, in the Atsimo-Andrefana Region of Madagascar, working with schools, youth groups, and coastal communities across the southwest coast.' },
  { q: 'How can I get involved?', a: 'Young people, mentors, volunteers, and partners can reach out through our contact form. We welcome enquiries about orientation sessions, environmental education, and community collaboration.' },
  { q: 'What does Mahilala mean?', a: 'Mahilala comes from a word meaning "Intelligence" in a language spoken in Southern Madagascar — understood as a lifelong journey of learning, awareness, responsibility, and positive impact.' },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="uppercase tracking-widest text-xs font-bold border px-4 py-1.5 rounded-lg leading-none inline-block"
      style={{ color: BRAND_BLUE, borderColor: BRAND_BLUE }}
    >
      {children}
    </span>
  );
}

const inputClass =
  'w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-[#111111] text-sm focus:outline-none focus:border-[#001BB7]/50 focus:ring-1 focus:ring-[#001BB7]/20 transition-all placeholder-gray-400';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', org: '', email: '', country: '', purpose: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        organization: formData.org || null,
        email: formData.email,
        country: formData.country || null,
        purpose: formData.purpose,
        message: formData.message,
        status: 'new',
      });

      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setErrorMsg('An error occurred while sending your message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <PageHero
        label="CONTACT US"
        heading="Get in Touch with Mahilala"
        subheading="Reach out for programme information, partnerships, volunteering, mentoring, or to connect with our team in Toliara."
        imageSrc="/images/about/about-story-workshop.png"
        imagePosition="center center"
        breadcrumb="Contact"
      />

      {/* Contact Information */}
      <section className="bg-white py-20 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow>Contact Information</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl text-[#111111] mt-4 font-bold tracking-tight">
              Mahilala Madagascar
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mt-4 max-w-2xl mx-auto">
              Based in Toliara, we welcome enquiries from young people, mentors, partners, and communities across Madagascar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F7F8FC] rounded-lg p-6 border border-black/5">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_BLUE}15`, color: BRAND_BLUE }}>
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-[#111111] font-bold mb-1">{CONTACT_INFO.location}</p>
              <p className="text-[#4A5568] text-sm">{CONTACT_INFO.region}</p>
            </div>

            <div className="bg-[#F7F8FC] rounded-lg p-6 border border-black/5">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_BLUE}15`, color: BRAND_BLUE }}>
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-1">Email</p>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-[#111111] font-bold hover:text-[#001BB7] transition-colors"
              >
                {CONTACT_INFO.email}
              </a>
            </div>

            <div className="bg-[#F7F8FC] rounded-lg p-6 border border-black/5 sm:col-span-2 lg:col-span-1">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_BLUE}15`, color: BRAND_BLUE }}>
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-1">Response Time</p>
              <p className="text-[#4A5568] text-sm leading-relaxed">{CONTACT_INFO.responseTime}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-[#4A5568] text-sm font-medium">Follow us</span>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#001BB7]/30 text-[#001BB7] hover:bg-[#001BB7] hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Details */}
      <section className="bg-[#F7F8FC] py-20 sm:py-24 px-4 border-t border-black/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-black/5 shadow-sm p-6 sm:p-8">
                <Eyebrow>Send a Message</Eyebrow>
                <h2 className="font-display text-3xl sm:text-4xl text-[#111111] mt-4 font-bold tracking-tight mb-2">
                  Contact Mahilala
                </h2>
                <p className="text-[#4A5568] text-sm mb-8">
                  Tell us how we can help — whether you are a young person, mentor, partner, or media contact.
                </p>

                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRAND_BLUE}15` }}>
                      <ArrowRight className="w-7 h-7" style={{ color: BRAND_BLUE }} />
                    </div>
                    <h3 className="text-[#111111] font-bold text-xl mb-2">Message Sent!</h3>
                    <p className="text-[#4A5568] text-sm">Thank you. We will respond within 3–5 business days.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { field: 'name', label: 'Full Name *', placeholder: 'Your name', type: 'text' },
                        { field: 'org', label: 'Organisation', placeholder: 'Your organisation', type: 'text' },
                      ].map(({ field, label, placeholder, type }) => (
                        <div key={field}>
                          <label className="block text-[#4A5568] text-xs font-bold mb-1.5 uppercase tracking-wider">{label}</label>
                          <input
                            type={type}
                            className={inputClass}
                            placeholder={placeholder}
                            value={formData[field as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#4A5568] text-xs font-bold mb-1.5 uppercase tracking-wider">Email *</label>
                        <input
                          type="email"
                          required
                          className={inputClass}
                          placeholder="your@email.org"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#4A5568] text-xs font-bold mb-1.5 uppercase tracking-wider">Country</label>
                        <select
                          className={inputClass}
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        >
                          <option value="">Select country…</option>
                          {['Kenya', 'Tanzania', 'Mozambique', 'Madagascar', 'Other African Country', 'Other'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#4A5568] text-xs font-bold mb-1.5 uppercase tracking-wider">Purpose *</label>
                      <select
                        required
                        className={inputClass}
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      >
                        <option value="">Select purpose…</option>
                        {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#4A5568] text-xs font-bold mb-1.5 uppercase tracking-wider">Message *</label>
                      <textarea
                        required
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    {errorMsg && <div className="text-red-500 text-sm font-medium">{errorMsg}</div>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 w-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Eyebrow>Direct Contact</Eyebrow>
                <h2 className="font-display text-2xl sm:text-3xl text-[#111111] mt-4 font-bold tracking-tight mb-6">
                  We&apos;re Here to Help
                </h2>
              </div>

              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-4 bg-white rounded-lg p-5 border border-black/5 hover:border-[#001BB7]/30 transition-all group shadow-sm"
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND_BLUE}15`, color: BRAND_BLUE }}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[#4A5568] text-xs font-bold uppercase tracking-wide">Email</p>
                  <p className="text-[#111111] font-bold text-sm">{CONTACT_INFO.email}</p>
                </div>
              </a>

              <div className="bg-[#111111] rounded-lg p-6 sm:p-8 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[100px] opacity-20 -mr-24 -mt-24" style={{ backgroundColor: BRAND_BLUE }} />
                <div className="relative z-10">
                  <span className="uppercase tracking-widest text-xs font-bold border border-white/30 text-white/90 px-4 py-1.5 rounded-lg leading-none inline-block">
                    Response Times
                  </span>
                  <div className="mt-6 space-y-4">
                    {[
                      { label: 'General enquiries', time: '2–3 business days' },
                      { label: 'Programme information', time: '2–3 business days' },
                      { label: 'Partnership discussions', time: '3–5 business days' },
                      { label: 'Media inquiries', time: '1–2 business days' },
                    ].map((row, idx, arr) => (
                      <div key={row.label} className={`flex justify-between items-center gap-4 ${idx !== arr.length - 1 ? 'border-b border-white/10 pb-4' : ''}`}>
                        <span className="text-white/60 text-sm font-medium">{row.label}</span>
                        <span className="text-white font-bold text-sm whitespace-nowrap">{row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white py-20 sm:py-24 px-4 border-t border-black/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Our Location</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl text-[#111111] mt-4 font-bold tracking-tight">
              Find us in Toliara
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mt-3 max-w-xl mx-auto">
              Mahilala Madagascar is based in Toliara, in the Atsimo-Andrefana Region on Madagascar&apos;s southwest coast.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden border border-black/5 shadow-sm">
            <iframe
              title="Mahilala Madagascar location in Toliara"
              className="w-full h-[380px] sm:h-[450px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=43.635%2C-23.37%2C43.705%2C-23.33&layer=mapnik&marker=-23.35%2C43.67"
            />
          </div>
          <p className="text-center text-[#4A5568] text-sm mt-4">
            Toliara, Atsimo-Andrefana Region, Madagascar
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F7F8FC] py-20 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow>Common Questions</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl text-[#111111] mt-4 font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white border border-black/5 rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F7F8FC]/80 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-[#111111] font-semibold text-sm leading-snug">{item.q}</span>
                  <span
                    className="text-xl font-light flex-shrink-0 transition-transform duration-200"
                    style={{ color: BRAND_BLUE, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[#4A5568] text-sm leading-relaxed border-t border-black/5 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
