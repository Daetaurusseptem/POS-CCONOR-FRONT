import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Ingredient, Supplier } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { SupplierService } from 'src/app/services/provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ingredient',
  templateUrl: './create-ingredient.component.html',
  styleUrls: ['./create-ingredient.component.css']
})
export class CreateIngredientComponent {
  ingredients: Ingredient[] = [];
  suppliers: Supplier[] = [];

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
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadIngredients();
    this.getSuppliers();
  }

  loadIngredients() {
    this.ingredientService.getIngredientsByCompanyId(this.authService.companyId!)
      .pipe(map(r => r.ingredients))
      .subscribe(data => {
        this.ingredients = data!;
      });
  }

  getSuppliers() {
    this.providerService.getCompanySuppliers(this.authService.companyId!)
      .pipe(
        map(resp => {
          console.log(resp);
          return resp.suppliers
        })
      )
      .subscribe(data => {
        this.suppliers = data!;
      });
  }

  addIngredient() {
    this.newIngredient.company = this.authService.companyId!
    console.log(this.newIngredient);

    this.ingredientService.createIngredient(this.newIngredient)
      .pipe(map(resp => resp.ingredient))
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

        this.router.navigate(['dashboard/admin/ingredients']);
      });
  }
}
