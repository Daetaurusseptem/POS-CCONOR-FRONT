import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsaleComponent } from './newsale/newsale.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';



@NgModule({
  declarations: [
    NewsaleComponent,
    CashRegisterComponent
  ],
  exports: [
    NewsaleComponent,
    CashRegisterComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ]
})
export class UserToolsModule { }
