import { useState } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useAdminPrograms } from '@workspace/esaora-core/hooks/usePrograms';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, AlertCircle, Globe } from 'lucide-react';

const PILLAR_COLORS: Record<string, string> = {
  'Toroy Izy': '#001BB7',
  'Youth Mentoring': '#7C3AED',
  'Sekoly Manga': '#22C55E',
  'Civic Engagement': '#F78A28',
  // Legacy esaora values (existing records)
  WASH: '#001BB7',
  'Climate Resilience': '#7C3AED',
  'Blue Economy': '#22C55E',
  'Public Health': '#F78A28',
  Governance: '#F78A28',
};

export default function ProgramsList() {
  const { programs, loading, remove, update } = useAdminPrograms();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { await remove(id); } finally { setDeleting(null); setConfirmDelete(null); }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await update(id, { is_published: !current });
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Programmes' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Programmes</h2>
          <p className="text-gray-400 text-sm mt-0.5">{programs.length} total programmes</p>
        </div>
        <Link href="/admin/programs/new">
          <button className="flex items-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" /> New Programme
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">No programmes yet</p>
            <Link href="/admin/programs/new">
              <button className="mt-4 px-4 py-2 bg-[#001BB7] text-white rounded-lg text-sm font-semibold hover:bg-[#F78A28] transition-colors">Create First Programme</button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Programme</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Pillar</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Visible</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {programs.map((prog) => {
                  const color = PILLAR_COLORS[prog.pillar] || '#001BB7';
                  return (
                    <tr key={prog.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{prog.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{prog.summary || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold" style={{ backgroundColor: `${color}20`, color }}>
                          {prog.pillar}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-xs text-gray-500">Madagascar</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${prog.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {prog.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => handleTogglePublish(prog.id, prog.is_published)} className={`p-1.5 rounded-lg transition-colors ${prog.is_published ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                          {prog.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/programs/${prog.id}/edit`}>
                            <button title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          </Link>
                          <button onClick={() => setConfirmDelete(prog.id)} title="Delete" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm p-6 w-full max-w-sm">
            <div className="w-10 h-10 bg-red-100 rounded-[6px] flex items-center justify-center mb-4"><AlertCircle className="w-5 h-5 text-red-500" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Programme?</h3>
            <p className="text-gray-500 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting === confirmDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleting === confirmDelete && <Loader2 className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
