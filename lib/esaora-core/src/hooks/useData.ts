import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Partner, Report, GalleryItem, TeamMember, SiteSetting } from '../lib/database.types';

// ── Partners ─────────────────────────────────────────────────────────────────
export function usePublishedPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('partners').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { setPartners(data || []); setLoading(false); });
  }, []);

  return { partners, loading };
}

export function useAdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('partners').select('*').order('sort_order');
    setPartners(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (payload: Partial<Partner> & { name: string }) => {
    setSaving(true);
    const { data, error } = await supabase.from('partners').insert(payload).select().single();
    setSaving(false);
    if (error) throw error;
    await fetchAll();
    return data;
  }, [fetchAll]);

  const update = useCallback(async (id: string, payload: Partial<Partner>) => {
    setSaving(true);
    const { error } = await supabase.from('partners').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
    setSaving(false);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('partners').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { partners, loading, saving, fetchAll, create, update, remove };
}

// ── Reports ──────────────────────────────────────────────────────────────────
export function usePublishedReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('reports').select('*').eq('is_published', true).order('published_date', { ascending: false })
      .then(({ data }) => { setReports(data || []); setLoading(false); });
  }, []);

  return { reports, loading };
}

export async function incrementReportDownload(id: string, currentCount: number): Promise<void> {
  await supabase.from('reports').update({ download_count: currentCount + 1 }).eq('id', id);
}

export function useAdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    setReports(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (payload: Partial<Report> & { title: string; category: string }) => {
    setSaving(true);
    const { data, error } = await supabase.from('reports').insert(payload).select().single();
    setSaving(false);
    if (error) throw error;
    await fetchAll();
    return data;
  }, [fetchAll]);

  const update = useCallback(async (id: string, payload: Partial<Report>) => {
    setSaving(true);
    const { error } = await supabase.from('reports').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
    setSaving(false);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('reports').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  const incrementDownload = useCallback(async (id: string, currentCount: number) => {
    await supabase.from('reports').update({ download_count: currentCount + 1 }).eq('id', id);
  }, []);

  return { reports, loading, saving, fetchAll, create, update, remove, incrementDownload };
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export function usePublishedGallery(category?: string) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from('gallery_items').select('*').eq('is_published', true).order('sort_order');
    if (category) q = q.eq('category', category);
    q.then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [category]);

  return { items, loading };
}

export function useAdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (payload: Partial<GalleryItem> & { image_url: string }) => {
    const { data, error } = await supabase.from('gallery_items').insert(payload).select().single();
    if (error) throw error;
    await fetchAll();
    return data;
  }, [fetchAll]);

  const update = useCallback(async (id: string, payload: Partial<GalleryItem>) => {
    const { error } = await supabase.from('gallery_items').update(payload).eq('id', id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('gallery_items').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { items, loading, fetchAll, create, update, remove };
}

// ── Team Members ─────────────────────────────────────────────────────────────
export function usePublishedTeam(role?: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from('team_members').select('*').eq('is_active', true).order('sort_order');
    if (role) q = q.eq('role', role);
    q.then(({ data }) => { setMembers(data || []); setLoading(false); });
  }, [role]);

  return { members, loading };
}

export function useAdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('team_members').select('*').order('sort_order');
    setMembers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (payload: Partial<TeamMember> & { name: string; title: string }) => {
    setSaving(true);
    const { data, error } = await supabase.from('team_members').insert(payload).select().single();
    setSaving(false);
    if (error) throw error;
    await fetchAll();
    return data;
  }, [fetchAll]);

  const update = useCallback(async (id: string, payload: Partial<TeamMember>) => {
    setSaving(true);
    const { error } = await supabase.from('team_members').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
    setSaving(false);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('team_members').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { members, loading, saving, fetchAll, create, update, remove };
}

// ── Site Settings ─────────────────────────────────────────────────────────────
export function useSiteSettings(key?: string) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from('site_settings').select('*');
    if (key) q = q.eq('key', key);
    q.then(({ data }) => {
      const mapped: Record<string, any> = {};
      (data || []).forEach((s: SiteSetting) => { mapped[s.key] = s.value; });
      setSettings(mapped);
      setLoading(false);
    });
  }, [key]);

  const updateSetting = useCallback(async (settingKey: string, value: any) => {
    await supabase.from('site_settings')
      .upsert({ key: settingKey, value, updated_at: new Date().toISOString() });
    setSettings(prev => ({ ...prev, [settingKey]: value }));
  }, []);

  return { settings, loading, updateSetting };
}

// ── Media metadata (alt text / caption / title per stored file) ───────────────
export interface MediaMetaEntry {
  alt?: string;
  caption?: string;
  title?: string;
}

const MEDIA_META_KEY = 'media_metadata';

/**
 * Persists per-file metadata (alt text, caption, title) for files living in
 * Supabase Storage. Stored as a single JSON map in `site_settings` keyed by
 * `${bucket}/${filename}`, so no dedicated table/migration is required.
 */
export function useMediaMeta() {
  const [meta, setMeta] = useState<Record<string, MediaMetaEntry>>({});
  const [loading, setLoading] = useState(true);

  const parse = (value: any): Record<string, MediaMetaEntry> => {
    if (!value) return {};
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return {}; }
    }
    return value as Record<string, MediaMetaEntry>;
  };

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', MEDIA_META_KEY).maybeSingle()
      .then(({ data }) => {
        setMeta(parse(data?.value));
        setLoading(false);
      });
  }, []);

  const persist = useCallback(async (next: Record<string, MediaMetaEntry>) => {
    await supabase.from('site_settings').upsert({
      key: MEDIA_META_KEY,
      value: next as any,
      updated_at: new Date().toISOString(),
    });
  }, []);

  const saveMeta = useCallback(async (fileKey: string, entry: MediaMetaEntry) => {
    let next: Record<string, MediaMetaEntry> = {};
    setMeta((prev) => {
      next = { ...prev, [fileKey]: { ...prev[fileKey], ...entry } };
      return next;
    });
    await persist(next);
  }, [persist]);

  const removeMeta = useCallback(async (fileKey: string) => {
    let next: Record<string, MediaMetaEntry> = {};
    setMeta((prev) => {
      next = { ...prev };
      delete next[fileKey];
      return next;
    });
    await persist(next);
  }, [persist]);

  return { meta, loading, saveMeta, removeMeta };
}

// ── Submissions ──────────────────────────────────────────────────────────────
export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { submissions, loading, fetchAll, updateStatus };
}

export function useMembershipApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('membership_applications').select('*').order('created_at', { ascending: false });
    setApplications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = useCallback(async (id: string, status: string, notes?: string) => {
    await supabase.from('membership_applications').update({
      status,
      notes: notes || null,
      reviewed_at: new Date().toISOString()
    }).eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { applications, loading, fetchAll, updateStatus };
}

export function useNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { subscribers, loading, fetchAll };
}

// ── Upload helper ─────────────────────────────────────────────────────────────
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}
