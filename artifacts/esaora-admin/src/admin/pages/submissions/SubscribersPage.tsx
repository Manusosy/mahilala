import { AdminLayout } from '@/admin/components/AdminLayout';
import { useNewsletterSubscribers } from '@workspace/esaora-core/hooks/useData';
import { Loader2, Download, Users } from 'lucide-react';

export default function SubscribersPage() {
  const { subscribers, loading } = useNewsletterSubscribers();

  const exportCSV = () => {
    const rows = [['Email', 'Subscribed', 'Status'], ...subscribers.map((s) => [s.email, new Date(s.subscribed_at).toLocaleDateString(), s.is_subscribed ? 'Subscribed' : 'Unsubscribed'])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'esaora-subscribers.csv'; a.click();
  };

  const active = subscribers.filter((s) => s.is_subscribed).length;

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Newsletter Subscribers' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Newsletter Subscribers</h2>
          <p className="text-gray-400 text-sm mt-0.5">{active} active · {subscribers.length - active} unsubscribed</p>
        </div>
        <button onClick={exportCSV} disabled={loading || subscribers.length === 0}
          className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {[{ label: 'Total Subscribers', value: subscribers.length, color: 'text-gray-900' },
          { label: 'Active', value: active, color: 'text-emerald-600' },
          { label: 'Unsubscribed', value: subscribers.length - active, color: 'text-red-500' }].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-[6px] p-5">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No subscribers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Subscribed</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-700">{sub.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{new Date(sub.subscribed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.is_subscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {sub.is_subscribed ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
