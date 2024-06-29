import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Category, User } from 'src/app/interfaces/models.interface';
import { CategoryService } from 'src/app/services/category.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {

  category!: Category;
  constructor(
    private categoryService: CategoryService,
    private userService: UsersService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required], // Inicializa con un string vacío o datos existentes
    description: ['', Validators.required],
  }
  );

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.loadCategory(params['id'])

    })
  }

  loadCategory(idCategory: string) {
    this.categoryService.getCategoryById(idCategory)
      .pipe(map(resp => resp.category))
      .subscribe(category => {
        console.log(category!.name);
        this.category = category!;
        console.log("Categoria obtenida: ", this.category);
        this.categoryForm.setValue({
          name: category!.name,
          description: category!.description,
        })
        console.log(this.categoryForm.value);
      })
  }


  campoNoValidoDatosUsuario(campo: string): boolean {
    if (this.categoryForm.get(campo)?.invalid) {
      return true;
    } else {
      return false;
    }
  }

  actualizarCategory() {
    if (this.categoryForm.valid) {
      console.log('Formulario válido, datos de la categoría:', this.categoryForm.value);
      console.log('ID de la categoría:', this.category._id);

      Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#F176B7'
      })
        .then(resp => {
          if (resp.isConfirmed) {
            console.log('Confirmación recibida, actualizando categoría...');
            this.categoryService.updateCategory(this.category._id!, this.categoryForm.value)
              .subscribe(
                r => {
                  console.log('Respuesta del servicio:', r);
                  this.router.navigateByUrl('/dashboard/sysadmin/users');
                },
                error => {
                  console.error('Error al actualizar la categoría:', error);
                }
              );
          } else {
            console.log('Actualización cancelada por el usuario');
          }
        })
        .catch(error => {
          console.error('Error en el diálogo de confirmación:', error);
        });
    } else {
      console.log('Formulario no válido');
    }
  }
}
