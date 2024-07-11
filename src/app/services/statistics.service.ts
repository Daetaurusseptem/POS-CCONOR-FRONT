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
}
