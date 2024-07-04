import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCompanyUserComponent } from './users/create-company-user/create-company-user.component';
import { CompanyUsersComponent } from './users/company-users/company-users.component';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCompanyCategoryComponent } from './Categories/create-company-catregory/create-company-category.component';
import { CategoriesListComponent } from './Categories/categories-list/categories-list.component';
import { ItemStockListComponent } from './item-list/item-list.component'; // Asegúrate de importar correctamente
import { ComponentsModule } from 'src/app/components/components.module';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { CreateSupplierComponent } from './Suppliers/create-supplier/create-supplier.component';
import { UpdateProductComponent } from './products/update-product/update-product.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { UpdateSuppliersComponent } from './Suppliers/update-suppliers/update-suppliers.component';
import { ItemsComponent } from './items/items.component';
import { AddItemComponent } from './add-item/add-item.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SuppliersListComponent } from './Suppliers/suppliers-list/suppliers-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditCategoryComponent } from './Categories/edit-category/edit-category.component';
import { RecipeListComponent } from './Recipes/recipe-list/recipe-list.component';
import { CreateRecipeComponent } from './Recipes/create-recipe/create-recipe.component';
import { EditRecipeComponent } from './Recipes/edit-recipe/edit-recipe.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { IngredientsAdminListComponent } from './ingredients/ingredients-admin-list/ingredients-admin-list.component';
import { EditIngredientComponent } from './ingredients/edit-ingredient/edit-ingredient.component';





@NgModule({
  declarations: [
    CreateCompanyUserComponent,
    CompanyUsersComponent,
    CreateCompanyCategoryComponent,
    CategoriesListComponent,
    ItemStockListComponent,
    CreateProductComponent,
    CreateSupplierComponent,
    UpdateProductComponent,
    ProductsListComponent,
    UpdateSuppliersComponent,
    ItemsComponent,
    AddItemComponent,
    SuppliersListComponent,
    EditCategoryComponent,
    RecipeListComponent,
    CreateRecipeComponent,
    EditRecipeComponent,
    IngredientListComponent,
    IngredientsComponent,
    IngredientsAdminListComponent,
    EditIngredientComponent,
    
  ],
  exports:[
    ItemStockListComponent,
    ProductsListComponent,
    CategoriesListComponent,
    SuppliersListComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class AdminToolsModule { }
