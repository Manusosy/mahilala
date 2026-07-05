import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Globe, Loader2, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePublishedArticles } from '@workspace/esaora-core/hooks/useArticles';

gsap.registerPlugin(ScrollTrigger);

export function NewsSection() {
  const { t } = useLanguage();
  const { articles, loading } = usePublishedArticles(3);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (articles.length > 0) {
      const cards = cardsRef.current?.children ? Array.from(cardsRef.current.children) : [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }
  }, [articles]);

  return (
    <section ref={sectionRef} className="bg-white py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div className="max-w-xl">
            <span className="text-brand-cyan uppercase tracking-[0.2em] text-[10px] font-black block mb-4">{t.news.latestLabel}</span>
            <h2 className="font-display text-4xl text-[#111111] font-black leading-[1.1]">{t.news.headline}</h2>
          </div>
          <Link href="/news" className="hidden sm:flex items-center gap-3 text-brand-navy font-black text-xs uppercase tracking-widest hover:text-brand-cyan transition-all group">
            {t.news.viewAll} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-50 h-[400px] rounded-[7px] border border-gray-100" />
                ))}
            </div>
        ) : articles.length > 0 ? (
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                    const date = new Date(article.published_at || article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                    const color = article.categories?.color || '#204f79';
                    
                    return (
                        <Link key={article.id} href={`/news/${article.slug}`}>
                            <div className="group bg-white rounded-[7px] overflow-hidden border border-gray-100 transition-all duration-300 flex flex-col h-full cursor-pointer hover:border-brand-cyan/40">
                                <div className="aspect-[16/10] overflow-hidden relative bg-gray-100">
                                    {article.cover_image_url ? (
                                        <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-navy/5">
                                            <Globe className="w-8 h-8 text-brand-navy/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span 
                                            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white rounded-[2px]"
                                            style={{ backgroundColor: color }}
                                        >
                                            {article.categories?.name || 'News'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-7 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{date}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-display text-xl font-black text-[#111111] leading-tight mb-4 group-hover:text-gray-600 transition-colors line-clamp-2">{article.title}</h3>
                                    <p className="text-slate-800 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{article.excerpt}</p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-brand-cyan text-[10px] font-black uppercase tracking-widest">
                                            <Share2 className="w-3.5 h-3.5" /> 
                                            <span>Discovery Insight</span>
                                        </div>
                                        <span className="text-[10px] font-black text-brand-navy group-hover:text-brand-cyan transition-colors flex items-center gap-2">
                                            READ <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        ) : (
            <div className="bg-[#F0F4F8] rounded-[7px] p-12 text-center border border-black/5">
                <div className="w-16 h-16 bg-brand-navy/5 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-brand-navy opacity-30" />
                </div>
                <h3 className="font-display text-2xl text-[#111111] font-bold mb-3">{t.news.headline}</h3>
                <p className="text-slate-700 text-base max-w-md mx-auto mb-8">
                    News and announcements from Mahilala Madagascar will be shared here soon. 
                    Stay tuned for updates on our programmes, events, and community work in Toliara.
                </p>
                <Link href="/news" className="inline-flex items-center gap-3 bg-[#204f79] text-white px-8 py-3 rounded-[7px] font-black text-xs uppercase tracking-widest hover:bg-[#F78A28] hover:gap-4 transition-all">
                    {t.news.viewAll} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        )}
      </div>
    </section>
  );
}
