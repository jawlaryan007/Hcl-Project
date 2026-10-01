import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">
            <i class="fa-solid fa-chart-line"></i>
          </div>
          <h1>Welcome to <span>PortfolioPro</span></h1>
          <p>3rd Year Paper Trading & Portfolio Management System</p>
        </div>

        <div class="demo-buttons-box">
          <div class="demo-title"><i class="fa-solid fa-bolt"></i> Quick Demo Accounts</div>
          <div class="demo-grid">
            <button type="button" class="btn-demo student" (click)="loginDemoStudent()">
              <i class="fa-solid fa-user-graduate"></i> Student (USER)
            </button>
            <button type="button" class="btn-demo admin" (click)="loginDemoAdmin()">
              <i class="fa-solid fa-user-shield"></i> Admin (ADMIN)
            </button>
          </div>
        </div>

        <div class="divider"><span>or sign in manually</span></div>

        <div *ngIf="errorMessage" class="error-banner">
          <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="student@portfoliopro.com">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required placeholder="••••••••">
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            <span *ngIf="!loading">Sign In <i class="fa-solid fa-arrow-right"></i></span>
            <span *ngIf="loading">Signing in...</span>
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a routerLink="/register">Register here</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 1.5rem;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .auth-logo {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: #fff;
      margin: 0 auto 1rem;
      box-shadow: 0 8px 20px rgba(59,130,246,0.4);
    }

    .auth-header h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 0.25rem;
    }

    .auth-header h1 span {
      color: #3b82f6;
    }

    .auth-header p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .demo-buttons-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.25rem;
    }

    .demo-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
      letter-spacing: 0.05em;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .btn-demo {
      padding: 0.6rem;
      font-size: 0.825rem;
      font-weight: 700;
      border-radius: 8px;
      border: 1px solid var(--border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }

    .btn-demo.student {
      background: #eff6ff;
      color: #2563eb;
      border-color: #bfdbfe;
    }

    .btn-demo.student:hover {
      background: #3b82f6;
      color: #fff;
    }

    .btn-demo.admin {
      background: #fffbeb;
      color: #d97706;
      border-color: #fde68a;
    }

    .btn-demo.admin:hover {
      background: #f59e0b;
      color: #fff;
    }

    .divider {
      text-align: center;
      margin: 1.25rem 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    .divider span {
      position: relative;
      background: #fff;
      padding: 0 0.75rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .error-banner {
      background: #fef2f2;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      border: 1px solid #fecaca;
    }

    .btn-block {
      width: 100%;
      margin-top: 0.5rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .auth-footer a {
      color: var(--accent);
      font-weight: 700;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginDemoStudent(): void {
    this.email = 'student@portfoliopro.com';
    this.password = 'student123';
    this.onSubmit();
  }

  loginDemoAdmin(): void {
    this.email = 'admin@portfoliopro.com';
    this.password = 'admin123';
    this.onSubmit();
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check backend connection.';
      }
    });
  }
}
