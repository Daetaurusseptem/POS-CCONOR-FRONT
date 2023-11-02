// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component'; // Importa tu componente de landing page
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Ruta para la landing page
  { path: 'login', component: LoginComponent },  // Define la ruta para el componente de login

  // ... otras rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
