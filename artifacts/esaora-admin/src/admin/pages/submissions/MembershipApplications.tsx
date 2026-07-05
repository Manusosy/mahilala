import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useMembershipApplications } from '@workspace/esaora-core/hooks/useData';
import { ChevronDown, ChevronUp, Loader2, Check, X, Clock, Globe } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:      { label: 'Pending',      color: 'bg-yellow-100 text-yellow-700' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
  approved:     { label: 'Approved',     color: 'bg-emerald-100 text-emerald-700' },
  rejected:     { label: 'Rejected',     color: 'bg-red-100 text-red-700' },
};

export default function MembershipApplications() {
  const { applications, loading, updateStatus } = useMembershipApplications();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const filtered = filterStatus ? applications.filter((a) => a.status === filterStatus) : applications;
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    await updateStatus(id, status, notes[id] || undefined);
    setUpdating(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Partnership Applications' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Partnership Applications</h2>
          <p className="text-gray-400 text-sm mt-0.5">{applications.length} total · {counts.pending || 0} pending review</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilterStatus('')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filterStatus ? 'bg-[#204f79] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All ({applications.length})</button>
        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
          <button key={s} onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === s ? 'bg-[#204f79] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {cfg.label} ({counts[s] || 0})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No applications found.</div>
        ) : filtered.map((app) => {
          const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
          const isExpanded = expanded === app.id;
          return (
            <div key={app.id} className="bg-white rounded-[6px] border border-gray-200">
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : app.id)}>
                <div className={`w-10 h-10 rounded-full bg-[#204f79]/10 flex items-center justify-center text-[#204f79] font-bold text-sm flex-shrink-0`}>
                  {app.org_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">{app.org_name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Globe className="w-3 h-3 text-gray-300" />
                    <span className="text-xs text-gray-500">{app.country}</span>
                    <span className="text-xs text-gray-400">· {app.org_type}</span>
                    <span className="text-xs text-gray-400">· {app.contact_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden md:block">{formatDate(app.created_at)}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <InfoRow label="Contact" value={`${app.contact_name}${app.contact_title ? ` · ${app.contact_title}` : ''}`} />
                      <InfoRow label="Email" value={app.contact_email} />
                      {app.contact_phone && <InfoRow label="Phone" value={app.contact_phone} />}
                      {app.website && <InfoRow label="Website" value={app.website} isLink />}
                    </div>
                    <div className="space-y-2">
                      {app.focus_areas?.length > 0 && <InfoRow label="Focus Areas" value={app.focus_areas.join(', ')} />}
                      {app.reviewed_at && <InfoRow label="Reviewed" value={formatDate(app.reviewed_at)} />}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-[6px] p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Motivation Statement</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{app.motivation}</p>
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Review Notes</label>
                    <textarea
                      value={notes[app.id] || app.notes || ''}
                      onChange={(e) => setNotes((n) => ({ ...n, [app.id]: e.target.value }))}
                      rows={2}
                      placeholder="Add internal notes about this application…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {app.status !== 'under_review' && (
                      <button onClick={() => handleStatusChange(app.id, 'under_review')} disabled={updating === app.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors">
                        <Clock className="w-3.5 h-3.5" /> Mark Under Review
                      </button>
                    )}
                    {app.status !== 'approved' && (
                      <button onClick={() => handleStatusChange(app.id, 'approved')} disabled={updating === app.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors">
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {app.status !== 'rejected' && (
                      <button onClick={() => handleStatusChange(app.id, 'rejected')} disabled={updating === app.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    {updating === app.id && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                    {app.contact_email && (
                      <a href={`mailto:${app.contact_email}?subject=ESA-ORA Partnership Application`}
                        className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-[#204f79] text-white rounded-lg text-xs font-semibold hover:bg-[#F78A28] transition-colors">
                        Reply via Email
                      </a>
                    )}
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

function InfoRow({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-400 flex-shrink-0 w-20">{label}</span>
      {isLink
        ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-[#204f79] hover:underline truncate">{value}</a>
        : <span className="text-xs text-gray-700">{value}</span>}
    </div>
  );
}
