import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Chart, ChartData, ChartOptions, ChartType, LabelItem, registerables } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  topSellingProducts: any[] = [];
  ingredientsStatistics: any[] = [];
  year: number = new Date().getFullYear();
  week: number = this.getWeekNumber(new Date());
  searchForm!: FormGroup;
  companyId: string;
  isProductView: boolean = true;

  // Chart configuration
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  barChartLabels: LabelItem[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad Vendida', backgroundColor: 'rgba(75, 192, 192, 0.6)' }
    ]
  };

  constructor(
    private statisticsService: StatisticsService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.companyId = this.authService.companyId!;
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  // Initialize the form
  private initForm(): void {
    this.searchForm = this.fb.group({
      year: [this.year],
      week: [this.week]
    });
  }

  // Load data based on current view
  private loadData(): void {
    this.isProductView ? this.loadTopSellingProducts() : this.loadIngredientsStatistics();
  }

  // Load top selling products
  private loadTopSellingProducts(): void {
    const { year, week } = this.searchForm.value;
    this.statisticsService.getTopSellingProductsByWeek(year, week, this.companyId).subscribe({
      next: (data) => {
        this.topSellingProducts = data.sales;
        this.updateChartData();
      },
      error: (error) => console.error('Error loading top selling products:', error)
    });
  }

  // Load ingredients statistics
  private loadIngredientsStatistics(): void {
    const { year, week } = this.searchForm.value;
    this.statisticsService.getIngredientsStatisticsByWeek(year, week, this.companyId).subscribe({
      next: (data) => {
        this.ingredientsStatistics = data.ingredients;
        this.updateChartData();
      },
      error: (error) => console.error('Error loading ingredients statistics:', error)
    });
  }

  // Update chart data based on current view
  private updateChartData(): void {
    const data = this.isProductView ? this.topSellingProducts : this.ingredientsStatistics;
    this.barChartLabels = data.map(item => this.isProductView ? item.product.name : item._id);
    this.barChartData.labels = this.barChartLabels;
    this.barChartData.datasets[0].data = data.map(item => this.isProductView ? item.totalQuantity : item.totalStock);
    this.barChartData.datasets[0].label = this.isProductView ? 'Cantidad Vendida' : 'Stock Total';
  }

  // Toggle between product and ingredient view
  toggleView(): void {
    this.isProductView = !this.isProductView;
    this.loadData();
  }

  // Get week number for a given date
  private getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + days) / 7);
  }

  // Search based on form values
  onSearch(): void {
    this.loadData();
  }

  // Navigate to previous week
  prevWeek(): void {
    if (this.week > 1) {
      this.week--;
    } else {
      this.week = 52;
      this.year--;
    }
    this.updateFormAndSearch();
  }

  // Navigate to next week
  nextWeek(): void {
    if (this.week < 52) {
      this.week++;
    } else {
      this.week = 1;
      this.year++;
    }
    this.updateFormAndSearch();
  }

  // Update form values and trigger search
  private updateFormAndSearch(): void {
    this.searchForm.patchValue({ year: this.year, week: this.week });
    this.onSearch();
  }

  // Generate and download Excel report
  downloadExcel() {
    const data = this.isProductView ? this.topSellingProducts : this.ingredientsStatistics;
    const sheetName = this.isProductView ? 'Top Productos' : 'Estadísticas de Ingredientes';
    
    const rankingHeader = ['Ranking', 'Producto', 'Cantidad Vendida'];
    const rankingData = this.topSellingProducts.map((item, index) => [index + 1, item.product.name, item.totalQuantity]);
    rankingData.unshift(rankingHeader);

    const mainHeader = this.isProductView ? 
      ['#', 'Producto', 'Cantidad Vendida/Semana'] : 
      ['#', 'Ingrediente', 'Stock Actual', 'Valor Total'];
    const mainData = data.map((item, index) => this.isProductView ?
      [index + 1, item.product.name, item.totalQuantity] :
      [index + 1, item._id, item.totalStock, item.totalValue]
    );
    mainData.unshift(mainHeader);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      [this.isProductView ? `Productos más vendidos - Semana ${this.week}, ${this.year}` : 'Estadísticas de Ingredientes'],
      [],
      ['Tabla de Ranking:'],
      ...rankingData,
      [],
      ['Tabla de Datos según la gráfica:'],
      ...mainData
    ]);

    // Set column widths and merge cells for better formatting
    ws['!cols'] = this.isProductView ? 
      [{ wch: 10 }, { wch: 40 }, { wch: 20 }] : 
      [{ wch: 10 }, { wch: 40 }, { wch: 20 }, { wch: 20 }];
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: this.isProductView ? 2 : 3 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      { s: { r: 4 + rankingData.length, c: 0 }, e: { r: 4 + rankingData.length, c: this.isProductView ? 2 : 3 } }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Set workbook properties
    wb.Props = {
      Title: this.isProductView ? `Productos más vendidos - Semana ${this.week}, ${this.year}` : 'Estadísticas de Ingredientes',
      Subject: "Reporte de Ventas",
      Author: "Leonix & Edy",
      CreatedDate: new Date()
    };

    // Generate and download the Excel file
    XLSX.writeFile(wb, `${sheetName}_${this.week}_${this.year}.xlsx`);
  }
}