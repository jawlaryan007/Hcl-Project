import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, Watchlist } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllStocks(searchQuery?: string): Observable<Stock[]> {
    let url = `${this.apiUrl}/stocks`;
    if (searchQuery && searchQuery.trim()) {
      url += `?search=${encodeURIComponent(searchQuery.trim())}`;
    }
    return this.http.get<Stock[]>(url);
  }

  getStockById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/stocks/${id}`);
  }

  getWatchlist(): Observable<Watchlist[]> {
    return this.http.get<Watchlist[]>(`${this.apiUrl}/watchlist`);
  }

  addToWatchlist(stockId: number): Observable<Watchlist> {
    return this.http.post<Watchlist>(`${this.apiUrl}/watchlist/${stockId}`, {});
  }

  removeFromWatchlist(stockId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/watchlist/${stockId}`);
  }

  checkInWatchlist(stockId: number): Observable<{ inWatchlist: boolean }> {
    return this.http.get<{ inWatchlist: boolean }>(`${this.apiUrl}/watchlist/check/${stockId}`);
  }
}
