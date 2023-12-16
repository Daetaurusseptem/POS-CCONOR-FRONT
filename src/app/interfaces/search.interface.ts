import { Item, Product, Supplier, User, company } from "./models.interface";

export interface Busqueda{
    ok:Boolean,
    busqueda: string;
    users?: User[];
    companies?: company[];
    products?: Product[];
    suppliers?: Supplier[];
    items?: Item[];
    
  }
  