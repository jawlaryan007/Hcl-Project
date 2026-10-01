import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { Watchlist } from '../../models/portfolio.models';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-star text-warning"></i> My Stock Watchlist
          </h1>
          <p class="page-subtitle">Keep an eye on stocks you're interested in before paper trading.</p>
        </div>
      </div>

      <!-- Toast Alert -->
      <div *ngIf="toastMessage" class="toast-alert success">
        <i class="fa-solid fa-circle-check"></i> {{ toastMessage }}
      </div>

      <div class="card">
        <div class="table-container" *ngIf="watchlist.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Sector</th>
                <th>Current Price</th>
                <th>Daily Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of watchlist">
                <td>
                  <span class="stock-badge">{{ item.stock.symbol }}</span>
                </td>
                <td><strong>{{ item.stock.companyName }}</strong></td>
                <td><span class="sector-badge">{{ item.stock.sector }}</span></td>
                <td><strong>₹{{ item.stock.currentPrice | number:'1.2-2' }}</strong></td>
                <td>
                  <span class="badge" [ngClass]="(item.stock.dayChange || 0) >= 0 ? 'badge-success' : 'badge-danger'">
                    {{ (item.stock.dayChange || 0) >= 0 ? '+' : '' }}{{ item.stock.dayChangePercent || 0 | number:'1.2-2' }}%
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <a [routerLink]="['/stocks', item.stock.id]" class="btn btn-outline btn-sm">
                      <i class="fa-solid fa-eye"></i> View Details
                    </a>
                    <button class="btn btn-danger btn-sm" (click)="removeItem(item.stock.id)">
                      <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="watchlist.length === 0">
          <i class="fa-solid fa-star"></i>
          <p>Your watchlist is currently empty.</p>
          <a routerLink="/stocks" class="btn btn-primary btn-sm">Explore Stocks Market</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-warning { color: #f59e0b; }
    .stock-badge {
      padding: 0.25rem 0.5rem;
      background: #0f172a;
      color: #fff;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }
    .sector-badge {
      font-size: 0.75rem;
      background: #f1f5f9;
      color: #475569;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
    }
    .action-btns { display: flex; gap: 0.5rem; }
    .toast-alert {
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-weight: 600;
    }
    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
    .empty-state i { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.4; }
  `]
})
export class WatchlistComponent implements OnInit {
  watchlist: Watchlist[] = [];
  toastMessage = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.stockService.getWatchlist().subscribe({
      next: (data) => this.watchlist = data,
      error: () => {}
    });
  }

  removeItem(stockId: number): void {
    this.stockService.removeFromWatchlist(stockId).subscribe({
      next: () => {
        this.toastMessage = 'Stock removed from Watchlist';
        this.loadWatchlist();
        setTimeout(() => this.toastMessage = '', 3000);
      }
    });
  }
}
