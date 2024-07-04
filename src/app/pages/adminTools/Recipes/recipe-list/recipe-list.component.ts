import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/interfaces/models.interface';
import { RecipesService } from 'src/app/services/recipes.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipesService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (data: Recipe[]) => {
        this.recipes = data;
      },
      error => {
        console.error('Error fetching recipes', error);
      }
    );
  }

  createRecipe(): void {
    this.router.navigate(['dashboard/admin/recipes/new']);
  }

  editRecipe(id: string): void {
    this.router.navigate(['/dashboard/admin/recipes/edit', id]);
  }

  deleteRecipe(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      this.recipeService.deleteRecipe(id).subscribe(r=>{
        console.log(r);
      }
      );
    }
  }
}