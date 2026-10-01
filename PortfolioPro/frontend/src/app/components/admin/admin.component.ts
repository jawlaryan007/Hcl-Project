import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { StockService } from '../../services/stock.service';
import { AdminStats, Stock, User } from '../../models/portfolio.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-user-shield text-warning"></i> Admin Management Portal
          </h1>
          <p class="page-subtitle">Manage system users, stock listings, prices, and view platform analytics.</p>
        </div>
      </div>

      <!-- Toast Alert -->
      <div *ngIf="toastMessage" class="toast-alert" [ngClass]="toastType">
        <i [class]="toastType === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"></i>
        {{ toastMessage }}
      </div>

      <!-- Platform Analytics Cards -->
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-icon icon-users"><i class="fa-solid fa-users"></i></div>
          <div class="stat-details">
            <span class="stat-lbl">Total Registered Users</span>
            <h3 class="stat-val">{{ stats?.totalUsers || 0 }}</h3>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon icon-stocks"><i class="fa-solid fa-arrow-trend-up"></i></div>
          <div class="stat-details">
            <span class="stat-lbl">Total Listed Stocks</span>
            <h3 class="stat-val">{{ stats?.totalStocks || 0 }}</h3>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon icon-txs"><i class="fa-solid fa-receipt"></i></div>
          <div class="stat-details">
            <span class="stat-lbl">Total Transactions</span>
            <h3 class="stat-val">{{ stats?.totalTransactions || 0 }}</h3>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon icon-vol"><i class="fa-solid fa-chart-column"></i></div>
          <div class="stat-details">
            <span class="stat-lbl">Total Platform Volume</span>
            <h3 class="stat-val">₹{{ stats?.totalPlatformVolume || 0 | number:'1.2-2' }}</h3>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="admin-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'STOCKS'" (click)="activeTab = 'STOCKS'">
          <i class="fa-solid fa-cubes"></i> Stock Management
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'USERS'" (click)="activeTab = 'USERS'">
          <i class="fa-solid fa-users"></i> User Directory
        </button>
      </div>

      <!-- Stocks Management Section -->
      <div class="card" *ngIf="activeTab === 'STOCKS'">
        <div class="card-header">
          <h3>Listed Stock Catalog</h3>
          <button class="btn btn-primary btn-sm" (click)="openAddStockModal()">
            <i class="fa-solid fa-plus"></i> Add New Stock
          </button>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Sector</th>
                <th>Current Price</th>
                <th>Previous Close</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let stock of stocks">
                <td><strong class="stock-sym">{{ stock.symbol }}</strong></td>
                <td>{{ stock.companyName }}</td>
                <td><span class="sector-badge">{{ stock.sector }}</span></td>
                <td><strong>₹{{ stock.currentPrice | number:'1.2-2' }}</strong></td>
                <td>₹{{ stock.previousPrice | number:'1.2-2' }}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-outline btn-sm" (click)="openEditModal(stock)">
                      <i class="fa-solid fa-pen-to-square"></i> Update Price
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="deleteStock(stock.id)">
                      <i class="fa-solid fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Directory Section -->
      <div class="card" *ngIf="activeTab === 'USERS'">
        <div class="card-header">
          <h3>Registered Users List</h3>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Virtual Cash Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of users">
                <td>#{{ u.id }}</td>
                <td><strong>{{ u.name }}</strong></td>
                <td>{{ u.email }}</td>
                <td>
                  <span class="badge" [ngClass]="u.role === 'ADMIN' ? 'badge-warning' : 'badge-info'">
                    {{ u.role }}
                  </span>
                </td>
                <td><strong>₹{{ u.virtualBalance | number:'1.2-2' }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Stock Modal -->
      <div class="modal-overlay" *ngIf="showAddModal" (click)="showAddModal = false">
        <div class="modal-content card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Add New Stock to System</h3>
            <button class="close-btn" (click)="showAddModal = false"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form (ngSubmit)="submitAddStock()">
            <div class="form-group">
              <label class="form-label">Stock Symbol (e.g. TATAPOWER)</label>
              <input type="text" class="form-control" [(ngModel)]="newStock.symbol" name="symbol" required>
            </div>
            <div class="form-group">
              <label class="form-label">Company Name</label>
              <input type="text" class="form-control" [(ngModel)]="newStock.companyName" name="companyName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Sector</label>
              <input type="text" class="form-control" [(ngModel)]="newStock.sector" name="sector" required>
            </div>
            <div class="form-group">
              <label class="form-label">Initial Price (₹)</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="newStock.currentPrice" name="price" required>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Stock</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Stock Modal -->
      <div class="modal-overlay" *ngIf="editingStock" (click)="editingStock = null">
        <div class="modal-content card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Update Price: {{ editingStock.symbol }}</h3>
            <button class="close-btn" (click)="editingStock = null"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form (ngSubmit)="submitUpdateStock()">
            <div class="form-group">
              <label class="form-label">New Stock Price (₹)</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="editPrice" name="editPrice" required>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="editingStock = null">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Price</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-warning { color: #f59e0b; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; font-size: 1.25rem;
    }
    .icon-users { background: #eff6ff; color: #2563eb; }
    .icon-stocks { background: #ecfdf5; color: #059669; }
    .icon-txs { background: #fef3c7; color: #d97706; }
    .icon-vol { background: #f3e8ff; color: #7c3aed; }

    .stat-lbl { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
    .stat-val { font-size: 1.35rem; font-weight: 800; color: var(--primary); }

    .admin-tabs { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; }
    .tab-btn {
      padding: 0.65rem 1.25rem; border-radius: 10px; border: 1px solid var(--border);
      background: #fff; font-weight: 700; color: var(--text-muted); cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);
    }

    .stock-sym { color: var(--primary); font-size: 0.95rem; }
    .sector-badge { font-size: 0.75rem; background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px; }
    .action-btns { display: flex; gap: 0.5rem; }
    .badge-warning { background: #fef3c7; color: #b45309; }

    .toast-alert { padding: 1rem; border-radius: 10px; margin-bottom: 1.25rem; font-weight: 600; }
    .toast-alert.success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .toast-alert.danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
    .close-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--text-muted); cursor: pointer; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
  `]
})
export class AdminComponent implements OnInit {
  stats: AdminStats | null = null;
  stocks: Stock[] = [];
  users: User[] = [];
  activeTab: 'STOCKS' | 'USERS' = 'STOCKS';

  showAddModal = false;
  newStock: Partial<Stock> = { symbol: '', companyName: '', sector: '', currentPrice: 0 };

  editingStock: Stock | null = null;
  editPrice = 0;

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private adminService: AdminService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.adminService.getAdminStats().subscribe({
      next: (data) => this.stats = data,
      error: () => {}
    });

    this.stockService.getAllStocks().subscribe({
      next: (data) => this.stocks = data,
      error: () => {}
    });

    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: () => {}
    });
  }

  openAddStockModal(): void {
    this.newStock = { symbol: '', companyName: '', sector: '', currentPrice: 0 };
    this.showAddModal = true;
  }

  submitAddStock(): void {
    if (!this.newStock.symbol || !this.newStock.companyName || !this.newStock.sector || !this.newStock.currentPrice) {
      return;
    }

    this.newStock.previousPrice = this.newStock.currentPrice;

    this.adminService.createStock(this.newStock).subscribe({
      next: () => {
        this.showAddModal = false;
        this.showToast('Stock created successfully!', 'success');
        this.loadAdminData();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to create stock', 'danger')
    });
  }

  openEditModal(stock: Stock): void {
    this.editingStock = stock;
    this.editPrice = stock.currentPrice;
  }

  submitUpdateStock(): void {
    if (!this.editingStock) return;

    this.adminService.updateStock(this.editingStock.id, {
      companyName: this.editingStock.companyName,
      sector: this.editingStock.sector,
      currentPrice: this.editPrice
    }).subscribe({
      next: () => {
        this.editingStock = null;
        this.showToast('Stock price updated!', 'success');
        this.loadAdminData();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to update stock', 'danger')
    });
  }

  deleteStock(id: number): void {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.adminService.deleteStock(id).subscribe({
        next: () => {
          this.showToast('Stock deleted', 'success');
          this.loadAdminData();
        },
        error: (err) => this.showToast(err.error?.message || 'Failed to delete stock', 'danger')
      });
    }
  }

  showToast(msg: string, type: 'success' | 'danger'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
