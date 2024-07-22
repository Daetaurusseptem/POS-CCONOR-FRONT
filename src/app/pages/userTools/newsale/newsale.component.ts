import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Category, Item } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-newsale',
  templateUrl: './newsale.component.html',
  styleUrls: ['./newsale.component.css']
})
export class NewsaleComponent {

  searchForm !: FormGroup;
  items: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  cart: any[] = [];
  total: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  search: string = '';
  companyId?: string;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemService,
    private categoryService: CategoryService,
    private saleService: SalesService,
    private authService: AuthService,
    private router: Router,
  ) {
    if (this.authService.role == 'user') {
      this.companyId = authService.companyId!;
    } else {
      this.companyId = authService.company?._id!;
    }
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCompanyCategories(this.companyId!)
      .pipe(
        map(r => r.categories!)
      )
      .subscribe((data: Category[]) => {
        this.categories = data;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0]._id;
          this.loadItems();
        }
      });
  }

  loadItems(): void {
    this.itemsService.getItemsByCategory(this.selectedCategory, this.search, this.currentPage)
      .pipe(map(r => { console.log('ItemResp: ', r); return r }))
      .subscribe(data => {
        this.items = data.items!.filter(item => item.stock > 0);
        this.totalPages = data.totalPages!;
      });
  }

  addToCart(item: any): void {
    const existingItem = this.cart.find(p => p.item._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.total += item.price;
    } else {
      this.cart.push({
        item,
        quantity: 1,
        total: item.price
      });
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  checkout(): void {
    if (this.cart.length <= 0) {
      return;
    }

    const saleData = {
      user: this.authService.usuario.id,
      total: this.total,
      discount: 0,
      productsSold: this.cart.map(item => ({
        product: item.item.product._id,
        name: item.item.product.name,
        quantity: item.quantity,
        unitPrice: item.item.price,
        subtotal: item.total,
        _id: item.item._id
      }))
    };

    this.router.navigate(['dashboard/user/new-sale/confirm-sale'],
      { state: { sale: saleData } });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadItems();
  }

  searchItems(): void {
    this.currentPage = 1;
    this.search = this.searchForm.get('search')?.value;
    this.loadItems();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  removeFromCart(item: any): void {
    const index = this.cart.findIndex(cartItem => cartItem.item._id === item.item._id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.calculateTotal();
    }
  }
}
