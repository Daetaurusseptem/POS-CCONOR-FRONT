import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CashRegister } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CashRegisterService } from 'src/app/services/cash-register.service';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.css']
})
export class CashRegisterComponent {
  openCashRegisterForm!: FormGroup;
  showForm: boolean = false;
  isOpenCashRegister: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cashRegisterService: CashRegisterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.openCashRegisterForm = this.fb.group({
      initialAmount: [0, [Validators.required, Validators.min(0)]]
    });
    this.checkOpenCashRegister();
  }

  checkOpenCashRegister() {
    const userId = this.authService.usuario.id;
    this.cashRegisterService.hasOpenCashRegister(userId).subscribe((hasOpen) => {
      this.isOpenCashRegister = hasOpen;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  openCashRegister() {
    if (this.isOpenCashRegister) return;

    const userId = this.authService.usuario.id;
    const initialAmount = this.openCashRegisterForm.get('initialAmount')!.value;

    const cashRegisterData = {
      user: userId,
      initialAmount: initialAmount
    };

    this.cashRegisterService.openCashRegister(cashRegisterData).subscribe({
      next: (data) => {
        console.log('Cash register opened successfully', data);
        this.router.navigate(['dashboard/user']);
      },
      error: (error) => {
        console.error('Error opening cash register', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}