import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Sale, User } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
  saleId!: string;
  sale!: Sale;
  usuario!: User;
  products: any;

  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.saleId = this.route.snapshot.paramMap.get('saleId')!;
    this.loadSale();
  }

  loadSale() {
    this.salesService.getSaleById(this.saleId).subscribe((response) => {
      this.sale = response.sale!;
      console.log(this.sale);
      this.usuario = response!.sale?.user as User;
      this.products = response.sale!.productsSold!
      console.log(this.products);
    });
  }

  generarPDF() {
    const doc = new jsPDF({
      format: [58.28, 350.89]
    });

    const marginX = 2;
    let currentY = 10;

    doc.setFontSize(10);
    doc.text('Ticket de Venta', marginX, currentY);
    currentY += 4;

    doc.setFontSize(8);
    doc.text(`Usuario: ${this.usuario}`, marginX, currentY);
    currentY += 4;
    doc.text(`Fecha: ${new Date(this.sale.date).toLocaleDateString()}`, marginX, currentY);
    currentY += 4;
    doc.text(`Total: $${this.sale.total.toFixed(2)}`, marginX, currentY);
    currentY += 4;
    if (this.sale.paymentMethod === 'cash') {
      doc.text(`Pago con: $${this.sale.receivedAmount?.toFixed(2)}`, marginX, currentY);
      currentY += 6;
      doc.text(`Cambio: $${this.sale.change?.toFixed(2)}`, marginX, currentY);
    } else if (this.sale.paymentMethod === 'credit') {
      doc.text(`Referencia de Pago: ${this.sale.paymentReference}`, marginX, currentY);
    }
    currentY += 6;

    (doc as any).autoTable({
      head: [['Producto', 'Cantidad', 'Precio']],
      body: this.sale.productsSold.map((product: any) => [
        product.productName,
        product.quantity,
        product.subtotal
      ]),
      startY: currentY,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
      columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 15 }, 2: { cellWidth: 15 } },
      theme: 'plain'
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      console.log('Iframe loaded, attempting to print');
      try {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
        console.log('Print command sent');
      } catch (e) {
        console.error('Print error: ', e);
      }
    };

    iframe.onerror = (error) => {
      console.error('Error loading iframe: ', error);
    };
  }
}
