import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@workspace/esaora-core/hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { session, profile, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        setLocation('/admin/login');
      } else if (profile && !profile.is_active) {
        setLocation('/admin/login?error=inactive');
      }
    }
  }, [session, profile, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#204f79] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#204f79]/30 border-t-[#204f79] rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading Mahilala Platform…</p>
        </div>
      </div>
    );
  }

  if (!session || (profile && !profile.is_active)) {
    return null;
  }

  return <>{children}</>;
}
