import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../interfaces/models.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private baseUrl = `${environment.apiUrl}/ingredients`;  

  constructor(private http: HttpClient) { }

  createIngredient(ingredientData: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.baseUrl}`, ingredientData);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.baseUrl}`);
  }
}
