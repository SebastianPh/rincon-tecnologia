'use client'
import { useState, useEffect } from 'react'

const BANNERS = [
  {
    id: '1',
    title: 'Recién Llegados',
    image_url: 'https://lpydkbkwmtbbhrzsnzzs.supabase.co/storage/v1/object/public/images/banners/banner-llegados.jpg'
  },
  {
    id: '2',
    title: 'Bienvenida',
    image_url: 'https://lpydkbkwmtbbhrzsnzzs.supabase.co/storage/v1/object/public/images/banners/banner.jpg'
  },
  {
    id: '3',
    title: 'Descuentos',
    image_url: 'https://lpydkbkwmtbbhrzsnzzs.supabase.co/storage/v1/object/public/images/banners/ofertas.jpg'
  }
]

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-8 bg-slate-950/80 border border-cyan-500/30">
      <div className="w-full h-[200px] sm:h-[280px] md:h-[320px] relative flex items-center justify-center p-2">
        {BANNERS.map((banner, index) => (
          <img
            key={banner.id}
            src={banner.image_url}
            alt={banner.title}
            className={`max-w-full max-h-full object-contain transition-opacity duration-700 ease-in-out absolute top-0 left-0 w-full h-full p-2 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ver banner ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-cyan-400' : 'w-2.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}