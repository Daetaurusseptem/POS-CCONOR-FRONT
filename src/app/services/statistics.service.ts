import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  getSalesStatistics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sales`);
  }

  getItemsStatistics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/items`);
  }

  getTopSellingProductsByWeek(year: number, week: number, companyId: string): Observable<any> {
    let params = new HttpParams()
      .set('year', year.toString())
      .set('week', week.toString())
      .set('companyId', companyId);

    return this.http.get<any>(`${this.baseUrl}/top-selling-products`, { params });
  }
  downloadCsv(data: any[], filename: string): void {
    const csv = this.arrayToCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${filename}.csv`;
    
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  
  private arrayToCsv(data: any[]): string {
    if (!data || !data.length) {
      return '';
    }
  
    const csv = [];
    const header = Object.keys(data[0]);
    csv.push(header.join(','));
  
    data.forEach((row: any) => {
      const values = header.map((field) => this.escapeCsvValue(row[field], field));
      csv.push(values.join(','));
    });
  
    return csv.join('\n');
  }
  
  private escapeCsvValue(value: any, field: string): string {
    if (value == null) {
      return '';
    } else if (typeof value === 'object') {
      // Personaliza la extracción de valores de objetos específicos aquí
      if (field === '_id') {
        // Suponiendo que solo necesitas el campo 'week' de _id
        return `"${value.week || ''}"`;
      } else if (field === 'product') {
        // Suponiendo que solo necesitas el campo 'name' de product
        return `"${value.name || ''}"`;
      } else {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
    } else if (typeof value === 'string') {
      // Maneja strings escapando comillas
      return `"${value.replace(/"/g, '""')}"`;
    } else {
      // Maneja otros tipos de datos (números, booleanos, etc.)
      return String(value);
    }
  }
  
}
