import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrl = `${environment.apiUrl}/sales`;
  constructor(
              private http: HttpClient,
              private authService: AuthService,

            ) { }

  createSale(saleData: any) {
    console.log(saleData);
    return this.http.post<itemResponse>(this.baseUrl, saleData, this.authService.headers);
  }
}