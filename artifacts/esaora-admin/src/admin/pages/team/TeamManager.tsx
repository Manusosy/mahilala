import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { useAdminTeam } from '@workspace/esaora-core/hooks/useData';
import type { TeamMember } from '@workspace/esaora-core/lib/database.types';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, X, ImagePlus, Check, Linkedin, Mail } from 'lucide-react';

const ROLES = ['leadership', 'board', 'staff', 'advisor', 'coordinator'];
const COUNTRIES = ['Madagascar', 'International'];
type FormState = Partial<TeamMember> & { name: string; title: string };
const EMPTY: FormState = { name: '', title: '', bio: '', role: 'staff', country: '', organization: '', email: '', linkedin_url: '', sort_order: 0, is_active: true };

const ROLE_COLORS: Record<string, string> = {
  leadership: 'bg-purple-100 text-purple-700',
  board: 'bg-blue-100 text-blue-700',
  staff: 'bg-gray-100 text-gray-600',
  advisor: 'bg-yellow-100 text-yellow-700',
  coordinator: 'bg-emerald-100 text-emerald-700',
};

export default function TeamManager() {
  const { members, loading, saving, create, update, remove } = useAdminTeam();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [mediaModal, setMediaModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); setSuccess(false); };
  const openEdit = (m: TeamMember) => { setForm({ ...m }); setEditId(m.id); setShowForm(true); setError(''); setSuccess(false); };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.title.trim()) { setError('Name and title are required.'); return; }
    setError('');
    try {
      if (editId) { await update(editId, form); } else { await create(form); }
      setSuccess(true); setTimeout(closeForm, 800);
    } catch (err: any) { setError(err.message); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { await remove(id); } finally { setDeleting(null); setConfirmDelete(null); }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Team Members' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Team Members</h2>
          <p className="text-gray-400 text-sm mt-0.5">{members.length} members</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-[6px] border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                    : <span className="text-gray-400 text-xl font-bold">{m.name.charAt(0)}</span>}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{m.country} · {m.organization}</p>
                  <span className={`inline-flex mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[m.role] || 'bg-gray-100 text-gray-500'}`}>{m.role}</span>
                </div>
              </div>
              {m.bio && <p className="text-xs text-gray-500 mt-3 line-clamp-2">{m.bio}</p>}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  {m.email && <a href={`mailto:${m.email}`} className="p-1 text-gray-400 hover:text-gray-600 transition-colors"><Mail className="w-3.5 h-3.5" /></a>}
                  {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-blue-500 transition-colors"><Linkedin className="w-3.5 h-3.5" /></a>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setConfirmDelete(m.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">No team members yet.</div>}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">{editId ? 'Edit Member' : 'Add Team Member'}</h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-3 text-red-600 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
              {success && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-emerald-600 text-sm"><Check className="w-4 h-4 flex-shrink-0" />Saved!</div>}

              {/* Photo – Media Library */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                  {form.photo_url ? <img src={form.photo_url} alt="" className="w-full h-full object-cover" /> : <ImagePlus className="w-5 h-5 text-gray-300" />}
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => setMediaModal(true)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5">
                    <ImagePlus className="w-3.5 h-3.5" /> Select Photo
                  </button>
                  {form.photo_url && <button type="button" onClick={() => setForm((f) => ({ ...f, photo_url: '' }))} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                  <select value={form.role || 'staff'} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
                  <select value={form.country || ''} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
                    <option value="">Not specified</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Organization</label>
                <input type="text" value={form.organization || ''} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={form.email || ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">LinkedIn URL</label>
                  <input type="url" value={form.linkedin_url || ''} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://…" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea value={form.bio || ''} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 resize-none" />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order || 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-600">Active</span>
                </label>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-2">
              <button onClick={closeForm} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#204f79] hover:bg-[#F78A28] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {mediaModal && (
        <MediaSelectModal
          onClose={() => setMediaModal(false)}
          onSelect={(url) => { setForm((f) => ({ ...f, photo_url: url })); setMediaModal(false); }}
          allowedBuckets={['team-photos', 'images']}
          title="Select Team Photo"
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm p-6 w-full max-w-sm">
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Remove Team Member?</h3>
            <p className="text-gray-500 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={!!deleting} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
