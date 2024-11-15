import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Item } from 'src/app/interfaces/models.interface';
import { ItemService } from 'src/app/services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'stock-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemStockListComponent {
  items: Item[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5; // Cambiar el límite para hacer más pruebas
  totalPages: number = 0;
  searchTerm: string = '';

  constructor(
    private itemService: ItemService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (data) => {
        this.items = data.items || [];
        this.totalItems = data.totalItems as number || 0; 
        this.totalPages = data.totalPages || Math.ceil(this.totalItems / this.itemsPerPage);
        console.log('Página actual:', this.currentPage, 'Total de páginas:', this.totalPages);
      },
      error: (error) => {
        console.error('Error al obtener items:', error);
      }
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina > 0 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.loadItems();
    }
  }

  crearItem() {
    this.router.navigate(['/dashboard/admin/items/new']);
  }

  deleteItem(idItem: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará definitivamente el stock seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.itemService.deleteItem(idItem).subscribe({
          next: (response) => {
            if (response.ok === true) {
              this.items = this.items.filter(item => item._id !== idItem);
              Swal.fire('Eliminado', 'Registro eliminado', 'success');
              this.loadItems(); // Recarga los items para actualizar la paginación.
            }
          },
          error: (error) => {
            console.error('Error eliminando item:', error);
          }
        });
      }
    });
  }
}
