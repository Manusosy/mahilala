import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

import { AdminLayout } from '@/admin/components/AdminLayout';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { useAdminArticles, useCategories, useTags } from '@workspace/esaora-core/hooks/useArticles';
import { supabase } from '@workspace/esaora-core/lib/supabase';
import type { Article } from '@workspace/esaora-core/lib/database.types';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link as LinkIcon,
  List, ListOrdered, Quote, Minus, Undo, Redo, ImagePlus, Table as TableIcon,
  Loader2, Save, Send, X, ChevronDown, Check, AlertCircle, ExternalLink,
  Heading1, Heading2, Heading3, Plus
} from 'lucide-react';

// ── Slug generator ────────────────────────────────────────────────────────────
function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({
  checked, onChange, color = 'bg-emerald-500'
}: { checked: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${checked ? color : 'bg-gray-200'}`}
      style={{ width: 40, height: 22 }}
    >
      <span
        className="absolute bg-white rounded-full shadow transition-transform duration-200"
        style={{
          width: 18,
          height: 18,
          top: 2,
          left: 2,
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
        }}
      />
    </button>
  );
}

// ── Toolbar Button ────────────────────────────────────────────────────────────
function ToolBtn({
  onClick, active, disabled, title, children,
}: { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-colors text-sm ${
        active ? 'bg-[#204f79] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function ArticleEditor() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const isEdit = !!id;

  const { create, update } = useAdminArticles();
  const { categories, create: createCategory } = useCategories();
  const { tags, create: createTag } = useTags();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [publishedAt, setPublishedAt] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Inline category/tag creation
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#204f79');
  const [savingCat, setSavingCat] = useState(false);

  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [savingTag, setSavingTag] = useState(false);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setSavingCat(true);
    try {
      await createCategory(newCatName.trim(), toSlug(newCatName.trim()), newCatColor);
      setNewCatName('');
      setNewCatColor('#204f79');
      setShowAddCategory(false);
    } catch (err: any) {
      setError(`Failed to add category: ${err.message}`);
    } finally {
      setSavingCat(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    setSavingTag(true);
    try {
      await createTag(newTagName.trim(), toSlug(newTagName.trim()));
      setNewTagName('');
      setShowAddTag(false);
    } catch (err: any) {
      setError(`Failed to add tag: ${err.message}`);
    } finally {
      setSavingTag(false);
    }
  };

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState<'draft' | 'publish'>('draft');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(isEdit);

  const [mediaModal, setMediaModal] = useState<{open: boolean, intendedFor: 'cover' | 'inline'} | null>(null);

  // ── TipTap Editor ───────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: 'code-block' } },
      }),
      Underline,
      TextStyle,
      Color,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Start writing your article here…' }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] px-6 py-5',
      },
    },
  });

  // ── Load existing article ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;
    async function load() {
      setLoadingArticle(true);
      const { data } = await supabase
        .from('articles')
        .select('*, article_tags(tag_id)')
        .eq('id', id)
        .single();
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setSlugEdited(true);
        setExcerpt(data.excerpt || '');
        setCategoryId(data.category_id || '');
        setCoverImageUrl(data.cover_image_url || '');
        setIsPublished(data.is_published);
        setIsFeatured(data.is_featured);
        if (data.published_at) {
            const d = new Date(data.published_at);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            setPublishedAt(d.toISOString().slice(0, 16));
        }
        setSelectedTagIds((data.article_tags || []).map((t: any) => t.tag_id));
        editor?.commands.setContent(data.body || '');
      }
      setLoadingArticle(false);
    }
    if (editor) load();
  }, [id, isEdit, editor]);

  // ── Auto-slug ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slugEdited && title) setSlug(toSlug(title));
  }, [title, slugEdited]);

  // ── Media Integration ────────────────────────────────────────────────────────
  const handleMediaSelect = (url: string) => {
    if (mediaModal?.intendedFor === 'cover') {
        setCoverImageUrl(url);
    } else if (mediaModal?.intendedFor === 'inline' && editor) {
        editor.chain().focus().setImage({ src: url }).run();
    }
    setMediaModal(null);
  };

  // ── Link insertion ─────────────────────────────────────────────────────────
  const handleSetLink = () => {
    if (!linkValue) {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: linkValue, target: '_blank' }).run();
    }
    setLinkValue('');
    setShowLinkInput(false);
  };

  // ── Internal link picker ───────────────────────────────────────────────────
  const [showInternalLinks, setShowInternalLinks] = useState(false);
  const [internalArticles, setInternalArticles] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [internalSearch, setInternalSearch] = useState('');

  useEffect(() => {
    if (!showInternalLinks) return;
    supabase.from('articles').select('id, title, slug').eq('is_published', true).then(({ data }) => {
      setInternalArticles(data || []);
    });
  }, [showInternalLinks]);

  const insertInternalLink = (slug: string, title: string) => {
    editor?.chain().focus().setLink({ href: `/news/${slug}` }).insertContent(title).run();
    setShowInternalLinks(false);
    setInternalSearch('');
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (mode: 'draft' | 'publish') => {
    setError(null);
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    if (!editor) return;

    setSaveMode(mode);
    setSaving(true);
    const body = editor.getHTML();
    const { data: { user } } = await supabase.auth.getUser();
    
    const shouldPublish = mode === 'publish';

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      body,
      category_id: categoryId || null,
      cover_image_url: coverImageUrl || null,
      author_id: user?.id || null,
      is_published: shouldPublish,
      is_featured: isFeatured,
      published_at: shouldPublish ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null,
    };

    try {
      if (isEdit && id) {
        await update(id, payload, selectedTagIds);
      } else {
        await create(payload as any, selectedTagIds);
      }
      setIsPublished(shouldPublish); // Keep toggle in sync
      setSuccess(true);
      setTimeout(() => setLocation('/admin/articles'), 1200);
    } catch (err: any) {
      setError(err.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingArticle) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Articles', href: '/admin/articles' }, { label: 'Loading…' }]}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Articles', href: '/admin/articles' },
        { label: isEdit ? 'Edit Article' : 'New Article' },
      ]}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-900 font-bold text-xl">{isEdit ? 'Edit Article' : 'New Article'}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {saving && saveMode === 'draft' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('publish')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#204f79] hover:bg-[#F78A28] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving && saveMode === 'publish' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isPublished ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-700 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded p-3 mb-4 text-emerald-700 text-sm font-medium">
          <Check className="w-4 h-4 flex-shrink-0" /> Saved successfully! Redirecting…
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── Left/Main: Title + Editor ───────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 outline-none"
            />
            {title.trim().length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-800 font-semibold flex-shrink-0">URL Slug:</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                    className="text-xs text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-gray-500 flex-1 min-w-0"
                  />
                  <span className="text-[10px] text-gray-500 font-medium">/news/{slug}</span>
                </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center gap-1">
              {/* History */}
              <ToolBtn title="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}><Undo className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}><Redo className="w-3.5 h-3.5" /></ToolBtn>

              <div className="w-px h-4 bg-gray-200 mx-0.5" />

              {/* Headings */}
              <ToolBtn title="Heading 1" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Heading 2" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Heading 3" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-3.5 h-3.5" /></ToolBtn>

              <div className="w-px h-4 bg-gray-200 mx-0.5" />

              {/* Inline marks */}
              <ToolBtn title="Bold" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Italic" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Underline" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Strikethrough" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Inline Code" active={editor?.isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()}><Code className="w-3.5 h-3.5" /></ToolBtn>

              <div className="w-px h-4 bg-gray-200 mx-0.5" />

              {/* Lists + blockquote */}
              <ToolBtn title="Bullet List" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Ordered List" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Blockquote" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote className="w-3.5 h-3.5" /></ToolBtn>
              <ToolBtn title="Horizontal Rule" onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus className="w-3.5 h-3.5" /></ToolBtn>

              <div className="w-px h-4 bg-gray-200 mx-0.5" />

              {/* Link */}
              <div className="relative">
                <ToolBtn
                  title="Insert Link"
                  active={editor?.isActive('link') || showLinkInput}
                  onClick={() => setShowLinkInput((s) => !s)}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </ToolBtn>
                {showLinkInput && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-[6px] p-3 z-30 w-72">
                    <p className="text-xs font-bold text-gray-800 mb-2">Insert Link URL</p>
                    <input
                      type="url"
                      value={linkValue}
                      onChange={(e) => setLinkValue(e.target.value)}
                      placeholder="https://…"
                      className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 mb-2"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSetLink(); }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                       <button onClick={handleSetLink} className="flex-1 bg-[#204f79] text-white rounded-[4px] py-1.5 text-xs font-semibold hover:bg-[#F78A28] transition-colors">Set Link</button>
                      {editor?.isActive('link') && (
                        <button onClick={() => { editor?.chain().focus().unsetLink().run(); setShowLinkInput(false); }} className="px-3 border border-gray-200 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors">Remove</button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Link */}
              <div className="relative">
                <ToolBtn title="Internal Link" active={showInternalLinks} onClick={() => setShowInternalLinks((s) => !s)}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </ToolBtn>
                {showInternalLinks && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-[6px] shadow-xl p-3 z-30 w-72">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Link to Article</p>
                    <input
                      value={internalSearch}
                      onChange={(e) => setInternalSearch(e.target.value)}
                      placeholder="Search articles…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-gray-400 mb-2"
                      autoFocus
                    />
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {internalArticles
                        .filter((a) => a.id !== id && (!internalSearch || a.title.toLowerCase().includes(internalSearch.toLowerCase())))
                        .map((a) => (
                          <button
                            key={a.id}
                            onClick={() => insertInternalLink(a.slug, a.title)}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {a.title}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inline Image */}
              <ToolBtn title="Insert Image" onClick={() => setMediaModal({ open: true, intendedFor: 'inline' })}>
                <ImagePlus className="w-3.5 h-3.5" />
              </ToolBtn>

              {/* Table */}
              <ToolBtn title="Insert Table" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                <TableIcon className="w-3.5 h-3.5" />
              </ToolBtn>

              {/* Character count */}
              <div className="ml-auto text-[10px] text-gray-400">
                {editor?.storage.characterCount?.words?.() ?? 0} words
              </div>
            </div>

            {/* Editor body */}
            <EditorContent editor={editor} />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">Excerpt <span className="text-gray-500 font-medium normal-case">(optional, 1–2 sentences)</span></label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="A short summary that appears in article cards and previews…"
              className="w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 outline-none focus:border-gray-500 resize-none placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* ── Right: Sidebar ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Publish Settings */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Publish Settings</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Published</span>
                <Toggle checked={isPublished} onChange={setIsPublished} color="bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Featured</span>
                <Toggle checked={isFeatured} onChange={setIsFeatured} color="bg-yellow-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Publish Date</label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded-[4px] px-3 py-2 outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Category</p>
              <button
                type="button"
                onClick={() => setShowAddCategory((s) => !s)}
                className="flex items-center gap-1 text-[10px] font-bold text-[#204f79] hover:underline"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            {showAddCategory && (
              <div className="mb-3 p-3 bg-gray-50 rounded-[4px] border border-gray-200 space-y-2">
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                  className="w-full text-xs bg-white border border-gray-300 rounded-[4px] px-2.5 py-1.5 outline-none focus:border-gray-500"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-medium text-gray-600">Colour</label>
                  <input type="color" value={newCatColor} onChange={(e) => setNewCatColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
                  <span className="text-[10px] text-gray-400 font-mono">{newCatColor}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddCategory} disabled={savingCat || !newCatName.trim()} className="flex-1 bg-[#204f79] text-white rounded-[4px] py-1.5 text-xs font-semibold hover:bg-[#F78A28] transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                    {savingCat ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Add
                  </button>
                  <button onClick={() => { setShowAddCategory(false); setNewCatName(''); }} className="px-3 border border-gray-200 rounded-[4px] text-xs text-gray-500 hover:bg-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500"
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500 mt-2">
              Or <a href="/admin/articles/categories" className="text-[#204f79] font-bold hover:underline inline-flex items-center gap-0.5">manage all categories <ExternalLink className="w-2.5 h-2.5" /></a>
            </p>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Tags</p>
              <button
                type="button"
                onClick={() => setShowAddTag((s) => !s)}
                className="flex items-center gap-1 text-[10px] font-bold text-[#204f79] hover:underline"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            {showAddTag && (
              <div className="mb-3 p-3 bg-gray-50 rounded-[4px] border border-gray-200 space-y-2">
                <input
                  type="text"
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); }}
                  className="w-full text-xs bg-white border border-gray-300 rounded-[4px] px-2.5 py-1.5 outline-none focus:border-gray-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleAddTag} disabled={savingTag || !newTagName.trim()} className="flex-1 bg-[#204f79] text-white rounded-[4px] py-1.5 text-xs font-semibold hover:bg-[#F78A28] transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                    {savingTag ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Add Tag
                  </button>
                  <button onClick={() => { setShowAddTag(false); setNewTagName(''); }} className="px-3 border border-gray-200 rounded-[4px] text-xs text-gray-500 hover:bg-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {tags.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No tags yet. Create one above.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTagIds((ids) =>
                      ids.includes(tag.id) ? ids.filter((i) => i !== tag.id) : [...ids, tag.id]
                    )}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      selectedTagIds.includes(tag.id)
                        ? 'bg-[#204f79] text-white border-[#204f79]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {selectedTagIds.includes(tag.id) && <Check className="w-2.5 h-2.5" />}
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Cover Image</p>
            {coverImageUrl ? (
              <div className="relative rounded-[6px] overflow-hidden mb-3">
                <img src={coverImageUrl} alt="Cover" className="w-full h-40 object-cover border border-gray-200" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded hover:bg-black transition-colors shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setMediaModal({ open: true, intendedFor: 'cover' })}
                className="border border-gray-300 rounded-[6px] h-32 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-all bg-white"
              >
                  <ImagePlus className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-xs font-bold text-gray-800">Select cover image</p>
              </div>
            )}
            
            {coverImageUrl && (
              <button
                type="button"
                onClick={() => setMediaModal({ open: true, intendedFor: 'cover' })}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1"
              >
                Replace image
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {mediaModal && (
          <MediaSelectModal 
             onClose={() => setMediaModal(null)} 
             onSelect={handleMediaSelect}
             allowedBuckets={['images']}
          />
      )}

      {/* Editor Styles */}
      <style>{`
        .ProseMirror { min-height: 400px; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #adb5bd; pointer-events: none; height: 0; }
        .ProseMirror h1 { font-size: 1.6rem; font-weight: 700; margin: 1.2rem 0 0.5rem; }
        .ProseMirror h2 { font-size: 1.3rem; font-weight: 700; margin: 1rem 0 0.4rem; }
        .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 0.8rem 0 0.3rem; }
        .ProseMirror blockquote { border-left: 3px solid #204f79; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1rem 0; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; }
        .ProseMirror pre.code-block { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; overflow-x: auto; }
        .ProseMirror img { max-width: 100%; border-radius: 0.5rem; margin: 0.5rem 0; }
        .ProseMirror a { color: #204f79; text-decoration: underline; }
        .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        .ProseMirror table td, .ProseMirror table th { border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; text-align: left; }
        .ProseMirror table th { background: #f8fafc; font-weight: 600; }
        .ProseMirror hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5rem 0; }
      `}</style>
    </AdminLayout>
  );
}
