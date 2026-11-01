import { Injectable, signal, computed } from '@angular/core';
import {
  Table, TableStatus, Reservation, ReservationStatus,
  MenuItem, Order, OrderItem, OrderStatus, Staff, Notification, DashboardStats
} from '../models';

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_TABLES: Table[] = [
  { id: 't1',  number: 1,  capacity: 2, status: 'available', section: 'Main', shape: 'round',       posX: 10, posY: 10 },
  { id: 't2',  number: 2,  capacity: 4, status: 'occupied',  section: 'Main', shape: 'square',      posX: 30, posY: 10 },
  { id: 't3',  number: 3,  capacity: 4, status: 'reserved',  section: 'Main', shape: 'square',      posX: 50, posY: 10 },
  { id: 't4',  number: 4,  capacity: 6, status: 'available', section: 'Main', shape: 'rectangular', posX: 70, posY: 10 },
  { id: 't5',  number: 5,  capacity: 2, status: 'cleaning',  section: 'Patio',shape: 'round',       posX: 10, posY: 40 },
  { id: 't6',  number: 6,  capacity: 4, status: 'available', section: 'Patio',shape: 'square',      posX: 30, posY: 40 },
  { id: 't7',  number: 7,  capacity: 8, status: 'occupied',  section: 'Patio',shape: 'rectangular', posX: 55, posY: 40 },
  { id: 't8',  number: 8,  capacity: 2, status: 'available', section: 'Bar',  shape: 'round',       posX: 10, posY: 70 },
  { id: 't9',  number: 9,  capacity: 4, status: 'reserved',  section: 'Bar',  shape: 'square',      posX: 30, posY: 70 },
  { id: 't10', number: 10, capacity: 6, status: 'available', section: 'Bar',  shape: 'rectangular', posX: 55, posY: 70 },
  { id: 't11', number: 11, capacity: 2, status: 'available', section: 'VIP',  shape: 'round',       posX: 10, posY: 80 },
  { id: 't12', number: 12, capacity: 6, status: 'occupied',  section: 'VIP',  shape: 'rectangular', posX: 40, posY: 80 },
];

const today = new Date().toISOString().split('T')[0];
const SEED_RESERVATIONS: Reservation[] = [
  { id: 'r1', customerName: 'Aisha Sharma',   customerEmail: 'aisha@email.com',  customerPhone: '9876543210', partySize: 2, date: today, time: '12:00', tableId: 't1', tableNumber: 1,  status: 'confirmed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'r2', customerName: 'Rahul Verma',    customerEmail: 'rahul@email.com',  customerPhone: '9123456789', partySize: 4, date: today, time: '13:30', tableId: 't3', tableNumber: 3,  status: 'pending',   createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), specialRequests: 'Window seat preferred' },
  { id: 'r3', customerName: 'Priya Nair',     customerEmail: 'priya@email.com',  customerPhone: '9988776655', partySize: 6, date: today, time: '19:00', tableId: 't4', tableNumber: 4,  status: 'confirmed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), specialRequests: 'Birthday celebration' },
  { id: 'r4', customerName: 'Karan Mehta',    customerEmail: 'karan@email.com',  customerPhone: '9871234567', partySize: 4, date: today, time: '20:00', tableId: 't9', tableNumber: 9,  status: 'seated',    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'r5', customerName: 'Divya Patel',    customerEmail: 'divya@email.com',  customerPhone: '9765432100', partySize: 2, date: today, time: '14:00',               tableNumber: undefined, status: 'cancelled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const SEED_MENU: MenuItem[] = [
  { id: 'm1',  name: 'Paneer Tikka',        description: 'Char-grilled cottage cheese with spices', price: 320, category: 'appetizer', image: '🧀', available: true,  preparationTime: 15, calories: 280, tags: ['vegetarian', 'spicy'],  rating: 4.7, reviewCount: 142 },
  { id: 'm2',  name: 'Dal Makhani',          description: 'Slow-cooked black lentils, rich & creamy', price: 280, category: 'main',      image: '🫕', available: true,  preparationTime: 20, calories: 360, tags: ['vegetarian', 'popular'], rating: 4.8, reviewCount: 210 },
  { id: 'm3',  name: 'Butter Chicken',       description: 'Tender chicken in a buttery tomato gravy', price: 380, category: 'main',      image: '🍗', available: true,  preparationTime: 25, calories: 480, tags: ['non-veg', 'popular'],    rating: 4.9, reviewCount: 389 },
  { id: 'm4',  name: 'Gulab Jamun',          description: 'Milk-solid dumplings soaked in rose syrup', price: 120, category: 'dessert',   image: '🍮', available: true,  preparationTime: 5,  calories: 250, tags: ['sweet', 'veg'],           rating: 4.6, reviewCount: 98  },
  { id: 'm5',  name: 'Mango Lassi',          description: 'Refreshing yoghurt-mango smoothie',        price: 140, category: 'beverage',  image: '🥭', available: true,  preparationTime: 5,  calories: 180, tags: ['sweet', 'cold'],           rating: 4.5, reviewCount: 76  },
  { id: 'm6',  name: 'Veg Biryani',          description: 'Fragrant basmati rice with mixed vegetables', price: 300, category: 'main',   image: '🍚', available: true,  preparationTime: 30, calories: 550, tags: ['vegetarian'],              rating: 4.4, reviewCount: 134 },
  { id: 'm7',  name: 'Chicken Biryani',      description: 'Aromatic rice with slow-cooked chicken',   price: 420, category: 'main',      image: '🍛', available: true,  preparationTime: 35, calories: 620, tags: ['non-veg', 'popular'],    rating: 4.9, reviewCount: 445 },
  { id: 'm8',  name: 'Samosa (2 pcs)',       description: 'Crispy pastry filled with spiced potatoes', price: 80, category: 'appetizer', image: '🥟', available: true,  preparationTime: 8,  calories: 180, tags: ['vegetarian', 'snack'],    rating: 4.3, reviewCount: 67  },
  { id: 'm9',  name: 'Masala Chai',          description: 'Traditional spiced Indian tea',            price: 60,  category: 'beverage',  image: '☕', available: true,  preparationTime: 5,  calories: 80,  tags: ['hot', 'veg'],             rating: 4.6, reviewCount: 55  },
  { id: 'm10', name: 'Chef\'s Special Platter', description: 'Curated assortment of signature dishes', price: 850, category: 'special', image: '🍱', available: true,  preparationTime: 40, calories: 900, tags: ['special', 'chef\'s pick'], rating: 5.0, reviewCount: 38  },
  { id: 'm11', name: 'Rasmalai',             description: 'Soft cottage cheese dumplings in sweetened cream', price: 150, category: 'dessert', image: '🍨', available: false, preparationTime: 5, calories: 280, tags: ['sweet', 'veg'], rating: 4.7, reviewCount: 84 },
  { id: 'm12', name: 'Prawn Koliwada',       description: 'Crispy fried prawns with Koli spices',    price: 520, category: 'appetizer', image: '🦐', available: true,  preparationTime: 20, calories: 350, tags: ['non-veg', 'spicy'],      rating: 4.8, reviewCount: 62  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 'o1', tableId: 't2', tableNumber: 2, items: [
      { menuItemId: 'm3', menuItemName: 'Butter Chicken', quantity: 2, unitPrice: 380 },
      { menuItemId: 'm6', menuItemName: 'Veg Biryani', quantity: 1, unitPrice: 300 },
      { menuItemId: 'm5', menuItemName: 'Mango Lassi', quantity: 2, unitPrice: 140 },
    ], status: 'preparing', subtotal: 1340, tax: 241.2, total: 1581.2, paid: false,
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(), updatedAt: new Date().toISOString(), servedBy: 'Ravi Kumar'
  },
  {
    id: 'o2', tableId: 't7', tableNumber: 7, items: [
      { menuItemId: 'm7', menuItemName: 'Chicken Biryani', quantity: 3, unitPrice: 420 },
      { menuItemId: 'm1', menuItemName: 'Paneer Tikka', quantity: 2, unitPrice: 320 },
      { menuItemId: 'm4', menuItemName: 'Gulab Jamun', quantity: 4, unitPrice: 120 },
    ], status: 'served', subtotal: 2420, tax: 435.6, total: 2855.6, paid: false,
    createdAt: new Date(Date.now() - 55 * 60000).toISOString(), updatedAt: new Date().toISOString(), servedBy: 'Meena Joshi'
  },
  {
    id: 'o3', tableId: 't12', tableNumber: 12, items: [
      { menuItemId: 'm10', menuItemName: 'Chef\'s Special Platter', quantity: 2, unitPrice: 850 },
      { menuItemId: 'm9', menuItemName: 'Masala Chai', quantity: 4, unitPrice: 60 },
    ], status: 'pending', subtotal: 1940, tax: 349.2, total: 2289.2, paid: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), updatedAt: new Date().toISOString(), servedBy: 'Ravi Kumar'
  },
];

const SEED_STAFF: Staff[] = [
  { id: 's1', name: 'Vikram Singh',  role: 'manager',  email: 'vikram@restaurant.com', phone: '9000000001', avatar: '👨‍💼', shiftStart: '08:00', shiftEnd: '20:00', onDuty: true,  tablesAssigned: [],                joinedDate: '2020-01-15' },
  { id: 's2', name: 'Ravi Kumar',    role: 'waiter',   email: 'ravi@restaurant.com',   phone: '9000000002', avatar: '🧑‍🍽️', shiftStart: '10:00', shiftEnd: '22:00', onDuty: true,  tablesAssigned: ['t1','t2','t3'],  joinedDate: '2021-03-20' },
  { id: 's3', name: 'Meena Joshi',   role: 'waiter',   email: 'meena@restaurant.com',  phone: '9000000003', avatar: '👩‍🍽️', shiftStart: '12:00', shiftEnd: '24:00', onDuty: true,  tablesAssigned: ['t7','t8','t9'],  joinedDate: '2022-07-01' },
  { id: 's4', name: 'Arjun Reddy',   role: 'chef',     email: 'arjun@restaurant.com',  phone: '9000000004', avatar: '👨‍🍳', shiftStart: '09:00', shiftEnd: '21:00', onDuty: true,  tablesAssigned: [],                joinedDate: '2019-06-10' },
  { id: 's5', name: 'Sunita Devi',   role: 'host',     email: 'sunita@restaurant.com', phone: '9000000005', avatar: '👩‍💁', shiftStart: '11:00', shiftEnd: '23:00', onDuty: true,  tablesAssigned: [],                joinedDate: '2023-02-14' },
  { id: 's6', name: 'Ankit Gupta',   role: 'cashier',  email: 'ankit@restaurant.com',  phone: '9000000006', avatar: '🧑‍💻', shiftStart: '10:00', shiftEnd: '22:00', onDuty: false, tablesAssigned: [],                joinedDate: '2021-11-05' },
];

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  // ── Signals (state) ──────────────────────────────────────
  tables     = signal<Table[]>(SEED_TABLES);
  reservations = signal<Reservation[]>(SEED_RESERVATIONS);
  menuItems  = signal<MenuItem[]>(SEED_MENU);
  orders     = signal<Order[]>(SEED_ORDERS);
  staff      = signal<Staff[]>(SEED_STAFF);
  notifications = signal<Notification[]>([]);

  // ── Computed ──────────────────────────────────────────────
  availableTables = computed(() => this.tables().filter(t => t.status === 'available'));
  occupiedTables  = computed(() => this.tables().filter(t => t.status === 'occupied'));
  reservedTables  = computed(() => this.tables().filter(t => t.status === 'reserved'));

  todayReservations = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.reservations().filter(r => r.date === today);
  });

  activeOrders = computed(() => this.orders().filter(o => o.status !== 'cancelled' && !o.paid));

  todayRevenue = computed(() =>
    this.orders()
      .filter(o => o.paid)
      .reduce((sum, o) => sum + o.total, 0)
  );

  dashboardStats = computed<DashboardStats>(() => ({
    totalReservationsToday: this.todayReservations().length,
    availableTables: this.availableTables().length,
    occupiedTables:  this.occupiedTables().length,
    totalOrdersToday: this.orders().filter(o => o.createdAt.startsWith(new Date().toISOString().split('T')[0])).length,
    revenue: this.todayRevenue(),
    avgTableTurnoverTime: 45,
  }));

  // ── Notifications ─────────────────────────────────────────
  addNotification(message: string, type: Notification['type'] = 'info'): void {
    const note: Notification = { id: crypto.randomUUID(), message, type, timestamp: new Date() };
    this.notifications.update(n => [note, ...n].slice(0, 10));
    setTimeout(() => this.removeNotification(note.id), 4000);
  }
  removeNotification(id: string): void {
    this.notifications.update(n => n.filter(x => x.id !== id));
  }

  // ── Table CRUD ────────────────────────────────────────────
  updateTableStatus(tableId: string, status: TableStatus): void {
    this.tables.update(ts => ts.map(t => t.id === tableId ? { ...t, status } : t));
    this.addNotification(`Table status updated to "${status}"`, 'success');
  }

  // ── Reservation CRUD ──────────────────────────────────────
  addReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Reservation {
    const r: Reservation = { ...data, id: 'r' + crypto.randomUUID().slice(0, 8), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.reservations.update(rs => [r, ...rs]);
    if (data.tableId) this.updateTableStatus(data.tableId, 'reserved');
    this.addNotification(`Reservation for ${data.customerName} added`, 'success');
    return r;
  }

  updateReservation(id: string, data: Partial<Reservation>): void {
    this.reservations.update(rs => rs.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r));
    this.addNotification(`Reservation updated`, 'info');
  }

  updateReservationStatus(id: string, status: ReservationStatus): void {
    this.reservations.update(rs => rs.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));
    if (status === 'cancelled') {
      const res = this.reservations().find(r => r.id === id);
      if (res?.tableId) this.updateTableStatus(res.tableId, 'available');
    }
    if (status === 'seated') {
      const res = this.reservations().find(r => r.id === id);
      if (res?.tableId) this.updateTableStatus(res.tableId, 'occupied');
    }
    this.addNotification(`Reservation status updated to "${status}"`, 'info');
  }

  deleteReservation(id: string): void {
    const res = this.reservations().find(r => r.id === id);
    if (res?.tableId) this.updateTableStatus(res.tableId, 'available');
    this.reservations.update(rs => rs.filter(r => r.id !== id));
    this.addNotification('Reservation deleted', 'warning');
  }

  // ── Order CRUD ────────────────────────────────────────────
  addOrder(tableId: string, tableNumber: number, items: OrderItem[], servedBy?: string): Order {
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const tax = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    const order: Order = {
      id: 'o' + crypto.randomUUID().slice(0, 8),
      tableId, tableNumber, items, status: 'pending',
      subtotal, tax, total, paid: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), servedBy
    };
    this.orders.update(os => [order, ...os]);
    this.updateTableStatus(tableId, 'occupied');
    this.addNotification(`Order placed for Table ${tableNumber}`, 'success');
    return order;
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    this.orders.update(os => os.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    this.addNotification(`Order status updated to "${status}"`, 'info');
  }

  settleOrder(id: string, paymentMethod: Order['paymentMethod']): void {
    this.orders.update(os => os.map(o => {
      if (o.id !== id) return o;
      return { ...o, paid: true, paymentMethod, updatedAt: new Date().toISOString() };
    }));
    const order = this.orders().find(o => o.id === id);
    if (order) this.updateTableStatus(order.tableId, 'cleaning');
    this.addNotification('Payment settled successfully', 'success');
  }

  // ── Menu CRUD ─────────────────────────────────────────────
  toggleMenuItemAvailability(id: string): void {
    this.menuItems.update(ms => ms.map(m => m.id === id ? { ...m, available: !m.available } : m));
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): void {
    const m: MenuItem = { ...item, id: 'm' + crypto.randomUUID().slice(0, 8) };
    this.menuItems.update(ms => [...ms, m]);
    this.addNotification(`"${item.name}" added to menu`, 'success');
  }

  // ── Staff ─────────────────────────────────────────────────
  toggleStaffDuty(id: string): void {
    this.staff.update(ss => ss.map(s => s.id === id ? { ...s, onDuty: !s.onDuty } : s));
  }
}

