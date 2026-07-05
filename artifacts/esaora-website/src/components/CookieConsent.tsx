import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'wouter';

const STORAGE_KEY = 'mahilala-cookie-consent';

const BRAND_BLUE = '#204f79';
const BRAND_ORANGE = '#F78A28';

interface CookieCategory {
  id: string;
  label: string;
  required: boolean;
}

const CATEGORIES: CookieCategory[] = [
  { id: 'session', label: 'Session', required: true },
  { id: 'persistent', label: 'Persistent', required: false },
  { id: 'performance', label: 'Performance', required: false },
  { id: 'third_party', label: 'Third Party', required: false },
  { id: 'functionality', label: 'Functionality', required: false },
];

function getStoredConsent(): Record<string, boolean> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function defaultConsent(allOptional = false): Record<string, boolean> {
  const values: Record<string, boolean> = {};
  CATEGORIES.forEach((c) => {
    values[c.id] = c.required || allOptional;
  });
  return values;
}

function persistAndClose(
  consent: Record<string, boolean>,
  setVisible: (v: boolean) => void,
  setMounted: (v: boolean) => void,
) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  setVisible(false);
  setTimeout(() => setMounted(false), 300);
}

const primaryBtn =
  'rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 bg-[#204f79] hover:bg-[#F78A28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204f79]';

const ghostBtn =
  'rounded-md px-4 py-2 text-sm font-semibold text-[#111111] transition-colors duration-200 border border-[#204f79]/25 hover:border-[#F78A28] hover:text-[#F78A28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204f79]';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [consent, setConsent] = useState<Record<string, boolean>>(() => defaultConsent(false));

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      const t = setTimeout(() => {
        setMounted(true);
        requestAnimationFrame(() => setVisible(true));
      }, 800);
      return () => clearTimeout(t);
    }
  }, []);

  if (!mounted) return null;

  const handleToggle = (id: string) => {
    if (CATEGORIES.find((c) => c.id === id)?.required) return;
    setConsent((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAcceptAll = () => persistAndClose(defaultConsent(true), setVisible, setMounted);

  const handleRejectAll = () => persistAndClose(defaultConsent(false), setVisible, setMounted);

  const handleSavePreferences = () => persistAndClose(consent, setVisible, setMounted);

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[9999] pointer-events-none"
    >
      <div
        className="pointer-events-auto mx-auto w-full max-w-5xl px-4 pb-4 transition-all duration-300 ease-out"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(calc(100% + 1rem))',
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {showManage && (
            <div className="border-b border-black/8 px-4 py-3 sm:px-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#204f79]">
                  Cookie preferences
                </p>
                <button
                  type="button"
                  onClick={() => setShowManage(false)}
                  aria-label="Close preferences"
                  className="rounded p-1 text-black/40 transition-colors hover:text-black/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {CATEGORIES.map((cat) => {
                  const checked = consent[cat.id];
                  return (
                    <li key={cat.id} className="flex items-center justify-between gap-2 py-1">
                      <span className="text-sm text-[#111111]">
                        {cat.label}
                        {cat.required && (
                          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-[#204f79]">
                            Required
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        disabled={cat.required}
                        onClick={() => handleToggle(cat.id)}
                        className="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 disabled:cursor-not-allowed"
                        style={{
                          background: checked ? BRAND_BLUE : '#E5E7EB',
                        }}
                        aria-label={`${cat.label} cookies ${checked ? 'enabled' : 'disabled'}`}
                      >
                        <span
                          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                          style={{ left: checked ? '18px' : '2px' }}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={handleSavePreferences} className={primaryBtn}>
                  Save preferences
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-3.5">
            <p className="text-sm leading-snug text-[#111111] sm:max-w-xl">
              We use cookies to improve your experience. See our{' '}
              <Link
                href="/cookies"
                className="font-semibold text-[#204f79] underline underline-offset-2 transition-colors hover:text-[#F78A28]"
              >
                cookie policy
              </Link>
              .
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              {!showManage && (
                <button
                  type="button"
                  onClick={() => setShowManage(true)}
                  className="text-sm font-semibold text-[#204f79] underline underline-offset-2 transition-colors hover:text-[#F78A28]"
                >
                  Manage
                </button>
              )}
              <button type="button" onClick={handleRejectAll} className={ghostBtn}>
                Essential only
              </button>
              <button type="button" id="cookie-accept-all" onClick={handleAcceptAll} className={primaryBtn}>
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
