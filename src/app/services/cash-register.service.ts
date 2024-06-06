import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';


const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  
  private url = `${baseUrl}/cash-registers`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,

  ) { }

  hasOpenCashRegister(userId: string) {
    return this.http.get<boolean>(`${this.url}/has-open/${userId}`);
  }

  openCashRegister(cashRegisterData: any) {
    return this.http.post<itemResponse>(`${this.url}/open`, cashRegisterData, this.authService.headers);
  }

  closeCashRegister(id: string, cashRegisterData: any){
    return this.http.post<itemResponse>(`${this.url}/close/${id}`, cashRegisterData, this.authService.headers);
  }

  getCashRegisters() {
    return this.http.get<itemResponse>(`${this.url}`);
  }
}
 