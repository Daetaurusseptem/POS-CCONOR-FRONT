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
   urlRecipes = `${environment.apiUrl}/recipe`;
  constructor(
    private http:HttpClient,
    private authService:AuthService,
    ){}
getCompanyRecipes() {
return this.http.get<itemResponse>(`${this.urlRecipes}/${this.authService.company._id}`);
this.authService.headers 
};
getProduct(id:string) {
return this.http.get<itemResponse>(`${this.urlRecipes}/${id}`,
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
return this.http.get<itemResponse>(`${this.urlRecipes}/search/${companyId}`, { params });
}

getCompanyProducts(id:string) {
return this.http.get<itemResponse>(`${this.urlRecipes}/company/${id}`, this.authService.headers);
};
deleteProduct(id:string){
return this.http.delete<itemResponse>(`${this.urlRecipes}/${id}`, this.authService.headers);
}
updateProduct(id:string, formData:FormData) {
return this.http.put<itemResponse>(`${this.urlRecipes}/${id}`, formData, this.authService.headers );
};

createProduct(empresaId:string,product:Recipes){

return this.http.post<itemResponse>(`${this.urlRecipes}/${empresaId}`, product, this.authService.headers);
};
}
