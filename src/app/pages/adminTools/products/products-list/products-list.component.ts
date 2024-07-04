import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/interfaces/models.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent {
  products!: Product[];
  companyName!: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProducts(this.authService.companyId);
  }

  getProducts(idEmpresa: string): void {
    this.productService.getCompanyProducts(idEmpresa)
      .pipe(map(item => item.products))
      .subscribe(products => {
        this.products = products!;
        this.companyName = this.authService.company.name;
      });
  }
}