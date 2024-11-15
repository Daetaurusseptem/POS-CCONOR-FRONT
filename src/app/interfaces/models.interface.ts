// Interfaces for Angular based on Mongoose models

import { Provider } from "@angular/core";

// User Interface
export interface User {
  uid?: string;
  _id?: string; // Assuming there is an ID field, usually provided by the database
  companyId?: string;
  email: string;
  username: string;
  password: string;
  name?: string;
  role: 'admin' | 'user' | 'sysadmin';
  lastLogin?: Date;
  img?: string;
}

export interface PaymentBreakdown {
  cash: number;
  credit: number;
  debit: number;
}

export interface CashRegister {
  _id: string;
  user: string | User; // ID del usuario que realizó el corte de caja
  startDate: Date; // Fecha de inicio del corte
  endDate: Date; // Fecha de fin del corte
  initialAmount: number; // Dinero inicial en caja
  finalAmount: number; // Dinero final en caja
  payments: PaymentBreakdown; // Desglose de pagos por tipo
  sales: string[]; // Referencia a las ventas incluidas en el corte
  notes: string; // Notas para inconsistencias u otros comentarios
  closed: boolean; // Indicador de si la caja está cerrada
}

export interface Company {
  _id?: string;
  name: string;
  adminId: string; // Referencia al usuario administrador
  img: string;
  description: string;
  address: string;
  tel: string;
  email: string;
  createdAt: Date;
  SuscriptionsHistory: Suscription[];
}

export interface Suscription {
  month: string;
  cutOffDate: Date;
  state: 'Activo' | 'Inactivo' | 'Pendiente';
  amountPaid: number;
  Paymethod: string;
  payReference: string;
}

export interface Category {
  _id?: string;
  companyId?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
}

export interface Lote {
  receivedDate: Date;
  expirationDate: Date;
  proveedor: string;
  supplier: string;
}

export interface Supplier {
  _id: string;
  name: string;
  description: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  company: string; // Referencia a Company
}

export interface Product {
  _id?: string;
  company?: string;
  categories?: Category[];
  supplier: Supplier;
  img?: string;
  name?: string;
  description?: string;
  marca?: string;
  isComposite: boolean;
  recipe?: string; // ID de la receta si es un producto compuesto
}
export interface Item {
  _id: string;
  productId: string;
  name: string;
  description: string;
  img: string;
  stock: number;
  price: number;
  expirationDate?: string;
  discount: number;
  receivedDate: string;
  supplier: string;
  product?: Product;
  modifications?: {
    name: string;
    extraPrice: number;
  }[];
}
export interface ProductSold {
  product: string|Item;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  companyId: string;
  _id?: string;
  product?: Product;
  user: string | User;
  date: Date;
  total: number;
  discount: number;
  iva?: number;
  productsSold: ProductSold[];
  paymentReference?: string; // Ahora es opcional
  paymentMethod: 'cash' | 'credit';
  receivedAmount?: number; // Agregado campo opcional
  change?: number; // Agregado campo opcional
}

// Recetas
export interface RecipeIngredient {
  ingredient: string; // ID del ingrediente
  quantity: number;
}

export interface Recipe {
  _id: string;
  name: string;
  description: string;
  company: string;
  ingredients: RecipeIngredient[];
}

export interface Ingredient {
  _id?: string;
  name: string;
  quantity: number;
  priceProvider: number;
  measurement: 'grms' | 'ml' | 'kg' | 'lts';
  provider?: Supplier;
  expirationDate?: Date|string;
  receivedDate: Date|string;
  company: string|String;
}