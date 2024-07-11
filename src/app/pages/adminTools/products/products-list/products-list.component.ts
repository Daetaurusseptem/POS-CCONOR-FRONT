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
  companyId: any;

  products!: Product[];
  companyName!: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if(this.authService.usuario.role=='sysadmin'){

      this.activatedRoute.params.subscribe(params => {
        this.companyId = params['id'];
    
      }
    )
    }else if(this.authService.usuario.role=='admin'){
      this.companyId = this.authService.companyId
    }
  }

  ngOnInit(): void {
    this.getProducts(this.companyId);
  }

  getProducts(idEmpresa: string): void {
    this.productService.getCompanyProducts(idEmpresa)
      .pipe(map(item => item.products))
      .subscribe(products => {
        this.products = products!;
        this.companyName = this.authService.company.name;
      });
  }
  crearProducto() {
    //routerLink="/dashboard/admin/product/new"
     if(this.authService.usuario.role == 'sysadmin'){
       this.router.navigateByUrl(`/dashboard/sysadmin/product/new/${this.companyId}`)
     }else if(this.authService.usuario.role == 'admin'){
       this.router.navigateByUrl(`/dashboard/admin/product/new`)
     }
   
   }
}