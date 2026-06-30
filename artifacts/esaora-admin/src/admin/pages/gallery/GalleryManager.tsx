import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { useAdminGallery } from '@workspace/esaora-core/hooks/useData';
import type { GalleryItem } from '@workspace/esaora-core/lib/database.types';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, X, ImagePlus, Check, Navigation, Layers } from 'lucide-react';

const CATEGORIES = ['Conferences', 'Field Projects', 'Workshops', 'General'];

type FormState = Partial<GalleryItem> & { image_url: string };
const EMPTY: FormState = { image_url: '', caption: '', category: 'Conferences', country: '', sort_order: 0, is_published: true };

export function GalleryPanel() {
  const { items, loading, create, update, remove } = useAdminGallery();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); setSuccess(false); setMultiSelectMode(false); };
  const openMultiAdd = () => { setMultiSelectMode(true); setMediaModal(true); };
  const openEdit = (item: GalleryItem) => { setForm({ ...item }); setEditId(item.id); setShowForm(true); setError(''); setSuccess(false); setMultiSelectMode(false); };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const handleSave = async () => {
    if (!form.image_url.trim()) { setError('An image must be selected.'); return; }
    setError(''); setSaving(true);
    try {
      if (editId) { await update(editId, form); } else { await create(form); }
      setSuccess(true); setTimeout(closeForm, 800);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleMultiSave = async (urls: string[]) => {
      setSaving(true);
      setError('');
      try {
          // Process sequentially to avoid Supabase rate limits or RLS issues in broad bursts
          for (const url of urls) {
              await create({
                  image_url: url,
                  category: 'General',
                  is_published: true,
                  sort_order: 0
              });
          }
          setSuccess(true);
          setMediaModal(false);
          setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
          setError(`Partial failure: ${err.message}`);
      } finally {
          setSaving(false);
          setMultiSelectMode(false);
      }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { await remove(id); } finally { setDeleting(null); setConfirmDelete(null); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-lg">Public Gallery</h2>
          <p className="text-gray-400 text-sm mt-0.5">{items.length} assets documented</p>
        </div>
        <div className="flex gap-2">
            <button onClick={openMultiAdd} disabled={saving} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#001BB7]" /> : <Layers className="w-4 h-4 text-[#001BB7]" />} {saving ? 'Uploading…' : 'Bulk Upload'}
            </button>
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
              <Plus className="w-4 h-4" /> Add Single
            </button>
        </div>
      </div>

      {error && !showForm && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-medium">
              <AlertCircle className="w-4 h-4" /> {error}
          </div>
      )}
      
      {success && !showForm && (
          <div className="mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-700 text-sm font-medium">
              <Check className="w-4 h-4" /> Batch update successful!
          </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-[6px] border border-gray-200 overflow-hidden group relative flex flex-col hover:border-[#001BB7]/50 transition-all shadow-sm hover:shadow-md">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {item.image_url ? (
                      <img src={item.image_url} alt={item.caption || "Gallery item"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  ) : (
                      <div className="flex items-center justify-center h-full"><ImagePlus className="w-8 h-8 text-gray-300" /></div>
                  )}
                  {!item.is_published && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="bg-white/90 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">DRAFT</span>
                      </div>
                  )}
                  <div className="absolute top-2 left-2">
                       <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">{item.category}</span>
                  </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                 <div>
                     <p className="text-[11px] text-gray-800 font-bold leading-relaxed line-clamp-2 italic" title={item.caption || ''}>
                         {item.caption || <span className="text-gray-300">No description...</span>}
                     </p>
                     {item.country && <p className="text-[9px] font-black text-[#001BB7] uppercase tracking-widest mt-2 flex items-center gap-1.5"><Navigation className="w-3 h-3" /> {item.country}</p>}
                 </div>
                 
                 <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order: {item.sort_order}</span>
                     <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} title="Edit Details" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete(item.id)} title="Remove Asset" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                     </div>
                 </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-center py-20 bg-gray-50 rounded-[6px] border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-xs">No assets curated yet.</div>}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] ps-shadow-none border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 font-display">{editId ? 'Edit Documentation' : 'Add Field Asset'}</h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="px-6 py-5 space-y-5">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-[4px] p-3 text-red-700 text-[11px] font-black uppercase tracking-widest"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
              {success && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-[4px] p-3 text-emerald-700 text-[11px] font-black uppercase tracking-widest"><Check className="w-4 h-4 flex-shrink-0" />DOCUMENTATION SAVED</div>}

              {/* Image Select */}
              <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Visual Asset *</label>
                  {form.image_url ? (
                      <div className="relative rounded-lg overflow-hidden aspect-[21/9] border border-gray-200 group">
                          <img src={form.image_url} alt="Selected" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button type="button" onClick={() => setMediaModal(true)} className="px-4 py-2 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-gray-100">Change Alignment</button>
                          </div>
                      </div>
                  ) : (
                      <button type="button" onClick={() => setMediaModal(true)} className="w-full h-40 bg-gray-50 border border-dashed border-gray-300 hover:border-brand-cyan rounded-lg text-[10px] text-gray-400 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer font-black uppercase tracking-widest">
                          <ImagePlus className="w-8 h-8 text-gray-300" /> Browse Library
                      </button>
                  )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Caption / Narrative</label>
                <textarea rows={3} value={form.caption || ''} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-brand-cyan transition-colors resize-none font-medium" placeholder="Describe the scene or event context..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Thematic Category</label>
                    <select value={form.category || ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-cyan transition-colors font-bold">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Geography</label>
                    <input type="text" value={form.country || ''} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-cyan transition-colors font-bold" placeholder="e.g. Kenya" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded border-gray-300 text-brand-navy focus:ring-brand-cyan" />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Public Visibility</span>
                  </label>
                  <div>
                      <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Grid Priority</label>
                      <input type="number" value={form.sort_order || 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 font-bold outline-none" />
                  </div>
              </div>

            </div>
            <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-200 flex gap-3">
              <button onClick={closeForm} className="flex-1 py-3 border border-gray-200 bg-white rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors">Abort</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98]">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Update Record' : 'Record Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Selection Modal */}
      {mediaModal && (
          <MediaSelectModal 
              onClose={() => { setMediaModal(false); setMultiSelectMode(false); }}
              onSelect={multiSelectMode ? undefined : (url) => {
                  setForm(f => ({ ...f, image_url: url }));
                  setMediaModal(false);
              }}
              onSelectMultiple={multiSelectMode ? handleMultiSave : undefined}
              multiSelect={multiSelectMode}
              saving={saving}
              allowedBuckets={['images']}
              title={multiSelectMode ? "Bulk Documentation Upload" : "Select Gallery Image"}
          />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm border border-gray-200 p-8 w-full max-w-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-5" />
            <h3 className="font-bold text-gray-900 text-lg mb-2 font-display uppercase tracking-tight">Erase Asset?</h3>
            <p className="text-gray-400 text-[10px] mb-8 font-black uppercase tracking-[0.15em] leading-relaxed">This visual documentation will be permanently removed from the public record.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 border border-gray-200 rounded-lg text-[10px] text-gray-400 font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Keep Asset</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={!!deleting} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Erase Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GalleryManager() {
  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Gallery' }]}>
      <GalleryPanel />
    </AdminLayout>
  );
}
