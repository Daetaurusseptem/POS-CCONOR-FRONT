import { Component, OnInit } from '@angular/core';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import { AuthService } from 'src/app/services/auth.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

interface Sale {
  date: Date;
  total: number;
  paymentMethod: string;
}

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.css']
})
export class DailySalesComponent implements OnInit {
getReceipt(id:string){
  this.router.navigateByUrl(`/dashboard/user/sale-details/${id}`)
}

  openCashRegisterWithSales: any;
  usuario = '';

  constructor(
    private cashRegisterService: CashRegisterService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOpenCashRegisterWithSales();
    this.usuario = this.authService.usuario.name;
  }

  loadOpenCashRegisterWithSales() {
    const userId = this.authService.usuario.id;
    this.cashRegisterService.getOpenCashRegisterWithSales(userId).subscribe(
      (data) => {
        this.openCashRegisterWithSales = data;
        console.log(this.openCashRegisterWithSales);
      },
      (error) => {
        console.error('Error fetching open cash register with sales', error);
      }
    );
  }

  generarPDF() {
    const doc = new jsPDF({
      format: [58.28, 350.89] // Ancho 58mm, Alto ajustable
    });

    const marginX = 2; // Margen horizontal en mm
    let currentY = 10; // Posición vertical inicial en mm

    // Título
    doc.setFontSize(10);
    doc.text('Historial de Ventas Diarias', marginX, currentY);
    currentY += 4;

    // Información del usuario y fecha de inicio
    doc.setFontSize(8);
    doc.text(`Usuario: ${this.usuario}`, marginX, currentY);
    currentY += 4;
    doc.text(`Fecha de Inicio: ${new Date(this.openCashRegisterWithSales.startDate).toLocaleDateString()}`, marginX, currentY);
    currentY += 4;
    doc.text(`Monto Inicial $: ${this.openCashRegisterWithSales.initialAmount}`, marginX, currentY);
    currentY += 6;

    // Subtotal
    const subtotal = this.openCashRegisterWithSales.sales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);

    (doc as any).autoTable({
      head: [['Fecha', 'Monto', 'Método de Pago']],
      body: [
        ...this.openCashRegisterWithSales.sales.map((sale: Sale) => [
          new Date(sale.date).toLocaleString(),
          sale.total.toFixed(2),
          sale.paymentMethod,
        ]),
        [{ content: 'Subtotal', colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } }, { content: subtotal.toFixed(2), colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } }, ''],
        [{ content: 'En Caja', colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } }, { content: (subtotal+this.openCashRegisterWithSales.initialAmount).toFixed(2), colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } }, '']
      ],
      startY: currentY,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 18 }, 2: { cellWidth: 20 } },
      theme: 'plain'
    });

    // Crear un Blob del PDF y abrirlo en una nueva ventana para imprimir automáticamente
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(url)!;

    // Esperar a que la ventana cargue el contenido y luego ejecutar la impresión
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  }
}
