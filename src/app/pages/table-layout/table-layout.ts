import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCountPipe } from '../../pipes/pipes';
import { RestaurantService } from '../../services/restaurant.service';
import { Table, TableStatus } from '../../models';

@Component({
  selector: 'app-table-layout',
  imports: [CommonModule, TableCountPipe],
  templateUrl: './table-layout.html',
  styleUrl: './table-layout.css',
})
export class TableLayoutComponent {
  rs = inject(RestaurantService);

  selectedSection = signal<string>('All');
  selectedTable   = signal<Table | null>(null);

  sections = computed(() => {
    const all = this.rs.tables().map(t => t.section);
    return ['All', ...new Set(all)];
  });

  displayedTables = computed(() => {
    const sec = this.selectedSection();
    return sec === 'All'
      ? this.rs.tables()
      : this.rs.tables().filter(t => t.section === sec);
  });

  statuses: TableStatus[] = ['available', 'occupied', 'reserved', 'cleaning'];

  statusLabel: Record<TableStatus, string> = {
    available: '✅ Available',
    occupied:  '🔴 Occupied',
    reserved:  '🟠 Reserved',
    cleaning:  '🧹 Cleaning',
  };

  selectTable(t: Table) {
    this.selectedTable.set(this.selectedTable()?.id === t.id ? null : t);
  }

  changeStatus(tableId: string, status: TableStatus) {
    this.rs.updateTableStatus(tableId, status);
    const updated = this.rs.tables().find(t => t.id === tableId) ?? null;
    this.selectedTable.set(updated);
  }

  getTableReservation(tableId: string) {
    return this.rs.reservations().find(r => r.tableId === tableId && r.status !== 'cancelled' && r.status !== 'completed');
  }

  getTableOrder(tableId: string) {
    return this.rs.orders().find(o => o.tableId === tableId && !o.paid && o.status !== 'cancelled');
  }
}
