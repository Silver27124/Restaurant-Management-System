import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (n of rs.notifications(); track n.id) {
        <div class="notification" [ngClass]="n.type" (click)="rs.removeNotification(n.id)">
          <span class="notif-icon">{{ icons[n.type] }}</span>
          <span class="notif-msg">{{ n.message }}</span>
          <button class="notif-close">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 360px;
    }
    .notification {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      cursor: pointer;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
    }
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    .notification.success { background: #198754; }
    .notification.error   { background: #dc3545; }
    .notification.warning { background: #fd7e14; }
    .notification.info    { background: #0d6efd; }
    .notif-icon { font-size: 1.1rem; flex-shrink: 0; }
    .notif-msg  { flex: 1; }
    .notif-close {
      background: none; border: none; color: rgba(255,255,255,0.7);
      cursor: pointer; font-size: 1rem; padding: 0; flex-shrink: 0;
    }
  `]
})
export class NotificationComponent {
  rs = inject(RestaurantService);
  icons: Record<string, string> = {
    success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
  };
}

