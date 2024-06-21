import { Injectable } from '@angular/core';
import { User } from '../interfaces/models.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { itemResponse } from '../interfaces/itemResponse.interface';
import { AuthService } from './auth.service';



const urlApi = `${environment.apiUrl}`;
const urlApiUsers = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
              private http:HttpClient,
              private authService:AuthService
             ) { }

  // Método para obtener empresas de prueba
  getUsers() {
    return this.http.get<User[]>(`${urlApiUsers}`, this.authService.headers);
  }
  getNumberUsers() {
    return this.http.get<itemResponse>(`${urlApiUsers}/number`, this.authService.headers);
  }
  getUserById(id:string) {
    return this.http.get<itemResponse>(`${urlApiUsers}/${id}`, this.authService.headers);
  }
  getUserByIdAdminCompany(id:string) {
    return this.http.get<itemResponse>(`${urlApiUsers}/company/solo/${id}`, this.authService.headers);
  }
  getCompanyAdmin(id:string) {
    return this.http.get<itemResponse>(`${urlApiUsers}/company/admin/${id}`, this.authService.headers);
  }

  getAllNonAdminUsersOfCompany(userId:string) {
    
    return this.http.get<itemResponse>(`${urlApiUsers}/company/${userId}`, this.authService.headers);
  }
  getAllAdmins() {
    
    return this.http.get<itemResponse>(`${urlApiUsers}/company/admins/all`, this.authService.headers);
  }
  getUnassignedAdmins() {
    
    return this.http.get<itemResponse>(`${urlApiUsers}/company/admins/unassigned`, this.authService.headers);
  }
  isAdmin(empresaId:string, adminId:string) {
    return this.http.get<itemResponse>(`${urlApiUsers}/admins/${empresaId}/${adminId}`, this.authService.headers);


  }
  deleteuser(id:string){
    return this.http.delete<itemResponse>(`${urlApiUsers}/${id}`, this.authService.headers);
  }
  


  updateUser(id:string, formData:FormData) {
    console.log(formData);
    return this.http.put<itemResponse>(`${urlApiUsers}/${id}`, formData, this.authService.headers )
    
    
  }
    availableAdmins(){
    return this.http.get<itemResponse>(`${urlApiUsers}/company/admins/unassigned`, this.authService.headers);
  }
  createUser(user:User){
    
    return this.http.post<itemResponse>(`${urlApiUsers}`, user,this.authService.headers);
  };
}