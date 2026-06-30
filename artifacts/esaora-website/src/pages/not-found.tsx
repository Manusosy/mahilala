import { Link } from 'wouter';
import { ArrowLeft, Map } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] text-center px-6">
      <div className="w-20 h-20 bg-brand-navy/5 rounded-lg flex items-center justify-center mb-8">
        <Map className="w-10 h-10 text-brand-navy opacity-20" />
      </div>
      
      <h1 className="font-display text-5xl font-bold text-brand-navy mb-4">404</h1>
      <h2 className="font-display text-2xl font-bold text-brand-navy/80 mb-6">Page Not Found</h2>
      
      <p className="text-[#718096] text-lg max-w-md mx-auto mb-10 leading-relaxed">
        The page you are looking for doesn't exist or has been moved. Use the alliance navigation to find your way back.
      </p>

      <Link href="/" className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3.5 rounded-lg font-bold text-sm hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/10 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Return Home
      </Link>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden -z-10">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="currentColor" strokeWidth="1" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

