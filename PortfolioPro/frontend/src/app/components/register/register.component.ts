import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <h1>Create Account</h1>
          <p>Start your paper trading journey with ₹1,00,000 virtual cash</p>
        </div>

        <div *ngIf="errorMessage" class="error-banner">
          <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="name" name="name" required placeholder="John Doe">
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="john@example.com">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required placeholder="••••••••">
          </div>

          <div class="form-group">
            <label class="form-label">Select Role</label>
            <select class="form-control" [(ngModel)]="role" name="role">
              <option value="USER">User (Paper Trader)</option>
              <option value="ADMIN">Admin (System Administrator)</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            <span *ngIf="!loading">Register Account <i class="fa-solid fa-arrow-right"></i></span>
            <span *ngIf="loading">Creating account...</span>
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: #fff;
      margin: 0 auto 1rem;
      box-shadow: 0 8px 20px rgba(16,185,129,0.3);
    }

    .auth-header h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 0.25rem;
    }

    .auth-header p {
      font-size: 0.85rem;
      color: var(--text-muted);
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
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'USER';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill out all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
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
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
