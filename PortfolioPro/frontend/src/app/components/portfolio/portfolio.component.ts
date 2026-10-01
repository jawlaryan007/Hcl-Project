import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TradingService } from '../../services/trading.service';
import { AuthService } from '../../services/auth.service';
import { Holding, PortfolioSummary } from '../../models/portfolio.models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-wallet"></i> My Stock Portfolio
          </h1>
          <p class="page-subtitle">Track your holdings, average buy prices, and paper trading profit/loss performance.</p>
        </div>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="toastMessage" class="toast-alert" [ngClass]="toastType">
        <i [class]="toastType === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"></i>
        {{ toastMessage }}
      </div>

      <!-- Portfolio Summary Cards -->
      <div class="summary-cards-grid">
        <div class="card stat-box">
          <span class="stat-lbl">Virtual Cash Balance</span>
          <h3 class="stat-val text-accent">₹{{ summary?.availableBalance || 0 | number:'1.2-2' }}</h3>
        </div>

        <div class="card stat-box">
          <span class="stat-lbl">Invested Capital</span>
          <h3 class="stat-val">₹{{ summary?.totalInvested || 0 | number:'1.2-2' }}</h3>
        </div>

        <div class="card stat-box">
          <span class="stat-lbl">Current Portfolio Value</span>
          <h3 class="stat-val">₹{{ summary?.currentPortfolioValue || 0 | number:'1.2-2' }}</h3>
        </div>

        <div class="card stat-box">
          <span class="stat-lbl">Total Profit / Loss</span>
          <h3 class="stat-val" [ngClass]="(summary?.totalProfitLoss || 0) >= 0 ? 'text-success' : 'text-danger'">
            {{ (summary?.totalProfitLoss || 0) >= 0 ? '+' : '' }}₹{{ summary?.totalProfitLoss || 0 | number:'1.2-2' }}
            <span class="pct-sub">({{ (summary?.totalProfitLossPercentage || 0) >= 0 ? '+' : '' }}{{ summary?.totalProfitLossPercentage || 0 | number:'1.2-2' }}%)</span>
          </h3>
        </div>
      </div>

      <!-- Holdings Table -->
      <div class="card mt-4">
        <div class="card-header">
          <h3><i class="fa-solid fa-layer-group"></i> Active Holdings ({{ summary?.holdings?.length || 0 }})</h3>
        </div>

        <div class="table-container" *ngIf="summary?.holdings && summary!.holdings.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Avg Buy Price</th>
                <th>Current Price</th>
                <th>Invested Amount</th>
                <th>Current Value</th>
                <th>P&L (Profit/Loss)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of summary?.holdings">
                <td>
                  <div class="holding-stock-info">
                    <strong class="stock-sym">{{ h.stock.symbol }}</strong>
                    <span class="company-name">{{ h.stock.companyName }}</span>
                  </div>
                </td>
                <td><strong>{{ h.quantity }}</strong></td>
                <td>₹{{ h.averagePrice | number:'1.2-2' }}</td>
                <td>₹{{ h.currentPrice | number:'1.2-2' }}</td>
                <td>₹{{ h.investedValue | number:'1.2-2' }}</td>
                <td><strong>₹{{ h.currentValue | number:'1.2-2' }}</strong></td>
                <td>
                  <span class="badge" [ngClass]="h.profitLoss >= 0 ? 'badge-success' : 'badge-danger'">
                    {{ h.profitLoss >= 0 ? '+' : '' }}₹{{ h.profitLoss | number:'1.2-2' }}
                    ({{ h.profitLossPercentage >= 0 ? '+' : '' }}{{ h.profitLossPercentage | number:'1.2-2' }}%)
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-success btn-sm" (click)="openTradeModal(h, 'BUY')">
                      <i class="fa-solid fa-plus"></i> Buy More
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="openTradeModal(h, 'SELL')">
                      <i class="fa-solid fa-minus"></i> Sell
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="!summary?.holdings || summary!.holdings.length === 0">
          <i class="fa-solid fa-briefcase"></i>
          <p>You have no stock holdings yet.</p>
          <a routerLink="/stocks" class="btn btn-primary btn-sm">Explore Stocks Market</a>
        </div>
      </div>

      <!-- Trade Modal -->
      <div class="modal-overlay" *ngIf="selectedHolding" (click)="closeModal()">
        <div class="modal-content card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>
              <i [class]="tradeAction === 'BUY' ? 'fa-solid fa-cart-shopping text-success' : 'fa-solid fa-hand-holding-dollar text-danger'"></i>
              {{ tradeAction }} Shares: {{ selectedHolding.stock.symbol }}
            </h3>
            <button class="close-btn" (click)="closeModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-info">
            <div>
              <strong>{{ selectedHolding.stock.companyName }}</strong>
              <div class="sub-text">Currently Owning: {{ selectedHolding.quantity }} shares</div>
            </div>
            <div class="text-right">
              <div class="price-lbl">₹{{ selectedHolding.stock.currentPrice | number:'1.2-2' }}</div>
            </div>
          </div>

          <div class="form-group mt-3">
            <label class="form-label">Quantity</label>
            <input type="number" class="form-control" min="1" [max]="tradeAction === 'SELL' ? selectedHolding.quantity : 9999" [(ngModel)]="tradeQty" (input)="calcTotal()">
          </div>

          <div class="calc-box">
            <div class="calc-row">
              <span>Total Estimated:</span>
              <strong>₹{{ totalAmt | number:'1.2-2' }}</strong>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
            <button class="btn" [ngClass]="tradeAction === 'BUY' ? 'btn-success' : 'btn-danger'" [disabled]="loading" (click)="confirmTrade()">
              <span *ngIf="!loading">Confirm {{ tradeAction }}</span>
              <span *ngIf="loading">Executing...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .summary-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-box {
      padding: 1.25rem;
    }

    .stat-lbl {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .stat-val {
      font-size: 1.35rem;
      font-weight: 800;
      margin-top: 0.35rem;
      color: var(--primary);
    }

    .pct-sub {
      font-size: 0.85rem;
      font-weight: 700;
    }

    .text-accent { color: var(--accent); }
    .text-success { color: #10b981; }
    .text-danger { color: #ef4444; }
    .mt-4 { margin-top: 1.5rem; }
    .mt-3 { margin-top: 1rem; }

    .card-header {
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1rem;
    }

    .holding-stock-info {
      display: flex;
      flex-direction: column;
    }

    .stock-sym { font-size: 0.95rem; color: var(--primary); }
    .company-name { font-size: 0.75rem; color: var(--text-muted); }

    .action-btns {
      display: flex;
      gap: 0.4rem;
    }

    .toast-alert {
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
      font-weight: 600;
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

    .close-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--text-muted); cursor: pointer; }

    .modal-info {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sub-text { font-size: 0.75rem; color: var(--text-muted); }
    .price-lbl { font-size: 1.25rem; font-weight: 800; color: var(--accent); }

    .calc-box {
      background: #f1f5f9;
      padding: 1rem;
      border-radius: 10px;
      margin: 1.25rem 0;
    }

    .calc-row { display: flex; justify-content: space-between; font-size: 1rem; color: var(--primary); }

    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; }

    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
    .empty-state i { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.4; }
  `]
})
export class PortfolioComponent implements OnInit {
  summary: PortfolioSummary | null = null;
  selectedHolding: Holding | null = null;
  tradeAction: 'BUY' | 'SELL' = 'BUY';
  tradeQty = 1;
  totalAmt = 0;
  loading = false;

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private tradingService: TradingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.tradingService.getPortfolioSummary().subscribe({
      next: (data) => this.summary = data,
      error: () => {}
    });
  }

  openTradeModal(holding: Holding, action: 'BUY' | 'SELL'): void {
    this.selectedHolding = holding;
    this.tradeAction = action;
    this.tradeQty = 1;
    this.calcTotal();
  }

  closeModal(): void {
    this.selectedHolding = null;
  }

  calcTotal(): void {
    if (this.selectedHolding && this.tradeQty > 0) {
      this.totalAmt = this.selectedHolding.stock.currentPrice * this.tradeQty;
    } else {
      this.totalAmt = 0;
    }
  }

  confirmTrade(): void {
    if (!this.selectedHolding || this.tradeQty <= 0) return;

    this.loading = true;
    const req$ = this.tradeAction === 'BUY'
      ? this.tradingService.buyStock(this.selectedHolding.stock.id, this.tradeQty)
      : this.tradingService.sellStock(this.selectedHolding.stock.id, this.tradeQty);

    req$.subscribe({
      next: (res) => {
        this.loading = false;
        this.showToast(res.message, 'success');
        this.authService.updateUserBalance(res.newVirtualBalance);
        this.loadPortfolio();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
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
