// src/components/product-card.tsx
"use client";

import Image from "next/image";
import { Product } from "@/types";
import { formatCOP } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, CheckCircle2, MessageCircle, Cpu } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `¡Hola! 👋 Me interesa comprar el producto:\n*${product.name}*\nPrecio: ${formatCOP(product.price)}`
    );
    window.open(`https://wa.me/573136983117?text=${message}`, "_blank");
  };

  return (
    <div className="group relative bg-slate-950 border border-[#00f0ff]/30 hover:border-[#fcee0a] clip-cyber transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#fcee0a]/10">
      
      {/* IMAGEN Y ETIQUETA */}
      <div className="relative aspect-square w-full bg-slate-900 overflow-hidden border-b border-slate-800">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fcee0a] text-slate-950 text-[10px] font-black font-mono tracking-wider">
              <Cpu className="w-3 h-3 text-slate-950 animate-pulse" />
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase font-mono tracking-widest text-[#00f0ff] bg-slate-900 px-2 py-0.5 border border-[#00f0ff]/30">
              {product.category}
            </span>
            <span className="text-[10px] font-mono text-emerald-400">● DISPONIBLE</span>
          </div>

          <h3 className="text-sm font-black text-white group-hover:text-[#fcee0a] transition-colors line-clamp-2 leading-snug font-mono">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="pt-1 space-y-1">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRECIO Y BOTONES DE ACCIÓN */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase">PRECIO OFICIAL</span>
            <span className="text-lg font-black text-[#fcee0a] font-mono">
              {formatCOP(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsAppBuy}
              className="py-2 px-2 bg-slate-900 hover:bg-emerald-500 border border-emerald-500/50 hover:border-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>PEDIR WP</span>
            </button>

            <button
              onClick={() => addToCart(product)}
              className="py-2 px-2 bg-[#00f0ff] hover:bg-[#fcee0a] text-slate-950 text-xs font-mono font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 fill-slate-950" />
              <span>AGREGAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}