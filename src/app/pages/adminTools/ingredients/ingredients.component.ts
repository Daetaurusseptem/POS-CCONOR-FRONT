import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Ingredient } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IngredientService } from 'src/app/services/ingredient.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent {
  ingredients: Ingredient[] = [];
  companyId!:string;
  constructor(
    private ingredientService: IngredientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.companyId = this.authService.companyId
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientService.getIngredientsByCompanyId(this.companyId)
    .pipe(map(r=>r.ingredients))
    .subscribe(r=>{
        this.ingredients = r!;
      }
    );
  }
}
