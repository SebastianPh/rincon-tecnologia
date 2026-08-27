// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extracción de datos de la orden
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const city = formData.get("city") as string;
    const department = formData.get("department") as string;
    const address = formData.get("address") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const total = formData.get("total") as string;
    const items = formData.get("items") as string;
    const receiptFile = formData.get("receipt") as File | null;

    // Lógica de mensajería según la ubicación (Montería vs Nacional)
    const isLocal = city.toLowerCase().includes("monteria") || city.toLowerCase().includes("montería");
    const deliveryNotice = isLocal
      ? "Su pedido será entregado en el transcurso del día en la ciudad de Montería."
      : "Su pedido será alistado y en cuanto sea despachado recibirá el número de guía de la transportadora.";

    // 1. LÓGICA DE ENVÍO DE CORREO INTERNO AL VENDEDOR (Simulación de servicio / Resend / Nodemailer)
    console.log("--> [VENDEDOR NOTIFICACIÓN] Nueva orden recibida:", {
      cliente: name,
      telefono: phone,
      total,
      metodo: paymentMethod,
      comprobanteAdjunto: receiptFile ? receiptFile.name : "N/A (Pago Online/Contraentrega)",
    });

    // 2. LÓGICA DE CONFIRMACIÓN AL COMPRADOR (Correo / WhatsApp API)
    console.log(`--> [CLIENTE NOTIFICACIÓN] Mensaje a ${phone} / ${email}:`, deliveryNotice);

    return NextResponse.json({
      success: true,
      message: "Orden procesada y notificaciones enviadas correctamente.",
      isLocal,
      deliveryNotice,
    });
  } catch (error) {
    console.error("Error en el checkout API:", error);
    return NextResponse.json({ success: false, error: "Error procesando el pedido" }, { status: 500 });
  }
}