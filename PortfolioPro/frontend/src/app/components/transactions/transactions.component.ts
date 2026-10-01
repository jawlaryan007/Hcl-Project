import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingService } from '../../services/trading.service';
import { Transaction } from '../../models/portfolio.models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-receipt"></i> Transaction History
          </h1>
          <p class="page-subtitle">Complete ledger of your buy and sell paper trading orders.</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card controls-card mb-4">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            class="form-control search-input"
            placeholder="Search transactions by stock symbol or name..."
            [(ngModel)]="searchQuery"
            (input)="applyFilters()"
          >
        </div>

        <div class="type-filters">
          <button class="pill-btn" [class.active]="selectedType === 'ALL'" (click)="filterType('ALL')">All Orders</button>
          <button class="pill-btn" [class.active]="selectedType === 'BUY'" (click)="filterType('BUY')">Buy Orders</button>
          <button class="pill-btn" [class.active]="selectedType === 'SELL'" (click)="filterType('SELL')">Sell Orders</button>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="card">
        <div class="table-container" *ngIf="filteredTransactions.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Type</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Price per Share</th>
                <th>Total Value</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tx of filteredTransactions">
                <td><span class="tx-id">#TX-{{ tx.id }}</span></td>
                <td>
                  <span class="badge" [ngClass]="tx.type === 'BUY' ? 'badge-success' : 'badge-danger'">
                    <i [class]="tx.type === 'BUY' ? 'fa-solid fa-cart-shopping' : 'fa-solid fa-hand-holding-dollar'"></i>
                    {{ tx.type }}
                  </span>
                </td>
                <td>
                  <strong>{{ tx.stock.symbol }}</strong>
                  <div class="company-sub">{{ tx.stock.companyName }}</div>
                </td>
                <td><strong>{{ tx.quantity }}</strong></td>
                <td>₹{{ tx.price | number:'1.2-2' }}</td>
                <td><strong>₹{{ tx.totalAmount | number:'1.2-2' }}</strong></td>
                <td>{{ tx.transactionDate | date:'medium' }}</td>
                <td>
                  <span class="badge badge-info">
                    <i class="fa-solid fa-check"></i> {{ tx.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="filteredTransactions.length === 0">
          <i class="fa-solid fa-receipt"></i>
          <p>No transactions found matching your filter.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-4 { margin-bottom: 1.5rem; }
    .controls-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search-box { position: relative; width: 100%; }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-input { padding-left: 2.75rem; }

    .type-filters { display: flex; gap: 0.5rem; }
    .pill-btn {
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-muted);
      cursor: pointer;
    }
    .pill-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

    .tx-id { font-family: monospace; font-size: 0.8rem; font-weight: 700; color: #64748b; }
    .company-sub { font-size: 0.75rem; color: var(--text-muted); }

    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
    .empty-state i { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.4; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  searchQuery = '';
  selectedType: 'ALL' | 'BUY' | 'SELL' = 'ALL';

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.tradingService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
      },
      error: () => {}
    });
  }

  filterType(type: 'ALL' | 'BUY' | 'SELL'): void {
    this.selectedType = type;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.transactions];

    if (this.selectedType !== 'ALL') {
      result = result.filter(t => t.type === this.selectedType);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.stock?.companyName.toLowerCase().includes(q) ||
        t.stock?.symbol.toLowerCase().includes(q)
      );
    }

    this.filteredTransactions = result;
  }
}
