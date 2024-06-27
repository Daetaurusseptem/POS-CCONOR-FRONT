import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UsuarioModel } from '../models/usuario.model';

import { tap, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { company } from '../interfaces/models.interface';
import { Router } from '@angular/router';

const url = environment.apiUrl;
const urlAuth = `${url}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public idUsuario!: string
  usuario!: UsuarioModel;
  company!: company;
  companyId!: string;


  constructor(
    private http: HttpClient,
    private router: Router

  ){}

  login(formData: { usuario?: string, password?: string }) {
    this.borrarLocalStorage()

    return this.http.post(`${urlAuth}`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu)
        })
      );
  }


  validarToken(): Observable<boolean> {

    return this.http.get(`${urlAuth}/renew`, this.headers)
      .pipe(
        map((resp: any) => {
          console.log(resp);
          this.idUsuario = resp.uid
          const { name, username, img = '', role, email, _id } = resp.usuario;
          if (role == 'user') {
            const company = resp.usuario.companyId;
            this.companyId = company
          }
          else {
            const company = resp.company
            this.company = company
          }

          this.usuario = new UsuarioModel(_id, username, name, role, email, img);

          this.guardarLocalStorage(resp.token, resp.menu)
          return true;
        }),
        catchError(error => of(false))
      );

  }
  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }
  get getCompany(): company {
    return this.company!;
  }
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get role() {
    return this.usuario.role
  }

  get id(): string {
    return this.usuario!.id || '';
  }
  guardarLocalStorage(token: string, menu: any) {
    var a = JSON.stringify(menu)
    localStorage.setItem('token', token);
    localStorage.setItem('menu', a);
  }

  borrarLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
  }

  logout() {
    this.borrarLocalStorage();
    this.router.navigate(['']);
  }



}