import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { gsap } from 'gsap';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';
import type { Language } from '@/i18n/translations';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
];

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  key: string;
  label: string;
  href?: string;
  sub?: SubItem[];
}

export function NavBar() {
  const { t, language, setLanguage } = useLanguage();
  const { settings } = useSiteSettings();
  const [location] = useLocation();
  const headerLogo = settings.header_logo_url || '/ESAORA-LOGO.png';
  const siteName = settings.site_name || 'Mahilala Madagascar';
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen]         = useState(false);
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(new Set());
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const langRef       = useRef<HTMLDivElement>(null);

  // Scroll → nav background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [langOpen]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { setMobileOpen(false); setOpenMobileItems(new Set()); }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on any route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileItems(new Set());
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobileItem = (key: string) => {
    setOpenMobileItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const navItems: NavItem[] = [
    {
      key: 'about',
      label: t.nav.about,
      href: '/about',
      sub: [
        { label: t.nav.ourStory, href: '/our-story' },
        { label: t.nav.vision, href: '/vision' },
        { label: t.nav.ourTeam, href: '/team' },
      ],
    },
    {
      key: 'programs',
      label: t.nav.programs,
      href: '/programs',
      sub: [
        { label: t.nav.allProjects, href: '/programs' },
        { label: t.nav.wash, href: '/programs/toroy-izy' },
        { label: t.nav.blueEconomy, href: '/programs/sekoly-manga' },
      ],
    },
    {
      key: 'partners',
      label: t.nav.partners,
      href: '/partners',
    },
    { key: 'gallery', label: t.nav.gallery, href: '/gallery' },
    { key: 'news', label: t.nav.news, href: '/news' },
  ];

  // Determine if a nav item (or any of its sub-items) matches the current location
  const isItemActive = (item: NavItem): boolean => {
    if (item.href && item.href !== '/' && (location === item.href || location.startsWith(item.href + '/'))) return true;
    if (item.sub) return item.sub.some((s) => location === s.href || location.startsWith(s.href + '/'));
    return false;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg shadow-black/5' : 'bg-white shadow-sm shadow-black/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center cursor-pointer flex-shrink-0 max-w-[240px] sm:max-w-[320px]">
              <img src={headerLogo} alt={siteName} className="h-12 sm:h-16 w-auto object-contain" />
            </Link>

            {/* ── Desktop Nav Items ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => item.sub && setActiveDropdown(item.key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {/* Main nav label — navigate if href, else just a button for dropdown */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`nav-link flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                          active ? 'text-brand-navy' : 'text-brand-navy/80 hover:text-brand-navy'
                        }`}
                      >
                        {item.label}
                        {item.sub && <ChevronDown className={`w-3 h-3 opacity-60 flex-shrink-0 transition-transform duration-200 ${activeDropdown === item.key ? 'rotate-180' : ''}`} />}
                        {active && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#001BB7] rounded-full" />}
                      </Link>
                    ) : (
                      <button
                        className={`nav-link flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                          active ? 'text-brand-navy' : 'text-brand-navy/80 hover:text-brand-navy'
                        }`}
                      >
                        {item.label}
                        {item.sub && <ChevronDown className={`w-3 h-3 opacity-60 flex-shrink-0 transition-transform duration-200 ${activeDropdown === item.key ? 'rotate-180' : ''}`} />}
                        {active && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#001BB7] rounded-full" />}
                      </button>
                    )}

                    {/* Dropdown panel */}
                    {item.sub && activeDropdown === item.key && (
                      <div className="absolute top-full left-0 w-56 bg-white border border-brand-navy/10 rounded-lg py-2 shadow-2xl shadow-black/10 z-50">
                        {item.sub.map((s) => (
                          <Link
                            key={s.label}
                            href={s.href}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors font-medium ${
                              location === s.href
                                ? 'text-[#001BB7] bg-brand-navy/5'
                                : 'text-brand-navy/80 hover:text-brand-navy hover:bg-brand-navy/5'
                            }`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Right Side: Language Selector + CTA ── */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

              {/* Language selector */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-brand-navy/80 hover:text-brand-navy text-sm py-1.5 px-2 rounded transition-colors"
                  aria-expanded={langOpen}
                  aria-haspopup="listbox"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="uppercase font-medium">{language}</span>
                  <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                  <div role="listbox" className="absolute right-0 top-full mt-1 w-40 bg-white border border-brand-navy/10 rounded-lg py-1.5 shadow-2xl shadow-black/10 z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={language === lang.code}
                        onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors font-medium ${
                          language === lang.code ? 'text-[#001BB7] bg-brand-navy/5' : 'text-brand-navy/80 hover:text-brand-navy hover:bg-brand-navy/5'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact CTA */}
              <Link
                href="/contact"
                className="bg-[#001BB7] hover:bg-[#F78A28] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 hover:scale-105 whitespace-nowrap"
              >
                {t.nav.contact}
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              className="lg:hidden text-brand-navy p-2 flex-shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      </nav>
      {/* ── Mobile Menu — accordion per section ── */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto transition-all duration-300 ease-in-out ${
          mobileOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto shadow-2xl' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-6 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isExpanded = openMobileItems.has(item.key);
            return (
              <div key={item.key}>
                <button
                  className="w-full text-left text-brand-navy text-base font-semibold py-3.5 border-b border-brand-navy/10 flex items-center justify-between"
                  onClick={() => item.sub ? toggleMobileItem(item.key) : undefined}
                >
                  {item.href && !item.sub ? (
                    <Link href={item.href} className="flex-1 text-left" onClick={() => setMobileOpen(false)}>{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  {item.sub && (
                    <ChevronDown className={`w-4 h-4 opacity-60 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {item.sub && isExpanded && (
                  <div className="bg-brand-navy/5 border-b border-brand-navy/10">
                    {item.sub.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        className="block w-full text-left text-brand-navy/70 hover:text-brand-navy text-sm py-2.5 px-4 transition-colors font-medium"
                        onClick={() => setMobileOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Language switcher + CTA at bottom */}
          <div className="pt-6 flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    language === lang.code
                      ? 'border-[#001BB7] bg-[#001BB7] text-white font-semibold'
                      : 'border-brand-navy/30 text-brand-navy/80 hover:border-brand-navy/60 hover:text-brand-navy font-medium'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Link
              href="/contact"
              className="bg-[#001BB7] hover:bg-[#F78A28] text-white px-6 py-3.5 rounded-lg font-semibold text-base w-full transition-colors text-center block"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
