import { lazy, Suspense, useEffect } from 'react';
// HMR Trigger: Refreshing route manifest to resolve module fetch issues.
import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';

// ── Shared UI Hooks ──
import { HomePage } from '@/pages/HomePage';
import NotFound from '@/pages/not-found';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';

// ── Phase 2: About Section ──────────────────────────────────────────────────
const AboutPage        = lazy(() => import('@/pages/AboutPage'));
const OurStoryPage     = lazy(() => import('@/pages/OurStoryPage'));
const VisionPage       = lazy(() => import('@/pages/VisionPage'));
// ── Phase 4: Country Pages ──────────────────────────────────────────────────
const MadagascarPage   = lazy(() => import('@/pages/MadagascarPage'));

// ── Phase 5: Engagement Pages ───────────────────────────────────────────────
const PartnersPage     = lazy(() => import('@/pages/PartnersPage'));
const NewsPage         = lazy(() => import('@/pages/NewsPage'));
const GalleryPage      = lazy(() => import('@/pages/GalleryPage'));
const ContactPage      = lazy(() => import('@/pages/ContactPage'));

// ── Phase 6: Supporting ─────────────────────────────────────────────────────
const ProgramsPage     = lazy(() => import('@/pages/ProgramsPage'));
const LegalPage        = lazy(() => import('@/pages/LegalPage'));

// ── Dynamic pages ─────────────────────────────────────────────
const NewsArticlePage  = lazy(() => import('@/pages/NewsArticlePage'));
const ProgramDetailPage = lazy(() => import('@/pages/ProgramDetailPage'));
const TeamPage         = lazy(() => import('@/pages/TeamPage'));
const TeamMemberPage   = lazy(() => import('@/pages/TeamMemberPage'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#001833] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#001BB7]/30 border-t-[#001BB7] rounded-full animate-spin" />
        <span className="text-white/40 text-xs tracking-widest uppercase font-medium">Loading</span>
      </div>
    </div>
  );
}
function ScrollToTop() {
  const [pathname] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { settings, loading } = useSiteSettings();

  // Apply admin-configured favicon + browser tab title
  useEffect(() => {
    if (settings.favicon_url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
    if (settings.site_name) {
      document.title = settings.site_name;
    }
  }, [settings.favicon_url, settings.site_name]);

  if (loading) return <PageLoader />;

  if (settings.maintenance_mode === 'true') {
    return (
      <div className="min-h-screen bg-[#001BB7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-2 border-[#001BB7]/30 border-t-[#001BB7] rounded-full animate-spin mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">Under Maintenance</h1>
        <p className="text-[#001BB7] text-xl max-w-lg leading-relaxed">
          The Mahilala Madagascar website is currently undergoing scheduled maintenance. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <NavBar />
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/about"      component={AboutPage} />
                <Route path="/our-story"  component={OurStoryPage} />
                <Route path="/vision"     component={VisionPage} />
                <Route path="/governance">{() => <Redirect to="/about" />}</Route>
                <Route path="/our-work/wash">{() => <Redirect to="/programs" />}</Route>
                <Route path="/our-work/climate">{() => <Redirect to="/programs" />}</Route>
                <Route path="/our-work/blue-economy">{() => <Redirect to="/programs" />}</Route>
                <Route path="/our-work/public-health">{() => <Redirect to="/programs" />}</Route>
                <Route path="/countries/kenya">{() => <Redirect to="/countries/madagascar" />}</Route>
                <Route path="/countries/tanzania">{() => <Redirect to="/countries/madagascar" />}</Route>
                <Route path="/countries/mozambique">{() => <Redirect to="/countries/madagascar" />}</Route>
                <Route path="/countries/madagascar" component={MadagascarPage} />
                <Route path="/programs" component={ProgramsPage} />
                <Route path="/programs/:slug" component={ProgramDetailPage} />
                <Route path="/reports">{() => <Redirect to="/programs" />}</Route>
                <Route path="/partners" component={PartnersPage} />
                <Route path="/news"     component={NewsPage} />
                <Route path="/news/:slug" component={NewsArticlePage} />
                <Route path="/gallery"  component={GalleryPage} />
                <Route path="/contact"  component={ContactPage} />
                <Route path="/team"     component={TeamPage} />
                <Route path="/team/:slug" component={TeamMemberPage} />
                <Route path="/donate">{() => <Redirect to="/contact" />}</Route>
                <Route path="/privacy">{() => <LegalPage title="Privacy Policy" type="privacy" />}</Route>
                <Route path="/terms">{() => <LegalPage title="Terms of Service" type="terms" />}</Route>
                <Route path="/cookies">{() => <LegalPage title="Cookie Policy" type="cookies" />}</Route>
                <Route component={NotFound} />
              </Switch>
              <Footer />
            </Suspense>
          </WouterRouter>
        </LanguageProvider>
        <Toaster />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
