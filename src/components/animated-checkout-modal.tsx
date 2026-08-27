// src/components/animated-checkout-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Truck, ShoppingCart, Package, CreditCard } from "lucide-react";

interface AnimatedCheckoutModalProps {
  isOpen: boolean;
  paymentMethod: "transfer" | "card" | "cod";
  onComplete: () => void;
}

export function AnimatedCheckoutModal({ isOpen, paymentMethod, onComplete }: AnimatedCheckoutModalProps) {
  const [step, setStep] = useState<"cart" | "verify" | "truck">("cart");

  useEffect(() => {
    if (!isOpen) {
      setStep("cart");
      return;
    }

    const timer1 = setTimeout(() => setStep("verify"), 2000);
    const timer2 = setTimeout(() => setStep("truck"), 3800);
    const timer3 = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-cyan-500/10 overflow-hidden">

        {/* FASE 1: Empacando en carrito */}
        {step === "cart" && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative h-28 w-full flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 animate-bounce text-cyan-400">
                <Package className="w-8 h-8" />
              </div>
              <div className="animate-pulse text-cyan-400 mt-6">
                <ShoppingCart className="w-16 h-16" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Empacando productos...</h3>
              <p className="text-xs text-slate-400">Verificando disponibilidad de inventario</p>
            </div>
          </div>
        )}

        {/* FASE 2: Verificación exitosa */}
        {step === "verify" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center text-emerald-400 animate-pulse">
              <CheckCircle2 className="w-20 h-20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">¡Pedido Confirmado!</h3>
              <p className="text-xs text-slate-400">Datos guardados e inventario reservado</p>
            </div>
          </div>
        )}

        {/* FASE 3: Despacho adaptado al medio de pago */}
        {step === "truck" && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative h-28 w-full flex items-center justify-center">
              {paymentMethod === "card" ? (
                <div className="text-cyan-400 animate-pulse">
                  <CreditCard className="w-20 h-20" />
                </div>
              ) : (
                <div className="text-cyan-400 animate-bounce">
                  <Truck className="w-20 h-20" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                {paymentMethod === "card" ? "Conectando con Pasarela Segura..." : "Despachando Orden a WhatsApp..."}
              </h3>
              <p className="text-xs text-slate-400">
                {paymentMethod === "card" ? "Abriendo módulo de pago con tarjeta/PSE" : "Enviando resumen y recibo al asesor"}
              </p>
            </div>
          </div>
        )}

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}