import { Component, OnInit } from '@angular/core';
import { Supplier, Company } from 'src/app/interfaces/models.interface';
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
  companyId!: string;

  constructor(
    private suppliersService: SupplierService,
    private authService: AuthService,
  ) { 
    this.companyId = this.authService.companyId!;
  }

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
}