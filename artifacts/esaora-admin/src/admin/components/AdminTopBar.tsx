import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '@workspace/esaora-core/hooks/useAuth';
import { useContactSubmissions, useMembershipApplications, useNewsletterSubscribers } from '@workspace/esaora-core/hooks/useData';
import { useState } from 'react';
import { signOut } from '@workspace/esaora-core/lib/auth';

interface AdminTopBarProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  setMobileOpen?: (v: boolean) => void;
}

export function AdminTopBar({ title, breadcrumbs, setMobileOpen }: AdminTopBarProps) {
  const { user, profile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch notification counts
  const { submissions } = useContactSubmissions();
  const { applications } = useMembershipApplications();
  const { subscribers } = useNewsletterSubscribers();

  const newContacts = submissions.filter((s: any) => s.status === 'new').length;
  const newApps = applications.filter((a: any) => a.status === 'pending' || a.status === 'new').length;
  const recentSubscribers = subscribers.filter((s: any) => {
    const d = new Date(s.subscribed_at);
    return (Date.now() - d.getTime()) < 24 * 60 * 60 * 1000;
  }).length;

  const totalNewCount = newContacts + newApps + recentSubscribers;

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* */ }
    window.location.href = '/admin/login';
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'AD';

  return (
    <header className="h-[61px] bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-3 lg:gap-4 flex-shrink-0">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setMobileOpen?.(true)}
        className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-gray-500 hover:bg-[#001BB7] hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb / Title */}
      <div className="flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-gray-800 font-semibold text-sm truncate">{title || 'Dashboard'}</h1>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-48 xl:w-64">
        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search…"
          className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-gray-400 hover:bg-[#001BB7] hover:text-white transition-colors">
        <Bell className="w-4 h-4" />
        {totalNewCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-[#001BB7] hover:text-white transition-colors group"
        >
          <div className="w-7 h-7 rounded-full bg-[#001BB7] flex items-center justify-center text-white text-xs font-bold group-hover:bg-[#F78A28] transition-colors">
            {initials}
          </div>
          <div className="hidden md:block text-left group-hover:text-white">
            <p className="text-xs font-semibold text-gray-800 group-hover:text-white leading-tight">
              {profile?.full_name || (user?.email ? user.email.split('@')[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Admin')}
            </p>
            <p className="text-[10px] text-gray-400 group-hover:text-white/80 capitalize">{profile?.role?.replace('_', ' ') || 'Admin'}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-800 truncate">{profile?.full_name || (user?.email ? user.email.split('@')[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Admin User')}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
