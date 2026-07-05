import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { Mail } from 'lucide-react';
import { FaLinkedin, FaXTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa6';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';

export function Footer() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const footerLogo = settings.footer_logo_url || '/footerlogo.svg';
  const siteName = settings.site_name || 'Mahilala Madagascar';

  return (
    <footer className="bg-[#204f79] border-t border-white/20 pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Identity Column */}
          <div className="space-y-8">
            <Link href="/">
              <img
                src={footerLogo}
                alt={`${siteName} Logo`}
                className="h-20 w-auto hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </Link>
            <div className="space-y-4">
              <p className="text-white text-lg font-medium leading-snug tracking-tight">
                {t.footer.tagline}
              </p>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                {t.footer.charter}
              </p>
            </div>

            {/* Social + Contact Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: <FaLinkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
                { icon: <FaXTwitter className="w-5 h-5" />,  href: '#', label: 'Twitter' },
                { icon: <FaFacebookF className="w-5 h-5" />, href: '#', label: 'Facebook' },
                { icon: <FaYoutube className="w-5 h-5" />,   href: '#', label: 'YouTube' },
                { icon: <Mail className="w-5 h-5" />, href: `mailto:${t.footer.email}`, label: 'Email' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label === 'Email' ? t.footer.email : s.label}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white hover:text-[#204f79] transition-all duration-300 hover:-translate-y-1"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Programmes Column */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest mb-10">{t.footer.ourWork}</h4>
            <ul className="space-y-5">
              <li><Link href="/programs/toroy-izy"  className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.wash}</Link></li>
              <li><Link href="/programs/sekoly-manga" className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.blueEconomy}</Link></li>
              <li><Link href="/programs"             className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.climate}</Link></li>
              <li><Link href="/programs"             className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.publicHealth}</Link></li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest mb-10">{t.footer.about}</h4>
            <ul className="space-y-5">
              <li><Link href="/about"      className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.about}</Link></li>
              <li><Link href="/team"       className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.ourTeam}</Link></li>
              <li><Link href="/programs"   className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.programs}</Link></li>
              <li><Link href="/partners"   className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.partners}</Link></li>
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest mb-10">{t.footer.allianceConnectivity}</h4>
            <ul className="space-y-5">
              <li><Link href="/gallery" className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.gallery}</Link></li>
              <li><Link href="/news"    className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.news}</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-[#F78A28] text-base transition-colors duration-200 block">{t.nav.contact}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white/50 text-xs tracking-wide">
            © {new Date().getFullYear()} Mahilala Madagascar. All rights reserved.
          </div>
          <div className="flex gap-10">
            {[
              { label: t.footer.privacy, href: '/privacy' },
              { label: t.footer.terms,   href: '/terms' },
              { label: t.footer.cookies, href: '/cookies' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-white/60 hover:text-white text-xs transition-colors font-medium">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
