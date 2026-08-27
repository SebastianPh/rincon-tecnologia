// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Package, ShieldCheck, Check, Lock, LogOut, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Estado Formulario Productos
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("Gaming");
  const [prodDesc, setProdDesc] = useState("");
  const [prodBadge, setProdBadge] = useState("NUEVO");
  const [prodFile, setProdFile] = useState<File | null>(null);

  // Validación de credenciales contra Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .eq("password_hash", password)
        .eq("role", "admin")
        .single();

      if (error || !data) {
        alert("Credenciales inválidas o no tienes permisos de Administrador.");
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      alert("Error al validar sesión.");
    } finally {
      setLoginLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `products/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFile || !prodName || !prodPrice) return alert("Completa el nombre, precio y foto");

    setLoading(true);
    setMessage("");

    try {
      const imageUrl = await uploadImage(prodFile);

      const { error } = await supabase.from("products").insert([
        {
          name: prodName,
          price: parseFloat(prodPrice),
          category: prodCategory,
          description: prodDesc,
          badge: prodBadge,
          images: [imageUrl],
          in_stock: true,
        },
      ]);

      if (error) throw error;

      setMessage("¡Producto guardado e ingresado al catálogo!");
      setProdName("");
      setProdPrice("");
      setProdDesc("");
      setProdFile(null);
    } catch (err: any) {
      alert("Error guardando producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-950 border border-[#00f0ff]/40 clip-cyber space-y-6">
        <div className="text-center space-y-2">
          <Lock className="w-10 h-10 text-[#fcee0a] mx-auto" />
          <h1 className="text-xl font-black font-mono text-white">ACCESO ADMINISTRADOR</h1>
          <p className="text-xs font-mono text-slate-400">Ingresa tu correo y clave de administrador</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300">Correo Admin</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rincondelatecnologia.com"
              className="w-full bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white font-mono focus:border-[#fcee0a] outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white font-mono focus:border-[#fcee0a] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-2.5 bg-[#fcee0a] text-slate-950 font-black font-mono text-xs clip-cyber-btn hover:bg-[#e0d300] transition-all flex items-center justify-center gap-2"
          >
            {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "VERIFICAR EN SUPABASE"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-[#00f0ff]/30 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-mono text-white flex items-center gap-2">
            PANEL DE ADMINISTRACIÓN <ShieldCheck className="w-5 h-5 text-[#fcee0a]" />
          </h1>
          <p className="text-xs font-mono text-slate-400">Rincón de la Tecnología // Sesión Activa</p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> CERRAR SESIÓN
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" /> {message}
        </div>
      )}

      {/* FORMULARIO PRODUCTOS */}
      <form onSubmit={handleSaveProduct} className="bg-slate-950 border border-[#00f0ff]/40 clip-cyber p-6 space-y-4">
        <h2 className="text-sm font-black font-mono text-[#00f0ff] uppercase flex items-center gap-2">
          <Package className="w-4 h-4" /> AGREGAR NUEVO PRODUCTO AL CATÁLOGO
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300">Nombre del Producto</label>
            <input
              type="text"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="Ej: Consola Retro R36S"
              className="w-full bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300">Precio en Pesos COP ($)</label>
            <input
              type="number"
              value={prodPrice}
              onChange={(e) => setProdPrice(e.target.value)}
              placeholder="180000"
              className="w-full bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300">Categoría</label>
            <select
              value={prodCategory}
              onChange={(e) => setProdCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-[#00f0ff] font-mono focus:border-[#00f0ff] outline-none"
            >
              <option value="Gaming">Gaming</option>
              <option value="Smartwear">Smartwear</option>
              <option value="Streaming">Streaming</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300">Etiqueta Destacada</label>
            <input
              type="text"
              value={prodBadge}
              onChange={(e) => setProdBadge(e.target.value)}
              placeholder="Ej: DISPONIBLE 🔥"
              className="w-full bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-300">Descripción Corta</label>
          <textarea
            value={prodDesc}
            onChange={(e) => setProdDesc(e.target.value)}
            rows={2}
            placeholder="Escribe las características principales..."
            className="w-full bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-300">Foto del Producto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProdFile(e.target.files?.[0] || null)}
            className="w-full bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-300 font-mono"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00f0ff] text-slate-950 font-black font-mono text-xs clip-cyber-btn hover:bg-[#00c8d6] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {loading ? "GUARDANDO EN SUPABASE..." : "AGREGAR PRODUCTO AL CATÁLOGO"}
        </button>
      </form>
    </div>
  );
}