import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { Category, Product, Supplier } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/provider.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {

  suppliers!:Supplier[]
  Categories!:Category[]
  companyId=''
  public imagenSubir!: File;


  productForm!: FormGroup;
  public imgTemp: any = null;
  constructor(
                private fb: FormBuilder,
                private authService: AuthService,
                private categoryService: CategoryService,
                private supplierService: SupplierService,
                private productService: ProductService,
                private modal: ModalService,
              ) { }

  ngOnInit(): void {
    this.companyId = this.authService.companyId;
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      marca: ['', Validators.required],
      supplier: ['', Validators.required],
      categories: [[], Validators.required]
    });
    this.loadCategories();
    this.loadSuppliers();
  }
  loadCategories(){
   this.categoryService.getCompanyCategories(this.companyId)
    .pipe(
      map(item =>{
        console.log(item);
        return item.categories
      })
    )
    .subscribe(categories=>{
      this.Categories = categories!
      
    }) 
  }
  loadSuppliers(){
    this.supplierService.getCompanySuppliers(this.companyId)
    .pipe(
      map(item =>{
        console.log(item);
        return item.suppliers
      })
    )
    .subscribe(suppliers=>{
      this.suppliers = suppliers!
      
    })
  }
  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      Swal.fire({
        'text':'Estas seguro?'
      })
      .then(res=>{
        if(res.isConfirmed){
          this.productService.createProduct(this.authService.companyId,this.productForm.value)
          .subscribe(r=>{
            if(r.ok){
              Swal.fire('Registro Guardado','','success')
            }else if(!r.ok){
              Swal.fire('Registro No Guardado','','error')
            }
          })
        }
      })
    }
  }


}
