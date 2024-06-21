import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
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

  selectProduct(product: any) {
    // Implementa la lógica que se ejecuta cuando un usuario selecciona un producto de la lista
    console.log('Producto seleccionado:', product);
  }
  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
  }

  itemForm!: FormGroup;
  searchTerm: string = '';
  searchResults: Product[] = [];
  companyId!:string

  products: Product[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private itemService: ItemService,
    private authservice: AuthService,
    private router: Router,
    

  ) {
    this.companyId = this.authservice.company._id!
   }

  

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      product: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      expirationDate: [''],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      receivedDate: [new Date(), Validators.required],
    });
  }

  

  onSubmit() {
    const obj = {
      "name":this.itemForm.get('name')?.value,
      "product":this.itemForm.get('product')?.value,
      "stock":this.itemForm.get('stock')?.value,
      "price":this.itemForm.get('price')?.value,
      "expirationDate":this.itemForm.get('expiration')?.value,
      "discount":this.itemForm.get('discount')?.value,
      "receivedDate":this.itemForm.get('receivedDate')?.value,
      "company":this.itemForm.get('company')?.value,
    }
    if (this.itemForm.valid) {
      console.log(this.itemForm.value);
      Swal.fire({
        text:'Estas Seguro?',
        icon:"question"
      })
      .then(res=>{
        if(res.isConfirmed){
          this.itemService.createItem(this.authservice.getCompany._id!,obj)
        
          .subscribe(resp=>{
            if(resp.ok){
              Swal.fire('Registro Guardado','','success')
              this.router.navigateByUrl('/dashboard/admin')
            }else if(!resp.ok){
              Swal.fire('Registro No Guardado','','error')
            }
          })
        }
      })
    }
  }

  loadInitialProducts(): void {
    this.productService.searchProductCompany('', 1, 5, this.companyId).subscribe(response => {
      this.products = response.products!;
      this.filteredProducts = response.products!;
    });
  }

  onSearchProduct(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.productService.searchProductCompany(searchTerm, 1, 5, this.companyId).subscribe(response => {
        this.filteredProducts = response.products!;
      });
    } else {
      this.loadInitialProducts();
    }
  }

  onSelectProduct(product: any): void {
    this.selectedProduct = product;
    this.itemForm.patchValue({ product: product._id });
    this.filteredProducts = [];
  }



 

 
}