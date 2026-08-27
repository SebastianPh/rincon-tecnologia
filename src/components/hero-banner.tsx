// src/components/hero-banner.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface BannerSlide {
  id: string;
  image_url: string;
  title: string;
  link_url?: string;
}

export function HeroBanner() {
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cargar banners desde la base de datos de Supabase
  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error("Error al cargar banners de Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  // Rotación automática cada 6 segundos
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const active = banners[currentIndex];

  if (loading) {
    return (
      <div className="w-full aspect-[16/6] md:aspect-[21/7] rounded-2xl bg-slate-950 border-2 border-[#00f0ff]/40 flex items-center justify-center my-6">
        <Loader2 className="w-8 h-8 text-[#00f0ff] animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full my-6">
      {/* MARCO CON TUBO Y RESPLANDOR NEÓN DE LÁMPARA NOCTURNA */}
      <div className="relative w-full aspect-[16/6] md:aspect-[21/7] rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#00f0ff] glow-cyan shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-500 group">
        
        {/* IMAGEN REAL DEL BANNER DESDE SUPABASE */}
        {active && (
          <a
            href={active.link_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full h-full"
          >
            <Image
              src={active.image_url}
              alt={active.title}
              fill
              priority
              unoptimized
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </a>
        )}

        {/* BORDE INTERNO RESPLANDECIENTE TIPO NEÓN */}
        <div className="absolute inset-0 border border-[#fcee0a]/30 pointer-events-none rounded-2xl" />

        {/* CONTROLES DE NAVEGACIÓN */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/80 hover:bg-[#fcee0a] text-[#00f0ff] hover:text-slate-950 border border-[#00f0ff] transition-all cursor-pointer z-20 backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/80 hover:bg-[#fcee0a] text-[#00f0ff] hover:text-slate-950 border border-[#00f0ff] transition-all cursor-pointer z-20 backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* PUNTOS INDICADORES DE PANTALLAS */}
            <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all cursor-pointer ${
                    currentIndex === idx ? "w-6 bg-[#fcee0a]" : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}