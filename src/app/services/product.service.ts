import { Injectable } from '@angular/core';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Category, Product } from '../interfaces/models.interface';

const urlProducts = `${environment.apiUrl}/products`


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
                private http:HttpClient,
                private authService:AuthService,
                ){}
  getProducts() {
    return this.http.get<itemResponse>(`${urlProducts}`,
    this.authService.headers 
    );
  };
 
  getCompanyProducts(id:string) {
    return this.http.get<itemResponse>(`${urlProducts}/company/${id}`, this.authService.headers);
  };
  deleteProduct(id:string){
    return this.http.delete<itemResponse>(`${urlProducts}/${id}`, this.authService.headers);
  }
  updateProduct(id:string, formData:FormData) {
    return this.http.put<itemResponse>(`${urlProducts}/${id}`, formData, this.authService.headers );
  };

  createProduct(product:Product){
    return this.http.post<itemResponse>(`${urlProducts}`, product, this.authService.headers);
  };
}
