import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/admin/components/AdminLayout';
import {
  Newspaper, Layers, Users, Handshake, MailOpen, UserCheck,
  TrendingUp, Clock, PlusCircle, Eye
} from 'lucide-react';
import { supabase } from '@workspace/esaora-core/lib/supabase';
import { useAuth } from '@workspace/esaora-core/hooks/useAuth';

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  href: string;
}

interface RecentItem {
  id: string;
  label: string;
  sub: string;
  time: string;
  type: string;
}

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [
        { count: articles },
        { count: programs },
        { count: partners },
        { count: team },
        { count: contacts },
        { count: memberApps },
        { count: gallery },
        { count: reports },
      ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('partners').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('membership_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        articles: articles || 0,
        programs: programs || 0,
        partners: partners || 0,
        team: team || 0,
        contacts: contacts || 0,
        memberApps: memberApps || 0,
        gallery: gallery || 0,
        reports: reports || 0,
      });

      // Recent activity
      const [{ data: recentArticles }, { data: recentContacts }, { data: recentApps }] = await Promise.all([
        supabase.from('articles').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('contact_submissions').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('membership_applications').select('id, org_name, created_at').order('created_at', { ascending: false }).limit(2),
      ]);

      const items: RecentItem[] = [
        ...(recentArticles || []).map((a: any) => ({
          id: a.id, label: a.title, sub: 'Article', time: a.created_at, type: 'article',
        })),
        ...(recentContacts || []).map((c: any) => ({
          id: c.id, label: c.name, sub: 'Contact Message', time: c.created_at, type: 'contact',
        })),
        ...(recentApps || []).map((a: any) => ({
          id: a.id, label: a.org_name, sub: 'Partnership Application', time: a.created_at, type: 'membership',
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      setRecent(items);
      setLoading(false);
    }
    loadStats();
  }, []);

  const STAT_CARDS: StatCard[] = [
    { label: 'Articles', value: stats.articles ?? '–', icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/articles' },
    { label: 'Programmes', value: stats.programs ?? '–', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/programs' },
    { label: 'Partners', value: stats.partners ?? '–', icon: Handshake, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/partners' },
    { label: 'Team Members', value: stats.team ?? '–', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/team' },
    { label: 'New Messages', value: stats.contacts ?? '–', icon: MailOpen, color: 'text-red-600', bg: 'bg-red-50', href: '/admin/submissions/contact' },
    { label: 'Pending Applications', value: stats.memberApps ?? '–', icon: UserCheck, color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/admin/submissions/membership' },
    { label: 'Gallery Items', value: stats.gallery ?? '–', icon: Eye, color: 'text-cyan-600', bg: 'bg-cyan-50', href: '/admin/gallery' },
    { label: 'Reports', value: stats.reports ?? '–', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/admin/reports' },
  ];

  const QUICK_ACTIONS = [
    { label: 'New Article', href: '/admin/articles/new', icon: Newspaper, color: 'bg-white hover:bg-gray-50', iconColor: 'text-[#001BB7]' },
    { label: 'New Programme', href: '/admin/programs/new', icon: Layers, color: 'bg-white hover:bg-gray-50', iconColor: 'text-emerald-600' },
    { label: 'Add Partner', href: '/admin/partners', icon: Handshake, color: 'bg-white hover:bg-gray-50', iconColor: 'text-purple-600' },
    { label: 'Add Team Member', href: '/admin/team', icon: Users, color: 'bg-white hover:bg-gray-50', iconColor: 'text-orange-600' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const fallback = user?.email ? user.email.split('@')[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Admin';
  const name = profile?.full_name?.split(' ')[0] || fallback.split(' ')[0];

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const typeColors: Record<string, string> = {
    article: 'bg-blue-100 text-blue-700',
    contact: 'bg-red-100 text-red-700',
    membership: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <AdminLayout
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      {/* Welcome Banner */}
      <div className="bg-[#001BB7] rounded-[6px] p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#F78A28] text-sm font-semibold mb-1">Mahilala Platform Manager</p>
            <h2 className="text-white text-2xl font-bold">{greeting}, {name} 👋</h2>
            <p className="text-white/70 text-sm mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[{ val: stats.contacts || 0, label: 'New messages' }, { val: stats.memberApps || 0, label: 'Pending apps' }].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-bold ${val > 0 ? 'text-[#F78A28]' : 'text-white/50'}`}>{val}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <div className="bg-white rounded-[6px] p-4 border border-gray-200 transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 ${card.bg} rounded-[4px] flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${card.color}`} />
                  </div>
                </div>
                {loading ? (
                  <div className="h-7 w-10 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                )}
                <p className="text-gray-400 text-xs mt-0.5">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Grid: Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-[6px] border border-gray-200 p-5">
          <p className="text-gray-700 font-semibold text-sm mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-gray-400" /> Quick Actions
          </p>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-[6px] border border-gray-200 cursor-pointer transition-all hover:shadow-sm ${action.color} text-sm font-semibold text-gray-800`}>
                    <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${action.iconColor}`} />
                    {action.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[6px] border border-gray-200 p-5">
          <p className="text-gray-700 font-semibold text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
          </p>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-100 rounded-[4px]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No activity yet. Start by adding content.</p>
          ) : (
            <div className="space-y-2.5">
              {recent.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-[4px] hover:bg-gray-50 transition-colors">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-[4px] flex-shrink-0 ${typeColors[item.type] || 'bg-gray-100 text-gray-600'}`}>
                    {item.sub}
                  </span>
                  <p className="text-sm text-gray-700 truncate flex-1">{item.label}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(item.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
