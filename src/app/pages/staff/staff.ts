import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-staff',
  imports: [CommonModule, TitleCasePipe],
  template: `
<div class="page">
  <div class="page-header">
    <div><h1>👥 Staff</h1><p class="subtitle">Manage your restaurant team</p></div>
    <div class="header-stats">
      <span class="stat-chip green">✅ On Duty: {{ onDuty().length }}</span>
      <span class="stat-chip grey">⭕ Off Duty: {{ offDuty().length }}</span>
    </div>
  </div>

  <!-- Role filter -->
  <div class="role-tabs">
    @for (r of roles; track r) {
      <button class="role-tab" [class.active]="filterRole() === r"
        (click)="filterRole.set(r)">{{ r | titlecase }}</button>
    }
  </div>

  <div class="staff-grid">
    @for (s of filtered(); track s.id) {
      <div class="staff-card" [class.off-duty]="!s.onDuty">
        <div class="staff-card-top" [class.on]="s.onDuty" [class.off]="!s.onDuty">
          <span class="staff-big-avatar">{{ s.avatar }}</span>
          <div class="duty-badge" [class.on]="s.onDuty">
            {{ s.onDuty ? 'On Duty' : 'Off Duty' }}
          </div>
        </div>
        <div class="staff-card-body">
          <h3 class="staff-name">{{ s.name }}</h3>
          <span class="staff-role-badge">{{ s.role | titlecase }}</span>
          <div class="staff-details">
            <div class="sd-row"><span>📧</span><span>{{ s.email }}</span></div>
            <div class="sd-row"><span>📱</span><span>{{ s.phone }}</span></div>
            <div class="sd-row"><span>⏰</span><span>{{ s.shiftStart }} – {{ s.shiftEnd }}</span></div>
            @if (s.tablesAssigned.length) {
              <div class="sd-row"><span>🪑</span><span>Tables: {{ getTableNumbers(s.tablesAssigned) }}</span></div>
            }
          </div>
          <button class="toggle-duty-btn" [class.make-on]="!s.onDuty" (click)="rs.toggleStaffDuty(s.id)">
            {{ s.onDuty ? 'Mark Off Duty' : 'Mark On Duty' }}
          </button>
        </div>
      </div>
    }
  </div>
</div>
  `,
  styleUrl: './staff.css',
})
export class StaffComponent {
  rs = inject(RestaurantService);
  filterRole = signal('all');
  roles = ['all','manager','waiter','chef','host','cashier'];

  onDuty  = computed(() => this.rs.staff().filter(s => s.onDuty));
  offDuty = computed(() => this.rs.staff().filter(s => !s.onDuty));

  filtered = computed(() => {
    const r = this.filterRole();
    return r === 'all' ? this.rs.staff() : this.rs.staff().filter(s => s.role === r);
  });

  getTableNumbers(tableIds: string[]): string {
    return tableIds.map(id => {
      const t = this.rs.tables().find(t => t.id === id);
      return t ? t.number : id;
    }).join(', ');
  }
}
