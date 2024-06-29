import { Component } from '@angular/core';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.css']
})
export class DailySalesComponent {

  openCashRegisterWithSales: any;
  usuario = '';

  constructor(
    private cashRegisterService: CashRegisterService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loadOpenCashRegisterWithSales();
    this.usuario = this.authService.usuario.name;
  }

  loadOpenCashRegisterWithSales() {
    const userId = this.authService.usuario.id;
    this.cashRegisterService.getOpenCashRegisterWithSales(userId).subscribe(
      (data) => {
        this.openCashRegisterWithSales = data;
        console.log(this.openCashRegisterWithSales);
      },
      (error) => {
        console.error('Error fetching open cash register with sales', error);
      }
    );
  }
}
