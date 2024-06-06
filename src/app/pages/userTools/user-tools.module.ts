import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsaleComponent } from './newsale/newsale.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OpenCashRegisterComponent } from './open-cash-register/open-cash-register.component';
import { UserHomeComponent } from './user-home/user-home.component';



@NgModule({
  declarations: [
    NewsaleComponent,
    CashRegisterComponent,
    OpenCashRegisterComponent,
    UserHomeComponent
  ],
  exports: [
    NewsaleComponent,
    CashRegisterComponent,
    OpenCashRegisterComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
    
  ]
})
export class UserToolsModule { }
