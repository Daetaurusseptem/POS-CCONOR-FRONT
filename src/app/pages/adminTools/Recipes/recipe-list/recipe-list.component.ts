import { Component, OnInit } from '@angular/core';
import { Recipes } from 'src/app/interfaces/models.interface';
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
  recipes: Recipes[] = [];
  companyId!: string;

  constructor(
    private recipeService: RecipesService,
    private authService: AuthService,
    private router: Router,
  ) {

    if (this.authService.usuario.role === 'admin') {
      this.companyId = this.authService.company._id!;
    } else if(this.authService.usuario.role === 'user') {
      this.companyId = this.authService.companyId;
    }
  }

  ngOnInit(): void {
    this.getRecipes();
  }
  
  getRecipes(): void {
    this.recipeService.getCompanyRecipes(this.companyId)
      .pipe(map(response => response.recipes))
      .subscribe(recipes => {
        this.recipes = recipes || [];
      });
  }

  deleteRecipe(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      this.recipeService.deleteRecipe(id).subscribe(() => {
        this.recipes = this.recipes.filter(recipe => recipe._id !== id);
      });
    }
  }

  editRecipe(idRecipie: string): void {
  }
}