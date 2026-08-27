// src/lib/products.ts
import { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-r36s",
    name: "Consola Portátil Retro R36S 64GB",
    slug: "consola-retro-r36s",
    description: "Consola portátil de código abierto con pantalla IPS de 3.5 pulgadas y más de 15,000 juegos retro cargados.",
    category: "gaming",
    price: 180000,
    stock: 5,
    badge: "DISPONIBLE 🔥",
    features: [
      "+15,000 juegos clásicos integrados",
      "Pantalla IPS de alta resolución (640x480)",
      "Sistema Linux de código abierto",
      "Incluye manual y cable de carga USB-C"
    ],
    images: ["/images/products/r36s.jpg"]
  },
  {
    id: "prod-hk11",
    name: "Smartwatch HK11 Pro Max 46mm",
    slug: "smartwatch-hk11-pro-max",
    description: "Reloj inteligente multifuncional Serie 11 con notificaciones, llamadas Bluetooth y seguimiento deportivo.",
    category: "smartwear",
    price: 230000,
    stock: 8,
    badge: "DISPONIBLE 🔥",
    features: [
      "Serie 11 multifuncional",
      "Incluye correa extra + cargador magnético",
      "Monitor de salud y modos deportivos",
      "Conectividad Bluetooth para llamadas"
    ],
    images: ["/images/products/hk11-promax.jpg"]
  },
  {
    id: "prod-gamesir",
    name: "Control GameSir Kaleid Flux (Xbox / PC)",
    slug: "control-gamesir-kaleid-flux",
    description: "Control profesional con licencias oficiales de Xbox y Windows. Módulos con tecnología Hall Effect anti-drift.",
    category: "gaming",
    price: 220000,
    stock: 3,
    badge: "INCLUYE GAME PASS ULTIMATE 1 MES 🔥🚀",
    features: [
      "Licencia oficial Xbox / Windows PC",
      "Joysticks y gatillos con tecnología Hall Effect Anti-Drift",
      "Cuerpo semitransparente con iluminación RGB",
      "Cable USB-C trenzado reforzado incluido"
    ],
    images: ["/images/products/gamesir-flux.jpg"]
  },
  {
    id: "prod-zoku",
    name: "TV Box Zoku 4K Streaming (8GB + 128GB)",
    slug: "tv-box-zoku-4k",
    description: "Dispositivo de streaming 4K Ultra HD impulsado por Google TV con soporte para las principales plataformas.",
    category: "streaming",
    price: 190000,
    stock: 10,
    badge: "DISPONIBLE 8GB + 128GB 🔥🤝",
    features: [
      "Sistema Google TV completo (Netflix, YouTube, Disney+)",
      "Resolución 4K Ultra HD",
      "Memoria masiva de 8GB RAM + 128GB ROM",
      "Incluye control por voz y cable HDMI"
    ],
    images: ["/images/products/zoku-tvbox.jpg"]
  }
];