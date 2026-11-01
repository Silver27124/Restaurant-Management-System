# 🍴 Saveur — Production-Ready Restaurant Management System

A production-ready **Restaurant Reservation & Table Management System** built with **Angular 22** featuring modern Signals-based state management, full interactive floor plan, reservation workflows, table status tracking, live orders, kitchen management, menu operations, staff tracking, and analytics reports.

---

## 🚀 Key Features & Architectural Highlights

### 1. Reusable Standalone Components
- **Navbar & Navigation** (`src/app/components/navbar/`): Responsive top navbar with mobile hamburger drawer and live badge indicators.
- **Notification Toast System** (`src/app/components/notification/`): Real-time snackbar toast alerts for order, table, and reservation updates.
- **Footer** (`src/app/components/footer/`): Branded responsive footer.
- **Dashboard** (`src/app/pages/dashboard/`): KPI metric cards, mini interactive floor preview, quick reservations, order pipeline, and on-duty staff.
- **Reservations Management** (`src/app/pages/reservations/`): Full CRUD, real-time search, date picker, status filters, modal form with validation, and status lifecycle transitions (`pending` → `confirmed` → `seated` → `completed` / `cancelled`).
- **Interactive Table Layout** (`src/app/pages/table-layout/`): Visual restaurant floor plan showing round, square, and rectangular tables colored by status (`available`, `occupied`, `reserved`, `cleaning`). Includes section filtering (Main, Patio, Bar, VIP) and side drawer table inspect panel.
- **Order Management & POS** (`src/app/pages/orders/`): Real-time order pipeline (`pending` → `preparing` → `ready` → `served`), multi-category food item selection, GST calculations, and bill settlement with multiple payment methods (Cash, Card, UPI, Wallet).
- **Menu Management** (`src/app/pages/menu/`): Category browsing (Appetizer, Main, Dessert, Beverage, Specials), availability toggle, ratings display, calorie/prep time metadata, and dynamic item additions.
- **Staff Management** (`src/app/pages/staff/`): Shift schedules, role filtering (Manager, Waiter, Chef, Host, Cashier), duty toggle, and table assignments.
- **Reports & Analytics** (`src/app/pages/reports/`): Visual revenue summary, order breakdown progress bars, reservation breakdown, top menu items ranking, and table utilization metrics.

---

### 2. State Management & Hooks / Signals
- Built with Angular's modern **Signals** (`signal()`, `computed()`, and `effect()`) — the reactive equivalent of React's `useState` and `useMemo` hooks.
- **Single Source of Truth** (`RestaurantService` in `src/app/services/restaurant.service.ts`):
  - `tables = signal<Table[]>(...)`
  - `reservations = signal<Reservation[]>(...)`
  - `orders = signal<Order[]>(...)`
  - `menuItems = signal<MenuItem[]>(...)`
  - `staff = signal<Staff[]>(...)`
  - `notifications = signal<Notification[]>(...)`
  - Computed signals automatically derived: `availableTables`, `occupiedTables`, `todayReservations`, `activeOrders`, `todayRevenue`, `dashboardStats`.

---

### 3. JavaScript Array Operations (`map`, `filter`, `reduce`)
- **`filter`**:
  - Filter reservations by customer search query, date, and reservation status.
  - Filter active vs. historical orders.
  - Filter tables by dining area section (Main Dining, Patio, Bar, VIP Room) and availability.
  - Custom pure pipes: `FilterCountPipe`, `OrderCountPipe`, `MenuFilterPipe`, `MenuCategoryCountPipe`, `TableCountPipe`.
- **`map`**:
  - Updating table statuses immutably on reservation lifecycle changes.
  - Updating order items quantity and status transitions.
  - Toggling staff duty and menu item availability.
- **`reduce`**:
  - Calculating order subtotals and 18% GST totals in real-time.
  - Aggregating settled daily revenue and pending tab revenue.

---

### 4. Routing & Views
Configured in `src/app/app.routes.ts` with lazy-loaded standalone components and view transitions:
- `/dashboard` — Restaurant Command Center
- `/reservations` — Guest Reservation Roster & Booking
- `/tables` — Floor Plan & Table Management
- `/orders` — Kitchen Display & Order POS
- `/menu` — Food & Beverage Catalog
- `/staff` — Roster & On-Duty Management
- `/reports` — Analytics & Financial Breakdown

---

### 5. Responsive Styling Techniques
- **CSS Grid & Flexbox**: Fully responsive layout adapting from mobile screens (320px) up to ultra-wide displays (1400px+).
- **CSS Custom Properties (Variables)**: Standardized color palette, border radiuses, and elevation shadows defined in `src/styles.css`.
- **Micro-Animations & Keyframes**: Pulse indicators for active tables, slide-in toasts, and smooth elevation on hover.
- **Visual Design System**: Distinct status color codes:
  - 🟢 Green (`#28a745`): Available / Seated / Ready
  - 🔴 Crimson (`#e94560`): Occupied / Urgent
  - 🟠 Orange (`#fd7e14`): Reserved / Pending
  - 🧹 Grey (`#6c757d`): Cleaning / Completed / Served
  - 🔵 Blue (`#0d6efd`): Confirmed / Preparing

---

## 🛠️ Running the Application

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Development Server
```bash
cd restaurant-management-system
npm start
```
Open your browser and navigate to `http://localhost:4200/`.

### Production Build
```bash
cd restaurant-management-system
npm run build
```
The compiled output is generated in `dist/restaurant-management-system/`.

---

## 📁 Directory Structure
```
restaurant-management-system/
├── angular.json
├── package.json
├── tsconfig.json
└── src/
    ├── index.html
    ├── styles.css
    ├── main.ts
    └── app/
        ├── app.ts / app.html / app.css
        ├── app.routes.ts
        ├── app.config.ts
        ├── models/
        │   └── index.ts               # TypeScript interfaces
        ├── services/
        │   └── restaurant.service.ts   # Central reactive signals state
        ├── pipes/
        │   └── pipes.ts                # Array filter & count pipes
        ├── components/
        │   ├── navbar/
        │   ├── footer/
        │   └── notification/
        └── pages/
            ├── dashboard/
            ├── reservations/
            ├── table-layout/
            ├── orders/
            ├── menu/
            ├── staff/
            └── reports/
```
