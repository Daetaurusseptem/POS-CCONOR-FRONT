// Interfaces for Angular based on Mongoose models

import { Provider } from "@angular/core";


  

  // User Interface
  export interface User {
    uid?:string
    _id?: string; // Assuming there is an ID field, usually provided by the database
    companyId?:string;
    email:string;
    username: string;
    password: string;
    name?: string;
    role: 'admin' | 'user'|'sysadmin';
    lastLogin?:Date;
    img?:string;

  }

  export interface PaymentBreakdown {
    cash: number;
    credit: number;
    debit: number;
  }
  
  export interface CashRegister {
    _id:string;
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
  
  
  
  export interface company {
    _id?:string;
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
    _id?:string;
    companyId?: string;
    name?: string;
    description?: string;
    createdAt?: Date;
    
    
}
export interface Lote {
  receivedDate: Date,
  expirationDate: Date,
  proveedor:string,
  supplier:string
}

export interface Supplier {
  _id:string;
  name: string;
  description:string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  company: string; // Referencia a Company
}


export interface Product{
  _id?:string;
  company?: string;
  categories?:Category[]
  supplier:Supplier
  img?:string;
  name?: string;
  description?: string;
  marca?:string
}
export interface Item {
  _id:string
  productId: string,
  name:string,
  description:string;
  img:string;
  stock: Number,
  price: Number,
  expirationDate?: Date;
  discount: number;
  receivedDate: Date,
  supplier: string
  product?:Product
}
  // Sale Interface
  export interface Sale {
    companyId: number;
    _id?: string; // Assuming there is an ID field, usually provided by the database
    user: string|User;
    date: Date;
    total: number;
    discount: number;
    iva?: number;
    productsSold: string[]|Product[];
    paymentReference:string,
    paymentMethod: 'cash' | 'credit',
  }

  //recetas

  export interface Recipe {
    _id: string;
    name: string;
    description: string;
  }
  export interface Ingredient {
    _id?: string;
    name: string;
    quantity: number;
    priceProvider: number;
    measurement: 'grms' | 'ml' | 'kg' | 'lts';
    provider?: Supplier;
    expirationDate?: Date;
    receivedDate: Date;
    company: string;
  }
  