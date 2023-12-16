import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCompanyUserComponent } from './users/create-company-user/create-company-user.component';
import { CompanyUsersComponent } from './users/company-users/company-users.component';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCompanyCategoryComponent } from './Categories/create-company-catregory/create-company-category.component';
import { CategoriesListComponent } from './Categories/categories-list/categories-list.component';
import {  ItemStockListComponent } from './item-list/item-list.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [
    CreateCompanyUserComponent,
    CompanyUsersComponent,
    CreateCompanyCategoryComponent,
    CategoriesListComponent,
    ItemStockListComponent
  ],
  exports:[
    ItemStockListComponent
  ],

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule
  ]
  
})
export class AdminToolsModule { }
