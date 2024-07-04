import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Ingredient, Supplier } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { SupplierService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent {
  ingredients: Ingredient[] = [];
  suppliers: Supplier[] = []; // Almacena la lista de proveedores
  newIngredient: Ingredient = {
    name: '',
    quantity: 0,
    priceProvider: 0,
    measurement: 'grms',
    provider: undefined,
    receivedDate: new Date(),
    company: ''
  };

  constructor(
    private ingredientService: IngredientService, 
    private providerService: SupplierService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadIngredients();
    this.getSuppliers(); // Carga la lista de proveedores al inicializar el componente
  }

  loadIngredients(): void {
    this.ingredientService.getIngredientsByCompanyId(this.authService.companyId!)
      .pipe(map(r=>r.ingredients))
      .subscribe(data => {
      this.ingredients = data!;
    });
  }

  getSuppliers(): void {

    this.providerService.getCompanySuppliers(this.authService.companyId!)
    .pipe(
      map(resp=>{
        console.log(resp);
        return resp.suppliers
      })
    )
    .subscribe(data => {
      this.suppliers = data!;
    });
  }

  addIngredient(): void {
    this.newIngredient.company = this.authService.companyId!
    console.log(this.newIngredient);

    this.ingredientService.createIngredient(this.newIngredient)
     .pipe(map(resp =>resp.ingredient)) 
    .subscribe(newIngredient => {
      this.ingredients.push(newIngredient!);
      // Reset newIngredient after successful addition
      this.newIngredient = {
        name: '',
        quantity: 0,
        priceProvider: 0,
        measurement: 'grms',
        provider: undefined,
        receivedDate: new Date(),
        company: ''
      };
    });
  
}
}
