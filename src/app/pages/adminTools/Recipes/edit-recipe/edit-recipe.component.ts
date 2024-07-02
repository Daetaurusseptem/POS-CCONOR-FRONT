import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from 'src/app/services/recipes.service';
import { Recipe } from 'src/app/interfaces/models.interface';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  recipeId: string;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      // Puedes agregar más campos aquí según tu modelo de receta
    });
    this.recipeId = '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = params['id'];
      if (this.recipeId) {
        this.loadRecipe();
      }
    });
  }

  loadRecipe(): void {
    this.recipeService.getRecipe(this.recipeId).subscribe(
      (response) => {
        console.log(response);
        const recipe = response.recipe;
        this.recipeForm.patchValue({
          name: recipe.name,
          description: recipe.description,
          // Actualiza aquí con más campos si es necesario
        });
      },
      (error) => {
        console.error('Error al cargar la receta:', error);
        // Aquí podrías manejar el error, por ejemplo, redirigiendo a la lista de recetas
      }
    );
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const updatedRecipe: Recipe = {
        ...this.recipeForm.value,
        _id: this.recipeId
      };

      this.recipeService.updateRecipe(this.recipeId, updatedRecipe).subscribe(
        (response) => {
          console.log('Receta actualizada:', response);
          this.router.navigate(['/dashboard/admin/recipes']);
        },
        (error) => {
          console.error('Error al actualizar la receta:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      );
    }
  }
}