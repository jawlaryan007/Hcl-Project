import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioSummary, TradeResponse, Transaction, Holding } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class TradingService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  buyStock(stockId: number, quantity: number): Observable<TradeResponse> {
    return this.http.post<TradeResponse>(`${this.apiUrl}/trading/buy`, { stockId, quantity });
  }

  sellStock(stockId: number, quantity: number): Observable<TradeResponse> {
    return this.http.post<TradeResponse>(`${this.apiUrl}/trading/sell`, { stockId, quantity });
  }

  getPortfolioSummary(): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.apiUrl}/portfolio`);
  }

  getHoldings(): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${this.apiUrl}/portfolio/holdings`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }
}
