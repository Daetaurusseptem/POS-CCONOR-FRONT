import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-manage-printers',
  templateUrl: './manage-printers.component.html',
  styleUrls: ['./manage-printers.component.css']
})
export class ManagePrintersComponent implements OnInit {
  printerForm: FormGroup;
  printers: { name: string, paperSize: string, default: boolean }[] = [];
  paperSizes = ['58mm', '80mm', '76mm', '110mm'];

  constructor(private fb: FormBuilder, private storageService: StorageService) {
    this.printerForm = this.fb.group({
      name: ['', Validators.required],
      paperSize: ['', Validators.required],
      default: [false]
    });
  }

  ngOnInit(): void {
    this.loadPrinters();
  }

  addPrinter(): void {
    if (this.printerForm.valid) {
      const newPrinter = this.printerForm.value;
      
      if (newPrinter.default) {
        this.printers.forEach(printer => printer.default = false);
      }

      this.printers.push(newPrinter);
      this.savePrinters();
      this.printerForm.reset();
    }
  }

  removePrinter(index: number): void {
    this.printers.splice(index, 1);
    this.savePrinters();
  }

  savePrinters(): void {
    this.storageService.setItem('printers', this.printers);
  }

  loadPrinters(): void {
    const storedPrinters = this.storageService.getItem('printers');
    if (storedPrinters) {
      this.printers = storedPrinters;
    }
  }

  setDefaultPrinter(index: number): void {
    this.printers.forEach((printer, i) => printer.default = i === index);
    this.savePrinters();
  }
}
