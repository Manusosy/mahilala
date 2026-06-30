import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Program } from '../lib/database.types';

export function usePublishedPrograms(pillar?: string) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let q = supabase.from('programs').select('*').eq('is_published', true).order('sort_order');
      if (pillar) q = q.eq('pillar', pillar);
      const { data } = await q;
      setPrograms(data || []);
      setLoading(false);
    }
    fetch();
  }, [pillar]);

  return { programs, loading };
}

export function useProgramBySlug(slug: string) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetchProgram() {
      setLoading(true);
      const { data } = await supabase
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      setProgram(data || null);
      setLoading(false);
    }
    fetchProgram();
  }, [slug]);

  return { program, loading };
}

export function useAdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('programs').select('*').order('sort_order');
    setPrograms(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (payload: Partial<Program> & { name: string; slug: string; pillar: string }) => {
    setSaving(true);
    const { data, error } = await supabase.from('programs').insert(payload).select().single();
    setSaving(false);
    if (error) throw error;
    await fetchAll();
    return data;
  }, [fetchAll]);

  const update = useCallback(async (id: string, payload: Partial<Program>) => {
    setSaving(true);
    const { error } = await supabase.from('programs').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
    setSaving(false);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('programs').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { programs, loading, saving, fetchAll, create, update, remove };
}
