// Interfaces for Angular based on Mongoose models


  

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
  _id:string;
  company?: string;
  category?:Category[]
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
  }
  