import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipesService } from 'src/app/services/recipes.service';
import { AuthService } from 'src/app/services/auth.service';
import { Ingredient, Recipe } from 'src/app/interfaces/models.interface';
import { IngredientService } from 'src/app/services/ingredient.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  createRecipeForm!: FormGroup;
  ingredients: Ingredient[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipesService,
    private ingredientService: IngredientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRecipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([])
    });

    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientService.getIngredientsByCompanyId(this.authService.companyId)
    .pipe(map(r=>{
      console.log(r);
      return r.ingredients
    }))
    .subscribe(
      ingredients => {
        this.ingredients = ingredients!;
      },
      error => {
        console.error('Error fetching ingredients', error);
      }
    );
  }

  get ingredientsArray(): FormArray {
    return this.createRecipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredientsArray.push(this.fb.group({
      ingredient: ['', Validators.required],
      quantity: [0, Validators.required]
    }));
  }

  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.createRecipeForm.invalid) {
      return;
    }

    const newRecipe: Recipe = this.createRecipeForm.value;
    this.recipeService.createRecipe(newRecipe,this.authService.companyId).subscribe((resp: any) =>{
        console.log('Receta creada con éxito', resp);
        this.router.navigate(['dashboard/admin/recipes']);
      }
    );
  }
}