import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { Category, Product, Recipe, Supplier } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/provider.service';
import { RecipesService } from 'src/app/services/recipes.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {

  
  suppliers!: Supplier[];
  Categories!: Category[];
  recipes!: Recipe[];
  companyId = '';
  isComposite = false;
  public imagenSubir!: File;

  productForm!: FormGroup;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private recipeService: RecipesService,
    private modal: ModalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.companyId = this.authService.companyId
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      marca: ['', Validators.required],
      supplier: ['', Validators.required],
      categories: [[], Validators.required],
      isComposite: [false, Validators.required],
      recipe: ['']
    });
    this.loadCategories();
    this.loadSuppliers();
    this.loadRecipes();
  }

  loadCategories() {
    this.categoryService.getCompanyCategories(this.companyId)
      .pipe(map(item => item.categories))
      .subscribe(categories => {
        this.Categories = categories!;
      });
  }

  loadSuppliers() {
    this.supplierService.getCompanySuppliers(this.companyId)
      .pipe(map(item => item.suppliers))
      .subscribe(suppliers => {
        this.suppliers = suppliers!;
      });
  }

  loadRecipes() {
    this.recipeService.getCompanyRecipes(this.authService.companyId)
      .pipe(map(item => item.recipes))
      .subscribe(recipes => {
        this.recipes = recipes!;
      });
  }

  onIsCompositeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value === 'true';
    this.isComposite = value;
    if (!value) {
      this.productForm.get('recipe')!.setValue('');
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      Swal.fire({
        title: 'Crear Producto',
        text: '¿Estás seguro de crear este producto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then(res => {
        if (res.isConfirmed) {
          const formValue = {...this.productForm.value};
          if (!this.isComposite || !formValue.recipe) {
            delete formValue.recipe;
          }
          this.productService.createProduct(this.authService.companyId, formValue).subscribe(
            r => {
              if (r.ok) {
                Swal.fire('Registro Guardado', '', 'success');
                this.router.navigate(['/dashboard/admin/products']);
              } else {
                Swal.fire('Registro No Guardado', '', 'error');
              }
            });
        }
      });
    }
  }
}
