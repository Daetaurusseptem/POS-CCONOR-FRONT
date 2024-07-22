import { Component } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Chart, ChartData, ChartOptions, ChartType, LabelItem, registerables } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ChartDataset } from 'chart.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  topSellingProducts: any[] = []; 
  ingredientsStatistics: any[] = [];
  year: number = new Date().getFullYear();
  week: number = this.getWeekNumber(new Date());
  searchForm!: FormGroup;
  companyId: string;
  isProductView: boolean = true;

  // Chart.js variables
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: LabelItem[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad Vendida' }
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
    this.searchForm = this.fb.group({
      year: [this.year],
      week: [this.week]
    });
    this.loadTopSellingProducts();
  }

  loadTopSellingProducts(): void {
    const { year, week } = this.searchForm.value;
    this.statisticsService.getTopSellingProductsByWeek(year, week, this.companyId).subscribe(data => {
      this.topSellingProducts = data.sales;
      this.updateChartData();
    });
  }

  loadIngredientsStatistics(): void {
    this.statisticsService.getIngredientsStatistics().subscribe(data => {
      this.ingredientsStatistics = data.ingredients;
      this.updateChartData();
    });
  }

  updateChartData(): void {
    if (this.isProductView) {
      this.barChartLabels = this.topSellingProducts.map(product => product.product.name);
      this.barChartData.labels = this.barChartLabels;
      this.barChartData.datasets[0].data = this.topSellingProducts.map(product => product.totalQuantity);
    } else {
      this.barChartLabels = this.ingredientsStatistics.map(ingredient => ingredient._id);
      this.barChartData.labels = this.barChartLabels;
      this.barChartData.datasets[0].data = this.ingredientsStatistics.map(ingredient => ingredient.totalStock);
      this.barChartData.datasets[0].label = 'Stock Total';
    }
  }

  toggleView(): void {
    this.isProductView = !this.isProductView;
    if (this.isProductView) {
      this.loadTopSellingProducts();
    } else {
      this.loadIngredientsStatistics();
    }
  }

  getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + days) / 7);
  }

  onSearch(): void {
    this.loadTopSellingProducts();
  }

  prevWeek(): void {
    if (this.week > 1) {
      this.week--;
    } else {
      this.week = 52;
      this.year--;
    }
    this.searchForm.patchValue({ year: this.year, week: this.week });
    this.loadTopSellingProducts();
  }

  nextWeek(): void {
    if (this.week < 52) {
      this.week++;
    } else {
      this.week = 1;
      this.year++;
    }
    this.searchForm.patchValue({ year: this.year, week: this.week });
    this.loadTopSellingProducts();
  }

  downloadExcel() {
    const data = this.isProductView ? this.topSellingProducts : this.ingredientsStatistics;
    const sheetName = this.isProductView ? 'Top Productos' : 'Estadísticas de Ingredientes';
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      [this.isProductView ? `Productos mas vendidos - Semana ${this.week}, ${this.year}` : 'Estadísticas de Ingredientes'],
      [],
      this.isProductView ? ['Ranking', 'Producto', 'Cantidad Vendida'] : ['Ranking', 'Ingrediente', 'Stock Total', 'Valor Total'],
      ...data.map((item, index) => this.isProductView ?
        [index + 1, item.product.name, item.totalQuantity] :
        [index + 1, item._id, item.totalStock, item.totalValue]
      )
    ]);

    ws['!cols'] = this.isProductView ? [{ wch: 10 }, { wch: 40 }, { wch: 20 }] : [{ wch: 10 }, { wch: 40 }, { wch: 20 }, { wch: 20 }];
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: this.isProductView ? 2 : 3 } }];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    wb.Props = {
      Title: this.isProductView ? `Productos mas vendidos - Semana ${this.week}, ${this.year}` : 'Estadísticas de Ingredientes',
      Subject: "Reporte de Ventas",
      Author: "Leonix64 & Edy",
      CreatedDate: new Date()
    };

    XLSX.writeFile(wb, `${sheetName}_${this.week}_${this.year}.xlsx`);
  }
}
