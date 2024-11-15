import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-close-cash-register',
  templateUrl: './close-cash-register.component.html',
  styleUrls: ['./close-cash-register.component.css']
})
export class CloseCashRegisterComponent {
  closeCashRegisterForm!: FormGroup;
  cashRegister: any = null;
  totalSales: number = 0;
  cashSales: number = 0;
  creditSales: number = 0;
  debitSales: number = 0;
  cashId!: string;

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

    // Obtener caja abierta
    this.cashRegisterService.getOpenCashRegister(userId).subscribe(
      data => {
        this.cashRegister = data;
        this.cashId = data._id;
        this.totalSales = this.cashRegister.payments.cash + this.cashRegister.payments.credit + this.cashRegister.payments.debit;
        this.cashSales = this.cashRegister.payments.cash;
        this.creditSales = this.cashRegister.payments.credit;
        this.debitSales = this.cashRegister.payments.debit;
      },
      error => {
        if (error.status === 404) {
          // Mostrar alerta si no se encuentra una caja abierta
          Swal.fire({
            icon: 'warning',
            title: 'Caja no encontrada',
            text: 'No se encontró una caja abierta para este usuario.',
            confirmButtonText: 'Ir al Dashboard',
            confirmButtonColor: '#6c757d'
          }).then(() => {
            // Redirigir al usuario al dashboard si no hay caja abierta
            this.router.navigate(['dashboard/user']);
          });
        } else {
          // Manejo de otros errores
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar la información de la caja. Por favor, inténtelo de nuevo más tarde.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    );
  }

  closeCashRegister(): void {
    if (this.closeCashRegisterForm.invalid) {
      return;
    }

    const cashRegisterData = {
      finalAmount: this.closeCashRegisterForm.get('finalAmount')?.value,
      notes: this.closeCashRegisterForm.get('notes')?.value
    };

    this.cashRegisterService.closeCashRegister(this.cashId, cashRegisterData).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Caja cerrada',
          text: 'La caja se ha cerrado con éxito.',
          confirmButtonText: 'Ir al Dashboard',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['dashboard/user']);
        });
      },
      error => {
        console.error('Error closing cash register', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cerrar la caja. Por favor, inténtelo de nuevo más tarde.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
      }
    );
  }
}
