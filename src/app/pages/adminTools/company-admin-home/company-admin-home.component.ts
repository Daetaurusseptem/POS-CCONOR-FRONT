import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Item, Product, User, company } from 'src/app/interfaces/models.interface';
import { CompanyService } from 'src/app/services/company.service';
import { UsersService } from 'src/app/services/users.service';

import { map } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-company-admin-home',
  templateUrl: './company-admin-home.component.html',
  styleUrls: ['./company-admin-home.component.css']
})
export class CompanyAdminHomeComponent {
items!:Item[]  
categories!: Category[];
products!: Product[];
users!: User[];
tabSelected:'usuarios'|'productos'|'suscripciones'|'proveedores'|'categorias'|'items'|'inventario' ='usuarios'
tabsArray=[
  {
    name:'usuarios',
    icon:'bi bi-people-fill'
  },
  {
    name:'productos',
    icon:'bi bi-bag-fill'
  },
  {
    name:'inventario',
    icon:'bi bi-box-fill'
  },
  {
    name:'categorias',
    icon:'bi bi-bag-fill'
  },
  {
    name:'proveedores',
    icon:'bi bi-file-earmark-person'
  },
  {
    name:'suscripcion',
    icon:'bi bi-card-checklist'
  },
]
eliminarUsuario(arg0: any) {
throw new Error('Method not implemented.');
}
abrirModal(_t76: any) {
throw new Error('Method not implemented.');
}
  company!: company;
  admin!: UsuarioModel
  id: string = '';

ngOnInit(): void {
  this.admin = this.authService.usuario
  console.log(this.admin);

  this.getAdminCompany(this.admin.id)
  
}



  constructor(
    private companyService: CompanyService,
    private userService: UsersService,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,

  ) {
    
  }
  
  getAdminCompany(id: string) {
    return this.userService.getCompanyAdmin(id)
    .pipe(
      map(item => {
        console.log(item);
        return item.company

      })
      )
      .subscribe(company => {
        
        this.company = company!;
        this.admin = this.authService.usuario
        this.getUsers(this.admin.id)
        this.getCategories(company!._id!);
        this.getProducts(company!._id!);
        this.getItemsCompany(company!._id!);
        
      })

  }
  
  getCategories(idEmpresa:string){
    this.categoryService.getCompanyCategories(idEmpresa,1)
    .pipe(
      map(i=>i.categories)
    )
    .subscribe(categories=>{
      this.categories =categories!;
    })
  }


  getUsers(idEmpresa:string){

    this.userService.getAllNonAdminUsersOfCompany(idEmpresa)
    .pipe(map(item=>item.users))
    .subscribe(users=>{this.users=users!})
    console.log(idEmpresa);
  }
  getProducts(idEmpresa:string){
    this.productService.getCompanyProducts(idEmpresa)
    .pipe(map(item=>{
      console.log(item);
      return item.products
    }))
    .subscribe(products=>{
      this.products=products!
      console.log(products);
    })
  }
  getItemsCompany(id:string){
    
    this.company = this.authService.getCompany
    
    
    this.itemService.getCompanyItems(id)
      .pipe(
        map(item => {
          console.log('ITEMSS',item);
          return item.items
        })
      )
      .subscribe(items => {
        this.items = items!;
      })
  }


  changeTab(tab:'usuarios'|'productos'|'items'|'suscripciones'|'proveedores'|'categorias'|'inventario'){
    this.tabSelected = tab
    console.log(this.tabSelected);
  
  }

}
