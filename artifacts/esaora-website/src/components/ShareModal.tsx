import { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';

const SHARE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://mahilalamadagascar.org';
const DEFAULT_MSG = `Mahilala Madagascar empowers youth through mentorship, civic engagement, environmental education, and leadership development in Toliara. Learn more:`;

/* ── Real brand SVG logos ── */
function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L.057 23.776a.5.5 0 0 0 .614.644l6.094-1.596A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.942 9.942 0 0 1-5.12-1.415l-.36-.217-3.738.978.998-3.648-.235-.373A9.943 9.943 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

interface Platform {
  key: string;
  label: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
  build: (msg: string, url: string) => string;
}

const PLATFORMS: Platform[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    bgColor: '#25D36618',
    iconColor: '#25D366',
    icon: <WhatsAppLogo />,
    build: (msg, url) => `https://wa.me/?text=${encodeURIComponent(`${msg}\n${url}`)}`,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    bgColor: '#1877F218',
    iconColor: '#1877F2',
    icon: <FacebookLogo />,
    build: (_msg, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    bgColor: '#ffffff14',
    iconColor: '#ffffff',
    icon: <XLogo />,
    build: (msg, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    bgColor: '#0A66C218',
    iconColor: '#0A66C2',
    icon: <LinkedInLogo />,
    build: (_msg, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    key: 'telegram',
    label: 'Telegram',
    bgColor: '#2AABEE18',
    iconColor: '#2AABEE',
    icon: <TelegramLogo />,
    build: (msg, url) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`,
  },
  {
    key: 'email',
    label: 'Email',
    bgColor: '#6B728018',
    iconColor: '#9CA3AF',
    icon: <Mail className="w-5 h-5" />,
    build: (msg, url) =>
      `mailto:?subject=${encodeURIComponent('Mahilala Madagascar — Youth & Environmental Action')}&body=${encodeURIComponent(`${msg}\n\n${url}`)}`,
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ open, onClose }: Props) {
  const [message, setMessage] = useState(DEFAULT_MSG);
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleShare = (platform: Platform) => {
    window.open(platform.build(message, SHARE_URL), '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${message}\n${SHARE_URL}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 29, 69, 0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* max-h-[90vh] + flex-col so it never overflows the screen */}
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl shadow-brand-navy/20 max-h-[90vh] flex flex-col">

        {/* Header — fixed */}
         <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-brand-navy font-bold text-xl">Share Our Mission</h2>
            <p className="text-brand-navy/50 text-sm mt-0.5">Amplify the voice of coastal communities</p>
          </div>
          <button onClick={onClose} className="text-brand-navy/30 hover:text-brand-navy transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Editable message */}
           <div>
            <label className="block text-brand-navy/40 text-[10px] font-bold uppercase tracking-widest mb-2">
              Customise your message
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-navy text-sm resize-none focus:outline-none focus:border-brand-navy/30 focus:bg-white transition-all placeholder-gray-400"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end mt-1">
              <span className="text-brand-navy/20 text-[10px] font-medium">{message.length} chars</span>
            </div>
          </div>

          {/* Link preview */}
           <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
            <div className="flex-1 min-w-0 text-left">
              <p className="text-brand-navy/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Link</p>
              <p className="text-brand-navy/70 text-sm truncate">{SHARE_URL}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                background: copied ? '#204f79' : '#e2e8f0',
                color: copied ? '#001D45' : '#64748b',
              }}
            >
              {copied
                ? <><Check className="w-3.5 h-3.5" /> Copied!</>
                : <><Copy className="w-3.5 h-3.5" /> Copy</>
              }
            </button>
          </div>

          {/* Platform grid */}
           <div>
            <p className="text-brand-navy/40 text-[10px] font-bold uppercase tracking-widest mb-3">Share on platform</p>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handleShare(p)}
                  className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-lg border border-gray-100 transition-all duration-200 hover:border-brand-navy/20 hover:bg-gray-50 group"
                  style={{ background: p.key === 'twitter' ? '#f8fafc' : p.bgColor.replace('18', '08') }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ background: p.key === 'twitter' ? '#00000018' : p.iconColor + '22', color: p.key === 'twitter' ? '#000000' : p.iconColor }}
                  >
                    {p.icon}
                  </div>
                  <span className="text-brand-navy/60 text-[10px] font-bold tracking-tight">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer — fixed */}
         <div className="px-6 py-4 border-t border-gray-50 text-center flex-shrink-0">
          <p className="text-brand-navy/30 text-[10px] font-medium leading-relaxed">
            Help us grow — every share brings more support to East & Southern Africa's coastal communities.
          </p>
        </div>
      </div>
    </div>
  );
}
