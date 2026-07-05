import { AdminLayout } from '@/admin/components/AdminLayout';
import { Users, Clock, Wrench } from 'lucide-react';
import { Link } from 'wouter';

export default function UsersRoles() {
  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Users & Roles' }]}>
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#E8EAF8] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-[#204f79]" />
          </div>
          <h2 className="text-gray-900 font-bold text-2xl mb-2">Users & Roles Module</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#204f79]" />
            <span className="text-[#204f79] font-semibold text-sm">Coming Soon</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            The users and roles management module is currently under active development. It will include user tracking, role assignment, permissions management, and audit logs.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['User Management', 'Role Assignment', 'Access Control', 'Audit Logs'].map((feature) => (
              <div key={feature} className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span className="text-xs text-gray-500">{feature}</span>
              </div>
            ))}
          </div>
          <Link href="/admin">
            <button className="px-5 py-2.5 bg-[#204f79] hover:bg-[#F78A28] text-white rounded-lg text-sm font-semibold transition-colors">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
