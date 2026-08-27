// src/app/(shop)/carrito/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatCOP } from "@/lib/utils";
import { AnimatedCheckoutModal } from "@/components/animated-checkout-modal";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Send,
  CreditCard,
  Banknote,
  Building2,
  Truck,
  Upload,
  Copy,
  Lock
} from "lucide-react";

export default function CarritoPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Campos de Datos de Envío
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Método de Pago, Recibo y Datos de Tarjeta Embebida
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "card" | "cod">("transfer");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Campos de tarjeta incrustados
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleStartCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (paymentMethod === "transfer" && !receipt) {
      alert("Por favor adjunta la captura o recibo del pago por transferencia antes de continuar.");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvc || !cardHolder)) {
      alert("Por favor completa todos los datos de la tarjeta para procesar el pago.");
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleCompleteCheckout = async () => {
    // 1. Enviar datos y comprobante al servidor por interno (API)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("department", department);
    formData.append("city", city);
    formData.append("neighborhood", neighborhood);
    formData.append("address", address);
    formData.append("notes", notes);
    formData.append("paymentMethod", paymentMethod);
    formData.append("total", formatCOP(totalPrice));
    formData.append("items", JSON.stringify(items));

    if (receipt) {
      formData.append("receipt", receipt);
    }

    try {
      await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Error enviando datos de la orden a la API:", err);
    }

    // 2. Notificación y Redirección a WhatsApp
    const isLocal = city.toLowerCase().includes("monteria") || city.toLowerCase().includes("montería");
    const deliveryInfo = isLocal
      ? "📍 *ENTREGA LOCAL:* Su pedido será entregado en el transcurso del día en Montería."
      : "📦 *ENVÍO NACIONAL:* Su pedido será alistado y en cuanto sea despachado recibirá el número de guía de la transportadora.";

    const paymentLabel = 
      paymentMethod === "transfer" 
        ? "Transferencia Bancaria (Comprobante Adjunto)" 
        : paymentMethod === "card" 
        ? "Pago con Tarjeta / PSE (Procesado en Web)" 
        : "Pago Contra Entrega";

    const message = encodeURIComponent(
      `¡Hola! 👋 Confirmación de pedido registrado desde la web:\n\n` +
      `📋 *RESUMEN DEL PEDIDO:*\n${items.map(i => `• *${i.product.name}* (x${i.quantity}) - ${formatCOP(i.product.price * i.quantity)}`).join("\n")}\n\n` +
      `💰 *TOTAL A PAGAR:* ${formatCOP(totalPrice)}\n` +
      `💳 *MÉTODO DE PAGO:* ${paymentLabel}\n\n` +
      `👤 *DATOS DE ENVÍO:*\n` +
      `• *Cliente:* ${name}\n` +
      `• *Teléfono:* ${phone}\n` +
      `• *Correo:* ${email}\n` +
      `• *Ubicación:* ${city}, ${department}\n` +
      `• *Barrio:* ${neighborhood}\n` +
      `• *Dirección:* ${address}\n` +
      (notes ? `• *Notas:* ${notes}\n` : "") +
      `\n${deliveryInfo}\n\n` +
      `Quedo a la espera de la confirmación.`
    );

    clearCart();
    setIsCheckoutOpen(false);
    window.location.href = `https://wa.me/573136983117?text=${message}`;
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-cyan-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Tu carrito está vacío</h1>
          <p className="text-sm text-slate-400">Explora nuestro catálogo y agrega tus productos favoritos.</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all">
          <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Finalizar Compra</h1>
          <p className="text-xs text-slate-400">Revisa tu carrito, selecciona tu método de pago y completa la entrega</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-4 h-4" /> Seguir comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: RESUMEN DE PRODUCTOS */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" /> Resumen de Productos ({items.length})
          </h2>
          {items.map((item) => (
            <div key={item.product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{item.product.name}</h3>
                  <span className="text-xs text-cyan-400 font-mono font-semibold">{formatCOP(item.product.price)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 text-slate-400 hover:text-white">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-white w-5 text-center">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 text-slate-400 hover:text-white">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button type="button" onClick={() => removeFromCart(item.product.id)} className="p-1 text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA: CHECKOUT Y FORMULARIOS */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <form onSubmit={handleStartCheckout} className="space-y-6">
            
            {/* SECCIÓN 1: DATOS DE ENVÍO */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" /> 1. Datos de Contacto y Envío
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre Completo *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp / Teléfono *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
                <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Departamento *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ciudad / Municipio *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
                <input type="text" required value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Barrio *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
              </div>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección Exacta *" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Indicaciones adicionales (Ej. Dejar en portería)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none" />
            </div>

            {/* SECCIÓN 2: OPCIONES DE PAGO */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" /> 2. Selección de Método de Pago
              </h2>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${paymentMethod === "transfer" ? "bg-cyan-500/10 border-cyan-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}
                >
                  <Building2 className="w-5 h-5 text-cyan-400 mb-2" />
                  <span className="text-xs font-bold block">Transferencia</span>
                  <span className="text-[10px] text-slate-400">Nequi / Bancolombia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${paymentMethod === "card" ? "bg-cyan-500/10 border-cyan-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}
                >
                  <CreditCard className="w-5 h-5 text-cyan-400 mb-2" />
                  <span className="text-xs font-bold block">Tarjeta / PSE</span>
                  <span className="text-[10px] text-slate-400">Pago en línea</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${paymentMethod === "cod" ? "bg-cyan-500/10 border-cyan-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}
                >
                  <Banknote className="w-5 h-5 text-cyan-400 mb-2" />
                  <span className="text-xs font-bold block">Contra Entrega</span>
                  <span className="text-[10px] text-slate-400">Pago en Efectivo</span>
                </button>
              </div>

              {/* BLOQUE DINÁMICO 1: TRANSFERENCIA Y COMPROBANTE */}
              {paymentMethod === "transfer" && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <p className="text-xs text-slate-300 font-semibold">Cuentas disponibles para transferir:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">NEQUI / DAVIPLATA</span>
                        <span className="text-slate-400 font-mono">313 6983117</span>
                      </div>
                      <button type="button" onClick={() => copyToClipboard("3136983117", "Nequi")} className="p-1.5 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">BANCOLOMBIA AHORROS</span>
                        <span className="text-slate-400 font-mono">313-6983117-1</span>
                      </div>
                      <button type="button" onClick={() => copyToClipboard("31369831171", "Bancolombia")} className="p-1.5 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {copiedAccount && (
                    <p className="text-[11px] text-emerald-400 font-medium text-center">✓ Número de {copiedAccount} copiado al portapapeles</p>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <label className="text-xs text-slate-300 font-medium block">Adjuntar Captura o Recibo de Pago *</label>
                    <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/50">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-1.5 text-slate-400">
                        <Upload className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs">
                          {receipt ? <strong className="text-emerald-400">{receipt.name}</strong> : "Haz clic o arrastra tu comprobante aquí"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOQUE DINÁMICO 2: TARJETA / PSE INCORPORADO DIRECTO EN LA PÁGINA */}
              {paymentMethod === "card" && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" /> Pago Directo con Tarjeta / PSE
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">🔒 Cifrado 256-bit SSL</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-medium">Número de Tarjeta *</label>
                      <input
                        type="text"
                        maxLength={19}
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-medium">Expiración (MM/AA) *</label>
                        <input
                          type="text"
                          maxLength={5}
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-medium">Código CVC / CVV *</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-medium">Nombre del Titular *</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Como aparece en la tarjeta"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RESUMEN Y BOTÓN FINAL */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Total a Pagar</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{formatCOP(totalPrice)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {paymentMethod === "card" ? "Procesar Pago en Línea" : "Confirmar y Enviar Pedido"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatedCheckoutModal
        isOpen={isCheckoutOpen}
        paymentMethod={paymentMethod}
        onComplete={handleCompleteCheckout}
      />
    </div>
  );
}