import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import Swal from 'sweetalert2';

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
    if (this.initialAmount < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Monto no válido',
        text: 'El monto inicial no puede ser negativo.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    const cashRegisterData = {
      user: this.userId,
      initialAmount: this.initialAmount
    };

    this.cashRegisterService.openCashRegister(cashRegisterData).subscribe({
      next: (data) => {
        console.log('Cash register opened successfully', data);
        Swal.fire({
          icon: 'success',
          title: 'Caja Abierta',
          text: 'La caja ha sido abierta exitosamente con el monto inicial registrado.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['dashboard/user']);
        });
      },
      error: (error) => {
        console.error('Error opening cash register', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al abrir la caja. Por favor, inténtalo de nuevo más tarde.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  logout() {
    Swal.fire({
      title: '¿Seguro que quieres salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}
