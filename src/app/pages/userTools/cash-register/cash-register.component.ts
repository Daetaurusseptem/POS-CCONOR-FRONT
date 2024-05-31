import { Component } from '@angular/core';
import { CashRegister } from 'src/app/interfaces/models.interface';
import { CashRegisterService } from 'src/app/services/cash-register.service';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.css']
})
export class CashRegisterComponent {
  cashRegisters: CashRegister[] = [];
  initialAmount: number = 0;
  finalAmount: number = 0;
  payments = { cash: 0, credit: 0, debit: 0 };
  notes: string = '';
  currentCashRegisterId: string = '';

  constructor(private cashRegisterService: CashRegisterService) { }

  ngOnInit(): void {
    this.loadCashRegisters();
  }

  loadCashRegisters(): void {
    this.cashRegisterService.getCashRegisters().subscribe({
      next: (data) => {
        this.cashRegisters = data.registrosCaja;
      },
      error: (error) => {
        console.error('Error fetching cash registers', error);
      }
    });
  }

  openCashRegister(): void {
    const cashRegisterData = {
      user: 'user_id_placeholder', // Reemplaza con el ID del usuario actual
      initialAmount: this.initialAmount
    };

    this.cashRegisterService.openCashRegister(cashRegisterData).subscribe({
      next: (data) => {
        this.currentCashRegisterId = data.registroCaja._id;
        this.loadCashRegisters();
      },
      error: (error) => {
        console.error('Error opening cash register', error);
      }
    });
  }

  closeCashRegister(): void {
    const cashRegisterData = {
      finalAmount: this.finalAmount,
      notes: this.notes
    };

    this.cashRegisterService.closeCashRegister(this.currentCashRegisterId, cashRegisterData).subscribe({
      next: (data) => {
        this.currentCashRegisterId = '';
        this.loadCashRegisters();
      },
      error: (error) => {
        console.error('Error closing cash register', error);
      }
    });
  }
}
