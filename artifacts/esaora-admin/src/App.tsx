import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/i18n/LanguageContext';

import { AuthContext, useAuthState } from '@workspace/esaora-core/hooks/useAuth';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';
import { AdminRoute } from '@/admin/components/AdminRoute';
import NotFound from '@/pages/not-found';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthState();
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

// ── Admin Pages ───────────────────────────────────────────────────────────
const AdminLogin         = lazy(() => import('@/admin/pages/AdminLogin'));
const AdminDashboard     = lazy(() => import('@/admin/pages/AdminDashboard'));
const ArticlesList       = lazy(() => import('@/admin/pages/articles/ArticlesList'));
const ArticleEditor      = lazy(() => import('@/admin/pages/articles/ArticleEditor'));
const CategoriesPage     = lazy(() => import('@/admin/pages/articles/CategoriesPage'));
const ProgramsList       = lazy(() => import('@/admin/pages/programs/ProgramsList'));
const ProgramEditor      = lazy(() => import('@/admin/pages/programs/ProgramEditor'));
const PartnersManager    = lazy(() => import('@/admin/pages/partners/PartnersManager'));
const MediaLibraryPage   = lazy(() => import('@/admin/pages/media/MediaLibrary'));
const ReportsManager     = lazy(() => import('@/admin/pages/reports/ReportsManager'));
const TeamManager        = lazy(() => import('@/admin/pages/team/TeamManager'));
const ContactInbox       = lazy(() => import('@/admin/pages/submissions/ContactInbox'));
const MembershipApps     = lazy(() => import('@/admin/pages/submissions/MembershipApplications'));
const SubscribersPage    = lazy(() => import('@/admin/pages/submissions/SubscribersPage'));
const UsersRolesPage     = lazy(() => import('@/admin/pages/users/UsersRoles'));
const DonationsAdminPage = lazy(() => import('@/admin/pages/donations/DonationsPage'));
const SettingsManager    = lazy(() => import('@/admin/pages/settings/SettingsManager'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#001833] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#204f79]/30 border-t-[#204f79] rounded-full animate-spin" />
        <span className="text-white/40 text-xs tracking-widest uppercase font-medium">Loading</span>
      </div>
    </div>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/" component={() => {
        window.location.href = '/admin';
        return null;
      }} />
      <Route path="/admin/login" component={AdminLogin} />

      <Route>
        {() => (
          <AdminRoute>
            <Switch>
              <Route path="/admin"                        component={AdminDashboard} />
              <Route path="/admin/articles"               component={ArticlesList} />
              <Route path="/admin/articles/new"           component={ArticleEditor} />
              <Route path="/admin/articles/categories"    component={CategoriesPage} />
              <Route path="/admin/articles/:id/edit"      component={ArticleEditor} />
              <Route path="/admin/programs"               component={ProgramsList} />
              <Route path="/admin/programs/new"           component={ProgramEditor} />
              <Route path="/admin/programs/:id/edit"      component={ProgramEditor} />
              <Route path="/admin/partners"               component={PartnersManager} />
              <Route path="/admin/gallery"                component={MediaLibraryPage} />
              <Route path="/admin/media"                  component={MediaLibraryPage} />
              <Route path="/admin/reports"                component={ReportsManager} />
              <Route path="/admin/team"                   component={TeamManager} />
              <Route path="/admin/submissions/contact"    component={ContactInbox} />
              <Route path="/admin/submissions/membership" component={MembershipApps} />
              <Route path="/admin/subscribers"            component={SubscribersPage} />
              <Route path="/admin/users"                  component={UsersRolesPage} />
              <Route path="/admin/donations"              component={DonationsAdminPage} />
              <Route path="/admin/settings/:tab"          component={SettingsManager} />
              <Route path="/admin/settings"               component={() => { window.location.href = '/admin/settings/system'; return null; }} />
              <Route component={NotFound} />
            </Switch>
          </AdminRoute>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  const { settings } = useSiteSettings();

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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Suspense fallback={<PageLoader />}>
                <AdminRouter />
              </Suspense>
            </WouterRouter>
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
