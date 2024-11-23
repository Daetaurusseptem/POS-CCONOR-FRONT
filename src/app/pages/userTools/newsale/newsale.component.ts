import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  searchForm!: FormGroup;
  items: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  cart: any[] = [];
  total: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  search: string = '';
  companyId?: string;
  availableExclusiveModifications: any[] = [];
  selectedExclusiveModification: any | null = null;
  availableNonExclusiveModifications: any[] = [];
  selectedNonExclusiveModifications: any[] = [];
  selectedQuantity: number = 1;
  selectedItem: any | null = null;

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
      .pipe(map(r => r.categories!))
      .subscribe((data: Category[]) => {
        this.categories = data;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0]._id;
          this.loadItems();
        }
      });
  }

  loadItems(): void {
    if (!this.selectedCategory && !this.search) {
      this.items = [];
      this.totalPages = 1;
      return;
    }
  
    this.itemsService.getItemsByCategory(this.selectedCategory, this.search, this.currentPage)
      .pipe(map(r => { console.log('ItemResp: ', r); return r; }))
      .subscribe({
        next: (data) => {
          this.items = data.items!.filter(item => item.stock > 0);
          this.totalPages = data.totalPages!;
        },
        error: (error) => {
          console.error('Error fetching items:', error);
          this.items = [];
          this.totalPages = 1;
        }
      });
  } 

  searchItems(): void {
    this.currentPage = 1;
    this.search = this.searchForm.get('search')?.value;

    // Limpiar categoría seleccionada
    this.selectedCategory = '';

    this.loadItems();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;

    // Limpiar campo de búsqueda
    this.searchForm.reset();
    this.search = '';

    this.loadItems();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  addToCart(item: any): void {
    if (this.selectedQuantity <= 0) {
      return;
    }

    const quantity = item.quantity || 1;
    if (quantity <= 0) {
      return;
    }

    const existingItem = this.cart.find(p =>
      p.item.product._id === item.product._id &&
      this.areVariationsEqual(p, this.selectedExclusiveModification, this.selectedNonExclusiveModifications)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total += (item.price + this.calculateModificationsPrice(this.selectedExclusiveModification, this.selectedNonExclusiveModifications)) * quantity;
    } else {
      this.cart.push({
        item,
        quantity,
        total: (item.price + this.calculateModificationsPrice(this.selectedExclusiveModification, this.selectedNonExclusiveModifications)) * quantity,
        exclusiveModification: this.selectedExclusiveModification,
        nonExclusiveModifications: [...this.selectedNonExclusiveModifications],
        product: item.product._id
      });
    }
    this.calculateTotal();
    this.clearModifications();
  }

  addToCartWithModifications(): void {
    if (this.selectedQuantity <= 0) {
      return;
    }

    const existingItem = this.cart.find(p =>
      p.item._id === this.selectedItem._id &&
      this.areVariationsEqual(p, this.selectedExclusiveModification, this.selectedNonExclusiveModifications)
    );

    const itemPriceWithModifications = this.selectedItem.price + this.calculateModificationsPrice(this.selectedExclusiveModification, this.selectedNonExclusiveModifications);

    if (existingItem) {
      existingItem.quantity += this.selectedQuantity;
      existingItem.total += itemPriceWithModifications * this.selectedQuantity;
    } else {
      this.cart.push({
        item: this.selectedItem,
        quantity: this.selectedQuantity,
        total: itemPriceWithModifications * this.selectedQuantity,
        exclusiveModification: this.selectedExclusiveModification,
        nonExclusiveModifications: [...this.selectedNonExclusiveModifications],
        product: this.selectedItem._id
      });
    }

    this.calculateTotal();
    this.selectedItem = null;
    this.clearModifications();
    this.selectedQuantity = 0;
  }

  calculateModificationsPrice(exclusive: any | null, nonExclusive: any[]): number {
    let price = 0;
    if (exclusive) {
      price += exclusive.extraPrice;
    }
    nonExclusive.forEach(mod => {
      price += mod.extraPrice;
    });
    return price;
  }

  areVariationsEqual(cartItem: any, exclusive: any | null, nonExclusive: any[]): boolean {
    const sameExclusive = cartItem.exclusiveModification?._id === exclusive?._id;
    const sameNonExclusive = JSON.stringify(cartItem.nonExclusiveModifications.map((mod: any) => mod._id).sort()) === JSON.stringify(nonExclusive.map(mod => mod._id).sort());
    return sameExclusive && sameNonExclusive;
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  removeFromCart(item: any): void {
    const index = this.cart.findIndex(cartItem => cartItem.item._id === item.item._id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.calculateTotal();
    }
  }

  loadModifications(item: any): void {
    this.selectedItem = item;
    this.availableExclusiveModifications = item.modifications.filter((mod: any) => mod.isExclusive);
    this.availableNonExclusiveModifications = item.modifications.filter((mod: any) => !mod.isExclusive);
    this.selectedExclusiveModification = null;
    this.selectedNonExclusiveModifications = [];
  }

  addExclusiveModification(modification: any): void {
    // Deseleccionar cualquier exclusión previa
    if (this.selectedExclusiveModification) {
      this.availableExclusiveModifications.push(this.selectedExclusiveModification);
    }

    // Seleccionar la nueva exclusión
    this.selectedExclusiveModification = modification;
    this.availableExclusiveModifications = this.availableExclusiveModifications.filter((mod: any) => mod._id !== modification._id);
  }

  addNonExclusiveModification(modification: any): void {
    const index = this.availableNonExclusiveModifications.findIndex(mod => mod._id === modification._id);
    if (index !== -1) {
      this.availableNonExclusiveModifications.splice(index, 1);
      this.selectedNonExclusiveModifications.push(modification);
    }
  }

  removeNonExclusiveModification(modification: any): void {
    const index = this.selectedNonExclusiveModifications.findIndex(mod => mod._id === modification._id);
    if (index !== -1) {
      this.selectedNonExclusiveModifications.splice(index, 1);
      this.availableNonExclusiveModifications.push(modification);
    }
  }

  clearModifications(): void {
    this.availableExclusiveModifications = [];
    this.selectedExclusiveModification = null;
    this.availableNonExclusiveModifications = [];
    this.selectedNonExclusiveModifications = [];
  }

  removeExclusiveModification(): void {
    if (this.selectedExclusiveModification) {
      this.availableExclusiveModifications.push(this.selectedExclusiveModification);
      this.selectedExclusiveModification = null;
    }
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
        modifications: [
          ...(item.exclusiveModification ? [item.exclusiveModification] : []),
          ...item.nonExclusiveModifications
        ]
      }))
    };

    this.router.navigate(['dashboard/user/new-sale/confirm-sale'], { state: { sale: saleData } });
  }

  incrementQuantity(item: any): void {
    if (!item.quantity) {
      item.quantity = 1;
    }
    item.quantity++;
  }

  decrementQuantity(item: any): void {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    }
  }

  incrementQuantityModSelected(): void {
    this.selectedQuantity++;
  }

  decrementQuantityModSelected(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  navigateBackHome(): void {
    this.router.navigate(['/dashboard/user']);
  }

}
