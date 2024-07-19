import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map } from 'rxjs';
import { Ingredient } from 'src/app/interfaces/models.interface';
import { IngredientService } from 'src/app/services/ingredient.service';
import Swal from 'sweetalert2';

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
          Swal.fire({
            title: 'Error',
            text: 'Error al obtener el ingrediente',
            icon: 'error'
          });
        }
      );
  }

  formatDate(isoString: string): string {
    return moment(isoString).format('YYYY-MM-DD');
  }

  regresarOrCancelar() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cancelar la edición?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar editando'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/dashboard/admin/ingredients']);
      }
    });
  }

  onSubmit(): void {
    if (this.editIngredientForm.invalid) {
      Swal.fire({
        title: 'Formulario no válido',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'warning'
      });
      return;
    }

    const updatedIngredient: Ingredient = {
      expirationDate: moment(this.editIngredientForm.value.expirationDate).toISOString(),
      receivedDate: moment(this.editIngredientForm.value.receivedDate).toISOString(),
      _id: this.ingredientId,
      ...this.editIngredientForm.value
    };

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar este ingrediente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ingredientService.updateIngredient(this.ingredientId, updatedIngredient).subscribe(
          response => {
            console.log('Ingrediente actualizado con éxito', response);
            Swal.fire({
              text: 'Ingrediente actualizado correctamente',
              icon: 'success'
            }).then(() => {
              this.router.navigate(['/dashboard/admin/ingredients']);
            });
          },
          error => {
            console.error('Error actualizando ingrediente', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar el ingrediente',
              icon: 'error'
            });
          }
        );
      }
    });
  }
}
