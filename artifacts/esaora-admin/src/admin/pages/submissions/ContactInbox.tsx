import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useContactSubmissions } from '@workspace/esaora-core/hooks/useData';
import { Mail, ChevronDown, ChevronUp, Loader2, Check, Archive, Clock, MailOpen } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new:     { label: 'New',     color: 'bg-red-100 text-red-700',     icon: Mail },
  read:    { label: 'Read',    color: 'bg-blue-100 text-blue-700',   icon: MailOpen },
  replied: { label: 'Replied', color: 'bg-emerald-100 text-emerald-700', icon: Check },
  archived:{ label: 'Archived',color: 'bg-gray-100 text-gray-500',   icon: Archive },
};
const STATUS_ORDER = ['new', 'read', 'replied', 'archived'];

export default function ContactInbox() {
  const { submissions, loading, updateStatus } = useContactSubmissions();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = filterStatus ? submissions.filter((s) => s.status === filterStatus) : submissions;

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    await updateStatus(id, status);
    setUpdating(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = submissions.filter((sub) => sub.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Contact Inbox' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Contact Inbox</h2>
          <p className="text-gray-400 text-sm mt-0.5">{submissions.length} total messages · {counts.new || 0} new</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilterStatus('')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filterStatus ? 'bg-[#204f79] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          All ({submissions.length})
        </button>
        {STATUS_ORDER.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === s ? 'bg-[#204f79] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {cfg.label} ({counts[s] || 0})
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Mail className="w-8 h-8 mx-auto mb-3 text-gray-200" />
            <p>No messages here.</p>
          </div>
        ) : filtered.map((msg) => {
          const cfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.new;
          const StatusIcon = cfg.icon;
          const isExpanded = expanded === msg.id;
          return (
            <div key={msg.id} className={`bg-white rounded-[6px] border transition-all ${msg.status === 'new' ? 'border-red-100 shadow-sm' : 'border-gray-200'}`}>
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => {
                setExpanded(isExpanded ? null : msg.id);
                if (msg.status === 'new') handleStatus(msg.id, 'read');
              }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">{msg.name}</p>
                    {msg.organization && <span className="text-xs text-gray-400">· {msg.organization}</span>}
                    {msg.status === 'new' && <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-[#204f79]">{msg.email}</span>
                    {msg.country && <span className="text-xs text-gray-400">· {msg.country}</span>}
                    {msg.purpose && <span className="text-xs text-gray-400">· {msg.purpose}</span>}
                  </div>
                  {!isExpanded && <p className="text-xs text-gray-500 mt-1 truncate">{msg.message}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden md:block">{formatDate(msg.created_at)}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-4 border-t border-gray-50 pt-4">
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-[6px] px-4 py-3 mb-4">{msg.message}</p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <a href={`mailto:${msg.email}?subject=Re: ESA-ORA Contact&body=%0A%0A----%0AOriginal message from ${msg.name}:%0A${msg.message}`}
                      className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Reply via Email
                    </a>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Mark as:</span>
                      <div className="flex items-center gap-1">
                        {STATUS_ORDER.filter((s) => s !== msg.status).map((s) => (
                          <button key={s} onClick={() => handleStatus(msg.id, s)} disabled={updating === msg.id}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${STATUS_CONFIG[s].color} hover:opacity-80`}>
                            {updating === msg.id ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_CONFIG[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
