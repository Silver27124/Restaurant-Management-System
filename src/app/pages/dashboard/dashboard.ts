import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  rs = inject(RestaurantService);

  statCards = computed(() => {
    const s = this.rs.dashboardStats();
    return [
      { label: 'Total Tables',       value: this.rs.tables().length,     icon: '🪑', color: 'blue',   sub: `${s.availableTables} available`  },
      { label: 'Today\'s Reservations', value: s.totalReservationsToday, icon: '📅', color: 'purple', sub: 'confirmed & pending'             },
      { label: 'Active Orders',       value: this.rs.activeOrders().length, icon: '🧾', color: 'orange', sub: 'in progress'                  },
      { label: 'Today\'s Revenue',   value: '₹' + s.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 }), icon: '💰', color: 'green', sub: 'from settled bills' },
    ];
  });

  tableStatusGroups = computed(() => [
    { label: 'Available', count: this.rs.availableTables().length, color: '#28a745', icon: '✅' },
    { label: 'Occupied',  count: this.rs.occupiedTables().length,  color: '#e94560', icon: '🔴' },
    { label: 'Reserved',  count: this.rs.reservedTables().length,  color: '#fd7e14', icon: '🟠' },
    { label: 'Cleaning',  count: this.rs.tables().filter(t => t.status === 'cleaning').length, color: '#6c757d', icon: '🧹' },
  ]);

  recentReservations = computed(() =>
    this.rs.todayReservations()
      .filter(r => r.status !== 'cancelled')
      .slice(0, 5)
  );

  pendingOrders = computed(() =>
    this.rs.activeOrders()
      .filter(o => o.status === 'pending' || o.status === 'preparing')
      .slice(0, 4)
  );

  staffOnDuty = computed(() => this.rs.staff().filter(s => s.onDuty));

  statusColor(status: string): string {
    const map: Record<string, string> = {
      pending: '#fd7e14', confirmed: '#0d6efd', seated: '#28a745',
      completed: '#6c757d', cancelled: '#dc3545',
    };
    return map[status] ?? '#6c757d';
  }

  orderStatusColor(status: string): string {
    const map: Record<string, string> = {
      pending: '#fd7e14', preparing: '#0d6efd', ready: '#28a745',
      served: '#6c757d', cancelled: '#dc3545',
    };
    return map[status] ?? '#6c757d';
  }

  getTimeSince(iso: string): string {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  }
}
