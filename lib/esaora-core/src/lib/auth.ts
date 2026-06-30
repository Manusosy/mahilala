import { supabase } from './supabase';
import type { AdminProfile } from './database.types';

/** Email domains permitted for admin portal access (code-only; never expose in UI). */
export const ALLOWED_ADMIN_EMAIL_DOMAINS = [
  '@mahilalamadagascar.org',
  '@kazinikazi.co.ke',
  '@averissystems.com',
] as const;

export function isAllowedAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_ADMIN_EMAIL_DOMAINS.some((domain) => normalized.endsWith(domain));
}

/** DEV ONLY - remove/disable for production. Requires VITE_ADMIN_SKIP_OTP=true in .env. */
export function shouldSkipAdminOtp(): boolean {
  return import.meta.env.VITE_ADMIN_SKIP_OTP === 'true';
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Update last_login
  if (data.user) {
    await supabase
      .from('admin_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
  }

  return data;
}

export async function sendOtp(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // shouldCreateUser: false ensures this is a verification-only OTP call
      // and forces Supabase to use the numeric token path (not magic link URL path).
      // The email template must use {{ .Token }} to render the 6-digit code.
      shouldCreateUser: false,
    },
  });
  if (error) throw error;
}

export async function verifyOtp(email: string, token: string, type: 'email' | 'magiclink' | 'signup' = 'email') {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
  if (error) throw error;

  if (data.user) {
    await supabase
      .from('admin_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const session = await getSession();
  if (!session?.user) return null;
  return getAdminProfile(session.user.id);
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

export async function signUp(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });
  if (error) throw error;
}
