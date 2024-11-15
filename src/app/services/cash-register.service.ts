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

  closeCashRegister(id: string, cashRegisterData: any) {
    return this.http.post<any>(`${this.url}/close/${id}`, cashRegisterData, this.authService.headers);
  }

  getCashRegisters() {
    return this.http.get<itemResponse>(`${this.url}`);
  }

  getOpenCashRegister(userId: string) {
    return this.http.get<any>(`${this.url}/open/${userId}`);
  }

  getDailySales() {
    return this.http.get<any>(`${baseUrl}/daily-sales`, this.authService.headers);
  }
  
  // Obtener caja abierta con ventas
  getOpenCashRegisterWithSales(userId: string) {
    return this.http.get<any>(`${this.url}/open-with-sales/${userId}`, this.authService.headers);
  }

  // Obtener todas las fechas con cajas abiertas del usuario
  getUserCajasByDate(userId: string) {
    return this.http.get<any>(`${this.url}/user/${userId}/cajas`, this.authService.headers);
  }

  // Obtener cajas abiertas de un usuario en una fecha específica
  getUserCashRegistersByDate(userId: string, startDate: string) {
    console.log(`${this.url}/user/${userId}/cajas/${startDate}`);
    return this.http.get<any>(`${this.url}/user/${userId}/cajas/${startDate}`, this.authService.headers);
  }

  

  // Obtener detalles de una caja específica
  getCajaDetailsById(cajaId: string) {
    return this.http.get<any>(`${this.url}/cajas/${cajaId}`, this.authService.headers);
  }
}
