import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipesService } from 'src/app/services/recipes.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  availableIngredients: string[] = ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3', 'Ingrediente 4'];
  selectedIngredients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      // Puedes agregar más campos aquí según tu modelo de receta
    });
  }

  ngOnInit(): void {}

  onIngredientSelect(event: any): void {
    const selectedOptions = event.target.selectedOptions;
    for (let i = 0; i < selectedOptions.length; i++) {
      const ingredientName = selectedOptions[i].value;
      if (!this.selectedIngredients.some(ing => ing.name === ingredientName)) {
        this.selectedIngredients.push({
          name: ingredientName,
          quantity: 0,
          unit: 'ml'
        });
      }
    }
  }

  removeIngredient(index: number): void {
    this.selectedIngredients.splice(index, 1);
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const newRecipe = this.recipeForm.value;
      newRecipe.company = this.authService.company._id;

      this.recipeService.createRecipe(newRecipe).subscribe(
        response => {
          console.log('Receta creada:', response);
          this.router.navigate(['/dashboard/admin/recipes']); // Ajusta esta ruta según tu estructura
        },
        error => {
          console.error('Error al crear la receta:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      );
    }
  }
}