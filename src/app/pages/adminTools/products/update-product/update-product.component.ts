import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Category, Product } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {

  product!: Product;
  id: string = '';
  Categories: Category[] = []


  productForm: FormGroup = this.fb.group({
    categories: [[], Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    marca: ['', Validators.required],
  }
  );


  loadCategories() {
    this.categoryService.getCompanyCategories(this.authService.company!._id!)
      .pipe(
        map(item => {
          console.log(item);
          return item.categories
        })
      )
      .subscribe(categories => {
        this.Categories = categories!

      })
  }

  constructor(
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService,
    private productService: ProductService,
    private modalService: ModalService,

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getProduct(this.id);
      this.loadCategories()
    })
  }

  getProduct(id: string) {
    return this.productService.getProduct(id)
      .pipe(
        map(item => {
          console.log(item);
          return item.product
        })
      )
      .subscribe(product => {

        this.product = product!;

        this.productForm.setValue({

          categories:this.product.categories!,
          name:this.product.name,
          description:this.product.description,
          marca:this.product.marca


        })
      })

  }


  updateProduct() {
    if (this.productForm.valid) {
      console.log('Producto actualizada:', this.productForm.value);
      // Aquí iría el código para enviar los datos actualizados a un servicio o backend


      Swal.fire({
        title: 'estas seguro?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#F176B7'
      })
        .then(resp => {
          if (resp.isConfirmed) {
            this.productService.updateProduct(this.product._id!, this.productForm.value)
              .subscribe(r => {
                this.router.navigateByUrl('/dashboard/sysadmin/companies')
              })
          }
        })
        .catch(r => { return })

    }
  }

  campoNoValidoDatosUsuario(campo: string): boolean {
    if (this.productForm.get(campo)?.invalid) {
      return true;
    } else {
      return false;
    }
  }
   abrirModal( element: Product,tipo:"empresas" | "usuarios" | "productos" ) {
    console.log(element);
    const {_id} = element
    this.modalService.abrirModal(element.img,tipo,_id!);
  }
}
