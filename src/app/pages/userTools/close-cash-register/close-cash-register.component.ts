import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CashRegisterService } from 'src/app/services/cash-register.service';

@Component({
  selector: 'app-close-cash-register',
  templateUrl: './close-cash-register.component.html',
  styleUrls: ['./close-cash-register.component.css']
})
export class CloseCashRegisterComponent {
  closeCashRegisterForm!: FormGroup;
  cashRegister: any;
  totalSales: number = 0;
  cashSales: number = 0;
  creditSales: number = 0;
  debitSales: number = 0;
  cashId!:string;

  constructor(
    private fb: FormBuilder,
    private cashRegisterService: CashRegisterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.closeCashRegisterForm = this.fb.group({
      finalAmount: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    const userId = this.authService.usuario.id;
    this.cashRegisterService.getOpenCashRegister(userId).subscribe(data => {
      this.cashRegister = data;
      this.cashId=data._id
      this.totalSales = this.cashRegister.payments.cash + this.cashRegister.payments.credit + this.cashRegister.payments.debit;
      this.cashSales = this.cashRegister.payments.cash;
      this.creditSales = this.cashRegister.payments.credit;
      this.debitSales = this.cashRegister.payments.debit;
    });
  }

  closeCashRegister(): void {
    if (this.closeCashRegisterForm.invalid) {
      return;
    }

    const cashRegisterData = {
      finalAmount: this.closeCashRegisterForm.get('finalAmount')?.value,
      notes: this.closeCashRegisterForm.get('notes')?.value
    };

    const userId = this.authService.usuario.id;

    this.cashRegisterService.closeCashRegister(this.cashId, cashRegisterData).subscribe(response => {
      console.log('Cash register closed successfully', response);
      this.router.navigate(['/user-home']);
    }, error => {
      console.error('Error closing cash register', error);
    });
  }
}
