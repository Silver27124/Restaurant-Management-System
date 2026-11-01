import { Pipe, PipeTransform } from '@angular/core';
import { Reservation, Order, MenuItem, Table } from '../models';

/** Count reservations by status */
@Pipe({ name: 'filterCount', pure: false })
export class FilterCountPipe implements PipeTransform {
  transform(reservations: Reservation[], status: string): number {
    return reservations.filter(r => r.status === status).length;
  }
}

/** Count orders by status */
@Pipe({ name: 'orderCount', pure: false })
export class OrderCountPipe implements PipeTransform {
  transform(orders: Order[], status: string): number {
    return orders.filter(o => o.status === status).length;
  }
}

/** Filter menu items by category */
@Pipe({ name: 'menuFilter', pure: false })
export class MenuFilterPipe implements PipeTransform {
  transform(items: MenuItem[], category: string): MenuItem[] {
    return items.filter(m => m.category === category);
  }
}

/** Count menu items by category ('all' counts everything) */
@Pipe({ name: 'menuCategoryCount', pure: false })
export class MenuCategoryCountPipe implements PipeTransform {
  transform(items: MenuItem[], category: string): number {
    return category === 'all' ? items.length : items.filter(m => m.category === category).length;
  }
}

/** Compute subtotal from order items */
@Pipe({ name: 'orderSubtotal', pure: false })
export class OrderSubtotalPipe implements PipeTransform {
  transform(items: { quantity: number; unitPrice: number }[]): number {
    return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  }
}

/** Count tables by status */
@Pipe({ name: 'tableCount', pure: false })
export class TableCountPipe implements PipeTransform {
  transform(tables: Table[], status: string): number {
    return tables.filter(t => t.status === status).length;
  }
}

