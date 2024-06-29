import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Category } from '../interfaces/models.interface';
const urlCategories = `${environment.apiUrl}/categories`
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
                private http:HttpClient,
                private authService:AuthService,
                ) { }
  getCategories() {
    return this.http.get<itemResponse>(`${urlCategories}`,
    this.authService.headers 
    );
  };
  getCategoryById(id:string) {
    return this.http.get<itemResponse>(`${urlCategories}/${id}`,
    this.authService.headers 
    );
  };
  getNumberOfCompanyCategories() {
    return this.http.get<itemResponse>(`${urlCategories}/number`,
    this.authService.headers 
    );
  };
  getCompanyCategories(id:string) {
    
    return this.http.get<itemResponse>(`${urlCategories}/company/${id}`, this.authService.headers);
  }

  getCompanyCategoriesPaginated(id:string, page:number) {
    return this.http.get<itemResponse>(`${urlCategories}/company/${id}?page=${page}`, this.authService.headers);
  };
  deleteCategory(id:string){
    return this.http.delete<itemResponse>(`${urlCategories}/${id}`, this.authService.headers);
  }
  
  updateCategory(id:string, formData:FormData) {
    console.log(`las;kdj;aklsjdlkasjdl;kajsdlkasjd;lkasj`);
    return this.http.put<itemResponse>(`${urlCategories}/${id}`, formData, this.authService.headers );
  };

  createCategory(category:Category, empresaId:string){
    
    return this.http.post<itemResponse>(`${urlCategories}/${empresaId}`, category, this.authService.headers);
  };
}
