import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservations/reservations').then(m => m.ReservationsComponent),
  },
  {
    path: 'tables',
    loadComponent: () => import('./pages/table-layout/table-layout').then(m => m.TableLayoutComponent),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu').then(m => m.MenuComponent),
  },
  {
    path: 'staff',
    loadComponent: () => import('./pages/staff/staff').then(m => m.StaffComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports').then(m => m.ReportsComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
