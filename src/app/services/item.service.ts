import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Category, Item } from '../interfaces/models.interface';
import { Observable } from 'rxjs';
const urlBase = `${environment.apiUrl}/items`
@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getItems(page: number, limit: number, search?: string): Observable<itemResponse> {
    const params: any = { page: page.toString(), limit: limit.toString() };
    if (search) {
      params.name = search;
    }
  
    if (this.authService.role === 'admin') {
      return this.http.get<itemResponse>(`${urlBase}/${this.authService.companyId}`, { params, headers: { 'x-token': this.authService.token } });
    } else if(this.authService.role === 'user') {
      return this.http.get<itemResponse>(`${urlBase}/${this.authService.companyId}`, { params, headers: { 'x-token': this.authService.token } });
    } else {
      throw new Error('Invalid role');
    }
  }
  

  
  getNumberOfCompanyItems() {
    return this.http.get<itemResponse>(`${urlBase}/number`,
      this.authService.headers
    );
  };

  getCompanyItems(id: string) {
    return this.http.get<itemResponse>(`${urlBase}/company/${id}`, this.authService.headers);
  };

  getCompanyItemsSysadmin(id: string) {
    return this.http.get<itemResponse>(`${urlBase}/company/sysadmin/${id}`, this.authService.headers);
  };
  deleteItem(id: string) {
    return this.http.delete<itemResponse>(`${urlBase}/${id}`, this.authService.headers);
  }

  updateItem(id: string, formData: FormData) {
    console.log(formData);
    return this.http.put<itemResponse>(`${urlBase}/${id}`, formData, this.authService.headers);
  };

  createItem(empresaId: string,item:any) {

    return this.http.post<itemResponse>(`${urlBase}/${empresaId}`, item, this.authService.headers);
  };

  getItemsByCategory(category: string, search: string = '', page: number = 1, limit: number = 10, idEmpresa?: string) {
     if(idEmpresa) {
       return this.http.get<itemResponse>(`${urlBase}/by-category/${idEmpresa}`, {
         params: {
           category,
           search,
           page: page.toString(),
           limit: limit.toString()
           
         },
         headers: {'x-token':this.authService.token}
       });
     } else {
       return this.http.get<itemResponse>(`${urlBase}/by-category/${this.authService.companyId}`, {
         params: {
           category,
           search,
           page: page.toString(),
           limit: limit.toString()
           
         },
         headers: {'x-token':this.authService.token}
       });
     }
  }
}
