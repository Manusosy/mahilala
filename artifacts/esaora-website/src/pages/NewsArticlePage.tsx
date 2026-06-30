import { useParams, Link } from 'wouter';
import { useArticleBySlug, usePublishedArticles } from '@workspace/esaora-core/hooks/useArticles';
import { Calendar, Share2, Link as LinkIcon, Check, ChevronRight, Signal } from 'lucide-react';
import { useState } from 'react';
import { NewsletterPopup } from '@/components/NewsletterPopup';
import { useNewsletterPopupTrigger } from '@/hooks/useNewsletterPopupTrigger';

// ── Official Social Icons (SVG) ─────────────────────────────────────────────
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.433-9.877 9.882-9.877 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c0 5.446-4.433 9.877-9.882 9.877m8.415-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function NewsArticlePage() {
  const params = useParams();
  const { article, loading, error } = useArticleBySlug(params.slug || '');
  const { articles: relatedArticles } = usePublishedArticles(3, article?.categories?.slug);
  const [copySuccess, setCopySuccess] = useState(false);
  const articleReady = !loading && !!article && !error;
  const { shouldShow, dismiss, close } = useNewsletterPopupTrigger(articleReady);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article?.title || '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 animate-pulse">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-3 w-24 bg-gray-100 rounded mb-5" />
          <div className="h-10 w-full bg-gray-100 rounded mb-3" />
          <div className="h-10 w-3/4 bg-gray-100 rounded mb-8" />
          <div className="aspect-[16/9] w-full bg-gray-100 rounded-[7px] mb-10" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-11/12 bg-gray-100 rounded" />
            <div className="h-4 w-10/12 bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-9/12 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl text-brand-navy font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The article you are looking for doesn't exist or has been removed.</p>
        <Link href="/news">
          <a className="bg-[#001BB7] text-white px-8 py-3 rounded-lg font-bold transition-transform hover:scale-105">Return to News</a>
        </Link>
      </div>
    );
  }

  const date = new Date(article.published_at || article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const categoryColor = article.categories?.color || '#001BB7';
  const authorName = article.author?.full_name?.trim() || 'Mahilala';
  const authorAvatar = article.author?.avatar_url?.trim() || null;

  return (
    <main className="bg-[#FAFAFA] min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="pt-24 pb-6 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-8">
                <Link href="/"><a className="hover:text-brand-navy transition-colors">Home</a></Link>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <Link href="/news"><a className="hover:text-brand-navy transition-colors">News</a></Link>
                {article.categories && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <Link href="/news" className="hover:text-brand-navy transition-colors">
                      {article.categories.name}
                    </Link>
                  </>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-brand-navy truncate max-w-[200px] md:max-w-md font-bold">{article.title}</span>
            </nav>
        </div>
      </div>

      <article className="pb-24">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto px-4 lg:px-8 mb-12 text-center md:text-left">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#111111] font-bold leading-[1.2] mb-6">
                {article.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                        {authorAvatar ? (
                            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                        ) : (
                            <img src="/favicon.png" alt="Platform Logo" className="w-8 h-8 opacity-60" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-black text-[#111111] uppercase tracking-wider leading-none mb-1">
                            By {authorName}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium">Official Release</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 md:ml-auto">
                    <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <Calendar className="w-4 h-4 mr-2 text-[#001BB7]" /> {date}
                    </div>
                    
                    <span 
                        className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white rounded-[2px]"
                        style={{ backgroundColor: categoryColor }}
                    >
                        {article.categories?.name || 'News'}
                    </span>

                    <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <Signal className="w-4 h-4 mr-2 text-gray-300" /> {article.view_count || 0} Views
                    </div>
                </div>
            </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-6xl mx-auto px-4 lg:px-8 mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[21/9]">
                {article.cover_image_url ? (
                    <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-brand-navy" />
                )}
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-6xl mx-auto px-4 lg:px-8 relative">
            <div className="flex flex-col lg:flex-row gap-16">
                
                {/* Sticky Share Sidebar (Desktop Only) */}
                <aside className="hidden lg:block w-16 sticky top-32 self-start pt-4">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-[10px] font-bold text-gray-400 rotate-180 uppercase tracking-widest [writing-mode:vertical-lr] mb-2">Share</p>
                        <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-white text-[#1877F2] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border border-gray-50"
                            title="Share on Facebook"
                        >
                            <FacebookIcon className="w-5 h-5" />
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-white text-black rounded-xl shadow-[0_4px_20_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border border-gray-50"
                            title="Share on X"
                        >
                            <XIcon className="w-5 h-5" />
                        </a>
                        <a 
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-white text-[#0077B5] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border border-gray-50"
                            title="Share on LinkedIn"
                        >
                            <LinkedinIcon className="w-5 h-5" />
                        </a>
                        <a 
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-white text-[#25D366] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border border-gray-50"
                            title="Share on WhatsApp"
                        >
                            <WhatsappIcon className="w-5 h-5" />
                        </a>
                        <button 
                            onClick={handleCopyLink}
                            className={`p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border border-gray-50 ${copySuccess ? 'bg-[#001BB7] text-white' : 'bg-white text-gray-500'}`}
                            title="Copy Link"
                        >
                            {copySuccess ? <Check className="w-5 h-5 animate-in zoom-in" /> : <LinkIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </aside>

                {/* Article Body */}
                <div className="flex-1 max-w-3xl">
                    <div 
                        className="prose prose-lg prose-blue max-w-none prose-headings:font-display prose-headings:text-brand-navy prose-a:text-[#001BB7] prose-img:rounded-xl prose-img:shadow-lg prose-p:text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.body }}
                    />

                    {/* Bottom Tags */}
                    <div className="mt-16 pt-8 border-t border-gray-200 flex flex-wrap gap-2">
                        {article.tags?.map((tag: any) => (
                            <span key={tag.id} className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-4 py-1.5 rounded-full hover:border-[#001BB7] hover:text-brand-navy transition-colors cursor-default">
                                #{tag.name}
                            </span>
                        ))}
                    </div>

                    {/* Mobile Share (Bottom) */}
                    <div className="lg:hidden mt-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-xl">
                        <p className="text-sm font-bold text-brand-navy mb-4">Share this article</p>
                        <div className="flex gap-4">
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-lg"><FacebookIcon className="w-5 h-5" /></a>
                            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="p-3 bg-black/10 text-black rounded-lg"><XIcon className="w-5 h-5" /></a>
                            <a href={`https://api.whatsapp.com/send?text=${shareUrl}`} className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-lg"><WhatsappIcon className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-display font-bold text-brand-navy">Related Articles</h2>
                <Link href="/news">
                    <a className="text-[#001BB7] font-bold text-sm hover:underline">View all news →</a>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.filter(a => a.id !== article.id).slice(0, 3).map(a => (
                    <Link key={a.id} href={`/news/${a.slug}`}>
                        <a className="group flex flex-col h-full bg-[#FAFAFA] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="aspect-video overflow-hidden">
                                <img src={a.cover_image_url || '/placeholder.jpg'} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <span className="text-[10px] font-bold text-[#001BB7] uppercase tracking-widest mb-3">{a.categories?.name || 'News'}</span>
                                <h3 className="text-lg font-bold text-[#111111] mb-4 group-hover:text-gray-600 transition-colors line-clamp-2">{a.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{a.excerpt}</p>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      <NewsletterPopup open={shouldShow} onDismiss={dismiss} onClose={close} />
    </main>
  );
}
