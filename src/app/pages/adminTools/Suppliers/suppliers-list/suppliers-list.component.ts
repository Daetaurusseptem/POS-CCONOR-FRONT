import { Component, OnInit } from '@angular/core';
import { Supplier, company } from 'src/app/interfaces/models.interface';
import { SupplierService } from 'src/app/services/provider.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent {

  suppliers!: Supplier[];
  company!: company;

  constructor(
    private suppliersService: SupplierService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.company = this.authService.getCompany;
    this.getSuppliers(this.company._id!);
  }

  getSuppliers(idEmpresa: string) {
    this.suppliersService.getCompanySuppliers(idEmpresa)
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
}