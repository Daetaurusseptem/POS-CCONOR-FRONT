;
import { Category, Item, Product, Sale, Supplier, User, Company, CashRegister, Recipe, Ingredient,  } from './models.interface';
import { StripeResponse } from './stripeProduct.interface';
export interface itemResponse {
  ok?:boolean,
  msg?:string,
  company?:Company,
  companies?:Company[],
  user?:User,
  item?:Item,
  items?:Item[],
  users?:User[],
  sale?:Sale,
  sales?:Sale[],
  product?:Product,  
  products?:Product[],  
  categories?:Category[],  
  category?:Category,  
  suppliers?:Supplier[],  
  supplier?:Supplier,  
  totalPages?:number,
  page?:number
  limit?:number,
  img:string;
  stripeResponse:StripeResponse;
  numberOfUsers:number,
  numberOfCompanies:number,
  numberOfProducts:number
  total:number|string;
  totalItems:number|string;
  registroCaja:CashRegister
  registrosCaja:CashRegister[],
  recipes?:Recipe[],
  recipe:Recipe,
  ingredients?:Ingredient[],
  ingredient?:Ingredient,
  currentPage:number
  
}