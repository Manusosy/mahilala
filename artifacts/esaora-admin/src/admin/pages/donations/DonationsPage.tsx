import { AdminLayout } from '@/admin/components/AdminLayout';
import { Heart, Clock, Wrench } from 'lucide-react';
import { Link } from 'wouter';

export default function DonationsPage() {
  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Donations' }]}>
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#E8EAF8] rounded-[6px] flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8 text-[#001BB7]" />
          </div>
          <h2 className="text-gray-900 font-bold text-2xl mb-2">Donations Module</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#001BB7]" />
            <span className="text-[#001BB7] font-semibold text-sm">Coming Soon</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            The donations management module is currently under active development. It will include donor tracking, payment reconciliation, giving history, and financial reporting.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['Donor Management', 'Payment Tracking', 'Financial Reports', 'Gift Processing'].map((feature) => (
              <div key={feature} className="bg-gray-50 rounded-[6px] px-3 py-2.5 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span className="text-xs text-gray-500">{feature}</span>
              </div>
            ))}
          </div>
          <Link href="/admin">
            <button className="px-5 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-lg text-sm font-semibold transition-colors">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
