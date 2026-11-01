import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Order, OrderStatus, OrderItem, PaymentMethod } from '../../models';
import { OrderCountPipe, MenuFilterPipe, OrderSubtotalPipe } from '../../pipes/pipes';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, TitleCasePipe, OrderCountPipe, MenuFilterPipe, OrderSubtotalPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  rs = inject(RestaurantService);

  filterStatus = signal<OrderStatus | 'all'>('all');
  showNewOrder = signal(false);
  payingOrderId = signal<string | null>(null);

  // New order form
  selectedTableId = signal('');
  selectedItems = signal<OrderItem[]>([]);
  servedBy = signal('');
  paymentMethod = signal<PaymentMethod>('cash');

  statusOptions: (OrderStatus | 'all')[] = ['all','pending','preparing','ready','served','cancelled'];
  paymentMethods: PaymentMethod[] = ['cash', 'card', 'upi', 'wallet'];

  setFilterStatus(s: OrderStatus | 'all') {
    this.filterStatus.set(s);
  }

  setPaymentMethod(pm: PaymentMethod) {
    this.paymentMethod.set(pm);
  }

  filteredOrders = computed(() => {
    const s = this.filterStatus();
    return this.rs.orders()
      .filter(o => s === 'all' || o.status === s)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  availableTables = computed(() =>
    this.rs.tables().filter(t => t.status !== 'cleaning')
  );

  getOrderTotal(items: OrderItem[]): number {
    const sub = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    return +(sub * 1.18).toFixed(2);
  }

  addItemToOrder(menuItemId: string) {
    const item = this.rs.menuItems().find(m => m.id === menuItemId);
    if (!item || !item.available) return;
    this.selectedItems.update(items => {
      const existing = items.find(i => i.menuItemId === menuItemId);
      if (existing) {
        return items.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { menuItemId: item.id, menuItemName: item.name, quantity: 1, unitPrice: item.price }];
    });
  }

  removeItemFromOrder(menuItemId: string) {
    this.selectedItems.update(items => {
      const existing = items.find(i => i.menuItemId === menuItemId);
      if (existing && existing.quantity > 1) {
        return items.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return items.filter(i => i.menuItemId !== menuItemId);
    });
  }

  getItemQty(menuItemId: string): number {
    return this.selectedItems().find(i => i.menuItemId === menuItemId)?.quantity ?? 0;
  }

  submitOrder() {
    if (!this.selectedTableId() || this.selectedItems().length === 0) {
      this.rs.addNotification('Select a table and add items', 'error');
      return;
    }
    const table = this.rs.tables().find(t => t.id === this.selectedTableId());
    if (!table) return;
    this.rs.addOrder(table.id, table.number, this.selectedItems(), this.servedBy());
    this.showNewOrder.set(false);
    this.selectedTableId.set('');
    this.selectedItems.set([]);
    this.servedBy.set('');
  }

  settlePayment() {
    if (!this.payingOrderId()) return;
    this.rs.settleOrder(this.payingOrderId()!, this.paymentMethod());
    this.payingOrderId.set(null);
  }

  orderColor(status: string): string {
    const m: Record<string,string> = {
      pending:'#fd7e14', preparing:'#0d6efd', ready:'#28a745',
      served:'#6c757d', cancelled:'#dc3545'
    };
    return m[status] ?? '#6c757d';
  }

  nextStatus(status: OrderStatus): OrderStatus | null {
    const flow: Partial<Record<OrderStatus, OrderStatus>> = {
      pending:'preparing', preparing:'ready', ready:'served'
    };
    return flow[status] ?? null;
  }

  advanceOrder(id: string, current: OrderStatus) {
    const next = this.nextStatus(current);
    if (next) this.rs.updateOrderStatus(id, next);
  }

  cancelOrder(id: string) {
    if (confirm('Cancel this order?')) this.rs.updateOrderStatus(id, 'cancelled');
  }

  getTimeSince(iso: string): string {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  }
}
