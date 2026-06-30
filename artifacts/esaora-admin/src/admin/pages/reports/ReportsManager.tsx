import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { useAdminReports } from '@workspace/esaora-core/hooks/useData';
import type { Report } from '@workspace/esaora-core/lib/database.types';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, X, ImagePlus, Check, FileText, Download } from 'lucide-react';

const CATEGORIES = ['Annual Report', 'Research Paper', 'Policy Brief', 'Impact Review'];

type FormState = Partial<Report> & { title: string; category: string };
const getLocalDate = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const EMPTY: FormState = { 
    title: '', category: 'Annual Report', report_type: '', description: '', 
    file_url: '', cover_image_url: '', page_count: 0, 
    published_date: getLocalDate(), is_published: true, is_featured: false, color: '#001BB7' 
};

export default function ReportsManager() {
  const { reports, loading, saving, create, update, remove } = useAdminReports();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Media modals state
  const [mediaModal, setMediaModal] = useState<{ open: boolean; type: 'cover' | 'file' } | null>(null);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); setSuccess(false); };
  const openEdit = (r: Report) => { setForm({ ...r }); setEditId(r.id); setShowForm(true); setError(''); setSuccess(false); };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const handleMediaSelect = (url: string) => {
      if (mediaModal?.type === 'cover') {
          setForm(f => ({ ...f, cover_image_url: url }));
      } else if (mediaModal?.type === 'file') {
          setForm(f => ({ ...f, file_url: url }));
      }
      setMediaModal(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim()) { setError('Title and category are required.'); return; }
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
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Reports' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Reports & Publications</h2>
          <p className="text-gray-400 text-sm mt-0.5">{reports.length} documents published</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Report
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-[6px] border border-gray-200 p-5 flex gap-4">
              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center border border-gray-200">
                  {r.cover_image_url ? (
                      <img src={r.cover_image_url} alt={r.title} className="w-full h-full object-cover" />
                  ) : (
                      <FileText className="w-8 h-8 text-gray-300" />
                  )}
                  {!r.is_published && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="bg-white/90 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">DRAFT</span>
                      </div>
                  )}
              </div>
              <div className="flex-1 min-w-0 py-1">
                 <div className="flex items-start justify-between gap-2">
                     <div className="min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${r.color}20`, color: r.color }}>{r.category}</span>
                             {r.is_featured && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Featured</span>}
                         </div>
                         <h3 className="font-bold text-gray-900 leading-tight truncate" title={r.title}>{r.title}</h3>
                         <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description || 'No description provided.'}</p>
                     </div>
                 </div>
                 
                 <div className="mt-4 flex items-center justify-between">
                     <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                         <span className="flex items-center gap-1.5 font-bold text-gray-600">
                           <Download className="w-3.5 h-3.5 text-gray-400" />
                           {r.download_count.toLocaleString()} 
                           <span className="font-normal text-gray-400">{r.download_count === 1 ? 'download' : 'downloads'}</span>
                         </span>
                         {r.file_url && <a href={r.file_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View PDF</a>}
                     </div>
                     <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                     </div>
                 </div>
              </div>
            </div>
          ))}
          {reports.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">No reports found.</div>}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">{editId ? 'Edit Report' : 'Add Report'}</h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-3 text-red-600 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
              {success && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-emerald-600 text-sm"><Check className="w-4 h-4 flex-shrink-0" />Saved!</div>}

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Report Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Category *</label>
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Publish Date</label>
                    <input type="date" value={form.published_date || ''} onChange={(e) => setForm((f) => ({ ...f, published_date: e.target.value }))} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500" />
                  </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows={3} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  {/* Document Select */}
                  <div className="border border-gray-200 rounded-[6px] p-4 bg-white">
                     <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Document File</p>
                     {form.file_url ? (
                         <div className="flex flex-col gap-2">
                            <a href={form.file_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline truncate font-medium">{form.file_url.split('/').pop()}</a>
                            <div className="flex gap-2 mt-1">
                                <button type="button" onClick={() => setMediaModal({ open: true, type: 'file' })} className="text-xs text-gray-600 hover:text-gray-900 font-semibold">Replace</button>
                                <button type="button" onClick={() => setForm(f => ({ ...f, file_url: '' }))} className="text-xs text-red-600 hover:text-red-800 font-semibold">Remove</button>
                            </div>
                         </div>
                     ) : (
                         <button type="button" onClick={() => setMediaModal({ open: true, type: 'file' })} className="w-full py-3 bg-white border border-gray-300 hover:border-gray-500 rounded-[6px] text-sm text-gray-700 transition-colors flex flex-col items-center gap-1 font-medium">
                            <FileText className="w-5 h-5 text-gray-600" /> Select PDF
                         </button>
                     )}
                  </div>
                  
                  {/* Cover Select */}
                  <div className="border border-gray-200 rounded-[6px] p-4 bg-white">
                     <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Cover Image</p>
                     {form.cover_image_url ? (
                         <div className="flex flex-col gap-2">
                            <img src={form.cover_image_url} alt="Cover Preview" className="h-20 w-16 object-cover border border-gray-200 rounded-[4px]" />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setMediaModal({ open: true, type: 'cover' })} className="text-xs text-gray-600 hover:text-gray-900 font-semibold">Replace</button>
                                <button type="button" onClick={() => setForm(f => ({ ...f, cover_image_url: '' }))} className="text-xs text-red-600 hover:text-red-800 font-semibold">Remove</button>
                            </div>
                         </div>
                     ) : (
                         <button type="button" onClick={() => setMediaModal({ open: true, type: 'cover' })} className="w-full py-3 bg-white border border-gray-300 hover:border-gray-500 rounded-[6px] text-sm text-gray-700 transition-colors flex flex-col items-center gap-1 font-medium">
                            <ImagePlus className="w-5 h-5 text-gray-600" /> Select Cover
                         </button>
                     )}
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-[4px] border border-gray-200">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded border-gray-300" />
                    <span className="text-sm font-semibold text-gray-800">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-[4px] border border-gray-200">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="rounded border-gray-300" />
                    <span className="text-sm font-semibold text-gray-800">Featured</span>
                  </label>
              </div>

            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
              <button onClick={closeForm} className="flex-1 py-2.5 border border-gray-300 bg-white rounded-[4px] text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-[4px] text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Save Changes' : 'Publish Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Selection Modal */}
      {mediaModal && (
          <MediaSelectModal 
              onClose={() => setMediaModal(null)}
              onSelect={handleMediaSelect}
              allowedBuckets={mediaModal.type === 'cover' ? ['images'] : ['documents']}
              title={mediaModal.type === 'cover' ? "Select Cover Image" : "Select Document File"}
          />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm border border-gray-200 p-6 w-full max-w-sm">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Delete Report?</h3>
            <p className="text-gray-600 text-sm mb-5 font-medium">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-300 bg-white rounded-[4px] text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={!!deleting} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-[4px] text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
