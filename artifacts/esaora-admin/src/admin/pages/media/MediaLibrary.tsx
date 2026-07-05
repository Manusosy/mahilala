import { useState, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useStorage, getPublicUrl } from '@workspace/esaora-core/hooks/useStorage';
import { useMediaMeta } from '@workspace/esaora-core/hooks/useData';
import { GalleryPanel } from '@/admin/pages/gallery/GalleryManager';
import {
  Loader2, Copy, Trash2, ImagePlus, Check, AlertCircle, File as FileIcon,
  Search, LayoutGrid, List as ListIcon, Upload, X, ExternalLink, Save,
} from 'lucide-react';

const MEDIA_TABS: { id: string; label: string; bucket: string | null }[] = [
  { id: 'images', label: 'Images', bucket: 'images' },
  { id: 'documents', label: 'Documents', bucket: 'documents' },
  { id: 'partner-logos', label: 'Partner Logos', bucket: 'partner-logos' },
  { id: 'team-photos', label: 'Team Photos', bucket: 'team-photos' },
  { id: 'gallery', label: 'Gallery', bucket: null },
];

const isImageFile = (name: string) => /\.(jpe?g|png|gif|webp|svg|avif|bmp|ico)$/i.test(name);

function formatFileSize(bytes: number) {
  if (!bytes) return '—';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function MediaLibraryPage() {
  const [location] = useLocation();
  const [tab, setTab] = useState(() => (location.startsWith('/admin/gallery') ? 'gallery' : 'images'));
  const active = MEDIA_TABS.find((t) => t.id === tab) || MEDIA_TABS[0];

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Media' }]}>
      <div className="mb-5">
        <h2 className="text-gray-900 font-bold text-xl">Media Library</h2>
        <p className="text-gray-400 text-sm mt-0.5">Manage uploaded files, documents, and the public gallery.</p>
      </div>

      {/* Single clean tab row — no dropdown */}
      <div className="flex items-center gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
        {MEDIA_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold -mb-px border-b-2 whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'border-[#204f79] text-[#204f79]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active.bucket ? <MediaLibraryPanel key={active.bucket} bucket={active.bucket} /> : <GalleryPanel />}
    </AdminLayout>
  );
}

function MediaLibraryPanel({ bucket }: { bucket: string }) {
  const { files, loading, error, uploading, uploadFile, deleteFile } = useStorage(bucket);
  const { meta, saveMeta, removeMeta } = useMediaMeta();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<{ names: string[] } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const metaKey = (name: string) => `${bucket}/${name}`;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    for (let i = 0; i < fileList.length; i++) {
      await uploadFile(fileList[i]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyUrl = (name: string) => {
    navigator.clipboard.writeText(getPublicUrl(bucket, name));
    setCopiedUrl(name);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const runDelete = async (names: string[]) => {
    setDeleting(true);
    try {
      for (const name of names) {
        await deleteFile(name);
        await removeMeta(metaKey(name));
      }
      setChecked(new Set());
      if (selected && names.includes(selected)) setSelected(null);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const toggleChecked = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => {
      const m = meta[`${bucket}/${f.name}`] || {};
      return (
        f.name.toLowerCase().includes(q) ||
        (m.alt || '').toLowerCase().includes(q) ||
        (m.caption || '').toLowerCase().includes(q) ||
        (m.title || '').toLowerCase().includes(q)
      );
    });
  }, [files, search, meta, bucket]);

  const selectedFile = files.find((f) => f.name === selected) || null;

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md p-3 text-red-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name, alt text, or caption…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md outline-none focus:border-[#204f79] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">Showing {filtered.length} of {files.length}</span>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setView('grid')}
              title="Grid view"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view === 'grid' ? 'bg-[#204f79] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Grid
            </button>
            <button
              onClick={() => setView('list')}
              title="List view"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors border-l border-gray-300 ${view === 'list' ? 'bg-[#204f79] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <ListIcon className="w-4 h-4" /> List
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Add New'}
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Bulk action bar */}
      {checked.size > 0 && (
        <div className="flex items-center justify-between bg-[#204f79]/5 border border-[#204f79]/20 rounded-md px-4 py-2.5 mb-4">
          <span className="text-sm font-semibold text-[#204f79]">{checked.size} selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setChecked(new Set())} className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-2 py-1">Clear</button>
            <button
              onClick={() => setConfirmDelete({ names: Array.from(checked) })}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-md border border-gray-200 min-h-[460px] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[460px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300 mb-2" />
            <span className="text-gray-400 text-sm">Loading media…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[460px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <ImagePlus className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">{search ? 'No files match your search' : 'No files in this bucket'}</p>
            <p className="text-gray-400 text-sm mt-1">{search ? 'Try a different term.' : 'Use “Add New” to upload.'}</p>
          </div>
        ) : view === 'grid' ? (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map((file) => {
              const url = getPublicUrl(bucket, file.name);
              const img = isImageFile(file.name);
              const isChecked = checked.has(file.name);
              const isOpen = selected === file.name;
              return (
                <div
                  key={file.name}
                  onClick={() => setSelected(file.name)}
                  className={`group relative border rounded-md overflow-hidden bg-gray-50 cursor-pointer transition-all ${isOpen ? 'border-[#204f79] ring-2 ring-[#204f79]/30' : 'border-gray-200 hover:border-[#204f79]'}`}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img src={url} alt={meta[`${bucket}/${file.name}`]?.alt || file.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <FileIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute top-2 left-2 w-5 h-5 rounded-[4px] border flex items-center justify-center cursor-pointer transition-all ${isChecked ? 'bg-[#204f79] border-[#204f79]' : 'bg-white/90 border-gray-300 opacity-0 group-hover:opacity-100'}`}
                  >
                    <input type="checkbox" checked={isChecked} onChange={() => toggleChecked(file.name)} className="hidden" />
                    {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                  </label>
                  <div className="px-2 py-1.5 border-t border-gray-100 bg-white">
                    <p className="text-[11px] font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-2 py-3">File</th>
                  <th className="px-2 py-3 hidden md:table-cell">Alt text</th>
                  <th className="px-2 py-3 hidden lg:table-cell">Caption</th>
                  <th className="px-2 py-3 hidden sm:table-cell">Size</th>
                  <th className="px-2 py-3 hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((file) => {
                  const url = getPublicUrl(bucket, file.name);
                  const img = isImageFile(file.name);
                  const m = meta[`${bucket}/${file.name}`] || {};
                  const isChecked = checked.has(file.name);
                  return (
                    <tr
                      key={file.name}
                      onClick={() => setSelected(file.name)}
                      className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selected === file.name ? 'bg-[#204f79]/5' : ''}`}
                    >
                      <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={() => toggleChecked(file.name)} className="rounded border-gray-300 text-[#204f79] focus:ring-[#204f79]" />
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {img ? <img src={url} alt={m.alt || file.name} className="w-full h-full object-cover" loading="lazy" /> : <FileIcon className="w-5 h-5 text-gray-300" />}
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-[220px]" title={file.name}>{file.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 hidden md:table-cell text-gray-500 truncate max-w-[160px]">{m.alt || <span className="text-gray-300">—</span>}</td>
                      <td className="px-2 py-2.5 hidden lg:table-cell text-gray-500 truncate max-w-[200px]">{m.caption || <span className="text-gray-300">—</span>}</td>
                      <td className="px-2 py-2.5 hidden sm:table-cell text-gray-500 whitespace-nowrap">{formatFileSize(file.metadata?.size || 0)}</td>
                      <td className="px-2 py-2.5 hidden sm:table-cell text-gray-400 whitespace-nowrap">{file.created_at ? new Date(file.created_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleCopyUrl(file.name)} title="Copy URL" className="p-1.5 rounded text-gray-400 hover:text-[#204f79] hover:bg-gray-100 transition-colors">
                            {copiedUrl === file.name ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a href={url} target="_blank" rel="noreferrer" title="Open" className="p-1.5 rounded text-gray-400 hover:text-[#204f79] hover:bg-gray-100 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button onClick={() => setConfirmDelete({ names: [file.name] })} title="Delete" className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {selectedFile && (
        <AttachmentDetails
          key={selectedFile.name}
          bucket={bucket}
          fileName={selectedFile.name}
          size={selectedFile.metadata?.size || 0}
          createdAt={selectedFile.created_at}
          url={getPublicUrl(bucket, selectedFile.name)}
          initial={meta[`${bucket}/${selectedFile.name}`] || {}}
          onSave={(entry) => saveMeta(`${bucket}/${selectedFile.name}`, entry)}
          onCopy={() => handleCopyUrl(selectedFile.name)}
          copied={copiedUrl === selectedFile.name}
          onDelete={() => setConfirmDelete({ names: [selectedFile.name] })}
          onClose={() => setSelected(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl p-6 w-full max-w-sm">
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">
              Delete {confirmDelete.names.length > 1 ? `${confirmDelete.names.length} files` : 'file'}?
            </h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone. Any pages referencing these URLs will break.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={() => runDelete(confirmDelete.names)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AttachmentDetails({
  bucket, fileName, size, createdAt, url, initial, onSave, onCopy, copied, onDelete, onClose,
}: {
  bucket: string;
  fileName: string;
  size: number;
  createdAt: string;
  url: string;
  initial: { alt?: string; caption?: string; title?: string };
  onSave: (entry: { alt?: string; caption?: string; title?: string }) => Promise<void> | void;
  onCopy: () => void;
  copied: boolean;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [alt, setAlt] = useState(initial.alt || '');
  const [caption, setCaption] = useState(initial.caption || '');
  const [title, setTitle] = useState(initial.title || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dims, setDims] = useState<string>('');

  const img = isImageFile(fileName);
  const ext = fileName.split('.').pop()?.toUpperCase() || '';
  const dirty = alt !== (initial.alt || '') || caption !== (initial.caption || '') || title !== (initial.title || '');

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ alt, caption, title });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-900">Attachment details</h3>
          <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center min-h-[180px]">
            {img ? (
              <img
                src={url}
                alt={alt || fileName}
                className="max-h-[260px] w-auto object-contain"
                onLoad={(e) => {
                  const t = e.currentTarget;
                  if (t.naturalWidth) setDims(`${t.naturalWidth} × ${t.naturalHeight} px`);
                }}
              />
            ) : (
              <div className="py-12 flex flex-col items-center text-gray-300">
                <FileIcon className="w-12 h-12" />
                <span className="text-xs font-semibold mt-2 text-gray-500">{ext}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1.5">
            <div className="flex justify-between gap-3"><span className="text-gray-400">File name</span><span className="font-medium text-gray-700 truncate max-w-[220px]" title={fileName}>{fileName}</span></div>
            <div className="flex justify-between gap-3"><span className="text-gray-400">Type</span><span className="font-medium text-gray-700">{ext || '—'}</span></div>
            <div className="flex justify-between gap-3"><span className="text-gray-400">Bucket</span><span className="font-medium text-gray-700">{bucket}</span></div>
            <div className="flex justify-between gap-3"><span className="text-gray-400">Size</span><span className="font-medium text-gray-700">{formatFileSize(size)}</span></div>
            {dims && <div className="flex justify-between gap-3"><span className="text-gray-400">Dimensions</span><span className="font-medium text-gray-700">{dims}</span></div>}
            <div className="flex justify-between gap-3"><span className="text-gray-400">Uploaded</span><span className="font-medium text-gray-700">{createdAt ? new Date(createdAt).toLocaleString() : '—'}</span></div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Alt text</label>
              <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for SEO & accessibility" className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#204f79] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#204f79] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Caption</label>
              <textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional caption for articles & galleries" className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#204f79] transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">File URL</label>
              <div className="flex items-center gap-2">
                <input readOnly value={url} className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-500 outline-none truncate" />
                <button onClick={onCopy} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:border-[#204f79] hover:text-[#204f79] transition-colors whitespace-nowrap">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onDelete} className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete permanently
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-4 py-2 bg-[#204f79] hover:bg-[#F78A28] text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
