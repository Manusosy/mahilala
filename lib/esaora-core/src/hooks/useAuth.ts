import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { getAdminProfile } from '../lib/auth';
import type { AdminProfile } from '../lib/database.types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null, user: null, profile: null,
  loading: true, isAdmin: false, isSuperAdmin: false, canEdit: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext };

// Standalone hook for components outside the provider
export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getAdminProfile(session.user.id).then(setProfile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        getAdminProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isAdmin: !!profile && profile.is_active,
    isSuperAdmin: profile?.role === 'super_admin',
    canEdit: !!profile && profile.is_active && ['super_admin', 'admin', 'editor'].includes(profile.role),
  };
}
