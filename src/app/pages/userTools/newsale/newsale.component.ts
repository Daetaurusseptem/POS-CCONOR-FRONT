import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs';
import { Category, company } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-newsale',
  templateUrl: './newsale.component.html',
  styleUrls: ['./newsale.component.css']
})
export class NewsaleComponent {
  searchForm!: FormGroup;
  items: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  cart: any[] = [];
  total: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  search: string = '';
  companyId: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private saleService: SalesService,
    private authService: AuthService
  ) {
    this.companyId = this.authService.company._id!; // Suponiendo que tienes un método para obtener el ID de la empresa
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCompanyCategories(this.companyId)
    .pipe(
      map(r=>r.categories!)
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
    // Load items based on selected category
    this.productService.getItemsByCategory(this.selectedCategory, this.search, this.currentPage).subscribe((data: any) => {
      this.items = data.items;
      this.totalPages = data.totalPages;
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
    // Handle the checkout process
    const saleData = {
      user: 'user_id_placeholder', // Replace with actual user ID
      total: this.total,
      discount: 0,
      productsSold: this.cart.map(item => ({
        productId: item.item.product._id,
        quantity: item.quantity,
        unitPrice: item.item.price,
        subtotal: item.total
      })),
      paymentMethod: 'cash' // Replace with actual payment method
    };

    this.saleService.createSale(saleData).subscribe((response: any) => {
      console.log('Sale created successfully', response);
      this.cart = [];
      this.total = 0;
    }, (error: any) => {
      console.error('Error creating sale', error);
    });
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
}
