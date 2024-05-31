import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CashRegisterService } from 'src/app/services/cash-register.service';

@Component({
  selector: 'app-open-cash-register',
  templateUrl: './open-cash-register.component.html',
  styleUrls: ['./open-cash-register.component.css']
})
export class OpenCashRegisterComponent {
  initialAmount: number = 0;
  showForm: boolean = false;
  userId: string;

  constructor(
    private cashRegisterService: CashRegisterService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userId = this.authService.usuario.id; // Asume que AuthService tiene un método para obtener el ID del usuario actual
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  openCashRegister() {
    const cashRegisterData = {
      user: this.userId,
      initialAmount: this.initialAmount
    };

    this.cashRegisterService.openCashRegister(cashRegisterData).subscribe({
      next: (data) => {
        console.log('Cash register opened successfully', data);
        //guardar
      },
      error: (error) => {
        console.error('Error opening cash register', error);
      }
    });
  }

  logout() {
    
    this.router.navigate(['/login']);
  }
}
