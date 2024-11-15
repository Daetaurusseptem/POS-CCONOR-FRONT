import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../pages/login/login.component';

import { MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';
import { RouterLink } from '@angular/router';
import { ModalImgComponent } from './shared/img-modal/img-modal.component';
import {  CreateUserReComponent } from './shared/create-user/create-user.component';
import { UserListComponent } from './shared/user-list/user-list.component';
import { SpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { LoadingDataSpinnerComponent } from './shared/loading-data-spinner/loading-data-spinner.component';
import { ItemsListComponent } from './shared/items-list/items-list.component';
import { TabsMenuComponent } from './shared/tabs-menu/tabs-menu.component';
import { BackButtonComponent } from './shared/back-button/back-button.component';
import { AlphanumericKeyboardComponent } from './shared/alphanumeric-keyboard/alphanumeric-keyboard.component';
import { UserCajasComponent } from './user-cajas/user-cajas.component';
import { FechaCajasComponent } from './fecha-cajas/fecha-cajas.component';
import { CajaDetailComponent } from './caja-detail/caja-detail.component';




@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    DashboardSidebarComponent,
    ModalImgComponent,
    CreateUserReComponent,
    UserListComponent,
    SpinnerComponent,
    LoadingDataSpinnerComponent,
    ItemsListComponent,
    TabsMenuComponent,
    BackButtonComponent,
    AlphanumericKeyboardComponent,
    UserCajasComponent,
    FechaCajasComponent,
    CajaDetailComponent
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    DashboardSidebarComponent,
    ModalImgComponent,
    UserListComponent,
    SpinnerComponent,
    LoadingDataSpinnerComponent,
    CreateUserReComponent,
    ItemsListComponent,
    TabsMenuComponent,
    BackButtonComponent,
    AlphanumericKeyboardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
    
  ]
})
export class ComponentsModule { }
