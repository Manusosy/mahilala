import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, useAuthState } from '@workspace/esaora-core/hooks/useAuth';
import { supabase } from '@workspace/esaora-core/lib/supabase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
