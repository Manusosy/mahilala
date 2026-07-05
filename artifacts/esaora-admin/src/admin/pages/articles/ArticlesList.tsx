import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useAdminArticles, useCategories } from '@workspace/esaora-core/hooks/useArticles';
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, EyeOff,
  Star, StarOff, Loader2, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

const PAGE_SIZE = 15;

export default function ArticlesList() {
  const { articles, loading, remove, publish, update } = useAdminArticles();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filtered + paginated
  const filtered = articles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || a.category_id === filterCat;
    const matchStatus = !filterStatus
      || (filterStatus === 'published' && a.is_published)
      || (filterStatus === 'draft' && !a.is_published);
    return matchSearch && matchCat && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { await remove(id); } finally { setDeleting(null); setConfirmDelete(null); }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await publish(id, !current);
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await update(id, { is_featured: !current });
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Articles' }]}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Articles & News</h2>
          <p className="text-gray-400 text-sm mt-0.5">{articles.length} total articles</p>
        </div>
        <Link href="/admin/articles/new">
          <button className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[6px] border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search articles…"
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No articles found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || filterCat || filterStatus ? 'Try adjusting your filters' : 'Create your first article to get started'}
            </p>
            {!search && !filterCat && !filterStatus && (
              <Link href="/admin/articles/new">
                <button className="mt-4 px-4 py-2 bg-[#204f79] text-white rounded-lg text-sm font-semibold hover:bg-[#F78A28] transition-colors">
                  Create First Article
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Article</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Views</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((article) => {
                  const cat = catMap[article.category_id || ''];
                  return (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {article.cover_image_url && (
                            <img
                              src={article.cover_image_url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{article.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{article.excerpt || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        {cat ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                          >
                            {cat.name}
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-400">
                        {formatDate(article.published_at || article.created_at)}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-500">
                        {article.view_count.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          article.is_published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {article.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleFeatured(article.id, article.is_featured)}
                            title={article.is_featured ? 'Unfeature' : 'Feature'}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                          >
                            {article.is_featured ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleTogglePublish(article.id, article.is_published)}
                            title={article.is_published ? 'Unpublish' : 'Publish'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              article.is_published
                                ? 'text-emerald-500 hover:bg-emerald-50'
                                : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'
                            }`}
                          >
                            {article.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <button title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(article.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${page === i + 1 ? 'bg-[#204f79] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[6px] shadow-sm p-6 w-full max-w-sm">
            <div className="w-10 h-10 bg-red-100 rounded-[6px] flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Article?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone. The article will be permanently removed.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleting === confirmDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
