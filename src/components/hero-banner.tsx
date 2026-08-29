'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Banner {
  id: string
  title: string
  image_url: string
}

// Inicialización directa del cliente de Supabase usando variables públicas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([
    // Banner por defecto mientras carga o si falla la BD
    {
      id: 'default',
      title: 'Bienvenido',
      image_url: '/images/banner.png'
    }
  ])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchBanners() {
      const { data, error } = await supabase.from('banners').select('*').eq('active', true)
      if (data && data.length > 0 && !error) {
        setBanners(data)
      }
    }
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-8">
      <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] relative bg-slate-950">
        <img
          src={banners[currentIndex]?.image_url || '/images/banner.png'}
          alt={banners[currentIndex]?.title || 'Banner Rincón de la Tecnología'}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out"
        />
      </div>

      {banners.length > 1 && (
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
      )}
    </div>
  )
}