import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { itemResponse } from '../interfaces/itemResponse.interface';

const  base_url= environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class ImgService {

  
  constructor(
    private http:HttpClient
  ) { }

  actualizarFoto(
    archivo: File,
    tipo: 'empresas'|'usuarios'|'productos',
    id: string,
  ) {


      console.log(tipo, id);
      const url = `${ base_url }/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('img', archivo);

      return this.http.put<itemResponse>(url, formData, this.headers);

  }

  get headers(): object{
    return {
      headers: {
        'x-token': this.token
      }
    };
  }
  get token(): string{
    return localStorage.getItem('token') || '';
  }
}
