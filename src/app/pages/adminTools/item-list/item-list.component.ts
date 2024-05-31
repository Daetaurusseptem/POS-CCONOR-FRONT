import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Item, company } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ItemService } from 'src/app/services/item.service';
import { ModalService } from 'src/app/services/modal.service';
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
  itemsPerPage: number = 10;
  searchTerm: string = '';

  constructor(
    private itemService: ItemService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    console.log(this.searchTerm);
    this.itemService.getItems(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (data) => {
        console.log(data);
        this.items = data.items!; // Ajusta según la estructura de la respuesta
        this.totalItems = data.total as number; // Ajusta según la estructura de la respuesta
      },
      error: (error) => {
        console.error('Error fetching items', error);
      }
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.loadItems();
  }

  

  onSearch(): void {
    console.log(this.searchTerm);
    this.currentPage = 1; 
    this.loadItems();
  }

  deleteItem(idItem:string){

    Swal.fire({
      title:'estas seguro?',
      text:'Esto eliminara definitivamente el stock seleccionado',
      showCancelButton:true
    })
    .then(res=>{
      if(res.isConfirmed ==true){
        this.itemService.deleteItem(idItem)
        .subscribe(r=>{
          Swal.fire({

            title:'Eliminado',
            text:'Registro eliminado'
          })
          .then(r=>{
            if(r.isConfirmed){
              this.router.navigateByUrl('/dashboard/admin')
            }
          })
        })
      }
    })

  }



}

