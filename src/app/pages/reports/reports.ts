import { Component, inject, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, TitleCasePipe],
  template: `
<div class="page">
  <div class="page-header">
    <div><h1>📈 Reports & Analytics</h1><p class="subtitle">Overview of restaurant performance</p></div>
  </div>

  <!-- KPI Row -->
  <div class="kpi-grid">
    @for (k of kpis(); track k.label) {
      <div class="kpi-card" [style.border-color]="k.color">
        <div class="kpi-icon">{{ k.icon }}</div>
        <div class="kpi-value" [style.color]="k.color">{{ k.value }}</div>
        <div class="kpi-label">{{ k.label }}</div>
      </div>
    }
  </div>

  <div class="reports-grid">
    <!-- Order Status Breakdown -->
    <div class="report-card">
      <h3>🧾 Order Status Breakdown</h3>
      @for (row of orderBreakdown(); track row.status) {
        <div class="bar-row">
          <span class="bar-label">{{ row.status | titlecase }}</span>
          <div class="bar-track">
            <div class="bar-fill" [style.width]="row.pct + '%'" [style.background]="row.color"></div>
          </div>
          <span class="bar-val">{{ row.count }}</span>
        </div>
      }
    </div>

    <!-- Reservation Status Breakdown -->
    <div class="report-card">
      <h3>📅 Reservation Status Breakdown</h3>
      @for (row of resBreakdown(); track row.status) {
        <div class="bar-row">
          <span class="bar-label">{{ row.status | titlecase }}</span>
          <div class="bar-track">
            <div class="bar-fill" [style.width]="row.pct + '%'" [style.background]="row.color"></div>
          </div>
          <span class="bar-val">{{ row.count }}</span>
        </div>
      }
    </div>

    <!-- Top Menu Items -->
    <div class="report-card wide">
      <h3>⭐ Top Menu Items by Rating</h3>
      <div class="top-items-grid">
        @for (item of topMenuItems(); track item.id; let i = $index) {
          <div class="top-item-row">
            <span class="rank">{{ i + 1 }}</span>
            <span class="ti-emoji">{{ item.image }}</span>
            <div class="ti-info">
              <div class="ti-name">{{ item.name }}</div>
              <div class="ti-meta">{{ item.category | titlecase }} · ₹{{ item.price }}</div>
            </div>
            <div class="ti-rating">
              <span class="ti-star">★</span>
              <span>{{ item.rating }}</span>
              <span class="ti-reviews">({{ item.reviewCount }})</span>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Table Utilization -->
    <div class="report-card wide">
      <h3>🪑 Table Utilization</h3>
      <div class="table-util-grid">
        @for (t of rs.tables(); track t.id) {
          <div class="util-cell" [ngClass]="t.status" [title]="'Table ' + t.number">
            <span class="util-num">{{ t.number }}</span>
            <span class="util-status">{{ t.status }}</span>
          </div>
        }
      </div>
    </div>

    <!-- Staff Summary -->
    <div class="report-card">
      <h3>👥 Staff by Role</h3>
      @for (row of staffByRole(); track row.role) {
        <div class="staff-role-row">
          <span class="sr-role">{{ row.role | titlecase }}</span>
          <div class="sr-dots">
            @for (s of row.staff; track s.id) {
              <span class="sr-dot" [title]="s.name" [class.on]="s.onDuty">{{ s.avatar }}</span>
            }
          </div>
          <span class="sr-count">{{ row.onDuty }}/{{ row.staff.length }}</span>
        </div>
      }
    </div>

    <!-- Revenue Summary -->
    <div class="report-card">
      <h3>💰 Revenue Summary</h3>
      <div class="revenue-grid">
        <div class="rev-item"><div class="rev-val">₹{{ totalRevenue() | number:'1.0-0' }}</div><div class="rev-label">Total Billed</div></div>
        <div class="rev-item"><div class="rev-val">₹{{ settledRevenue() | number:'1.0-0' }}</div><div class="rev-label">Settled</div></div>
        <div class="rev-item"><div class="rev-val">₹{{ pendingRevenue() | number:'1.0-0' }}</div><div class="rev-label">Pending</div></div>
        <div class="rev-item"><div class="rev-val">{{ rs.orders().length }}</div><div class="rev-label">Total Orders</div></div>
      </div>
    </div>
  </div>
</div>
  `,
  styleUrl: './reports.css',
})
export class ReportsComponent {
  rs = inject(RestaurantService);

  kpis = computed(() => [
    { label:'Total Revenue',      value:'₹' + this.settledRevenue().toLocaleString('en-IN'), icon:'💰', color:'#28a745' },
    { label:'Total Reservations', value: this.rs.reservations().length,                      icon:'📅', color:'#0d6efd' },
    { label:'Total Orders',       value: this.rs.orders().length,                            icon:'🧾', color:'#fd7e14' },
    { label:'Menu Items',         value: this.rs.menuItems().length,                         icon:'🍽️', color:'#6f42c1' },
    { label:'Staff Members',      value: this.rs.staff().length,                             icon:'👥', color:'#e94560' },
    { label:'Tables',             value: this.rs.tables().length,                            icon:'🪑', color:'#0dcaf0' },
  ]);

  orderBreakdown = computed(() => {
    const orders = this.rs.orders();
    const total = orders.length || 1;
    const statuses = ['pending','preparing','ready','served','cancelled'];
    const colors: Record<string,string> = { pending:'#fd7e14', preparing:'#0d6efd', ready:'#28a745', served:'#6c757d', cancelled:'#dc3545' };
    return statuses.map(s => ({
      status: s,
      count: orders.filter(o => o.status === s).length,
      pct: Math.round(orders.filter(o => o.status === s).length / total * 100),
      color: colors[s],
    }));
  });

  resBreakdown = computed(() => {
    const res = this.rs.reservations();
    const total = res.length || 1;
    const statuses = ['pending','confirmed','seated','completed','cancelled'];
    const colors: Record<string,string> = { pending:'#fd7e14', confirmed:'#0d6efd', seated:'#28a745', completed:'#6c757d', cancelled:'#dc3545' };
    return statuses.map(s => ({
      status: s,
      count: res.filter(r => r.status === s).length,
      pct: Math.round(res.filter(r => r.status === s).length / total * 100),
      color: colors[s],
    }));
  });

  topMenuItems = computed(() =>
    [...this.rs.menuItems()].sort((a, b) => b.rating - a.rating).slice(0, 6)
  );

  staffByRole = computed(() => {
    const roles = [...new Set(this.rs.staff().map(s => s.role))];
    return roles.map(role => ({
      role,
      staff: this.rs.staff().filter(s => s.role === role),
      onDuty: this.rs.staff().filter(s => s.role === role && s.onDuty).length,
    }));
  });

  totalRevenue   = computed(() => this.rs.orders().reduce((s, o) => s + o.total, 0));
  settledRevenue = computed(() => this.rs.orders().filter(o => o.paid).reduce((s, o) => s + o.total, 0));
  pendingRevenue = computed(() => this.rs.orders().filter(o => !o.paid && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0));
}
