import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabSelectedService {

  

  constructor() { }

  updateTabSelected(tab:'usuarios' | 'productos' | 'items' | 'suscripciones' | 'proveedores' | 'categorias' | 'inventario'){  
    localStorage.removeItem('tabSelected');
    localStorage.setItem('tabSelected',tab);

  }
}
