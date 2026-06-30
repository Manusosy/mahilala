import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'mahilala-newsletter-popup';
const SESSION_KEY = 'mahilala-newsletter-shown';
const DISMISS_DAYS = 7;
const MIN_TIME_MS = 12_000;
const MIN_SCROLL = 0.55;
const BOTTOM_SCROLL = 0.82;

interface PopupStorage {
  dismissedAt?: number;
  subscribed?: boolean;
}

function readStorage(): PopupStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markNewsletterSubscribed() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ subscribed: true }));
}

export function markNewsletterDismissed() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }));
}

function isEligible(): boolean {
  if (sessionStorage.getItem(SESSION_KEY)) return false;
  const stored = readStorage();
  if (stored.subscribed) return false;
  if (stored.dismissedAt) {
    const elapsed = Date.now() - stored.dismissedAt;
    if (elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return false;
  }
  return true;
}

function scrollProgress(): number {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 0;
  return scrollTop / docHeight;
}

/** Shows at most once per session after meaningful article engagement or exit intent. */
export function useNewsletterPopupTrigger(enabled: boolean) {
  const [shouldShow, setShouldShow] = useState(false);
  const armedRef = useRef(false);
  const shownRef = useRef(false);
  const pageEnteredAt = useRef(Date.now());

  useEffect(() => {
    if (!enabled || !isEligible()) return;

    pageEnteredAt.current = Date.now();
    armedRef.current = false;

    const tryShow = () => {
      if (shownRef.current || !armedRef.current) return;
      shownRef.current = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      setShouldShow(true);
    };

    const updateArmed = () => {
      const elapsed = Date.now() - pageEnteredAt.current;
      const scrolled = scrollProgress();
      if (elapsed >= MIN_TIME_MS && scrolled >= MIN_SCROLL) {
        armedRef.current = true;
      }
      if (armedRef.current && scrolled >= BOTTOM_SCROLL) {
        tryShow();
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 12) return;
      tryShow();
    };

    window.addEventListener('scroll', updateArmed, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    updateArmed();

    return () => {
      window.removeEventListener('scroll', updateArmed);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [enabled]);

  const dismiss = () => {
    markNewsletterDismissed();
    setShouldShow(false);
  };

  return { shouldShow, dismiss, close: () => setShouldShow(false) };
}
