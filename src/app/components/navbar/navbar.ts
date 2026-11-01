import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  rs = inject(RestaurantService);
  mobileOpen = signal(false);

  navLinks = [
    { path: '/dashboard',    label: 'Dashboard',    icon: '📊' },
    { path: '/reservations', label: 'Reservations', icon: '📅' },
    { path: '/tables',       label: 'Table Layout', icon: '🪑' },
    { path: '/orders',       label: 'Orders',       icon: '🧾' },
    { path: '/menu',         label: 'Menu',         icon: '🍽️' },
    { path: '/staff',        label: 'Staff',        icon: '👥' },
    { path: '/reports',      label: 'Reports',      icon: '📈' },
  ];

  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile()  { this.mobileOpen.set(false); }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.navbar')) this.mobileOpen.set(false);
  }
}

