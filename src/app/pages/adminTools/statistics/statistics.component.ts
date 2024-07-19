import { Component } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Chart, ChartData, ChartOptions, ChartType, LabelItem, registerables } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ChartDataset } from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  topSellingProducts: any[] = [];
  year: number = new Date().getFullYear();
  week: number = this.getWeekNumber(new Date());
  searchForm!: FormGroup;
  companyId: string;

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

  updateChartData(): void {
    this.barChartLabels = this.topSellingProducts.map(product => product.product.name);
    this.barChartData.labels = this.barChartLabels;
    this.barChartData.datasets[0].data = this.topSellingProducts.map(product => product.totalQuantity);
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
  downloadCsvWhitPage(){
    this.statisticsService.downloadCsv(this.topSellingProducts,"recuentos");
  }
}
