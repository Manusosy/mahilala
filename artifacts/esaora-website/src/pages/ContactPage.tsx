import { useState } from 'react';
import { ArrowRight, Mail, Globe } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { supabase } from '@workspace/esaora-core/lib/supabase';
import { Loader2 } from 'lucide-react';

const PURPOSES = ['I am a young person', 'I want to volunteer / mentor', 'Partnership & Collaboration', 'Environmental Education Request', 'Media Inquiry', 'General Question'];

const CONTACT_INFO = {
  location: 'Toliara, Madagascar',
  region: 'Atsimo-Andrefana Region',
  email: 'info@mahilalamadagascar.org',
  responseTime: 'We aim to respond within 2 to 3 business days.',
};

const FAQ = [
  { q: 'What is Mahilala Madagascar?', a: 'Mahilala Madagascar is a youth empowerment, civic engagement, and environmental education organization based in Toliara. We guide young Malagasy people toward purpose, responsibility, and positive impact.' },
  { q: 'What programmes does Mahilala offer?', a: 'Our core programmes include Toroy Izy (academic orientation and mentoring), Sekoly Manga (marine environmental education), and ongoing youth mentoring and civic engagement activities.' },
  { q: 'Where does Mahilala operate?', a: 'We are based in Toliara, in the Atsimo-Andrefana Region of Madagascar, working with schools, youth groups, and coastal communities across the southwest coast.' },
  { q: 'How can I get involved?', a: 'Young people, mentors, volunteers, and partners can reach out through our contact form. We welcome enquiries about orientation sessions, environmental education, and community collaboration.' },
  { q: 'What does Mahilala mean?', a: 'Mahilala comes from a word meaning "Intelligence" in a language spoken in Southern Madagascar — understood as a lifelong journey of learning, awareness, responsibility, and positive impact.' },
];

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
        status: 'new'
      });

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
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
        heading="Get in Touch"
        subheading="Reach out for programme information, partnerships, media inquiries, volunteering, mentoring, or to get involved."
        imageSrc="/images/hero/hero-bg.jpg"
        breadcrumb="Contact"
      />

      {/* Contact Information */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Contact Information</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Mahilala Madagascar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5">
              <p className="text-[#001BB7] text-xs font-bold uppercase tracking-widest mb-2">Location</p>
              <p className="text-brand-navy font-bold">{CONTACT_INFO.location}</p>
              <p className="text-slate-600 text-sm mt-1">{CONTACT_INFO.region}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5">
              <p className="text-[#001BB7] text-xs font-bold uppercase tracking-widest mb-2">Email</p>
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-navy font-bold hover:text-[#001BB7] transition-colors">{CONTACT_INFO.email}</a>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-6 border border-black/5 sm:col-span-2 lg:col-span-1">
              <p className="text-[#001BB7] text-xs font-bold uppercase tracking-widest mb-2">Response Time</p>
              <p className="text-slate-700 text-sm">{CONTACT_INFO.responseTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-[#F0F4F8] py-24 px-4 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Form */}
            <div>
              <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Send a Message</span>
              <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-8">Contact Mahilala</h2>

              {sent ? (
                <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-xl shadow-black/5">
                  <div className="w-14 h-14 bg-[#001BB7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-7 h-7 text-[#001BB7]" />
                  </div>
                  <h3 className="text-brand-navy font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-[#718096] text-sm">Thank you. We will respond within 3–5 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { field: 'name', label: 'Full Name *', placeholder: 'Your name', type: 'text' },
                      { field: 'org', label: 'Organisation', placeholder: 'Your organisation', type: 'text' },
                    ].map(({ field, label, placeholder, type }) => (
                      <div key={field}>
                        <label className="block text-brand-navy/60 text-xs font-bold mb-1.5 uppercase tracking-wider">{label}</label>
                        <input
                          type={type}
                          className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-brand-navy text-sm focus:outline-none focus:border-[#001BB7]/50 focus:ring-1 focus:ring-[#001BB7]/20 transition-all placeholder-gray-400"
                          placeholder={placeholder}
                          value={formData[field as keyof typeof formData]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-brand-navy/60 text-xs font-bold mb-1.5 uppercase tracking-wider">Email *</label>
                      <input
                        type="email" required
                        className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-brand-navy text-sm focus:outline-none focus:border-[#001BB7]/50 focus:ring-1 focus:ring-[#001BB7]/20 transition-all placeholder-gray-400"
                        placeholder="your@email.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-brand-navy/60 text-xs font-bold mb-1.5 uppercase tracking-wider">Country</label>
                      <select
                        className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-brand-navy text-sm focus:outline-none focus:border-[#001BB7]/50 focus:ring-1 focus:ring-[#001BB7]/20 transition-all"
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
                    <label className="block text-brand-navy/60 text-xs font-bold mb-1.5 uppercase tracking-wider">Purpose *</label>
                    <select
                      required
                      className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-brand-navy text-sm focus:outline-none focus:border-[#001BB7]/50 focus:ring-1 focus:ring-[#001BB7]/20 transition-all"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    >
                      <option value="">Select purpose…</option>
                      {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-brand-navy/60 text-xs font-bold mb-1.5 uppercase tracking-wider">Message *</label>
                    <textarea
                      required rows={5}
                      className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-brand-navy text-sm focus:outline-none focus:border-[#001BB7]/50 focus:ring-1 focus:ring-[#001BB7]/20 transition-all placeholder-gray-400 resize-none"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  {errorMsg && <div className="text-red-500 text-sm font-medium">{errorMsg}</div>}
                  <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 w-full shadow-lg shadow-brand-navy/10 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div>
                <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Direct Contact</span>
                <h2 className="font-display text-4xl text-brand-navy font-bold leading-tight mb-8">Get in Touch</h2>
              </div>
              <div className="space-y-4">
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 bg-white rounded-lg p-5 border border-black/5 hover:border-[#001BB7]/30 transition-all group shadow-sm">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#001BB7]/10 text-[#001BB7]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-brand-navy/50 text-xs font-bold uppercase tracking-wide">Email</p>
                    <p className="text-brand-navy font-bold text-sm">{CONTACT_INFO.email}</p>
                  </div>
                </a>
              </div>
              <div className="bg-brand-navy rounded-lg p-8 mt-8 relative overflow-hidden text-white shadow-2xl shadow-brand-navy/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#001BB7] rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />
                <div className="relative z-10">
                  <p className="text-[#001BB7] uppercase tracking-widest text-xs font-bold mb-6">
                    RESPONSE TIMES
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: 'General enquiries', time: '2–3 business days' },
                      { label: 'Programme information', time: '2–3 business days' },
                      { label: 'Partnership discussions', time: '3–5 business days' },
                      { label: 'Media inquiries', time: '1–2 business days' },
                    ].map((row, idx, arr) => (
                      <div key={row.label} className={`flex justify-between items-center ${idx !== arr.length - 1 ? 'border-b border-white/10 pb-4' : ''}`}>
                        <span className="text-white/60 text-sm font-medium">{row.label}</span>
                        <span className="text-white font-bold text-sm">{row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-3">Common Questions</span>
            <h2 className="font-display text-4xl text-brand-navy font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-black/5 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F0F4F8]/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-brand-navy font-semibold text-sm leading-snug">{item.q}</span>
                  <span className={`text-[#001BB7] text-xl font-light flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[#718096] text-sm leading-relaxed border-t border-black/5 pt-4">
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
