import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Reservation, ReservationStatus } from '../../models';
import { FilterCountPipe } from '../../pipes/pipes';

@Component({
  selector: 'app-reservations',
  imports: [CommonModule, FormsModule, TitleCasePipe, FilterCountPipe],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class ReservationsComponent {
  rs = inject(RestaurantService);

  // Filter / search state
  searchTerm    = signal('');
  filterStatus  = signal<ReservationStatus | 'all'>('all');
  filterDate    = signal(new Date().toISOString().split('T')[0]);
  showForm      = signal(false);
  editingId     = signal<string | null>(null);

  // Form state
  form = signal({
    customerName: '', customerEmail: '', customerPhone: '',
    partySize: 2, date: new Date().toISOString().split('T')[0],
    time: '12:00', tableId: '', status: 'pending' as ReservationStatus,
    specialRequests: '',
  });

  statuses: (ReservationStatus | 'all')[] = ['all','pending','confirmed','seated','completed','cancelled'];

  // Computed filtered list
  filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.filterStatus();
    const date = this.filterDate();
    return this.rs.reservations()
      .filter(r => {
        const matchSearch = !term ||
          r.customerName.toLowerCase().includes(term) ||
          r.customerEmail.toLowerCase().includes(term) ||
          r.customerPhone.includes(term);
        const matchStatus = status === 'all' || r.status === status;
        const matchDate   = !date || r.date === date;
        return matchSearch && matchStatus && matchDate;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  });

  availableTablesForForm = computed(() =>
    this.rs.tables().filter(t =>
      t.status === 'available' || (this.editingId() && t.id === this.form().tableId)
    )
  );

  openNew() {
    this.form.set({
      customerName: '', customerEmail: '', customerPhone: '',
      partySize: 2, date: new Date().toISOString().split('T')[0],
      time: '12:00', tableId: '', status: 'pending',
      specialRequests: '',
    });
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(r: Reservation) {
    this.form.set({
      customerName: r.customerName, customerEmail: r.customerEmail,
      customerPhone: r.customerPhone, partySize: r.partySize,
      date: r.date, time: r.time, tableId: r.tableId ?? '',
      status: r.status, specialRequests: r.specialRequests ?? '',
    });
    this.editingId.set(r.id);
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); this.editingId.set(null); }

  submitForm() {
    const f = this.form();
    if (!f.customerName || !f.customerPhone || !f.date || !f.time) {
      this.rs.addNotification('Please fill all required fields', 'error');
      return;
    }
    const table = this.rs.tables().find(t => t.id === f.tableId);
    const payload: Omit<Reservation,'id'|'createdAt'|'updatedAt'> = {
      customerName: f.customerName, customerEmail: f.customerEmail,
      customerPhone: f.customerPhone, partySize: f.partySize,
      date: f.date, time: f.time,
      tableId: f.tableId || undefined,
      tableNumber: table?.number,
      status: f.status,
      specialRequests: f.specialRequests || undefined,
    };
    if (this.editingId()) {
      this.rs.updateReservation(this.editingId()!, payload);
    } else {
      this.rs.addReservation(payload);
    }
    this.closeForm();
  }

  patchForm(key: string, value: unknown) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  updateStatus(id: string, status: ReservationStatus) {
    this.rs.updateReservationStatus(id, status);
  }

  deleteRes(id: string) {
    if (confirm('Delete this reservation?')) this.rs.deleteReservation(id);
  }

  statusColor(s: string): string {
    const m: Record<string,string> = {
      pending:'#fd7e14', confirmed:'#0d6efd', seated:'#28a745',
      completed:'#6c757d', cancelled:'#dc3545'
    };
    return m[s] ?? '#6c757d';
  }

  nextStatuses(current: ReservationStatus): ReservationStatus[] {
    const flow: Record<ReservationStatus, ReservationStatus[]> = {
      pending:   ['confirmed','cancelled'],
      confirmed: ['seated','cancelled'],
      seated:    ['completed'],
      completed: [],
      cancelled: [],
    };
    return flow[current] ?? [];
  }
}
