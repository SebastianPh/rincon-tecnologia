'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Banner {
  id: string
  title: string
  image_url: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchBanners() {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)

      if (data && data.length > 0 && !error) {
        setBanners(data)
      } else {
        // Fallback directo a las imágenes JPG cargadas en tu bucket
        setBanners([
          {
            id: '1',
            title: 'Banner Principal',
            image_url: 'https://lpydkbkwmtbbhrzsnzzs.supabase.co/storage/v1/object/public/images/banners/banner.jpg'
          },
          {
            id: '2',
            title: 'Promociones del Mes',
            image_url: 'https://lpydkbkwmtbbhrzsnzzs.supabase.co/storage/v1/object/public/images/banners/promociones.jpg'
          }
        ])
      }
    }
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [banners])

  if (banners.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] mb-8">
      <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] relative bg-slate-950">
        {banners.map((banner, index) => (
          <img
            key={banner.id || index}
            src={banner.image_url}
            alt={banner.title || 'Banner'}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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
      )}
    </div>
  )
}