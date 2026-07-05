import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, Newspaper, Layers, FolderOpen, Image,
  Settings, BookOpen, Users, Handshake, Award, ShieldCheck,
  Heart, Home, LogOut, ChevronDown, ChevronRight, Menu, X,
  Globe, Mail, Database
} from 'lucide-react';
import { signOut } from '@workspace/esaora-core/lib/auth';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  {
    icon: Newspaper, label: 'News & Articles',
    children: [
      { label: 'All Articles', href: '/admin/articles' },
      { label: 'Add New Article', href: '/admin/articles/new' },
      { label: 'Categories & Tags', href: '/admin/articles/categories' },
    ],
  },
  {
    icon: Layers, label: 'Programmes',
    children: [
      { label: 'All Programmes', href: '/admin/programs' },
      { label: 'Add New', href: '/admin/programs/new' },
    ],
  },
  { icon: Image, label: 'Media', href: '/admin/media' },
  { icon: BookOpen, label: 'Reports', href: '/admin/reports' },
  {
    icon: Settings, label: 'Settings',
    children: [
      { label: 'System', href: '/admin/settings/system' },
      { label: 'Profile', href: '/admin/settings/profile' },
      { label: 'Notifications', href: '/admin/settings/notifications' },
    ],
  },
];

const ORG_ITEMS: NavItem[] = [
  { icon: Users, label: 'Team Members', href: '/admin/team' },
  { icon: Handshake, label: 'Partners', href: '/admin/partners' },
  { icon: Mail, label: 'Contact Inbox', href: '/admin/submissions/contact' },
  { icon: Globe, label: 'Partnership Applications', href: '/admin/submissions/membership' },
  { icon: Database, label: 'Newsletter Subscribers', href: '/admin/subscribers' },
  { icon: Heart, label: 'Donations', href: '/admin/donations' },
  { icon: ShieldCheck, label: 'Users & Roles', href: '/admin/users' },
];

const NAV_ITEM_BASE =
  'flex items-center gap-3 py-2.5 px-3 rounded-md cursor-pointer transition-colors duration-150';

function navItemClass(isActive: boolean) {
  return isActive
    ? `${NAV_ITEM_BASE} bg-white/[0.08] text-white font-semibold`
    : `${NAV_ITEM_BASE} text-white/70 hover:bg-white/[0.06] hover:text-white`;
}

function NavGroup({ item, collapsed, setMobileOpen }: { item: NavItem; collapsed: boolean; setMobileOpen?: (v: boolean) => void }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(() =>
    item.children?.some((c) => location.startsWith(c.href)) ?? false
  );

  const isActive = item.href
    ? location === item.href || (item.href !== '/admin' && location.startsWith(item.href))
    : item.children?.some((c) => location.startsWith(c.href));

  const Icon = item.icon;

  if (item.href && !item.children) {
    return (
      <Link href={item.href}>
        <div
          onClick={() => setMobileOpen?.(false)}
          className={navItemClass(!!isActive)}
          title={collapsed ? item.label : undefined}
        >
          <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#F78A28]' : 'text-white/70'}`} />
          {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
        </div>
      </Link>
    );
  }

  return (
    <div>
      <div
        onClick={() => !collapsed && setOpen((o) => !o)}
        className={navItemClass(!!isActive)}
        title={collapsed ? item.label : undefined}
      >
        <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#F78A28]' : 'text-white/70'}`} />
        {!collapsed && (
          <>
            <span className="text-sm font-medium truncate flex-1">{item.label}</span>
            {open
              ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-white" />
              : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-white" />}
          </>
        )}
      </div>

      {!collapsed && open && item.children && (
        <div className="ml-7 mt-0.5 space-y-0.5 pl-3">
          {item.children.map((child) => {
            const childActive = location === child.href;
            return (
              <Link key={child.href} href={child.href}>
                <div
                  onClick={() => setMobileOpen?.(false)}
                  className={`py-2 px-3 rounded-md text-xs cursor-pointer transition-colors duration-150 ${
                    childActive
                      ? 'bg-white/[0.08] text-[#F78A28] font-semibold'
                      : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {child.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

export function AdminSidebar({ collapsed, onCollapse, mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const { settings } = useSiteSettings();
  const footerLogo = settings.footer_logo_url || '/footerlogo.png';

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* ignore */ }
    window.location.href = '/admin/login';
  };

  return (
    <aside
      className={`flex flex-col h-full bg-[#204f79] border-r border-[#001496] transition-all duration-300 ease-in-out flex-shrink-0 w-[260px] lg:h-screen lg:w-auto ${
        collapsed ? 'lg:w-[64px]' : 'lg:w-[260px]'
      }`}
    >
      {/* Logo / Header */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#001496] min-h-[72px] ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          <img
            src="/owl-icon.png"
            alt="Platform Manager"
            className="w-9 h-9 object-contain flex-shrink-0"
          />
        ) : (
          <img
            src={footerLogo}
            alt="Platform Manager"
            className="h-9 w-auto object-contain flex-shrink-0"
          />
        )}
        <button
          onClick={() => {
            if (window.innerWidth < 1024) setMobileOpen?.(false);
            else onCollapse(!collapsed);
          }}
          className={`ml-auto p-1 rounded-md text-white hover:bg-white/10 transition-colors flex-shrink-0 ${collapsed ? 'ml-0' : ''}`}
        >
          <div className="hidden lg:block">{collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}</div>
          <div className="lg:hidden"><X className="w-4 h-4" /></div>
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavGroup key={item.label} item={item} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        ))}

        {/* Organization Section */}
        {!collapsed && (
          <div className="pt-4 pb-1 px-3">
            <p className="text-white text-[9px] uppercase tracking-[0.18em] font-bold opacity-50">Organization</p>
          </div>
        )}
        {collapsed && <div className="my-2 border-t border-[#001496] hidden lg:block" />}

        {ORG_ITEMS.map((item) => (
          <NavGroup key={item.label} item={item} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[#001496] space-y-0.5">
        <Link href="/" target="_blank">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-150"
            title={collapsed ? 'Go Back Home' : undefined}
          >
            <Home className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-xs font-medium">Go Back Home</span>}
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-white hover:bg-red-700 transition-colors duration-150"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
