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
    private http: HttpClient,
    private authService: AuthService,
  ) { }
  getProducts() {
    return this.http.get<itemResponse>(`${urlProducts}`,
      this.authService.headers
    );
  };
  getProduct(id: string) {
    return this.http.get<itemResponse>(`${urlProducts}/${id}`,
      this.authService.headers
    );
  };

  searchProductCompany(search: string = '', page: number = 1, limit: number = 5, companyId: string) {
    const params = {
      search,
      page: page.toString(),
      limit: limit.toString(),
      companyId
    };
    return this.http.get<itemResponse>(`${urlProducts}/search/${companyId}`, { params });
  }

  getCompanyProducts(id: string) {
    console.log('skfnsfnsofnsoenfi',id);
    return this.http.get<itemResponse>(`${urlProducts}/company/${id}`, this.authService.headers);
  };
  getCompanyProductsSysadmin(id: string) {
    if (!id) {
        throw new Error("Company ID is required");
    }
    return this.http.get<itemResponse>(`${urlProducts}/company/sysadmin/${id}`, this.authService.headers);
}

  deleteProduct(id: string) {
    return this.http.delete<itemResponse>(`${urlProducts}/${id}`, this.authService.headers);
  }
  updateProduct(id: string, formData: FormData) {
    return this.http.put<itemResponse>(`${urlProducts}/${id}`, formData, this.authService.headers);
  };

  createProduct(empresaId: string, product: FormData) {

    return this.http.post<itemResponse>(`${urlProducts}/${empresaId}`, product, this.authService.headers);
  };
}
