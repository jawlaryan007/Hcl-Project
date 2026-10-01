import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { TradingService } from '../../services/trading.service';
import { AuthService } from '../../services/auth.service';
import { Stock } from '../../models/portfolio.models';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-arrow-trend-up"></i> Indian Stock Market (NIFTY Demo)
          </h1>
          <p class="page-subtitle">Search and trade simulated stocks using your virtual paper trading balance.</p>
        </div>
      </div>

      <!-- Controls: Search & Sector Filters -->
      <div class="controls-card card mb-4">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            class="form-control search-input"
            placeholder="Search by company name, symbol (e.g. RELIANCE, TCS)..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
          >
          <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="sector-pills">
          <button
            class="pill-btn"
            [class.active]="selectedSector === 'ALL'"
            (click)="filterSector('ALL')"
          >All Sectors</button>
          <button
            class="pill-btn"
            *ngFor="let sector of sectors"
            [class.active]="selectedSector === sector"
            (click)="filterSector(sector)"
          >{{ sector }}</button>
        </div>
      </div>

      <!-- Toast Alert Notification -->
      <div *ngIf="toastMessage" class="toast-alert" [ngClass]="toastType">
        <i [class]="toastType === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"></i>
        {{ toastMessage }}
      </div>

      <!-- Stocks Table -->
      <div class="card table-card">
        <div class="table-container" *ngIf="filteredStocks.length > 0">
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
              <tr *ngFor="let stock of filteredStocks">
                <td>
                  <div class="stock-badge">
                    <span>{{ stock.symbol }}</span>
                  </div>
                </td>
                <td>
                  <strong>{{ stock.companyName }}</strong>
                </td>
                <td>
                  <span class="sector-badge">{{ stock.sector }}</span>
                </td>
                <td>
                  <strong class="price-val">₹{{ stock.currentPrice | number:'1.2-2' }}</strong>
                </td>
                <td>
                  <span class="badge" [ngClass]="(stock.dayChange || 0) >= 0 ? 'badge-success' : 'badge-danger'">
                    <i [class]="(stock.dayChange || 0) >= 0 ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down'"></i>
                    {{ (stock.dayChange || 0) >= 0 ? '+' : '' }}{{ stock.dayChangePercent || 0 | number:'1.2-2' }}%
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/stocks', stock.id]" class="btn btn-outline btn-sm">
                      <i class="fa-solid fa-eye"></i> View
                    </a>
                    <button class="btn btn-success btn-sm" (click)="openTradeModal(stock, 'BUY')">
                      <i class="fa-solid fa-cart-shopping"></i> Buy
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="filteredStocks.length === 0">
          <i class="fa-solid fa-magnifying-glass-slash"></i>
          <p>No stocks found matching your query "{{ searchQuery }}".</p>
        </div>
      </div>

      <!-- Quick Trade Modal -->
      <div class="modal-overlay" *ngIf="selectedTradeStock" (click)="closeTradeModal()">
        <div class="modal-content card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>
              <i class="fa-solid fa-bolt text-warning"></i>
              Paper Trade: {{ selectedTradeStock.symbol }}
            </h3>
            <button class="close-modal-btn" (click)="closeTradeModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="stock-summary-box">
            <div>
              <strong>{{ selectedTradeStock.companyName }}</strong>
              <div class="sector-sub">{{ selectedTradeStock.sector }}</div>
            </div>
            <div class="text-right">
              <div class="modal-price">₹{{ selectedTradeStock.currentPrice | number:'1.2-2' }}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Quantity</label>
            <input type="number" class="form-control" min="1" [(ngModel)]="tradeQuantity" (input)="calculateTotal()">
          </div>

          <div class="trade-calc-box">
            <div class="calc-row">
              <span>Stock Price:</span>
              <span>₹{{ selectedTradeStock.currentPrice | number:'1.2-2' }}</span>
            </div>
            <div class="calc-row">
              <span>Quantity:</span>
              <span>{{ tradeQuantity || 0 }}</span>
            </div>
            <div class="calc-row total-row">
              <span>Estimated Total:</span>
              <strong>₹{{ totalCost | number:'1.2-2' }}</strong>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-outline" (click)="closeTradeModal()">Cancel</button>
            <button class="btn btn-success" [disabled]="tradingLoading" (click)="executeTrade()">
              <span *ngIf="!tradingLoading">Confirm Buy Stock</span>
              <span *ngIf="tradingLoading">Processing...</span>
            </button>
          </div>
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

    .search-box {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-input {
      padding-left: 2.75rem;
      padding-right: 2.5rem;
      font-size: 1rem;
    }

    .clear-btn {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1rem;
    }

    .sector-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .pill-btn {
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .pill-btn:hover { background: #f1f5f9; }
    .pill-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .stock-badge {
      display: inline-block;
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

    .price-val { font-size: 1.05rem; }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .toast-alert {
      padding: 1rem 1.25rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .toast-alert.success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .toast-alert.danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
    }

    .close-modal-btn {
      background: transparent;
      border: none;
      font-size: 1.25rem;
      color: var(--text-muted);
      cursor: pointer;
    }

    .stock-summary-box {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .sector-sub { font-size: 0.75rem; color: var(--text-muted); }
    .modal-price { font-size: 1.25rem; font-weight: 800; color: var(--accent); }

    .trade-calc-box {
      background: #f1f5f9;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }

    .total-row {
      border-top: 1px dashed #cbd5e1;
      padding-top: 0.5rem;
      margin-bottom: 0;
      font-size: 1.05rem;
      color: var(--primary);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
    .empty-state i { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.4; }
  `]
})
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  sectors: string[] = [];
  searchQuery = '';
  selectedSector = 'ALL';

  selectedTradeStock: Stock | null = null;
  tradeQuantity = 1;
  totalCost = 0;
  tradingLoading = false;

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private stockService: StockService,
    private tradingService: TradingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        this.sectors = Array.from(new Set(data.map(s => s.sector)));
        this.applyFilters();
      },
      error: () => {}
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  filterSector(sector: string): void {
    this.selectedSector = sector;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.stocks];

    if (this.selectedSector !== 'ALL') {
      result = result.filter(s => s.sector === this.selectedSector);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(s =>
        s.companyName.toLowerCase().includes(q) ||
        s.symbol.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q)
      );
    }

    this.filteredStocks = result;
  }

  openTradeModal(stock: Stock, type: 'BUY' | 'SELL'): void {
    this.selectedTradeStock = stock;
    this.tradeQuantity = 1;
    this.calculateTotal();
  }

  closeTradeModal(): void {
    this.selectedTradeStock = null;
  }

  calculateTotal(): void {
    if (this.selectedTradeStock && this.tradeQuantity > 0) {
      this.totalCost = this.selectedTradeStock.currentPrice * this.tradeQuantity;
    } else {
      this.totalCost = 0;
    }
  }

  executeTrade(): void {
    if (!this.selectedTradeStock || this.tradeQuantity <= 0) return;

    this.tradingLoading = true;
    this.tradingService.buyStock(this.selectedTradeStock.id, this.tradeQuantity).subscribe({
      next: (res) => {
        this.tradingLoading = false;
        this.showToast(res.message, 'success');
        this.authService.updateUserBalance(res.newVirtualBalance);
        this.closeTradeModal();
      },
      error: (err) => {
        this.tradingLoading = false;
        this.showToast(err.error?.message || 'Trade failed.', 'danger');
      }
    });
  }

  showToast(msg: string, type: 'success' | 'danger'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
