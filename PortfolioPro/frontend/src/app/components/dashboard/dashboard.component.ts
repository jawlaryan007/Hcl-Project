import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TradingService } from '../../services/trading.service';
import { StockService } from '../../services/stock.service';
import { AuthService } from '../../services/auth.service';
import { PortfolioSummary, Stock, Transaction, User } from '../../models/portfolio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="sim-notice-card">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span><strong>SIMULATION MODE:</strong> All trading in PortfolioPro uses virtual funds (₹ INR) for paper trading practice. No real money or real stock execution.</span>
      </div>

      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-chart-pie"></i> Dashboard Overview
          </h1>
          <p class="page-subtitle">Welcome back, {{ user?.name }}! Here is your paper portfolio summary.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/stocks" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Buy Stocks
          </a>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-icon val-icon"><i class="fa-solid fa-sack-dollar"></i></div>
          <div class="stat-details">
            <span class="stat-label">Total Portfolio Value</span>
            <h3 class="stat-value">₹{{ summary?.totalValue || (user?.virtualBalance || 100000) | number:'1.2-2' }}</h3>
            <span class="stat-sub">Cash + Investments</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon cash-icon"><i class="fa-solid fa-wallet"></i></div>
          <div class="stat-details">
            <span class="stat-label">Available Balance</span>
            <h3 class="stat-value">₹{{ summary?.availableBalance || (user?.virtualBalance || 100000) | number:'1.2-2' }}</h3>
            <span class="stat-sub">Ready to invest</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon inv-icon"><i class="fa-solid fa-vault"></i></div>
          <div class="stat-details">
            <span class="stat-label">Invested Amount</span>
            <h3 class="stat-value">₹{{ summary?.totalInvested || 0 | number:'1.2-2' }}</h3>
            <span class="stat-sub">Total capital deployed</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon" [ngClass]="(summary?.totalProfitLoss || 0) >= 0 ? 'pl-up-icon' : 'pl-down-icon'">
            <i [class]="(summary?.totalProfitLoss || 0) >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"></i>
          </div>
          <div class="stat-details">
            <span class="stat-label">Total Profit / Loss</span>
            <h3 class="stat-value" [ngClass]="(summary?.totalProfitLoss || 0) >= 0 ? 'text-success' : 'text-danger'">
              {{ (summary?.totalProfitLoss || 0) >= 0 ? '+' : '' }}₹{{ summary?.totalProfitLoss || 0 | number:'1.2-2' }}
            </h3>
            <span class="badge" [ngClass]="(summary?.totalProfitLossPercentage || 0) >= 0 ? 'badge-success' : 'badge-danger'">
              {{ (summary?.totalProfitLossPercentage || 0) >= 0 ? '+' : '' }}{{ summary?.totalProfitLossPercentage || 0 | number:'1.2-2' }}%
            </span>
          </div>
        </div>
      </div>

      <div class="dashboard-main-grid">
        <!-- Visual Portfolio Chart & Distribution -->
        <div class="chart-card card">
          <div class="card-header">
            <h3><i class="fa-solid fa-chart-line"></i> Portfolio Asset Distribution</h3>
            <span class="badge badge-info">{{ summary?.totalHoldingsCount || 0 }} Active Holding(s)</span>
          </div>

          <div class="chart-content">
            <div class="svg-chart-wrapper">
              <svg viewBox="0 0 400 160" class="performance-chart">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <path d="M 10,140 Q 80,110 150,90 T 290,50 T 390,30 L 390,150 L 10,150 Z" fill="url(#chartGrad)"/>
                <path d="M 10,140 Q 80,110 150,90 T 290,50 T 390,30" fill="none" stroke="#3b82f6" stroke-width="3"/>
                <circle cx="390" cy="30" r="5" fill="#3b82f6"/>
              </svg>
            </div>

            <div class="holdings-mini-list" *ngIf="summary && summary.holdings && summary.holdings.length > 0">
              <div class="mini-holding-item" *ngFor="let h of summary.holdings">
                <div class="symbol-circle">{{ h.stock.symbol.substring(0, 3) }}</div>
                <div class="mini-info">
                  <strong>{{ h.stock.companyName }}</strong>
                  <span>{{ h.quantity }} shares &#64; ₹{{ h.averagePrice | number:'1.2-2' }}</span>
                </div>
                <div class="mini-val text-right">
                  <strong>₹{{ h.currentValue | number:'1.2-2' }}</strong>
                  <span [ngClass]="h.profitLoss >= 0 ? 'text-success' : 'text-danger'">
                    {{ h.profitLoss >= 0 ? '+' : '' }}₹{{ h.profitLoss | number:'1.2-2' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="empty-state" *ngIf="!summary || !summary.holdings || summary.holdings.length === 0">
              <i class="fa-solid fa-briefcase"></i>
              <p>No stock holdings yet. Explore available Indian stocks to start paper trading!</p>
              <a routerLink="/stocks" class="btn btn-primary btn-sm">Explore Stocks</a>
            </div>
          </div>
        </div>

        <!-- Popular Indian Stocks -->
        <div class="stocks-sidebar-card card">
          <div class="card-header">
            <h3><i class="fa-solid fa-fire"></i> Popular Stocks</h3>
            <a routerLink="/stocks" class="view-all-link">View All</a>
          </div>

          <div class="popular-stocks-list">
            <div class="popular-stock-item" *ngFor="let stock of popularStocks" [routerLink]="['/stocks', stock.id]">
              <div class="stock-meta">
                <div class="stock-sym">{{ stock.symbol }}</div>
                <div class="stock-name">{{ stock.companyName }}</div>
              </div>
              <div class="stock-price-col">
                <div class="stock-price">₹{{ stock.currentPrice | number:'1.2-2' }}</div>
                <div class="stock-chg" [ngClass]="(stock.dayChange || 0) >= 0 ? 'text-success' : 'text-danger'">
                  {{ (stock.dayChange || 0) >= 0 ? '+' : '' }}{{ stock.dayChangePercent || 0 | number:'1.2-2' }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table -->
      <div class="transactions-section card mt-4">
        <div class="card-header">
          <h3><i class="fa-solid fa-clock-rotate-left"></i> Recent Activity</h3>
          <a routerLink="/transactions" class="view-all-link">Full History</a>
        </div>

        <div class="table-container" *ngIf="recentTransactions.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tx of recentTransactions">
                <td>
                  <span class="badge" [ngClass]="tx.type === 'BUY' ? 'badge-success' : 'badge-danger'">
                    {{ tx.type }}
                  </span>
                </td>
                <td><strong>{{ tx.stock.symbol }}</strong> - {{ tx.stock.companyName }}</td>
                <td>{{ tx.quantity }}</td>
                <td>₹{{ tx.price | number:'1.2-2' }}</td>
                <td><strong>₹{{ tx.totalAmount | number:'1.2-2' }}</strong></td>
                <td>{{ tx.transactionDate | date:'medium' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="recentTransactions.length === 0">
          <p>No recent transactions recorded yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sim-notice-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #b45309;
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
    }

    .val-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .cash-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .inv-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .pl-up-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .pl-down-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .stat-details {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .stat-value {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary);
      margin: 0.15rem 0;
    }

    .stat-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .dashboard-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 992px) {
      .dashboard-main-grid {
        grid-template-columns: 1fr;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .card-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .svg-chart-wrapper {
      width: 100%;
      background: #f8fafc;
      border-radius: 10px;
      padding: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .performance-chart {
      width: 100%;
      height: 140px;
    }

    .mini-holding-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .symbol-circle {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 800;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
    }

    .mini-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .mini-info strong { font-size: 0.9rem; }
    .mini-info span { font-size: 0.75rem; color: var(--text-muted); }

    .popular-stocks-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .popular-stock-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s;
    }

    .popular-stock-item:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .stock-sym {
      font-weight: 800;
      font-size: 0.9rem;
      color: var(--primary);
    }

    .stock-name {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .stock-price-col {
      text-align: right;
    }

    .stock-price {
      font-weight: 700;
      font-size: 0.9rem;
    }

    .stock-chg {
      font-size: 0.75rem;
      font-weight: 700;
    }

    .view-all-link {
      font-size: 0.825rem;
      color: var(--accent);
      font-weight: 700;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }

    .empty-state i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    .text-success { color: #10b981 !important; }
    .text-danger { color: #ef4444 !important; }
    .mt-4 { margin-top: 1.5rem; }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  summary: PortfolioSummary | null = null;
  popularStocks: Stock[] = [];
  recentTransactions: Transaction[] = [];

  constructor(
    private authService: AuthService,
    private tradingService: TradingService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.tradingService.getPortfolioSummary().subscribe({
      next: (data) => this.summary = data,
      error: () => {}
    });

    this.stockService.getAllStocks().subscribe({
      next: (stocks) => this.popularStocks = stocks.slice(0, 5),
      error: () => {}
    });

    this.tradingService.getTransactions().subscribe({
      next: (txs) => this.recentTransactions = txs.slice(0, 5),
      error: () => {}
    });
  }
}
