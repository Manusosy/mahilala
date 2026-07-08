import { useState, useEffect } from 'react';

export interface HeroSlide {
  id: string;
  url: string;
  alt: string;
}

interface HeroSliderBackgroundProps {
  slides: readonly HeroSlide[];
  imagePosition?: string;
  intervalMs?: number;
}

export function HeroSliderBackground({
  slides,
  imagePosition = 'center',
  intervalMs = 10000,
}: HeroSliderBackgroundProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(sliderInterval);
  }, [slides.length, intervalMs]);

  return (
    <div className="absolute top-16 md:top-20 left-0 right-0 bottom-0 bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-[opacity,transform] duration-[5000ms] ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
          }`}
          style={{
            backgroundImage: `url('${slide.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: imagePosition,
            backgroundRepeat: 'no-repeat',
          }}
          role="img"
          aria-label={slide.alt}
          aria-hidden={index !== currentSlide}
        />
      ))}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
    </div>
  );
}
