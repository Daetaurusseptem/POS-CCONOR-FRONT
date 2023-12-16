import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { menuItem } from 'src/app/interfaces/menu.interface';

@Component({
  selector: 'tabs-menu',
  templateUrl: './tabs-menu.component.html',
  styleUrls: ['./tabs-menu.component.css']
})
export class TabsMenuComponent implements OnInit{
@Input() items: menuItem[] = [];
@Input() default?:string;
tabSelected: any;
@Output() public tabSelectedOutput = new EventEmitter<any>();

ngOnInit(): void {
  if(this.default){
    this.tabSelected=this.default
  }else{
    
    this.tabSelected=this.items[0].name;
  }


}
changeTab(name: string) {
  this.tabSelected=name
  this.tabSelectedOutput.emit(this.tabSelected);

}



}
