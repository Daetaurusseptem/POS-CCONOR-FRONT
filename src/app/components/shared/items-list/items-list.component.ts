import { Component, Input, OnInit } from '@angular/core';
import { Item, Product } from 'src/app/interfaces/models.interface';



@Component({
    selector: 'items-list',
    templateUrl: './items-list.component.html',
    styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
    @Input() items: Product[] = [];

    ngOnInit(): void {

    }
    constructor(){
    }
}
