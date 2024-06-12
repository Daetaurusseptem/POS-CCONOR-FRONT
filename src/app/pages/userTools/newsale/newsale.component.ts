import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-newsale',
  templateUrl: './newsale.component.html',
  styleUrls: ['./newsale.component.css']
})
export class NewsaleComponent {
  searchForm!: FormGroup;
  products: any[] = [];
  categories: string[] = ['Bebidas', 'Bebidas frías', 'Alimentos'];
  selectedCategory: string = 'Bebidas';
  cart: any[] = [];
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private saleService: SalesService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
  
  }

  

  addToCart(product: any): void {
    const existingProduct = this.cart.find(p => p.product._id === product._id);
    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.total += product.price;
    } else {
      this.cart.push({
        product,
        quantity: 1,
        total: product.price
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
        productId: item.product._id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.total
      })),
      paymentMethod: 'cash' // Replace with actual payment method
    };

    this.saleService.createSale(saleData).subscribe(response => {
      console.log('Sale created successfully', response);
      this.cart = [];
      this.total = 0;
    }, error => {
      console.error('Error creating sale', error);
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    
  }
}
