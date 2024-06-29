import { Component } from '@angular/core';
import { Recipes } from 'src/app/interfaces/models.interface';
import { RecipesService } from 'src/app/services/recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
 recipes!: Recipes[];
 recipeName!: string;

 pop='asdasd'


 constructor(
  private recipeService: RecipesService,
  private authService: AuthService,

 ) {}

 ngOnInit(): void {
  this.getRecipes();
 }
 
 getRecipes(): void {
  this.recipeService.getCompanyRecipes()
  .pipe(map(recipes=>recipes.recipes))
  .subscribe(recipes => {
    this.recipes = recipes!;
  })
 }
}