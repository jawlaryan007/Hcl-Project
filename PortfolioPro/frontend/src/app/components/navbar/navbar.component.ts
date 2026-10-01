import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/portfolio.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <div class="brand-text">
          <h2>Portfolio<span>Pro</span></h2>
          <span class="brand-sub">Paper Trading v1.0</span>
        </div>
      </div>

      <div class="user-card" *ngIf="user">
        <div class="user-avatar">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <span class="role-badge" [class.admin-badge]="user.role === 'ADMIN'">
            {{ user.role }}
          </span>
        </div>
        <div class="balance-container">
          <span class="balance-label">Virtual Cash</span>
          <span class="balance-value">₹{{ user.virtualBalance | number:'1.2-2' }}</span>
        </div>
      </div>

      <nav class="nav-menu">
        <div class="nav-section">MAIN MENU</div>
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <i class="fa-solid fa-house-chart"></i>
          <span>Dashboard</span>
        </a>
        <a routerLink="/stocks" routerLinkActive="active" class="nav-item">
          <i class="fa-solid fa-arrow-trend-up"></i>
          <span>Explore Stocks</span>
        </a>
        <a routerLink="/portfolio" routerLinkActive="active" class="nav-item">
          <i class="fa-solid fa-wallet"></i>
          <span>My Portfolio</span>
        </a>
        <a routerLink="/watchlist" routerLinkActive="active" class="nav-item">
          <i class="fa-solid fa-star"></i>
          <span>Watchlist</span>
        </a>
        <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
          <i class="fa-solid fa-receipt"></i>
          <span>History</span>
        </a>

        <div class="nav-section" *ngIf="user?.role === 'ADMIN'">ADMINISTRATION</div>
        <a *ngIf="user?.role === 'ADMIN'" routerLink="/admin" routerLinkActive="active" class="nav-item admin-item">
          <i class="fa-solid fa-user-shield"></i>
          <span>Admin Portal</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--primary);
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      box-shadow: 4px 0 15px rgba(0,0,0,0.05);
      z-index: 100;
    }

    .brand {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #fff;
      box-shadow: 0 4px 10px rgba(59,130,246,0.3);
    }

    .brand-text h2 {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #fff;
    }

    .brand-text h2 span {
      color: #3b82f6;
    }

    .brand-sub {
      font-size: 0.7rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .user-card {
      margin: 1.25rem;
      padding: 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: rgba(59,130,246,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #60a5fa;
      font-size: 0.9rem;
      float: left;
      margin-right: 0.75rem;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .role-badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: #334155;
      color: #94a3b8;
      font-weight: 700;
    }

    .admin-badge {
      background: #f59e0b;
      color: #0f172a;
    }

    .balance-container {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px dashed rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
    }

    .balance-label {
      font-size: 0.7rem;
      color: #94a3b8;
    }

    .balance-value {
      font-size: 1.1rem;
      font-weight: 800;
      color: #10b981;
    }

    .nav-menu {
      padding: 0.5rem 1rem;
      flex: 1;
      overflow-y: auto;
    }

    .nav-section {
      font-size: 0.65rem;
      font-weight: 700;
      color: #64748b;
      margin: 1.25rem 0.5rem 0.5rem;
      letter-spacing: 0.08em;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      color: #94a3b8;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s ease;
      margin-bottom: 0.25rem;
    }

    .nav-item:hover {
      color: #fff;
      background: rgba(255,255,255,0.05);
    }

    .nav-item.active {
      color: #fff;
      background: var(--accent);
      box-shadow: 0 4px 12px rgba(59,130,246,0.3);
    }

    .admin-item:hover, .admin-item.active {
      background: #d97706;
      color: #fff;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #ef4444;
      color: #fff;
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
