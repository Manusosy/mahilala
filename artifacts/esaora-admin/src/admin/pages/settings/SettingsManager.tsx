import { AdminLayout } from '@/admin/components/AdminLayout';
import { useParams, Link } from 'wouter';
import { Settings, User, Bell } from 'lucide-react';
import SystemSettingsTab from './SystemSettingsTab';
import ProfileSettingsTab from './ProfileSettingsTab';
import NotificationSettingsTab from './NotificationSettingsTab';

const TABS = [
  { id: 'system', label: 'System', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsManager() {
  const { tab = 'system' } = useParams<{ tab?: string }>();

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: tab.charAt(0).toUpperCase() + tab.slice(1) }]}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-900 font-bold text-xl">Settings & Configurations</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
            {TABS.map((t) => {
              const active = t.id === tab;
              const Icon = t.icon;
              return (
                <Link key={t.id} href={`/admin/settings/${t.id}`}>
                  <button className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-colors text-left ${active ? 'bg-[#204f79]/10 text-[#204f79]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-b border-gray-50'}`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-[#204f79]' : 'text-gray-400'}`} />
                    {t.label}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {tab === 'system' && <SystemSettingsTab />}
          {tab === 'profile' && <ProfileSettingsTab />}
          {tab === 'notifications' && <NotificationSettingsTab />}
        </div>
      </div>
    </AdminLayout>
  );
}
