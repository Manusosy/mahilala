import { useState, useMemo } from 'react';
import { ArrowRight, Download, FileText, BookOpen, Loader2, Calendar, Star } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { usePublishedReports, incrementReportDownload } from '@workspace/esaora-core/hooks/useData';
import type { Report } from '@workspace/esaora-core/lib/database.types';

const CATEGORIES = ['All', 'Annual Report', 'Research Paper', 'Policy Brief', 'Impact Review'];

export default function ReportsPage() {
  const { reports, loading } = usePublishedReports();
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  const filteredReports = useMemo(() => {
    if (activeCategory === 'All') return reports;
    return reports.filter(r => r.category === activeCategory);
  }, [reports, activeCategory]);

  const handleDownload = async (report: Report) => {
    if (!report.file_url) return;
    const current = downloadCounts[report.id] ?? report.download_count;
    const next = current + 1;
    setDownloadCounts(prev => ({ ...prev, [report.id]: next }));
    incrementReportDownload(report.id, current).catch(() => {
      setDownloadCounts(prev => ({ ...prev, [report.id]: current }));
    });
    try {
      const res = await fetch(report.file_url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const urlParts = report.file_url.split('/');
      a.download = urlParts[urlParts.length - 1] || `${report.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(report.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <main className="bg-gray-50">
      <PageHero
        label="REPORTS & PUBLICATIONS"
        heading="Knowledge, Transparency, and Evidence"
        subheading="ESA-ORA publishes program reports, research findings, financial statements, and policy documents to ensure full transparency and drive evidence-based practice across the region."
        imageSrc="/images/hero/hero-bg-5.jpg"
        breadcrumb="Reports & Publications"
      />

      {/* ── Filter Bar — News-page style ── */}
      <div className="bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center border border-gray-100 rounded-[7px] overflow-hidden bg-white">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-7 py-3.5 text-[10px] font-black tracking-widest transition-all uppercase ${
                  i > 0 ? 'border-l border-gray-100' : ''
                } ${
                  activeCategory === cat
                    ? 'bg-brand-navy text-white'
                    : 'text-brand-navy/40 hover:text-brand-navy hover:bg-gray-50'
                }`}
              >
                {cat === 'All' ? 'All Reports' : cat}
              </button>
            ))}
            {!loading && (
              <span className="ml-auto px-6 text-[10px] text-brand-navy/30 font-bold tracking-widest border-l border-gray-100 py-3.5 whitespace-nowrap hidden md:block">
                {filteredReports.length} DOCUMENT{filteredReports.length !== 1 ? 'S' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Report List ── */}
      <section className="pb-16 px-4 min-h-[400px]">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-9 h-9 animate-spin text-brand-navy/20" />
              <p className="text-brand-navy/30 text-[10px] font-bold tracking-widest uppercase">Loading Publications...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[7px] p-14 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 bg-gray-50 rounded-[7px] flex items-center justify-center mx-auto mb-5">
                <FileText className="w-7 h-7 text-brand-navy opacity-20" />
              </div>
              <h2 className="font-display text-xl text-brand-navy font-bold mb-2">No Reports Published Yet</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Publications are currently undergoing final review. Please check back soon.
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-brand-navy/40 text-sm">
                No documents in <span className="font-bold text-brand-navy">"{activeCategory}"</span>.
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-4 text-brand-navy font-black text-[10px] uppercase tracking-widest hover:text-brand-cyan transition-colors"
              >
                VIEW ALL REPORTS
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map(report => (
                <ReportRow
                  key={report.id}
                  report={report}
                  overrideCount={downloadCounts[report.id]}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Open Access Panel — dotted white background, compact ── */}
      <section
        className="relative py-16 px-4 overflow-hidden bg-white"
        style={{
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      >
        {/* Faint fade at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-[7px] px-8 py-10 text-center">
            <div className="w-10 h-10 bg-[#001BB7]/10 rounded-[7px] flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-5 h-5 text-[#001BB7]" />
            </div>
            <h2 className="font-display text-xl md:text-2xl text-brand-navy font-bold mb-3">Open Access Policy</h2>
            <p className="text-brand-navy/55 text-sm leading-relaxed max-w-xl mx-auto mb-7">
              All ESA-ORA program reports, research publications, and policy documents are freely available for download. Evidence must be accessible to drive better decisions across the region.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:info@esaora.org"
                className="inline-flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-2.5 rounded-[7px] font-bold text-xs uppercase tracking-widest hover:bg-brand-navy/90 transition-all"
              >
                Request a Custom Report <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:info@esaora.org"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-brand-navy px-6 py-2.5 rounded-[7px] font-bold text-xs uppercase tracking-widest hover:border-brand-navy/30 hover:bg-gray-50 transition-all"
              >
                Submit Research Proposal
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Compact horizontal report row ─────────────────────────────────────────────
interface ReportRowProps {
  report: Report;
  overrideCount?: number;
  onDownload: (report: Report) => void;
}

function ReportRow({ report, overrideCount, onDownload }: ReportRowProps) {
  const [downloading, setDownloading] = useState(false);
  const count = overrideCount ?? report.download_count;

  const handleClick = async () => {
    if (downloading || !report.file_url) return;
    setDownloading(true);
    await onDownload(report);
    setDownloading(false);
  };

  return (
    <div className="group bg-white rounded-[7px] border border-gray-100 flex flex-col sm:flex-row overflow-hidden transition-all duration-200 hover:border-gray-200">
      {/* Colour thumbnail */}
      <div
        className="sm:w-[104px] flex-shrink-0 flex items-center justify-center py-5 sm:py-0"
        style={{ backgroundColor: `${report.color || '#001BB7'}12` }}
      >
        {report.cover_image_url ? (
          <img
            src={report.cover_image_url}
            alt={report.title}
            className="w-14 h-16 sm:w-full sm:h-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-[7px] flex items-center justify-center"
            style={{ backgroundColor: `${report.color || '#001BB7'}20` }}
          >
            <FileText className="w-5 h-5" style={{ color: report.color || '#001BB7' }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
        {/* Main info */}
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${report.color || '#001BB7'}18`, color: report.color || '#001BB7' }}
            >
              {report.category}
            </span>
            {report.report_type && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/35">
                {report.report_type}
              </span>
            )}
            {report.is_featured && (
              <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-brand-navy font-bold text-[15px] leading-snug line-clamp-1 mb-0.5">
            {report.title}
          </h3>

          {/* Description */}
          {report.description && (
            <p className="text-brand-navy/50 text-xs leading-relaxed line-clamp-1 mb-1.5">
              {report.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-[10px] text-brand-navy/35 font-semibold">
            {report.published_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(report.published_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {count.toLocaleString()} {count === 1 ? 'download' : 'downloads'}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          {report.file_url ? (
            <button
              onClick={handleClick}
              disabled={downloading}
              className="flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-[7px] text-[11px] font-black uppercase tracking-widest hover:bg-brand-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {downloading ? 'Downloading…' : 'Download PDF'}
            </button>
          ) : (
            <span className="text-[10px] text-brand-navy/25 font-semibold italic">Not available</span>
          )}
        </div>
      </div>
    </div>
  );
}
