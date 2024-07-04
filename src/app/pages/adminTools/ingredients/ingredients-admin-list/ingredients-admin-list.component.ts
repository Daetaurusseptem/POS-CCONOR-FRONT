import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from 'src/app/services/ingredient.service';
import { AuthService } from 'src/app/services/auth.service';
import { Ingredient } from 'src/app/interfaces/models.interface';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-ingredients-admin-list',
  templateUrl: './ingredients-admin-list.component.html',
  styleUrls: ['./ingredients-admin-list.component.css']
})
export class IngredientsAdminListComponent {
  ingredient!: Ingredient[];
  companyName!: string;

  constructor(
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ){}

  ngOnInit(): void {
    this.getIngredients();
  }

  getIngredients(): void {
    this.ingredientService.getIngredients()
      .subscribe(ingredients => {
        this.ingredient = ingredients;
        this.companyName = this.authService.company.name;
      });
  }

}
