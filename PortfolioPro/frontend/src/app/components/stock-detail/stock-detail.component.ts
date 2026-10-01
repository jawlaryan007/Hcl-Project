import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { TradingService } from '../../services/trading.service';
import { AuthService } from '../../services/auth.service';
import { Stock, User } from '../../models/portfolio.models';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper" *ngIf="stock">
      <div class="page-header">
        <div>
          <a routerLink="/stocks" class="back-link">
            <i class="fa-solid fa-arrow-left"></i> Back to Stocks
          </a>
          <h1 class="page-title mt-2">
            {{ stock.companyName }} ({{ stock.symbol }})
          </h1>
          <p class="page-subtitle">Sector: {{ stock.sector }} | National Stock Exchange (NSE India)</p>
        </div>

        <div class="header-actions">
          <button
            class="btn"
            [ngClass]="inWatchlist ? 'btn-danger' : 'btn-outline'"
            (click)="toggleWatchlist()"
          >
            <i [class]="inWatchlist ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
            {{ inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist' }}
          </button>
        </div>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="toastMessage" class="toast-alert" [ngClass]="toastType">
        <i [class]="toastType === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"></i>
        {{ toastMessage }}
      </div>

      <div class="detail-grid">
        <!-- Main Chart & Price Section -->
        <div class="chart-section card">
          <div class="price-banner">
            <div class="main-price">₹{{ stock.currentPrice | number:'1.2-2' }}</div>
            <div class="price-chg-pill" [ngClass]="(stock.dayChange || 0) >= 0 ? 'badge-success' : 'badge-danger'">
              <i [class]="(stock.dayChange || 0) >= 0 ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down'"></i>
              {{ (stock.dayChange || 0) >= 0 ? '+' : '' }}₹{{ stock.dayChange || 0 | number:'1.2-2' }}
              ({{ (stock.dayChangePercent || 0) >= 0 ? '+' : '' }}{{ stock.dayChangePercent || 0 | number:'1.2-2' }}%)
            </div>
          </div>

          <div class="chart-box">
            <div class="chart-header">
              <span>Historical Price Trend (Simulated)</span>
              <div class="timeframe-btns">
                <button class="tf-btn active">1D</button>
                <button class="tf-btn">1W</button>
                <button class="tf-btn">1M</button>
                <button class="tf-btn">1Y</button>
              </div>
            </div>

            <!-- SVG Visual Price Trend Chart -->
            <svg viewBox="0 0 500 200" class="stock-svg-chart">
              <defs>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" [attr.stop-color]="(stock.dayChange || 0) >= 0 ? '#10b981' : '#ef4444'" stop-opacity="0.3"/>
                  <stop offset="100%" [attr.stop-color]="(stock.dayChange || 0) >= 0 ? '#10b981' : '#ef4444'" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 10,160 Q 120,140 220,100 T 360,70 T 490,40 L 490,190 L 10,190 Z" fill="url(#stockGrad)"/>
              <path d="M 10,160 Q 120,140 220,100 T 360,70 T 490,40" fill="none" [attr.stroke]="(stock.dayChange || 0) >= 0 ? '#10b981' : '#ef4444'" stroke-width="3"/>
              <circle cx="490" cy="40" r="6" [attr.fill]="(stock.dayChange || 0) >= 0 ? '#10b981' : '#ef4444'"/>
            </svg>
          </div>

          <div class="stats-row">
            <div class="stat-box">
              <span>Previous Close</span>
              <strong>₹{{ stock.previousPrice | number:'1.2-2' }}</strong>
            </div>
            <div class="stat-box">
              <span>Day High</span>
              <strong>₹{{ (stock.currentPrice * 1.02) | number:'1.2-2' }}</strong>
            </div>
            <div class="stat-box">
              <span>Day Low</span>
              <strong>₹{{ (stock.currentPrice * 0.98) | number:'1.2-2' }}</strong>
            </div>
            <div class="stat-box">
              <span>Exchange</span>
              <strong>NSE (India)</strong>
            </div>
          </div>
        </div>

        <!-- Trading Action Box -->
        <div class="trade-action-card card">
          <div class="trade-tabs">
            <button class="tab-btn" [class.active]="tradeType === 'BUY'" (click)="setTradeType('BUY')">Buy</button>
            <button class="tab-btn sell" [class.active]="tradeType === 'SELL'" (click)="setTradeType('SELL')">Sell</button>
          </div>

          <div class="user-cash-preview">
            <span>Virtual Cash Available:</span>
            <strong>₹{{ user?.virtualBalance | number:'1.2-2' }}</strong>
          </div>

          <div class="form-group mt-3">
            <label class="form-label">Quantity</label>
            <input type="number" class="form-control" min="1" [(ngModel)]="quantity" (input)="updateTotal()">
          </div>

          <div class="calc-summary">
            <div class="calc-line">
              <span>Price per share:</span>
              <span>₹{{ stock.currentPrice | number:'1.2-2' }}</span>
            </div>
            <div class="calc-line">
              <span>Quantity:</span>
              <span>{{ quantity || 0 }}</span>
            </div>
            <div class="calc-line total-line">
              <span>Order Total:</span>
              <strong>₹{{ orderTotal | number:'1.2-2' }}</strong>
            </div>
          </div>

          <button
            class="btn btn-block"
            [ngClass]="tradeType === 'BUY' ? 'btn-success' : 'btn-danger'"
            [disabled]="loadingTrade"
            (click)="executeOrder()"
          >
            <span *ngIf="!loadingTrade">
              Confirm {{ tradeType }} {{ stock.symbol }}
            </span>
            <span *ngIf="loadingTrade">Executing...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      color: var(--accent);
      font-size: 0.875rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 1rem; }

    .toast-alert {
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
      font-weight: 600;
    }

    .toast-alert.success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .toast-alert.danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 992px) {
      .detail-grid { grid-template-columns: 1fr; }
    }

    .price-banner {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .main-price {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--primary);
    }

    .price-chg-pill {
      font-size: 0.95rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
    }

    .chart-box {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .timeframe-btns {
      display: flex;
      gap: 0.35rem;
    }

    .tf-btn {
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
    }

    .tf-btn.active {
      background: var(--primary);
      color: #fff;
    }

    .stock-svg-chart {
      width: 100%;
      height: 200px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      border-top: 1px solid var(--border);
      padding-top: 1.25rem;
    }

    .stat-box span {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .stat-box strong {
      font-size: 1rem;
      color: var(--primary);
    }

    .trade-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 10px;
      margin-bottom: 1.25rem;
    }

    .tab-btn {
      padding: 0.6rem;
      border-radius: 8px;
      border: none;
      font-weight: 700;
      color: var(--text-muted);
      background: transparent;
      cursor: pointer;
    }

    .tab-btn.active {
      background: #10b981;
      color: #fff;
    }

    .tab-btn.sell.active {
      background: #ef4444;
      color: #fff;
    }

    .user-cash-preview {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.825rem;
      display: flex;
      justify-content: space-between;
      color: #1e40af;
    }

    .calc-summary {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 10px;
      margin: 1.25rem 0;
    }

    .calc-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }

    .total-line {
      border-top: 1px dashed #cbd5e1;
      padding-top: 0.5rem;
      margin-bottom: 0;
      font-size: 1.1rem;
      color: var(--primary);
    }

    .btn-block {
      width: 100%;
    }
  `]
})
export class StockDetailComponent implements OnInit {
  stock: Stock | null = null;
  user: User | null = null;
  inWatchlist = false;

  tradeType: 'BUY' | 'SELL' = 'BUY';
  quantity = 1;
  orderTotal = 0;
  loadingTrade = false;

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private tradingService: TradingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    const stockId = Number(this.route.snapshot.paramMap.get('id'));
    if (stockId) {
      this.loadStock(stockId);
      this.checkWatchlist(stockId);
    }
  }

  loadStock(id: number): void {
    this.stockService.getStockById(id).subscribe({
      next: (data) => {
        this.stock = data;
        this.updateTotal();
      },
      error: () => this.router.navigate(['/stocks'])
    });
  }

  checkWatchlist(id: number): void {
    this.stockService.checkInWatchlist(id).subscribe({
      next: (res) => this.inWatchlist = res.inWatchlist,
      error: () => {}
    });
  }

  toggleWatchlist(): void {
    if (!this.stock) return;
    if (this.inWatchlist) {
      this.stockService.removeFromWatchlist(this.stock.id).subscribe({
        next: () => {
          this.inWatchlist = false;
          this.showToast('Removed from Watchlist', 'success');
        }
      });
    } else {
      this.stockService.addToWatchlist(this.stock.id).subscribe({
        next: () => {
          this.inWatchlist = true;
          this.showToast('Added to Watchlist', 'success');
        }
      });
    }
  }

  setTradeType(type: 'BUY' | 'SELL'): void {
    this.tradeType = type;
  }

  updateTotal(): void {
    if (this.stock && this.quantity > 0) {
      this.orderTotal = this.stock.currentPrice * this.quantity;
    } else {
      this.orderTotal = 0;
    }
  }

  executeOrder(): void {
    if (!this.stock || this.quantity <= 0) return;

    this.loadingTrade = true;
    const action$ = this.tradeType === 'BUY'
      ? this.tradingService.buyStock(this.stock.id, this.quantity)
      : this.tradingService.sellStock(this.stock.id, this.quantity);

    action$.subscribe({
      next: (res) => {
        this.loadingTrade = false;
        this.showToast(res.message, 'success');
        this.authService.updateUserBalance(res.newVirtualBalance);
        this.user = this.authService.currentUserValue;
      },
      error: (err) => {
        this.loadingTrade = false;
        this.showToast(err.error?.message || 'Transaction failed.', 'danger');
      }
    });
  }

  showToast(msg: string, type: 'success' | 'danger'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
