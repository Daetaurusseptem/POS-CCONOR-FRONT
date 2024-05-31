import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { environment } from 'src/environments/environment';


const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  
  private url = `${baseUrl}/cash-registers`;

  constructor(private http: HttpClient) { }

  openCashRegister(cashRegisterData: any) {
    return this.http.post<itemResponse>(`${this.url}/open`, cashRegisterData);
  }

  closeCashRegister(id: string, cashRegisterData: any){
    return this.http.post<itemResponse>(`${this.url}/close/${id}`, cashRegisterData);
  }

  getCashRegisters() {
    return this.http.get<itemResponse>(`${this.url}`);
  }
}
