'use client'
// ... (mismos imports que tienes)

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // ... (mismo useMemo y useEffect de Supabase que tienes)

  if (loading) {
    return (
      // CLASE AJUSTADA: Cambiamos de h-[...] a aspect- ratio y h-auto
      <div className="w-full h-auto aspect-[2.1/1] bg-slate-900 rounded-2xl animate-pulse mb-8 border border-cyan-500/20" />
    )
  }

  if (banners.length === 0) return null

  return (
    // CONTENEDOR AJUSTADO: Eliminamos el borde de neón externo para un diseño más limpio
    <div className="relative w-full overflow-hidden rounded-2xl mb-8 bg-slate-950">
      
      {/* CLASE AJUSTADA DEL CONTENEDOR DE IMAGEN:
          Cambiamos 'w-full h-[...]' por 'w-full h-auto aspect-[2.1/1]'
          Esto fuerza al contenedor a mantener la proporción exacta de tu imagen (aprox 2.1 ancho x 1 alto)
      */}
      <div className="w-full h-auto aspect-[2.1/1] relative flex items-center justify-center">
        {banners.map((banner, index) => (
          <img
            key={banner.id || index}
            src={banner.image_url}
            alt={banner.title || 'Banner'}
            // CLASE AJUSTADA DE LA IMAGEN:
            // Aseguramos que object-fit sea cover para llenar el nuevo contenedor de proporción exacta
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