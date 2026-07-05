import { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useCategories, useTags } from '@workspace/esaora-core/hooks/useArticles';
import { Plus, Trash2, Loader2, AlertCircle, Tag } from 'lucide-react';

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const PRESET_COLORS = [
  '#204f79', '#22C55E', '#F59E0B', '#8B5CF6', '#204f79',
  '#EF4444', '#F97316', '#06B6D4', '#6366F1', '#14B8A6',
];

export default function CategoriesPage() {
  const { categories, loading: catLoading, create: createCat, remove: removeCat } = useCategories();
  const { tags, loading: tagLoading, create: createTag, remove: removeTag } = useTags();

  // Category form
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#204f79');
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState('');

  // Tag form
  const [tagName, setTagName] = useState('');
  const [tagSaving, setTagSaving] = useState(false);
  const [tagError, setTagError] = useState('');

  const [deleting, setDeleting] = useState<string | null>(null);

  const handleCreateCat = async () => {
    if (!catName.trim()) { setCatError('Name is required'); return; }
    setCatError('');
    setCatSaving(true);
    try {
      await createCat(catName.trim(), toSlug(catName), catColor);
      setCatName('');
    } catch (e: any) { setCatError(e.message); }
    finally { setCatSaving(false); }
  };

  const handleCreateTag = async () => {
    if (!tagName.trim()) { setTagError('Name is required'); return; }
    setTagError('');
    setTagSaving(true);
    try {
      await createTag(tagName.trim(), toSlug(tagName));
      setTagName('');
    } catch (e: any) { setTagError(e.message); }
    finally { setTagSaving(false); }
  };

  const handleDelete = async (type: 'cat' | 'tag', id: string) => {
    setDeleting(id);
    try {
      if (type === 'cat') await removeCat(id);
      else await removeTag(id);
    } finally { setDeleting(null); }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Articles', href: '/admin/articles' }, { label: 'Categories & Tags' }]}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Categories */}
        <div className="bg-white rounded-[6px] border border-gray-200 p-6">
          <h3 className="text-gray-900 font-bold text-base mb-1">Categories</h3>
          <p className="text-gray-400 text-sm mb-5">Organise articles into broad categories with colour coding.</p>

          {/* Add form */}
          <div className="bg-gray-50 rounded-[6px] p-4 mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Category</p>
            <input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Announcements"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 mb-3"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCat(); }}
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCatColor(c)}
                  className={`w-6 h-6 rounded-full transition-all ${catColor === c ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input type="color" value={catColor} onChange={(e) => setCatColor(e.target.value)} className="w-6 h-6 rounded-full border-none cursor-pointer" title="Custom colour" />
            </div>
            {catError && <p className="text-red-500 text-xs mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{catError}</p>}
            <button
              onClick={handleCreateCat}
              disabled={catSaving}
              className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {catSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Category
            </button>
          </div>

          {/* List */}
          {catLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-gray-700 flex-1 font-medium">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.slug}</span>
                  <button
                    onClick={() => handleDelete('cat', cat.id)}
                    disabled={deleting === cat.id}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    title="Delete"
                  >
                    {deleting === cat.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No categories yet.</p>}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white rounded-[6px] border border-gray-200 p-6">
          <h3 className="text-gray-900 font-bold text-base mb-1 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400" />Tags</h3>
          <p className="text-gray-400 text-sm mb-5">Fine-grained labels for filtering articles by topic or region.</p>

          {/* Add form */}
          <div className="bg-gray-50 rounded-[6px] p-4 mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Tag</p>
            <input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g. Marine Conservation"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 mb-3"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateTag(); }}
            />
            {tagError && <p className="text-red-500 text-xs mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{tagError}</p>}
            <button
              onClick={handleCreateTag}
              disabled={tagSaving}
              className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {tagSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Tag
            </button>
          </div>

          {/* Tags cloud */}
          {tagLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="group flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors">
                  <span className="text-sm text-gray-600 group-hover:text-red-600 transition-colors">{tag.name}</span>
                  <button
                    onClick={() => handleDelete('tag', tag.id)}
                    disabled={deleting === tag.id}
                    className="text-gray-300 group-hover:text-red-400 transition-colors"
                  >
                    {deleting === tag.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              ))}
              {tags.length === 0 && <p className="text-gray-400 text-sm">No tags yet.</p>}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
