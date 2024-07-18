import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Ingredient, Supplier } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { SupplierService } from 'src/app/services/provider.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
          return resp.suppliers;
        })
      )
      .subscribe(data => {
        this.suppliers = data!;
      });
  }

  addIngredient() {
    this.newIngredient.company = this.authService.companyId!;
    console.log(this.newIngredient);

    Swal.fire({
      title: '¿Deseas añadir este ingrediente?',
      text: 'Confirma la adición del nuevo ingrediente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, añadir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.ingredientService.createIngredient(this.newIngredient)
          .pipe(map(resp => resp.ingredient))
          .subscribe({
            next: newIngredient => {
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

              Swal.fire({
                text: 'Ingrediente añadido correctamente',
                icon: 'success'
              }).then(() => {
                this.router.navigate(['dashboard/admin/ingredients']);
              });
            },
            error: error => {
              console.error('Error al añadir el ingrediente:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo añadir el ingrediente',
                icon: 'error'
              });
            }
          });
      }
    });
  }
}
