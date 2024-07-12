import { Component, OnInit } from '@angular/core';
import { Supplier, Company } from 'src/app/interfaces/models.interface';
import { SupplierService } from 'src/app/services/provider.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent {

  
    constructor(
      private suppliersService: SupplierService,
      private router: Router,
      private authService: AuthService,
    ) { 
      this.companyId = this.authService.companyId!;
    }
crearSupplier() {
  
    if(this.authService.usuario.role == 'sysadmin'){
      this.router.navigateByUrl(`/dashboard/admin/suppliers/new/${this.authService.companyId}`)
    }else if(this.authService.usuario.role == 'admin'){
      this.router.navigateByUrl(`/dashboard/admin/suppliers/new/${this.authService.companyId}`)
    }

}

  suppliers!: Supplier[];
  companyId!: string;

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers() {
    this.suppliersService.getCompanySuppliers(this.authService.companyId)
      .pipe(
        map(i => {
          console.log('sups', i);
          return i.suppliers;
        })
      )
      .subscribe(suppliers => {
        this.suppliers = suppliers!;
      });
  }

  deleteSupplier(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.suppliersService.deleteSupplier(id).subscribe(() => {
          this.suppliers = this.suppliers.filter(supplier => supplier._id !== id);
          Swal.fire(
            '¡Eliminado!',
            'El proveedor ha sido eliminado.',
            'success'
          );
        }, error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el proveedor.',
            'error'
          );
        });
      }
    });
  }
}