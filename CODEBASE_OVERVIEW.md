# Codebase Overview: Bus Management System (BMS)

This document serves as the primary context for the coding assistant. It outlines the structure, technology stack, and architectural decisions of the project.

## 1. Project Overview
The **Bus Management System (BMS)** is a comprehensive solution for managing school/organization bus fleets. It serves three primary user roles:
- **Admin**: Fleet management, student tracking, route optimization, attendance monitoring, and system settings.
- **Parent**: Live bus tracking, student notifications, profile management, and contacting support.
- **Driver**: Route navigation, shift management, and receiving alerts.

---

## 2. Technology Stack
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API (`DataContext`) and [TanStack Query](https://tanstack.com/query/latest) (React Query).
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (using Radix UI and Tailwind CSS).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet](https://leafletjs.com/) with [react-leaflet](https://react-leaflet.js.org/)
- **Simulation**: Integrated bus movement and status simulation in `DataContext`.
- **Environment**: Optimized Node.js memory limits (`NODE_OPTIONS=--max-old-space-size=4096`) for large project building.

---

## 3. Directory Structure
```text
/src
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
│   └── ...          # Feature-specific components
├── assets/          # Project assets
└── public/
    └── assets/
        └── docs/    # Secure vehicle documentation (RC, Insurance photos)
├── context/         # React Context providers (DataContext.tsx)
├── data/            # Mock data and static configuration
├── hooks/           # Custom React hooks (useData, etc.)
├── layouts/         # Page wrappers (AdminLayout, ParentLayout, DriverLayout)
├── lib/             # Utility functions (cn, utils.ts)
├── pages/           # Route-level components
│   ├── admin/       # Admin-specific pages (Dashboard, Students, Buses, etc.)
│   ├── driver/      # Driver-specific pages (Dashboard, Routes, etc.)
│   ├── parent/      # Parent-specific pages (Home, LiveTrack, Profile, etc.)
│   ├── Login.tsx    # Multi-role login page
│   └── LoginSelection.tsx # Role selection entry point
├── types/           # TypeScript interface/type definitions
├── App.tsx          # Main application component & Routing
└── main.tsx         # Application entry point
```

---

## 4. Routing & User Roles
The application uses `react-router-dom` for client-side routing.
- **Root (`/`)**: Login Selection.
- **Login (`/login/:role`)**: Dynamic login for Admin, Driver, or Parent.
- **Admin Section (`/admin`)**:
  - `/admin/dashboard`: Overview of stats and active fleet.
  - `/admin/tracking`: Live map with all active buses.
  - `/admin/students`: Student CRUD and RFID management.
  - `/admin/buses`: Bus and Driver management.
  - `/admin/attendance`: Scan logs and attendance reporting.
  - `/admin/alerts`: System-wide alerts and notifications.
- **Parent Section (`/parent`)**:
  - `/parent/home`: Overview of child's bus status.
  - `/parent/track`: Detailed live tracking for the assigned bus.
  - `/parent/notifications`: Personal alerts (boarding, drop-off).
  - `/parent/profile`: Personal and child details management.
- **Driver Section (`/driver`)**:
  - `/driver/dashboard`: Daily shift summary.
  - `/driver/route`: Interactive route map and stop list.
  - `/driver/notifications`: Job assignments and emergency alerts.

---

## 5. Data Architecture
### `DataContext.tsx`
The backbone of the application's state. It manages:
- **Entities**: Students, Buses, Routes, Alerts, Drivers.
- **Persistence**: Synchronizes state with `localStorage` for offline-like behavior. Uses `DATA_VERSION` (currently `v11`) for schema migrations.
- **Simulation**: A `useEffect` interval simulates bus movement, speed changes, and status updates every 3 seconds.
- **CRUD Operations**: Centralized functions for updating any entity.

### `Map.tsx`
The primary visualization tool.
- Supports markers for buses (with rotation based on heading).
- Renders route polylines and stop markers.
- Features "Lock to Bus" (auto-centering) and full-screen modes.
- Integrated with `DataContext` to reflect real-time simulated movements.

---

## 6. Key Implementation Details
- **Interactive Verification**: High-resolution lightbox for vehicle documentation (RC/Insurance) in the admin fleet view.
- **Advanced Filtering**: Targeted "Morning Boarded" and "Evening Returns" visual toggles in attendance logs.
- **Responsive Dialogs**: Full adaptation of Route Live Status views for mobile devices ("Where is my Train" style).
- **Automated Fleet Ops**: Strict alphabetical route generation (RouteA...RouteZ) and auto-creation of buses/routes during assignment.
- **Modular Architecture**: Data management decoupled using `src/data/mockData.ts` and `src/hooks/useTrafficSimulation.ts`.
- **Component Composition**: Complex dialogs (Add Bus, Add Route, Add Driver) extracted to `src/components` for improved code structure and readability.

---
*Last Updated: 2026-01-05*
