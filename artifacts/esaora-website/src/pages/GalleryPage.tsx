import { useState, useMemo } from 'react';
import { X, Maximize2, Navigation, Filter, Camera } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { usePublishedGallery } from '@workspace/esaora-core/hooks/useData';
import { PAGE_HERO_SLIDES } from '@/constants/pageHeroSlides';

const CATEGORIES = ['All', 'Conferences', 'Field Projects', 'Workshops', 'General'];

export default function GalleryPage() {
  const { items, loading } = usePublishedGallery();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [items, activeCategory]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <main className="bg-white min-h-screen">
      <PageHero
        label="GALLERY"
        heading="Mahilala in Action"
        subheading="Moments from our programmes, events, environmental education activities, and community work across Madagascar."
        slides={PAGE_HERO_SLIDES.gallery}
        breadcrumb="Gallery"
      />

      {/* Filter Bar */}
      <section className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-brand-navy">
                  <Filter className="w-5 h-5 text-[#204f79]" />
                  <span className="text-xs font-black uppercase tracking-widest">Filter Archive</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                  {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeCategory === cat 
                            ? 'bg-brand-navy text-white shadow-xl' 
                            : 'bg-gray-50 text-gray-500 hover:bg-[#204f79]/10 hover:text-brand-navy'
                        }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>
      </section>

      {/* Main Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[7px] border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-100" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-40 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Camera className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No visual assets found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                    key={item.id} 
                    className="group bg-white rounded-[7px] border border-gray-100 overflow-hidden flex flex-col hover:border-[#204f79]/30 transition-all duration-500"
                    onClick={() => openLightbox(index)}
                >
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden cursor-zoom-in">
                    <img 
                        src={item.image_url} 
                        alt={item.caption || 'Field asset'} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-10 h-10 text-white drop-shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-500" />
                    </div>
                    <div className="absolute top-4 left-4">
                        <span className="bg-brand-navy/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-[0.2em]">
                            {item.category}
                        </span>
                    </div>
                  </div>
                  
                  {item.caption && (
                      <div className="p-6 flex-1 flex flex-col justify-between">
                          <p className="text-brand-navy text-sm font-medium leading-relaxed italic mb-4">
                            "{item.caption}"
                          </p>
                          {item.country && (
                              <div className="flex items-center gap-2 text-[10px] text-[#204f79] font-black uppercase tracking-widest pt-4 border-t border-gray-50">
                                  <Navigation className="w-3 h-3" /> {item.country}
                              </div>
                          )}
                      </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
            className="fixed inset-0 z-[100] bg-brand-navy/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
            onClick={closeLightbox}
        >
            <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }} 
                className="absolute z-[110] top-6 right-6 md:top-12 md:right-12 text-white/40 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full"
            >
                <X className="w-8 h-8" />
            </button>
            
            <div 
                className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-8"
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={filteredItems[lightboxIndex].image_url} 
                    alt={filteredItems[lightboxIndex].caption || 'Large view'} 
                    className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
                />
                
                <div className="max-w-2xl text-center space-y-4">
                    <span className="text-[#204f79] text-xs font-black uppercase tracking-widest">{filteredItems[lightboxIndex].category} | {filteredItems[lightboxIndex].country}</span>
                    <p className="text-white text-xl md:text-2xl font-medium italic leading-relaxed">
                        "{filteredItems[lightboxIndex].caption || 'Visual documentation from Mahilala Madagascar programmes and community work.'}"
                    </p>
                </div>
                
                {/* Navigation */}
                <div className="flex gap-4 mt-8">
                    <button 
                        disabled={lightboxIndex === 0}
                        onClick={() => setLightboxIndex(lightboxIndex - 1)}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-20 transition-all"
                    >
                        Previous
                    </button>
                    <button 
                        disabled={lightboxIndex === filteredItems.length - 1}
                        onClick={() => setLightboxIndex(lightboxIndex + 1)}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-20 transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
      )}
    </main>
  );
}
