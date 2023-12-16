;
import { Category, Item, Product, Sale, User, company } from './models.interface';
import { StripeResponse } from './stripeProduct.interface';
export interface itemResponse {
  ok?:boolean,
  msg?:string,
  company?:company,
  companies?:company[],
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
  totalPages?:number,
  page?:number
  limit?:number,
  img:string;
  stripeResponse:StripeResponse;
  numberOfUsers:number,
  numberOfCompanies:number,
  numberOfProducts:number
}