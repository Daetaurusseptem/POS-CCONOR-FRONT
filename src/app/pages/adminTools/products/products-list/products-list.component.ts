import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/interfaces/models.interface';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  companyId: any;
  products!: Product[];
  companyName!: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.authService.usuario.role == 'sysadmin') {
      this.activatedRoute.params.subscribe(params => {
        this.companyId = params['id'];
      });
    } else if (this.authService.usuario.role == 'admin') {
      this.companyId = this.authService.companyId;
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

  crearProducto(): void {
    if (this.authService.usuario.role == 'sysadmin') {
      this.router.navigateByUrl(`/dashboard/sysadmin/product/new/${this.companyId}`);
    } else if (this.authService.usuario.role == 'admin') {
      this.router.navigateByUrl(`/dashboard/admin/product/new`);
    }
  }

  eliminarProducto(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(
          () => {
            this.products = this.products.filter(product => product._id !== id);
            Swal.fire('Eliminado', 'El producto ha sido eliminado correctamente.', 'success');
          },
          error => {
            console.error('Error al eliminar producto', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
          }
        );
      }
    });
  }

  editarProducto(id: string): void {
    if (this.authService.usuario.role == 'sysadmin') {
      this.router.navigateByUrl(`/dashboard/sysadmin/product/edit/${id}/${this.companyId}`);
    } else if (this.authService.usuario.role == 'admin') {
      this.router.navigateByUrl(`/dashboard/admin/product/edit/${id}`);
    }
  }
}
