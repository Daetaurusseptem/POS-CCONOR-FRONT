import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Category, Supplier } from '../interfaces/models.interface';
const urlSuppliers = `${environment.apiUrl}/suppliers`
@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
                private http:HttpClient,
                private authService:AuthService,
                ) { }
  getSuppliers() {
    return this.http.get<itemResponse>(`${urlSuppliers}`,
    this.authService.headers 
    );
  };
  getSupplier(idSupplier:String) {
    return this.http.get<itemResponse>(`${urlSuppliers}/${idSupplier}`,
    this.authService.headers 
    );
  };
  
  getCompanySuppliers(id:string) {
    
    return this.http.get<itemResponse>(`${urlSuppliers}/company/${id}`, this.authService.headers);
  }

 
  deleteSupplier(id:string){
    return this.http.delete<itemResponse>(`${urlSuppliers}/${id}`, this.authService.headers);
  }
  
  updateSupplier(id:string, formData:any) {
    console.log(formData);
    return this.http.put<itemResponse>(`${urlSuppliers}/${id}`, formData, this.authService.headers );
  };

  createSupplier(supplier:any, companyId:string){

    return this.http.post<itemResponse>(`${urlSuppliers}/${companyId}`, supplier, this.authService.headers);
  };
}
