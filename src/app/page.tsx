// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { CategoryFilters } from "@/components/category-filters";
import  HeroBanner  from "@/components/hero-banner";
import { ShieldCheck, Truck, Zap, Search, PackageX, Loader2 } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error al cargar productos de Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative">
      {/* BANNER NEÓN DE ANUNCIOS */}
      <HeroBanner />

      {/* BENEFICIOS Y GARANTÍAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950 border border-[#00f0ff]/30 clip-cyber flex items-center gap-4 hover:border-[#fcee0a] transition-all">
          <div className="p-3 bg-slate-900 border border-[#00f0ff] text-[#00f0ff]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-black font-mono text-[#fcee0a]">ENTREGAS RÁPIDAS</h4>
            <p className="text-[11px] text-slate-300">Entrega el mismo día en Montería y despachos a todo el país.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-[#00f0ff]/30 clip-cyber flex items-center gap-4 hover:border-[#fcee0a] transition-all">
          <div className="p-3 bg-slate-900 border border-emerald-400 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-black font-mono text-[#fcee0a]">GARANTÍA DIRECTA</h4>
            <p className="text-[11px] text-slate-300">Productos probados y 100% funcionales.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-[#00f0ff]/30 clip-cyber flex items-center gap-4 hover:border-[#fcee0a] transition-all">
          <div className="p-3 bg-slate-900 border border-[#ff0055] text-[#ff0055]">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-black font-mono text-[#fcee0a]">ATENCIÓN INMEDIATA</h4>
            <p className="text-[11px] text-slate-300">Asesoría directa y confirmación por WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00f0ff]/30 pb-4">
          <div>
            <h2 className="text-xl font-black text-white font-mono tracking-wider flex items-center gap-2">
              CATÁLOGO DESTACADO <span className="w-2 h-2 bg-[#fcee0a] animate-ping"></span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">Selecciona una categoría o escribe lo que buscas</p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o tipo..."
              className="w-full bg-slate-950 border border-[#00f0ff]/50 py-2 pl-10 pr-4 text-xs text-[#00f0ff] font-mono placeholder-slate-600 focus:outline-none focus:border-[#fcee0a]"
            />
            <Search className="w-4 h-4 text-[#00f0ff] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#00f0ff] animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">CARGANDO CATÁLOGO DESDE SUPABASE...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-950 border border-[#ff0055] clip-cyber p-8 text-center space-y-3 max-w-md mx-auto my-8">
            <PackageX className="w-8 h-8 text-[#ff0055] mx-auto" />
            <h3 className="text-xs font-mono font-black text-white">NO HAY PRODUCTOS REGISTRADOS AÚN</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Entra a la ruta <span className="text-[#fcee0a] font-bold">/admin</span> para agregar productos o subir imágenes de banners.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}