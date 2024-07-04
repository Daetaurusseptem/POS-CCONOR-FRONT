import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../interfaces/models.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { itemResponse } from '../interfaces/itemResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private baseUrl = `${environment.apiUrl}/ingredients`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,

  ) { }

  createIngredient(ingredientData: Ingredient) {
    return this.http.post<itemResponse>(`${this.baseUrl}`, ingredientData, this.authService.headers);
  }

  getIngredients(){
    return this.http.get<itemResponse>(`${this.baseUrl}`, this.authService.headers);
  }

  getIngredientsByCompanyId(companyId: string) {
    return this.http.get<itemResponse>(`${this.baseUrl}/company/${companyId}`, this.authService.headers);
  }

  getIngredientById(id: string) {
    return this.http.get<itemResponse>(`${this.baseUrl}/${id}`);
  }

  updateIngredient(id: string, ingredientData: Ingredient) {
    return this.http.put<itemResponse>(`${this.baseUrl}/${id}`, ingredientData);
  }

  deleteIngredient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
