import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Article, Category, Tag } from '../lib/database.types';

// ── Public hook: fetch published articles ───────────────────────────────────
export function usePublishedArticles(limit = 12, categorySlug?: string) {
  const [articles, setArticles] = useState<(Article & { categories: Category | null; tags: Tag[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select(`*, categories(*), article_tags(tags(*)), author:admin_profiles!author_id(full_name, avatar_url)`)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (categorySlug) {
        const { data: cat } = await supabase
          .from('categories').select('id').eq('slug', categorySlug).single();
        if (cat) query = query.eq('category_id', cat.id);
      }

      const { data, error } = await query;
      if (error) { setError(error.message); } else {
        const mapped = (data || []).map((a: any) => ({
          ...a,
          categories: a.categories,
          author: a.author,
          tags: (a.article_tags || []).map((at: any) => at.tags).filter(Boolean),
        }));
        setArticles(mapped);
      }
      setLoading(false);
    }
    fetchArticles();
  }, [limit, categorySlug]);

  return { articles, loading, error };
}

// ── Public hook: fetch single article by slug ───────────────────────────────
export function useArticleBySlug(slug: string) {
  const [article, setArticle] = useState<(Article & { categories: Category | null; tags: Tag[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchArticle() {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select(`*, categories(*), article_tags(tags(*)), author:admin_profiles!author_id(full_name, avatar_url)`)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) { setError(error.message); } else if (data) {
        setArticle({
          ...data,
          categories: (data as any).categories,
          author: (data as any).author,
          tags: ((data as any).article_tags || []).map((at: any) => at.tags).filter(Boolean),
        });
        // Increment view count via secure RPC
        supabase.rpc('increment_article_view', { article_id: data.id }).then(({ error: rpcError }) => {
          if (rpcError) console.error('Failed to increment view count:', rpcError);
        });
      }
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  return { article, loading, error };
}

// ── Admin hook: full CRUD for articles ──────────────────────────────────────
export function useAdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('*, categories(name, color)')
      .order('created_at', { ascending: false });
    setArticles((data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (payload: Partial<Article> & { title: string; slug: string; body: string }, tagIds: string[]) => {
    setSaving(true);
    const { data, error } = await supabase
      .from('articles')
      .insert({ ...payload, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) { setSaving(false); throw error; }

    if (tagIds.length > 0) {
      await supabase.from('article_tags').insert(tagIds.map(tid => ({ article_id: data.id, tag_id: tid })));
    }
    setSaving(false);
    await fetchAll();
    return data;
  }, [fetchAll]);

  const update = useCallback(async (id: string, payload: Partial<Article>, tagIds?: string[]) => {
    setSaving(true);
    const { error } = await supabase
      .from('articles')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { setSaving(false); throw error; }

    if (tagIds !== undefined) {
      await supabase.from('article_tags').delete().eq('article_id', id);
      if (tagIds.length > 0) {
        await supabase.from('article_tags').insert(tagIds.map(tid => ({ article_id: id, tag_id: tid })));
      }
    }
    setSaving(false);
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('article_tags').delete().eq('article_id', id);
    await supabase.from('articles').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  const publish = useCallback(async (id: string, publish: boolean) => {
    await update(id, {
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    });
  }, [update]);

  return { articles, loading, saving, fetchAll, create, update, remove, publish };
}

// ── Admin hook: categories ──────────────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (name: string, slug: string, color: string) => {
    const { error } = await supabase.from('categories').insert({ name, slug, color });
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { categories, loading, fetchAll, create, remove };
}

// ── Admin hook: tags ────────────────────────────────────────────────────────
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('tags').select('*').order('name');
    setTags(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (name: string, slug: string) => {
    const { error } = await supabase.from('tags').insert({ name, slug });
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('tags').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { tags, loading, fetchAll, create, remove };
}
