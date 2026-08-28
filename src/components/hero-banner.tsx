'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client' // Ajusta según la ubicación de tu cliente de Supabase

interface Banner {
  id: string
  title: string
  image_url: string
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const supabase = createClient()

  // Cargar banners desde Supabase
  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase.from('banners').select('*').eq('active', true)
      if (data && data.length > 0) {
        setBanners(data)
      }
    }
    fetchBanners()
  }, [])

  // Cambio automático cada 5 segundos
  useEffect(() => {
    if (banners.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  if (banners.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
      {/* Imagen actual con ajuste perfecto */}
      <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] relative">
        <img
          src={banners[currentIndex].image_url}
          alt={banners[currentIndex].title || 'Banner'}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out"
        />
      </div>

      {/* Indicadores inferiores (puntitos) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              currentIndex === index ? 'w-8 bg-cyan-400' : 'w-2.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}