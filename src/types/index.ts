// src/types/index.ts

export type Category = 'gaming' | 'smartwear' | 'streaming' | 'accesorios';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  price: number;
  stock: number;
  badge?: string;
  features: string[];
  images: string[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  items: CartItem[];
  total: number;
  status: 'pendiente' | 'confirmado' | 'enviado';
  createdAt: string;
}