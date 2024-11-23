import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Item } from 'src/app/interfaces/models.interface';
import { ItemService } from 'src/app/services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {

  idItem!: string;
  item!: Item;
  ItemForm: FormGroup;

  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.ItemForm = this.fb.group({
      name: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      expirationDate: ['', Validators.required],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      receivedDate: ['', Validators.required],
      modifications: this.fb.array([])
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idItem = params['id'];
      this.loadItem();
    });
  }

  loadItem() {
    this.itemService.getItemById(this.idItem)
      .pipe(map(response => response.item))
      .subscribe(item => {
        this.item = item!;
        const exp = this.formatDate(item!.expirationDate!);
        const rec = this.formatDate(item!.receivedDate!);
        this.ItemForm.patchValue({
          name: item!.name,
          stock: item!.stock,
          price: item!.price,
          expirationDate: exp,
          discount: item!.discount,
          receivedDate: rec,
        });
        this.setModifications(item!.modifications || []);
      });
  }

  formatDate(isoString: string): string {
    return moment(isoString).format('YYYY-MM-DD');
  }

  get modifications(): FormArray {
    return this.ItemForm.get('modifications') as FormArray;
  }

  setModifications(modifications: any[]) {
    this.modifications.clear(); // Clear existing modifications to avoid duplicates
    modifications.forEach(mod => {
      this.modifications.push(this.fb.group({
        name: [mod.name, Validators.required],
        extraPrice: [mod.extraPrice, [Validators.required, Validators.min(0)]],
        isExclusive: [mod.isExclusive, Validators.required]
      }));
    });
  }

  addModification() {
    this.modifications.push(this.fb.group({
      name: ['', Validators.required],
      extraPrice: [0, [Validators.required, Validators.min(0)]],
      isExclusive: [false, Validators.required]
    }));
  }

  removeModification(index: number) {
    this.modifications.removeAt(index);
  }

  updateItem() {
    if (this.ItemForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres actualizar este ítem?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then(response => {
        if (response.isConfirmed) {
          const updatedItem = {
            ...this.ItemForm.value,
            expirationDate: moment(this.ItemForm.value.expirationDate).toISOString(),
            receivedDate: moment(this.ItemForm.value.receivedDate).toISOString(),
          };
          this.itemService.updateItem(this.item._id!, updatedItem).subscribe(
            () => {
              Swal.fire('¡Actualizado!', 'El ítem ha sido actualizado correctamente', 'success');
              this.router.navigateByUrl('/dashboard/admin/items');
            },
            error => {
              console.error('Error en el servicio de actualización', error);
              Swal.fire('Error', 'Hubo un problema al actualizar el ítem', 'error');
            }
          );
        }
      }).catch(error => {
        console.error('Error en el diálogo de confirmación', error);
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  campoNoValidoDatosItem(campoItem: string): boolean {
    return this.ItemForm.get(campoItem)?.invalid ?? false;
  }
}
