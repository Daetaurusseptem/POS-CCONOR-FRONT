import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCompanyUserComponent } from './users/create-company-user/create-company-user.component';
import { CompanyUsersComponent } from './users/company-users/company-users.component';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCompanyCategoryComponent } from './Categories/create-company-catregory/create-company-category.component';
import { CategoriesListComponent } from './Categories/categories-list/categories-list.component';
import { ItemStockListComponent } from './Items/item-list/item-list.component'; // Asegúrate de importar correctamente
import { ComponentsModule } from 'src/app/components/components.module';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { CreateSupplierComponent } from './Suppliers/create-supplier/create-supplier.component';
import { UpdateProductComponent } from './products/update-product/update-product.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { UpdateSuppliersComponent } from './Suppliers/update-suppliers/update-suppliers.component';
import { AddItemComponent } from './Items/add-item/add-item.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SuppliersListComponent } from './Suppliers/suppliers-list/suppliers-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditCategoryComponent } from './Categories/edit-category/edit-category.component';
import { RecipeListComponent } from './Recipes/recipe-list/recipe-list.component';
import { CreateRecipeComponent } from './Recipes/create-recipe/create-recipe.component';
import { EditRecipeComponent } from './Recipes/edit-recipe/edit-recipe.component';
import { UpdateItemComponent } from './Items/update-item/update-item.component';
import { IngredientListComponent } from './ingredients/ingredient-list/ingredient-list.component';
import { CreateIngredientComponent } from './ingredients/create-ingredient/create-ingredient.component';
import { EditIngredientComponent } from './ingredients/edit-ingredient/edit-ingredient.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgChartsModule } from 'ng2-charts';
import { ManagePrintersComponent } from './manage-printers/manage-printers.component';








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
    AddItemComponent,
    SuppliersListComponent,
    EditCategoryComponent,
    RecipeListComponent,
    CreateRecipeComponent,
    EditRecipeComponent,
    UpdateItemComponent,
    IngredientListComponent,
    CreateIngredientComponent,
    EditIngredientComponent,
    UpdateItemComponent,
    StatisticsComponent,
    ManagePrintersComponent
  ],
  exports:[
    ItemStockListComponent,
    ProductsListComponent,
    CategoriesListComponent,
    SuppliersListComponent,
    UpdateItemComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    NgxPaginationModule,
    NgSelectModule,
    NgChartsModule
    
  ]
})
export class AdminToolsModule { }
