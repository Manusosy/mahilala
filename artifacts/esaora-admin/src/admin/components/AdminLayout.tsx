import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden relative">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar 
          collapsed={collapsed} 
          onCollapse={setCollapsed} 
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopBar 
          title={title} 
          breadcrumbs={breadcrumbs} 
          setMobileOpen={setMobileOpen} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
