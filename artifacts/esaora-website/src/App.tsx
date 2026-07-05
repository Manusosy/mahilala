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
// "Our Story" now serves as the main About Us page (Mission/Vision/Values live inside it).
const OurStoryPage     = lazy(() => import('@/pages/OurStoryPage'));
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

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-3 w-28 bg-gray-100 rounded mb-5" />
        <div className="h-9 w-3/4 max-w-xl bg-gray-100 rounded mb-4" />
        <div className="h-4 w-1/2 max-w-md bg-gray-100 rounded mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-[7px] border border-gray-100 overflow-hidden">
              <div className="aspect-[16/10] bg-gray-100" />
              <div className="p-7 space-y-3">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-5 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
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

  if (loading) return null;

  if (settings.maintenance_mode === 'true') {
    return (
      <div className="min-h-screen bg-[#204f79] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Under Maintenance</h1>
        <p className="text-[#204f79] text-xl max-w-lg leading-relaxed">
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
            <NavBar />
            <Suspense fallback={<PageSkeleton />}>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/about"      component={OurStoryPage} />
                <Route path="/our-story">{() => <Redirect to="/about" />}</Route>
                <Route path="/vision">{() => <Redirect to="/about" />}</Route>
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
            </Suspense>
            <Footer />
          </WouterRouter>
        </LanguageProvider>
        <Toaster />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
