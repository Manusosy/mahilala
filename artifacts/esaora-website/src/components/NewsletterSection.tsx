import { ChevronRight, Loader2, Check, Mail } from 'lucide-react';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

/** Inline newsletter band — light branded layout (no dark navy block). */
export function NewsletterSection() {
  const { settings } = useSiteSettings();
  const logo = settings.header_logo_url || '/favicon.png';
  const { email, setEmail, subscribing, subscribed, error, handleSubscribe } = useNewsletterSubscribe();

  return (
    <section className="bg-gray-50 px-4 pt-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[14px] border border-[#111111]/8 bg-[#F3EFE4] px-8 py-10 md:px-14 md:py-12 shadow-sm">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#F78A28]/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="lg:flex-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="" className="h-8 w-auto object-contain" aria-hidden />
                <span className="inline-flex items-center gap-2 text-[#F78A28] uppercase tracking-widest text-[11px] font-black">
                  <Mail className="w-3.5 h-3.5" /> Stay Connected
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-[#111111] font-bold mb-2">
                Get Mahilala Updates
              </h2>
              <p className="text-[#4A5568] text-sm md:text-base max-w-xl leading-relaxed">
                Receive news, programme stories, and opportunities directly from Mahilala Madagascar.
              </p>
            </div>

            <div className="lg:w-[440px] flex-shrink-0">
              {subscribed ? (
                <div className="flex items-center justify-center gap-3 bg-white border border-[#111111]/10 rounded-lg px-6 py-4">
                  <Check className="w-5 h-5 text-[#F78A28]" />
                  <span className="text-[#111111] text-sm font-semibold">You're subscribed! Thank you.</span>
                </div>
              ) : (
                <form className="flex rounded-lg overflow-hidden border border-[#111111]/15 bg-white shadow-sm" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 px-5 py-3.5 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="flex items-center justify-center gap-2 bg-[#F78A28] hover:bg-[#001BB7] text-white px-6 py-3.5 font-black text-xs uppercase tracking-widest transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {subscribing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Subscribe <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
              {error && <p className="text-red-600 text-xs mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
