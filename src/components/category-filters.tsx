// src/components/category-filters.tsx
"use client";

import { Category } from "@/types";
import { Gamepad2, Watch, Tv, Cpu, Grid } from "lucide-react";

interface CategoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilters({ selectedCategory, onSelectCategory }: CategoryFiltersProps) {
  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "Todos", icon: <Grid className="w-4 h-4" /> },
    { id: "gaming", label: "Gaming", icon: <Gamepad2 className="w-4 h-4" /> },
    { id: "smartwear", label: "Smartwear", icon: <Watch className="w-4 h-4" /> },
    { id: "streaming", label: "Streaming", icon: <Tv className="w-4 h-4" /> },
    { id: "accesorios", label: "Accesorios", icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              isActive
                ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}