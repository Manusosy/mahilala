import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { PageHero } from '@/components/PageHero';
import { ArrowRight, Globe, Loader2, Calendar, Check } from 'lucide-react';
import { usePublishedArticles, useCategories } from '@workspace/esaora-core/hooks/useArticles';
import { supabase } from '@workspace/esaora-core/lib/supabase';

export default function NewsPage() {
  const { t } = useLanguage();
  const { articles, loading } = usePublishedArticles();
  const { categories } = useCategories();
  const [filterCategory, setFilterCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setSubError('');
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email, is_subscribed: true });
      if (error && error.code !== '23505') throw error; // 23505 is unique violation
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubError('Could not subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const publishedArticles = articles.filter(a => a.is_published);
  const filtered = filterCategory ? publishedArticles.filter(a => a.categories?.name === filterCategory) : publishedArticles;

  return (
    <main>
      <PageHero
        heading="News, Stories & Insights from the Alliance"
        subheading="Updates, programme stories, and news from Mahilala Madagascar on youth mentorship, civic engagement, and environmental education."
        imageSrc="/images/hero/hero-bg-11.jpg"
        breadcrumb="News"
      />

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Professional Category Sub-navigation (Divided Column Style) */}
          <div className="flex flex-wrap items-center justify-center mb-12 border border-gray-100 rounded-[7px] overflow-hidden bg-white">
            <button
              onClick={() => setFilterCategory('')}
              className={`px-8 py-4 text-[10px] font-black tracking-widest transition-all ${
                !filterCategory 
                ? 'bg-brand-navy text-white' 
                : 'text-brand-navy/40 hover:text-brand-navy hover:bg-gray-50'
              }`}
            >
              ALL NEWS
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.name)}
                className={`px-8 py-4 text-[10px] font-black tracking-widest transition-all border-l border-gray-100 ${
                  filterCategory === cat.name 
                  ? 'text-white' 
                  : 'text-brand-navy/40 hover:text-brand-navy hover:bg-gray-50'
                }`}
                style={filterCategory === cat.name ? { backgroundColor: cat.color || '#001BB7' } : {}}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-navy/30 mb-4" />
              <p className="text-slate-500 font-medium">Loading network insights...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[7px] border border-gray-100">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-brand-navy mb-2">No Articles Found</h3>
              <p className="text-slate-500">We couldn't find any articles matching your criteria.</p>
              {filterCategory && (
                <button onClick={() => setFilterCategory('')} className="mt-6 text-brand-cyan font-black hover:underline uppercase text-[10px] tracking-widest">
                    View all articles
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => {
                const catInfo = article.categories;
                const color = catInfo?.color || '#001BB7';
                const date = new Date(article.published_at || article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

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
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{date}</span>
                          </div>
                          {article.author && (
                            <span className="text-[9px] font-black text-brand-navy/30 uppercase tracking-tighter">
                              By {article.author.full_name}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-xl font-black text-brand-navy leading-tight mb-4 group-hover:text-brand-cyan transition-colors line-clamp-2 italic">{article.title}</h3>
                        <p className="text-slate-800 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{article.excerpt}</p>
                        <div className="flex items-center text-brand-cyan font-black text-[10px] tracking-[0.2em] mt-auto transition-all group-hover:gap-2 uppercase">
                          READ ARTICLE <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-brand-navy py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[#001BB7] uppercase tracking-widest text-xs font-bold block mb-4">Stay Connected</span>
          <h2 className="font-display text-3xl text-white font-bold mb-4">Get Mahilala Updates</h2>
          <p className="text-white/55 text-base mb-8">Receive news, program updates, and funding opportunities directly from the Alliance Secretariat.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-[7px] px-6 py-4 max-w-md mx-auto">
              <Check className="w-5 h-5 text-[#001BB7]" />
              <span className="text-white text-sm font-semibold">You're subscribed! Thank you.</span>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.org"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3 rounded-[7px] text-sm focus:outline-none focus:border-[#001BB7]/60 transition-colors"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="flex items-center justify-center gap-2 bg-[#001BB7] hover:bg-[#F78A28] text-white px-7 py-3 rounded-[7px] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap disabled:opacity-60"
              >
                {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
              </button>
            </form>
          )}
          {subError && <p className="text-red-400 text-xs mt-3">{subError}</p>}
        </div>
      </section>
    </main>
  );
}
