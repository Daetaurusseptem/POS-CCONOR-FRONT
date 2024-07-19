import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/models.interface';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  categories!: Category[];
  companyId!: string;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.companyId = this.authService.companyId;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCompanyCategories(this.authService.companyId)
      .pipe(
        map(i => {
          console.log(this.categories);
          return i.categories;
        })
      )
      .subscribe(categories => {
        this.categories = categories!;
      });
  }

  crearCategory() {
    Swal.fire({
      title: 'Crear nueva categoría',
      text: "¿Deseas crear una nueva categoría?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const role = this.authService.role;
        const navigateTo = role === 'admin' 
          ? `/dashboard/admin/categories/new/${this.companyId}` 
          : `/dashboard/sysadmin/categories/new/${this.companyId}`;

        this.router.navigate([navigateTo]).catch((error) => {
          Swal.fire(
            'Error',
            'Hubo un problema al redirigir a la creación de la categoría.',
            'error'
          );
        });
      }
    });
  }

  eliminarCategory(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe(() => {
          this.categories = this.categories.filter(category => category._id !== id);
          Swal.fire(
            '¡Eliminado!',
            'La categoría ha sido eliminada.',
            'success'
          );
        }, error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar la categoría.',
            'error'
          );
        });
      }
    });
  }
}
