import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Category } from '../interfaces/models.interface';
const urlCategories = `${environment.apiUrl}/items`
@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
                private http:HttpClient,
                private authService:AuthService,
                ) { }
  getItems() {
    return this.http.get<itemResponse>(`${urlCategories}`,
    this.authService.headers 
    );
  };
  getNumberOfCompanyItems() {
    return this.http.get<itemResponse>(`${urlCategories}/number`,
    this.authService.headers 
    );
  };
  getCompanyItems(id:string) {
    return this.http.get<itemResponse>(`${urlCategories}/company/${id}`, this.authService.headers);
  };
  deleteItem(id:string){
    return this.http.delete<itemResponse>(`${urlCategories}/${id}`, this.authService.headers);
  }
  
  updateItem(id:string, formData:FormData) {
    console.log(formData);
    return this.http.put<itemResponse>(`${urlCategories}/${id}`, formData, this.authService.headers );
  };

  createItem(category:Category){
    
    return this.http.post<itemResponse>(`${urlCategories}`, category, this.authService.headers);
  };
}

