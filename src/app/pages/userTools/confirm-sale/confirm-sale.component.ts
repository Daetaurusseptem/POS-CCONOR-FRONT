import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-confirm-sale',
  templateUrl: './confirm-sale.component.html',
  styleUrls: ['./confirm-sale.component.css']
})
export class ConfirmSaleComponent {
  confirmSaleForm!: FormGroup;
  sale: any;
  totalAmount: number;
  change: number = 0;

  constructor(
    private fb: FormBuilder,
    private saleService: SalesService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.sale = navigation?.extras.state?.['sale'];
    this.totalAmount = this.sale.total - this.sale.discount;
    // Add productName to each productSold item for display purposes
    this.sale.productsSold = this.sale.productsSold.map((product: any) => ({
      ...product,
      productName: product.name || 'Nombre del producto' // Replace with actual product name if available
    }));
    console.log(this.sale);
    
  }

  ngOnInit(): void {
    this.confirmSaleForm = this.fb.group({
      paymentMethod: ['cash', Validators.required],
      paymentReference: [''],
      receivedAmount: [0, Validators.required],
      change: [{ value: 0, disabled: true }]
    });

    this.confirmSaleForm.get('paymentMethod')!.valueChanges.subscribe((value) => {
      console.log(value);
      if (value === 'card') {
        this.confirmSaleForm.get('paymentReference')!.setValidators([Validators.required]);
      } else {
        this.confirmSaleForm.get('paymentReference')!.clearValidators();
      }
      this.confirmSaleForm.get('paymentReference')!.updateValueAndValidity();
    });

    this.confirmSaleForm.get('receivedAmount')!.valueChanges.subscribe((value) => {
      this.change = value - this.totalAmount;
      this.confirmSaleForm.patchValue({ change: this.change });
    });
  }

  confirmSale(): void {
    if (this.confirmSaleForm.invalid) {
      return;
    }

    const saleData = {
      ...this.sale,
      paymentMethod: this.confirmSaleForm.value.paymentMethod,
      paymentReference: this.confirmSaleForm.value.paymentReference,
      receivedAmount: this.confirmSaleForm.value.receivedAmount,
      change: this.change
    };

    this.saleService.createSale(saleData).subscribe(response => {
      console.log('Sale created successfully', response);
      this.router.navigate(['dashboard/user/sales-success']);
    }, error => {
      console.error('Error creating sale', error);
    });
  }
}