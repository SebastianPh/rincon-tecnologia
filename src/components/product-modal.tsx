// src/components/product-modal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, Category } from "@/types";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductModal({ isOpen, onClose, onSave }: ProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("gaming");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("5");
  const [badge, setBadge] = useState("DISPONIBLE 🔥");
  
  // Estado para la imagen subida
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  // Manejador para cargar la imagen desde el computador
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      alert("Por favor adjunta una imagen para el producto.");
      return;
    }
    
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      badge,
      features: ["Garantía Directa", "Envío Inmediato"],
      images: [imagePreview],
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white">Agregar Nuevo Producto</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Nombre del Producto *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Mandos DualSense PS5"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Categoría *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="gaming">Gaming</option>
                <option value="smartwear">Smartwear</option>
                <option value="streaming">Streaming</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Precio (COP) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Stock Inicial *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Etiqueta / Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej. DISPONIBLE 🔥"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Descripción Corta *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles del producto, especificaciones rápidas..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* CAMPO DE SUBIDA DE IMAGEN (FILE INPUT) */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Foto del Producto *</label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-950">
              <input
                type="file"
                accept="image/*"
                required={!imagePreview}
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <Image src={imagePreview} alt="Vista previa" fill className="object-cover" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">✓ Imagen cargada correctamente (Haz clic para cambiar)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <Upload className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-medium">Seleccionar imagen desde tu equipo</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG o WEBP</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}