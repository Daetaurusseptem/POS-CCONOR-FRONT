import { Component, OnInit } from '@angular/core';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import { AuthService } from 'src/app/services/auth.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
export class DailySalesComponent {

  openCashRegisterWithSales: any;
  usuario = '';

  constructor(
    private cashRegisterService: CashRegisterService,
    private authService: AuthService) { }

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
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Historial de Ventas Diarias', 14, 22);
    doc.setFontSize(12);
    doc.text(`Usuario: ${this.usuario}`, 14, 30);
    doc.text(`Fecha de Inicio: ${new Date(this.openCashRegisterWithSales.startDate).toLocaleDateString()}`, 14, 36);
    doc.text(`Monto Inicial $: ${this.openCashRegisterWithSales.initialAmount}`, 14, 42);

    // Subtotal
    const subtotal = this.openCashRegisterWithSales.sales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);

    (doc as any).autoTable({
      head: [['Fecha', 'Monto', 'Metodo de Pago']],

      body: [
        ...this.openCashRegisterWithSales.sales.map((sale: Sale) => [
          new Date(sale.date).toLocaleString(),
          sale.total.toFixed(2),
          sale.paymentMethod
        ]),

        [{ content: 'Subtotal', colSpan: 1, style: { haling: 'right', fontSize: 'bold' } }, { content: subtotal.toFixed(2), colSpan: 1, style: { haling: 'right', fontSize: 'bold' } }, '']
      ],

      startY: 50,
      theme: 'plain',
    });
    doc.save('Historial_de_Ventas_Diarias.pdf');
  }
}
