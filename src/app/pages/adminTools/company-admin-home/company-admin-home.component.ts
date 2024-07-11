import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Item, Product, Supplier, User, Company, Recipe } from 'src/app/interfaces/models.interface';
import { CompanyService } from 'src/app/services/company.service';
import { UsersService } from 'src/app/services/users.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ItemService } from 'src/app/services/item.service';
import { ModalService } from 'src/app/services/modal.service';
import { SupplierService } from 'src/app/services/provider.service';
import { RecipesService } from 'src/app/services/recipes.service';
import { TabSelectedService } from 'src/app/service/tab-selected.service';

@Component({
  selector: 'app-company-admin-home',
  templateUrl: './company-admin-home.component.html',
  styleUrls: ['./company-admin-home.component.css']
})
export class CompanyAdminHomeComponent {
  items!: Item[];
  categories!: Category[];
  suppliers!: Supplier[];
  products!: Product[];
  users!: User[];
  recipes!: Recipe[];

  

  tabSelected: 'usuarios' | 'productos' | 'suscripciones' | 'proveedores' | 'categorias' | 'items' | 'recetas' | 'inventario' = localStorage.getItem('tabSelected') as 'usuarios' | 'productos' | 'suscripciones' | 'proveedores' | 'categorias' | 'items' | 'recetas' | 'inventario';  tabsArray = [
    { name: 'usuarios', icon: 'bi bi-people-fill' },
    { name: 'productos', icon: 'bi bi-bag-fill' },
    { name: 'inventario', icon: 'bi bi-box-fill' },
    { name: 'categorias', icon: 'bi bi-bag-fill' },
    { name: 'proveedores', icon: 'bi bi-file-earmark-person' },
    { name: 'suscripcion', icon: 'bi bi-card-checklist' }
  ];

  company!: Company;
  admin!: UsuarioModel;
  id: string = '';
  

  ngOnInit(): void {
    if(localStorage.getItem('tabSelected')==null){
      this.tabSelected = 'usuarios';
    }
    console.log(this.tabSelected);
    this.changeTab(this.tabSelected)
    this.admin = this.authService.usuario;
    this.getUsers();
    this.getAdminCompany(this.admin.id);
  }

  constructor(
    private companyService: CompanyService,
    private userService: UsersService,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private suppliersService: SupplierService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService,
    private tabSelectedService: TabSelectedService
  ) {}

  getAdminCompany(id: string) {
    return this.userService.getCompanyAdmin(id)
      .pipe(map(item => item.company))
      .subscribe(company => {
        this.company = company!;
        this.admin = this.authService.usuario;
      });
  }

  getCategories() {
    this.categoryService.getCompanyCategories(this.authService.companyId)
      .pipe(map(i => i.categories))
      .subscribe(categories => {
        this.categories = categories!;
      });
  }

  getSuppliers() {
    this.suppliersService.getCompanySuppliers(this.authService.companyId)
      .pipe(map(i => i.suppliers))
      .subscribe(suppliers => {
        this.suppliers = suppliers!;
      });
  }

  getUsers() {
    this.userService.getAllNonAdminUsersOfCompany(this.authService.usuario.id)
      .pipe(map(item => item.users))
      .subscribe(users => {
        this.users = users!;
      });
  }
  getProducts(idEmpresa:string){
    this.productService.getCompanyProducts(idEmpresa)
      .pipe(map(item => item.products))
      .subscribe(products => {
        this.products = products!;
      });
  }

  getItemsCompany(id: string) {
    this.itemService.getCompanyItems(id)
      .pipe(map(item => item.items))
      .subscribe(items => {
        this.items = items!;
      });
  }

  changeTab(tab: 'usuarios' | 'productos' | 'items' | 'suscripciones' | 'proveedores' | 'categorias' | 'inventario'|'recetas') {
    console.log('cambiacion', tab);
    switch (tab) {
      case 'usuarios':
        this.tabSelectedService.updateTabSelected(tab);
        this.getUsers();
        break;
      case 'productos':
        this.tabSelectedService.updateTabSelected(tab);
        this.getProducts(this.authService.companyId);
        break;
        case 'items':
        this.tabSelectedService.updateTabSelected(tab);
        this.getProducts(this.authService.companyId);
        break;
        case 'proveedores':
        this.tabSelectedService.updateTabSelected(tab);
        this.getSuppliers();
        break;
        case 'categorias':
          this.tabSelectedService.updateTabSelected(tab);
          this.getCategories();
        break;
      default:
        break;
    }

    this.tabSelected = tab;
    console.log(this.tabSelected);
  }

  abrirModal(element: Company | User, tipo: 'empresas' | 'usuarios' | 'productos') {
    const { _id } = element;
    this.modalService.abrirModal(element.img, tipo, _id!);
  }
}
