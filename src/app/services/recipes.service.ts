import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { environment } from 'src/environments/environment.development';
import { Recipes } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private urlRecipes = `${environment.apiUrl}/recipe`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getRecipe(id: string) {
    return this.http.get<itemResponse>(`${this.urlRecipes}/by-Id/${id}`, this.authService.headers);
  }

  getAllRecipes() {
    return this.http.get<itemResponse>(`${this.urlRecipes}`, this.authService.headers);
  }

  getCompanyRecipes(companyId: string) {
    return this.http.get<itemResponse>(`${this.urlRecipes}/${companyId}`, this.authService.headers);
  }

  createRecipe(recipe: Recipes) {
    return this.http.post<itemResponse>(`${this.urlRecipes}`, recipe, this.authService.headers);
  }

  deleteRecipe(id: string) {
    return this.http.delete<itemResponse>(`${this.urlRecipes}/${id}`, this.authService.headers);
  }

  updateRecipe(id: string, recipe: Recipes) {
    return this.http.put<itemResponse>(`${this.urlRecipes}/${id}`, recipe, this.authService.headers);
  }
}