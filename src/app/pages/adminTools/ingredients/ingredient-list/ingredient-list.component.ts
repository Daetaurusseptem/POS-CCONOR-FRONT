import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from 'src/app/services/ingredient.service';
import { AuthService } from 'src/app/services/auth.service';
import { Ingredient } from 'src/app/interfaces/models.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent {

  ingredients: Ingredient[] = [];

  constructor(
    private ingredientService: IngredientService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientService.getIngredientsByCompanyId(this.authService.companyId)
      .pipe(map(item => {
        console.log(item);
        return item.ingredients;
      }))
      .subscribe(ingredients => { this.ingredients = ingredients! })
  }

  editIngredient(id: string): void {
    this.router.navigate(['dashboard/admin/ingredients/edit/', id]);
  }

  createIngredient(): void {
    this.router.navigate(['dashboard/admin/ingredients/new']);
  }

  deleteIngredient(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      this.ingredientService.deleteIngredient(id).subscribe(
        () => {
          this.ingredients = this.ingredients.filter(ingredient => ingredient._id !== id);
          alert('Ingrediente eliminado con éxito');
        },
        error => {
          console.error('Error eliminando ingrediente', error);
        }
      );
    }
  }
}