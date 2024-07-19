import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptPrinterService {
  private apiUrl = 'http://localhost:5000';
  private printersKey = 'printers';

  constructor(private http: HttpClient) { }

  printTicket(printerName: string, content: string, paperSize: string): Observable<any> {
    const payload = {
      printer_name: printerName,
      content: content,
      paper_size: paperSize
    };

    return this.http.post(`${this.apiUrl}/print_ticket`, payload);
  }

  setPrinters(printers: any[]) {
    localStorage.setItem(this.printersKey, JSON.stringify(printers));
  }

  getPrinters(): any[] {
    const printers = localStorage.getItem(this.printersKey);
    return printers ? JSON.parse(printers) : [];
  }

  getDefaultPrinter(): any | null {
    const printers = this.getPrinters();
    return printers.find(printer => printer.default) || null;
  }
}
