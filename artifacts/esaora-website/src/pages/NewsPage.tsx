import { useState } from 'react';
import { Link } from 'wouter';
import { PageHero } from '@/components/PageHero';
import { NewsletterSection } from '@/components/NewsletterSection';
import { ArrowRight, Globe, Calendar } from 'lucide-react';
import { usePublishedArticles, useCategories } from '@workspace/esaora-core/hooks/useArticles';

export default function NewsPage() {
  const { articles, loading } = usePublishedArticles();
  const { categories } = useCategories();
  const [filterCategory, setFilterCategory] = useState('');

  const publishedArticles = articles.filter(a => a.is_published);
  const filtered = filterCategory ? publishedArticles.filter(a => a.categories?.name === filterCategory) : publishedArticles;

  return (
    <main>
      <PageHero
        label="NEWS & STORIES"
        heading="Updates from Mahilala Madagascar"
        subheading="Programme stories, announcements, and insights on youth mentorship, civic engagement, and environmental education in Toliara and across Madagascar."
        imageSrc="/images/sections/pillar-youth-mentoring.jpg"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[7px] overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-[16/10] bg-gray-100" />
                  <div className="p-7 space-y-3">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="h-5 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
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
                        </div>
                        <h3 className="font-display text-xl font-black text-[#111111] leading-tight mb-4 group-hover:text-gray-600 transition-colors line-clamp-2">{article.title}</h3>
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

      <NewsletterSection />
    </main>
  );
}
