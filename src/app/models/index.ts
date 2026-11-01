// =========================================================
// Restaurant Management System - Shared Models / Interfaces
// =========================================================

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
export type StaffRole = 'manager' | 'waiter' | 'chef' | 'host' | 'cashier';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';

// ── Table ─────────────────────────────────────────────────
export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  section: string;
  shape: 'round' | 'square' | 'rectangular';
  currentReservationId?: string;
  currentOrderId?: string;
  posX: number;   // percentage-based grid position
  posY: number;
}

// ── Reservation ───────────────────────────────────────────
export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: string;           // ISO date string  YYYY-MM-DD
  time: string;           // HH:mm
  tableId?: string;
  tableNumber?: number;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Menu Item ─────────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;          // emoji or URL placeholder
  available: boolean;
  preparationTime: number; // minutes
  calories?: number;
  tags: string[];
  rating: number;
  reviewCount: number;
}

// ── Order Item ────────────────────────────────────────────
export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

// ── Order ─────────────────────────────────────────────────
export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  reservationId?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  servedBy?: string;
}

// ── Staff ─────────────────────────────────────────────────
export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  avatar: string;   // emoji
  shiftStart: string;
  shiftEnd: string;
  onDuty: boolean;
  tablesAssigned: string[];
  joinedDate: string;
}

// ── Notification ──────────────────────────────────────────
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

// ── Dashboard Stats ───────────────────────────────────────
export interface DashboardStats {
  totalReservationsToday: number;
  availableTables: number;
  occupiedTables: number;
  totalOrdersToday: number;
  revenue: number;
  avgTableTurnoverTime: number;
}

