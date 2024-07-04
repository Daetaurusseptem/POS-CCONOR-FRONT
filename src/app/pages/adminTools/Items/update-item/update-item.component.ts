import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/interfaces/models.interface';
import { ItemService } from 'src/app/services/item.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {
  idItem!: string;
  item!: Item;
  ItemForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    stock: ['', Validators.required],
    price: ['', Validators.required],
    expirationDate: ['', Validators.required],
    discount: ['', Validators.required],
    receivedDate: ['', Validators.required],
  });

  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idItem = params['id'];
      this.loadItems();
    });
  }

  loadItems() {
    this.itemService.getItemById(this.idItem)
      .pipe(map(response => response.item))
      .subscribe(item => {
        this.item = item!;
        const exp = this.formatDate(item!.expirationDate!);
        const rec = this.formatDate(item!.receivedDate!);
        this.ItemForm.setValue({
          name: item!.name,
          stock: item!.stock,
          price: item!.price,
          expirationDate: exp,
          discount: item!.discount,
          receivedDate: rec,
        });
      });
  }

  formatDate(isoString: string): string {
    return moment(isoString).format('YYYY-MM-DD');
  }

  updateItem() {
    if (this.ItemForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#F176B7'
      }).then(response => {
        if (response.isConfirmed) {
          const updatedItem = {
            ...this.ItemForm.value,
            expirationDate: moment(this.ItemForm.value.expirationDate).toISOString(),
            receivedDate: moment(this.ItemForm.value.receivedDate).toISOString(),
          };
          this.itemService.updateItem(this.item._id!, updatedItem).subscribe(
            r => this.router.navigateByUrl('/dashboard/admin/items'),
            error => console.error('Error en el servicio', error)
          );
        }
      }).catch(err => console.error('Error en el diálogo de confirmación', err));
    } else {
      console.log('Formulario no válido');
    }
  }

  campoNoValidoDatosItem(campoItem: string): boolean {
    return this.ItemForm.get(campoItem)?.invalid ?? false;
  }
}
