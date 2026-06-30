import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileObject } from '@supabase/storage-js';

const VALID_BUCKETS = ['images', 'documents', 'partner-logos', 'team-photos'];

export function useStorage(bucketName: string) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    if (!VALID_BUCKETS.includes(bucketName)) return;
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        // Provide a user-friendly message for common cases
        const msg = error.message?.toLowerCase() ?? '';
        if (msg.includes('not found') || msg.includes('does not exist')) {
          setError(`Storage bucket "${bucketName}" not found. Please run the storage setup script.`);
        } else {
          setError(error.message);
        }
      } else {
        setFiles((data || []).filter(f => f.name !== '.emptyFolder'));
      }
    } catch (e: any) {
      // "Failed to fetch" = network / CORS / bucket doesn't exist
      setError('Unable to reach storage. Check your network or ensure the storage bucket exists.');
    }
    setLoading(false);
  }, [bucketName]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      // Create a unique filepath
      const filePath = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;
      
      await fetchFiles();
      
      // Return the public URL
      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrl;
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
      throw err;
    } finally {
      setUploading(false);
    }
  }, [bucketName, fetchFiles]);

  const deleteFile = useCallback(async (fileName: string) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase.storage.from(bucketName).remove([fileName]);
      if (deleteError) throw deleteError;
      await fetchFiles();
    } catch (err: any) {
      setError(err.message || 'Error deleting file');
      throw err;
    }
  }, [bucketName, fetchFiles]);

  return { files, loading, error, uploading, fetchFiles, uploadFile, deleteFile };
}

export function getPublicUrl(bucketName: string, filePath: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
