import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { useAdminPartners } from '@workspace/esaora-core/hooks/useData';
import type { Partner } from '@workspace/esaora-core/lib/database.types';
import {
  Plus, Edit2, Trash2, Globe, Loader2, AlertCircle, X,
  ImagePlus, Check, ExternalLink, Star
} from 'lucide-react';

const PARTNER_TYPES = ['member', 'strategic', 'donor', 'implementing', 'observer'];
const COUNTRIES = ['Kenya', 'Tanzania', 'Mozambique', 'Madagascar', 'Regional', 'International'];

type FormState = Partial<Partner> & { name: string };
const EMPTY: FormState = { name: '', website_url: '', country: '', description: '', type: 'member', is_founding: false, is_active: true, sort_order: 0 };

export default function PartnersManager() {
  const { partners, loading, saving, create, update, remove } = useAdminPartners();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [mediaModal, setMediaModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (p: Partner) => { setForm({ ...p }); setEditId(p.id); setShowForm(true); setError(''); };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(''); setSuccess(false); };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Partner name is required.'); return; }
    setError('');
    try {
      if (editId) { await update(editId, form); }
      else { await create(form); }
      setSuccess(true);
      setTimeout(closeForm, 1000);
    } catch (err: any) { setError(err.message); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { await remove(id); } finally { setDeleting(null); setConfirmDelete(null); }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Partners' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Partners & Members</h2>
          <p className="text-gray-400 text-sm mt-0.5">{partners.length} total partners</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-[6px] border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-[6px] flex items-center justify-center border border-gray-200 flex-shrink-0 overflow-hidden">
                  {partner.logo_url
                    ? <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain p-1" />
                    : <span className="text-gray-300 text-lg font-bold">{partner.name.charAt(0)}</span>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2">{partner.name}</p>
                    {partner.is_founding && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{partner.country}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-[#001BB7]/10 text-[#001BB7] rounded-full capitalize">{partner.type}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${partner.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{partner.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              {partner.description && <p className="text-xs text-gray-500 mt-3 line-clamp-2">{partner.description}</p>}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                {partner.website_url ? (
                  <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#001BB7] hover:underline">
                    <ExternalLink className="w-3 h-3" /> Website
                  </a>
                ) : <span />}
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(partner)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setConfirmDelete(partner.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          {partners.length === 0 && !loading && (
            <div className="col-span-3 text-center py-16 text-gray-400">No partners yet. Add the first one!</div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">{editId ? 'Edit Partner' : 'Add Partner'}</h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-3 text-red-600 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
              {success && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-emerald-600 text-sm"><Check className="w-4 h-4 flex-shrink-0" />Saved!</div>}

              {/* Logo Upload via Media Library */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-[6px] border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.logo_url ? <img src={form.logo_url} alt="" className="w-full h-full object-contain p-1" /> : <ImagePlus className="w-5 h-5 text-gray-300" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => setMediaModal(true)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5">
                      <ImagePlus className="w-3.5 h-3.5" /> Select Logo
                    </button>
                    {form.logo_url && <button type="button" onClick={() => setForm((f) => ({ ...f, logo_url: '' }))} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Partner Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type || 'member'} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
                    {PARTNER_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
                  <select value={form.country || ''} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
                    <option value="">—</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Website URL</label>
                <input type="url" value={form.website_url || ''} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://…" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 resize-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_founding || false} onChange={(e) => setForm((f) => ({ ...f, is_founding: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-600">Founding Member</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-600">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order || 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-2">
              <button onClick={closeForm} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Save Changes' : 'Add Partner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {mediaModal && (
        <MediaSelectModal
          onClose={() => setMediaModal(false)}
          onSelect={(url) => { setForm((f) => ({ ...f, logo_url: url })); setMediaModal(false); }}
          allowedBuckets={['partner-logos', 'images']}
          title="Select Partner Logo"
        />
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm p-6 w-full max-w-sm">
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Delete Partner?</h3>
            <p className="text-gray-500 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={!!deleting} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
