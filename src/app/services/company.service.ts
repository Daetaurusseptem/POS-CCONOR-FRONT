import { Injectable } from '@angular/core';
import { company } from '../interfaces/models.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { AuthService } from './auth.service';

const urlApi = `${environment.apiUrl}/companies`
const urlApiCompanies = `${environment.apiUrl}/companies`

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
              private http:HttpClient,
              private authService:AuthService,

              ) { }
  // Método para obtener empresas de prueba
  getCompanies() {
    return this.http.get<itemResponse>(`${urlApiCompanies}`,
    this.authService.headers 
    );
  };
  getNumberOfCompanies() {
    return this.http.get<itemResponse>(`${urlApiCompanies}/number`,
    this.authService.headers 
    );
  };
  getCompany(id:string) {
    return this.http.get<itemResponse>(`${urlApiCompanies}/${id}`, this.authService.headers);
  };
  deleteCompany(id:string){
    return this.http.delete<itemResponse>(`${urlApiCompanies}/${id}`, this.authService.headers);
  }
  
  updateCompany(id:string, formData:FormData) {
    console.log(formData);
    return this.http.put<itemResponse>(`${urlApiCompanies}/${id}`, formData, this.authService.headers );
  };

  createCompany(company:company){
    
    return this.http.post<itemResponse>(`${urlApiCompanies}`, company, this.authService.headers);
  };
}
