import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map } from 'rxjs';
import { Ingredient } from 'src/app/interfaces/models.interface';
import { IngredientService } from 'src/app/services/ingredient.service';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.css']
})
export class EditIngredientComponent {

  editIngredientForm!: FormGroup;
  ingredientId!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ingredientId = this.route.snapshot.paramMap.get('id')!;
    this.editIngredientForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, Validators.required],
      priceProvider: [0, Validators.required],
      receivedDate: ['', Validators.required],
      expirationDate: ['']
    });
    this.loadIngredient();
  }

  loadIngredient(): void {
    this.ingredientService.getIngredientById(this.ingredientId)
      .pipe(map(r => r.ingredient))
      .subscribe(ingredient => {

        ingredient!.expirationDate = this.formatDate(ingredient!.expirationDate as string);
        ingredient!.receivedDate = this.formatDate(ingredient!.receivedDate as string);

        this.editIngredientForm.patchValue(ingredient!);
      },
        error => {
          console.error('Error fetching ingredient', error);
        }
      );
  }

  formatDate(isoString: string): string {
    return moment(isoString).format('YYYY-MM-DD');
  }

  regresarOrCancelar() {

  }

  onSubmit(): void {
    if (this.editIngredientForm.invalid) {
      return;
    }

    const updatedIngredient: Ingredient = {
      expirationDate: moment(this.editIngredientForm.value.expirationDate).toISOString(),
      receivedDate: moment(this.editIngredientForm.value.receivedDate).toISOString(),
      _id: this.ingredientId,
      ...this.editIngredientForm.value
    };

    this.ingredientService.updateIngredient(this.ingredientId, updatedIngredient).subscribe(
      response => {
        console.log('Ingrediente actualizado con éxito', response);
        this.router.navigate(['/dashboard/admin/ingredients']);
      },
      error => {
        console.error('Error actualizando ingrediente', error);
      }
    );
  }
}
