import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ItemService } from 'src/app/services/item.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  itemForm!: FormGroup;
  searchTerm: string = '';
  searchResults: Product[] = [];
  companyId!: string;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {
    this.companyId = this.authService.companyId!;
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      bar_code: [''],
      product: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      expirationDate: [''],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      receivedDate: [new Date(), Validators.required],
    });

    this.loadInitialProducts();
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const newItem = {
        name: this.itemForm.get('name')?.value,
        bar_code: this.itemForm.get('bar_code')?.value,
        product: this.itemForm.get('product')?.value,
        stock: this.itemForm.get('stock')?.value,
        price: this.itemForm.get('price')?.value,
        expirationDate: this.itemForm.get('expirationDate')?.value,
        discount: this.itemForm.get('discount')?.value,
        receivedDate: this.itemForm.get('receivedDate')?.value,
        company: this.companyId,
      };

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres guardar este registro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.itemService.createItem(this.companyId, newItem).subscribe(
            resp => {
              if (resp.ok) {
                Swal.fire('¡Registro Guardado!', '', 'success');
                this.router.navigateByUrl('/dashboard/admin');
              } else {
                Swal.fire('Error', 'Hubo un problema al guardar el registro', 'error');
              }
            },
            error => {
              console.error('Error al crear item', error);
              Swal.fire('Error', 'Hubo un error inesperado', 'error');
            }
          );
        }
      });
    }
  }

  loadInitialProducts(): void {
    this.productService.searchProductCompany('', 1, 5, this.companyId)
      .pipe(map(response => response.products))
      .subscribe(products => {
        this.products = products!;
        this.filteredProducts = products!;
      });
  }

  onSearchProduct(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.productService.searchProductCompany(searchTerm, 1, 5, this.companyId)
        .pipe(map(response => response.products))
        .subscribe(products => {
          this.filteredProducts = products!;
        });
    } else {
      this.loadInitialProducts();
    }
  }

  onSelectProduct(product: Product): void {
    this.selectedProduct = product;
    this.itemForm.patchValue({ product: product._id });
    this.filteredProducts = [];
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
  }
}
