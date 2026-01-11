# Folder Structure: Bus ERP System

This document provides a comprehensive visualization and description of the project's directory hierarchy.

```text
bus-erp/
├── .env                  # Environment variables (API Keys)
├── .gitignore            # Files to be excluded from version control
├── netlify.toml          # Netlify deployment configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS design tokens and theme
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build tool configuration
├── CONTEXT.md            # System-wide architecture context
├── CODEBASE_OVERVIEW.md  # General project overview
├── FOLDER_STRUCTURE.md   # [This File] Hierarchy visualization
│
├── public/               # Static assets served directly
│   ├── _redirects        # Netlify SPA redirect rules
│   ├── favicon.ico       # Browser tab icon
│   └── assets/
│       └── docs/         # Secure vehicle documentation (RC, Insurance photos)
│
└── src/                  # Main application source code
    ├── main.tsx          # Entry point (React rendering)
    ├── App.tsx           # Router and Global Providers
    ├── index.css         # Global styles and Tailwind imports
    │
    ├── assets/           # Images, fonts, and local static media
    │
    ├── components/       # Reusable UI blocks
    │   ├── ui/           # Atomic shadcn/ui components (Buttons, Cards, etc.)
    │   ├── auth/         # Login and authentication views
    │   ├── dashboard/    # Specific widgets for dashboards
    │   └── Map.tsx       # Core Leaflet map implementation
    │
    ├── context/          # React State Management
    │   └── DataContext.tsx # Global state, CRUD logic, and Movement Simulator
    │
    ├── data/             # Static mock data and configuration constants
    │
    ├── hooks/            # Custom React hooks (e.g., useMobile, useData)
    │
    ├── layouts/          # Structural page wrappers
    │   ├── AdminLayout.tsx
    │   ├── ParentLayout.tsx
    │   └── DriverLayout.tsx
    │
    ├── lib/              # Shared utility functions (e.g., cn helper)
    │
    ├── pages/            # View components mapped to routes
    │   ├── admin/        # (Students, Buses, Tracking, Alerts, etc.)
    │   ├── parent/       # (Home, Live Tracking, Profile, Settings)
    │   ├── driver/       # (Dashboard, Route Navigation)
    │   ├── Login.tsx     # Generic login page
    │   └── NotFound.tsx  # 404 Error page
    │
    ├── types/            # Global TypeScript interface definitions
    └── lib/              # Utility functions and shared helpers
```

---

## Key Directories Explained

### `src/components/Map.tsx`
The primary visual interface for tracking. Uses `react-leaflet` to render buses as dynamic SVG markers that rotate based on their `heading`.

### `src/context/DataContext.tsx`
Manages the source of truth for all entities (Students, Buses, Drivers). It includes a simulation loop that updates bus positions every 3 seconds to test the UI without real GPS hardware.

### `src/pages/`
Organized by user role to ensure clear separation of concerns. Each folder contains the specific screens and logic for Admin, Parent, and Driver roles.

---

