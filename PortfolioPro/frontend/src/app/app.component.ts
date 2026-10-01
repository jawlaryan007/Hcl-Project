import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="isLoggedIn"></app-navbar>
      <main class="main-content">
        <div class="sim-header-notice" *ngIf="isLoggedIn">
          <i class="fa-solid fa-graduation-cap"></i>
          <span><strong>PortfolioPro:</strong> Simulated Paper Trading System for College Project Demo. All figures in Indian Rupees (₹).</span>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .sim-header-notice {
      background: #0f172a;
      color: #94a3b8;
      padding: 0.5rem 1.5rem;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .sim-header-notice strong {
      color: #3b82f6;
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
