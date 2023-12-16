import { Component, Input } from '@angular/core';
import { map } from 'rxjs';
import { Item, company } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ItemService } from 'src/app/services/item.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'stock-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemStockListComponent {
  adminId!: string
  companyId!: string
  @Input() items!: Item[];
  company!: company;
  userRole!:string;
  
  
  constructor(
    private itemService: ItemService,
    private authService: AuthService
    ) { 

  }


  



  ngOnInit(): void {
    
  }

}
