import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Category, Item, Product, Supplier, User, company } from 'src/app/interfaces/models.interface';
import { CompanyService } from 'src/app/services/company.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/provider.service';
import { CategoryService } from 'src/app/services/category.service';
import { ModalService } from 'src/app/services/modal.service';
import { ItemService } from 'src/app/services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  items!: Item[];
  company!: company;
  admin!: User;
  id: string = '';
  users!: User[];
  products!: Product[];
  suppliers!: Supplier[];
  categories!: Category[];
  totalItems: number = 0;
  currentPage: number = 1;
  adminId: string = '';
  userRole!: 'admin' | 'sysadmin' | 'user';

  itemsPerPage: number = 10;
  searchTerm: string = '';
  tabSelected: 'usuarios' | 'productos' | 'suscripciones' | 'proveedores' | 'categorias' | 'items' | 'inventario' = 'usuarios';
  tabsArray = [
    { name: 'usuarios', icon: 'bi bi-people-fill'},
    { name: 'productos', icon: 'bi bi-bag-fill'},
    { name: 'inventario', icon: 'bi bi-box-fill'},
    { name: 'categorias', icon: 'bi bi-bag-fill'},
    { name: 'proveedores', icon: 'bi bi-file-earmark-person'},
    { name: 'suscripciones', icon: 'bi bi-card-checklist'}
  ];

  constructor(
    private companyService: CompanyService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private suppliersService: SupplierService,
    private categoryService: CategoryService,
    private modalService: ModalService,
    private itemService: ItemService,
  ) {
    this.adminId = this.authService.idUsuario;
    this.getRole();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {  
      this.id = params['id'];
    
      this.getCompany(this.id);
      this.getUsers();
      this.getItemsCompany();
    });
  }

  getRole() {
    this.userRole = this.authService.role;
  }

  getCompany(id: string) {
    return this.companyService.getCompany(id)
      .pipe(map(item => item.company))
      .subscribe(company => {
        this.company = company!;
        console.log('company: ',this.company);
        this.getAdmin(company!.adminId!);
      });
  }

  getAdmin(adminId: string) {
    this.userService.getUserById(adminId)
      .pipe(map(item => item.user))
      .subscribe(adminCompany => {
        this.admin = adminCompany!;
        console.log(this.admin);
      });
  }

  changeTab(tab: 'usuarios' | 'productos' | 'suscripciones' | 'proveedores' | 'categorias' | 'inventario') {
    switch (tab) {
      case 'usuarios':
        this.getUsers();
        break;
      case 'productos':
        this.getProducts(this.id);
        break;
      case 'inventario':
        console.log('Inventario');
        this.getItemsCompany();
        break;
      case 'proveedores':
        this.getSuppliers(this.id);
        break;
      case 'categorias':
        this.getCategories(this.id);
        break;
      default:
        break;
    }

    this.tabSelected = tab;
    console.log(this.tabSelected);
  }

  getUsers() {
    this.userService.getAllUsersOfCompany(this.id)
      .pipe(map(item => {
        console.log(item);
        return item.users
      }))
      .subscribe(users => {
        this.users = users!;
      });
  }

  getProducts(idEmpresa: string) {
    this.productService.getCompanyProductsSysadmin(idEmpresa)
      .pipe(map(item => {
        console.log(item);
        return item.products;
      }))
      .subscribe(products => {
        this.products = products!;
      });
  }

  getSuppliers(idEmpresa: string) {
    this.suppliersService.getCompanySuppliers(idEmpresa)
      .pipe(map(i => i.suppliers))
      .subscribe(suppliers => {
        this.suppliers = suppliers!;
      });
  }

  getCategories(idEmpresa: string) {
    this.categoryService.getCompanyCategories(idEmpresa)
      .pipe(map(i => i.categories))
      .subscribe(categories => {
        this.categories = categories!;
      });
  }

  //Pendiente
  getItemsCompany() {
    this.itemService.getCompanyItemsSysadmin(this.id)
      .pipe(map(item => item.items))
      .subscribe(items => {
        this.items = items!;
      });
  }

  abrirModal(element: company | User, tipo: 'empresas' | 'usuarios' | 'productos') {
    const { _id } = element;
    this.modalService.abrirModal(element.img, tipo, _id!);

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
  pageChanged(event: any): void {
    this.currentPage = event;
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

}
