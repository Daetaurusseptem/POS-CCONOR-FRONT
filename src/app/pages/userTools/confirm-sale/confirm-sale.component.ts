import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales.service';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptPrinterService } from 'src/app/services/receipt-printer.service';


@Component({
  selector: 'app-confirm-sale',
  templateUrl: './confirm-sale.component.html',
  styleUrls: ['./confirm-sale.component.css']
})
export class ConfirmSaleComponent implements OnInit {
  confirmSaleForm!: FormGroup;
  sale: any;
  totalAmount: number;
  change: number = 0;
  usuario = this.authService.usuario.name;

  constructor(
    private fb: FormBuilder,
    private saleService: SalesService,
    private router: Router,
    private authService: AuthService,
    private receiptPrinterService: ReceiptPrinterService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.sale = navigation?.extras.state?.['sale'];
    this.totalAmount = this.sale.total - this.sale.discount;
    this.sale.productsSold = this.sale.productsSold.map((product: any) => ({
      ...product,
      productName: product.name || 'Nombre del producto'
    }));
    console.log(this.sale);
  }

  ngOnInit(): void {
    this.confirmSaleForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      paymentReference: [''],
      receivedAmount: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/), this.amountValidator.bind(this)]],
      change: [{ value: 0, disabled: true }]
    });

    this.confirmSaleForm.get('paymentMethod')!.valueChanges.subscribe((value) => {
      if (value === 'credit') {
        this.confirmSaleForm.get('paymentReference')!.setValidators([Validators.required]);
        this.confirmSaleForm.get('receivedAmount')!.clearValidators();
      } else {
        this.confirmSaleForm.get('paymentReference')!.clearValidators();
        this.confirmSaleForm.get('receivedAmount')!.setValidators([Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/), this.amountValidator.bind(this)]);
      }
      this.confirmSaleForm.get('paymentReference')!.updateValueAndValidity();
      this.confirmSaleForm.get('receivedAmount')!.updateValueAndValidity();
    });

    this.confirmSaleForm.get('receivedAmount')!.valueChanges.subscribe((value) => {
      this.change = value - this.totalAmount;
      this.confirmSaleForm.patchValue({ change: this.change });
    });
  }

  amountValidator(control: AbstractControl): ValidationErrors | null {
    const receivedAmount = control.value;
    if (this.confirmSaleForm && this.confirmSaleForm.get('paymentMethod')!.value === 'cash' && receivedAmount < this.totalAmount) {
      return { insufficientAmount: true };
    }
    return null;
  }

  confirmSale(): void {
    if (this.confirmSaleForm.invalid) {
      this.confirmSaleForm.markAllAsTouched();
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
      this.generarTicket(saleData);
      this.router.navigate(['dashboard/user/sales-success']);
    }, error => {
      console.error('Error creating sale', error);
    });
  }

  generarTicket(saleData: any) {
    const content = `
      123 STORE ST
      store@store.com
      www.store.com

      Order Number: ${saleData._id}
      Date: ${new Date(saleData.date).toLocaleDateString()}

      --------------------------------
      Qty   Product                Total
      --------------------------------
      ${saleData.productsSold.map((product: any) => `
      ${product.quantity}    ${product.productName}      ${product.unitPrice * product.quantity}
      `).join('')}
      --------------------------------

      Total: $${saleData.total.toFixed(2)}
      Discount: $${saleData.discount.toFixed(2)}
      ${saleData.paymentMethod === 'cash' ? `Received Amount: $${saleData.receivedAmount.toFixed(2)}
      Change: $${saleData.change.toFixed(2)}` : `Payment Reference: ${saleData.paymentReference}`}
      
      Thank you for shopping!
      
    `;

    const printer = this.receiptPrinterService.getDefaultPrinter();
    if (printer) {
      this.receiptPrinterService.printTicket(printer.name, content, printer.paperSize).subscribe(response => {
        console.log('Ticket sent to printer successfully', response);
      }, error => {
        console.error('Error sending ticket to printer', error);
      });
    } else {
      console.error('No default printer set');
    }
  }

  get paymentMethod() {
    return this.confirmSaleForm.get('paymentMethod');
  }

  get paymentReference() {
    return this.confirmSaleForm.get('paymentReference');
  }

  get receivedAmount() {
    return this.confirmSaleForm.get('receivedAmount');
  }

  get changeControl() {
    return this.confirmSaleForm.get('change');
  }
}
