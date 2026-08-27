// src/components/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { ShoppingCart, Search, Phone, Radio } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#00f0ff]/40 bg-[#05050a]/95 backdrop-blur-xl shadow-xl shadow-[#00f0ff]/10">
      {/* BARRA SUPERIOR AMARILLO CYBERPUNK */}
      <div className="bg-[#fcee0a] text-slate-950 text-[11px] font-black py-1 px-4 flex justify-between items-center font-mono tracking-wider">
        <span className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
          PEDIDOS AUTOMATIZADOS - MONTERÍA, CÓRDOBA Y ENVÍOS A TODA COLOMBIA
        </span>

        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com/rincondelatecno2025"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-950 text-[#fcee0a] px-2.5 py-0.5 rounded-sm hover:bg-slate-900 transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#00f0ff]" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>@rincondelatecno2025</span>
          </a>

          <a
            href="https://wa.me/573136983117"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-slate-950 text-[#fcee0a] px-2.5 py-0.5 rounded-sm hover:bg-slate-900 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>313 6983117</span>
          </a>
        </div>
      </div>

      {/* CABECERA PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#fcee0a] bg-slate-950 glow-yellow group-hover:scale-105 transition-transform flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Rincón de la Tecnología Logo"
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-[10px] font-black text-[#fcee0a] font-mono text-center leading-none">
              RINCÓN<br/>TEC
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none group-hover:text-[#fcee0a] transition-colors font-mono">
              RINCÓN DE LA
            </span>
            <span className="text-xs font-black text-[#00f0ff] tracking-widest font-mono">
              TECNOLOGÍA
            </span>
          </div>
        </Link>

        {/* BUSCADOR */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="Buscar accesorios, consolas retro, memorias, TV Box..."
            className="w-full bg-slate-950 border border-[#00f0ff]/50 rounded-none py-2.5 pl-10 pr-4 text-xs text-[#00f0ff] placeholder-slate-500 focus:outline-none focus:border-[#fcee0a] transition-all font-mono"
          />
          <Search className="w-4 h-4 text-[#00f0ff] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* CARRITO */}
        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="relative px-5 py-2.5 bg-[#fcee0a] hover:bg-[#e0d300] text-slate-950 clip-cyber-btn font-black flex items-center gap-2 text-xs transition-all glow-yellow cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 fill-slate-950" />
            <span className="hidden sm:inline font-mono">MI CARRITO</span>
            <span className="bg-slate-950 text-[#fcee0a] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-[#fcee0a]">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}