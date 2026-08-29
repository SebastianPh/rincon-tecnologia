'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Banner {
  id: string
  title: string
  image_url: string
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    return createClient(url, key)
  }, [])

  useEffect(() => {
    async function fetchBanners() {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)

      if (data && data.length > 0 && !error) {
        setBanners(data)
      } else {
        setBanners([
          {
            id: '1',
            title: 'Recién Llegados',
            image_url: 'https://lpydkbkwmtbbhrzsnzzs.supabase.co/storage/v1/object/public/images/banners/banner-llegados.jpg'
          }
        ])
      }
      setLoading(false)
    }
    fetchBanners()
  }, [supabase])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [banners])

  if (loading) {
    return (
      <div className="w-full h-auto aspect-[2.1/1] bg-slate-900 rounded-2xl animate-pulse mb-8 border border-cyan-500/20" />
    )
  }

  if (banners.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-8 bg-slate-950">
      <div className="w-full h-auto aspect-[2.1/1] relative flex items-center justify-center">
        {banners.map((banner, index) => (
          <img
            key={banner.id || index}
            src={banner.image_url}
            alt={banner.title || 'Banner'}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'w-8 bg-cyan-400' : 'w-2.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}