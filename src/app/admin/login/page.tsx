// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "rincon2026") {
      localStorage.setItem("admin_token_rincon", "active");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl shadow-cyan-500/5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Panel de Control</h1>
          <p className="text-xs text-slate-400">Rincón de la Tecnología - Administración</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Contraseña de Administrador</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 font-medium">Contraseña incorrecta. Intenta de nuevo.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}