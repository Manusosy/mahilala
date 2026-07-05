import { ChevronRight, Loader2, Check } from 'lucide-react';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { markNewsletterSubscribed } from '@/hooks/useNewsletterPopupTrigger';

interface NewsletterPopupProps {
  open: boolean;
  onDismiss: () => void;
  onClose: () => void;
}

export function NewsletterPopup({ open, onDismiss, onClose }: NewsletterPopupProps) {
  const { settings } = useSiteSettings();
  const logo = settings.header_logo_url || '/favicon.png';

  const { email, setEmail, subscribing, subscribed, error, handleSubscribe } =
    useNewsletterSubscribe(() => {
      markNewsletterSubscribed();
      setTimeout(onClose, 1800);
    });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close newsletter popup"
        onClick={onDismiss}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-[#F3EFE4] px-8 py-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="Mahilala" className="h-12 w-auto object-contain mb-6" />

          <h2
            id="newsletter-popup-title"
            className="font-display text-lg font-black uppercase tracking-[0.2em] text-[#111111] mb-3"
          >
            Join Our Community
          </h2>

          <div className="w-10 h-px bg-[#111111]/30 mb-5" />

          <p className="text-sm text-[#4A5568] leading-relaxed mb-8 max-w-xs">
            Get updates on programme stories, youth initiatives, and opportunities from Mahilala Madagascar.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-[#204f79] font-semibold text-sm py-2">
              <Check className="w-5 h-5 text-[#F78A28]" />
              You're subscribed. Thank you!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full">
              <div className="flex rounded-lg overflow-hidden border border-[#111111]/15 bg-white shadow-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-4 py-3.5 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  aria-label="Subscribe"
                  className="flex items-center justify-center w-14 bg-[#204f79] hover:bg-[#F78A28] text-white transition-colors disabled:opacity-60"
                >
                  {subscribing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            </form>
          )}

          <button
            type="button"
            onClick={onDismiss}
            className="mt-8 text-sm text-[#111111] underline underline-offset-4 hover:text-[#F78A28] transition-colors"
          >
            No, Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
