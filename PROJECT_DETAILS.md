# Project Context & Specifications: Bus ERP

This document serves as the definitive source of truth for the codebase structure, technical specifications, and development workflow of the Bus Management System (Bus ERP). It consolidates project context and detailed technical requirements.

---

## 1. Project Mission
A centralized **Bus Management System** designed to bridge the gap between school administrators, parents, and drivers. The platform provides real-time visibility into student safety and fleet efficiency.

---

## 2. Technical Architecture & Tech Stack

### Core Stack
- **Framework**: React 18 + Vite (configured for fast refresh and optimized builds).
- **Language**: TypeScript 5.x (Strict Mode).
- **Styling**: Tailwind CSS 3.4 + shadcn/ui (Radix UI as foundation).
- **Routing**: React Router DOM 6.30.
- **State Management**: TanStack Query (React Query) for server state; Context API for global app state.

### specialized Libraries
- **Map Engine**: Leaflet + React-Leaflet with CartoDB Voyager tiles.
- **Icons**: Lucide React.
- **Charts**: Recharts (for analytics).

---

## 3. Directory Breakdown

### `/src`
- **`/components`**:
    - `Map.tsx`: The "Heart" of the app. Handles bus rendering, route polylines, and auto-centering logic.
    - `/ui`: Atomic shadcn components (Buttons, Inputs, Dialogs).
    - `/auth`: Logic for multi-role login.
- **`/context`**:
    - `DataContext.tsx`: The "Brain". Orchestrates global state for students and buses. Includes a **real-time simulation engine** for movement.
- **`/pages`**:
    - `/admin`: High-density data views (Live Tracking, Student CRUD, Fleet Management).
    - `/parent`: Consumer-focused views (Child Tracking, Alerts).
    - `/driver`: Navigation and shift-focused views.
- **`/layouts`**: Wrappers for the three user roles (Admin, Parent, Driver).
- **`/types`**: Centralized TypeScript interfaces (Student, Bus, Route, Driver).

---

## 4. Detailed Data Models (TypeScript Interfaces)

### Student Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (UUID generated) |
| `name` | `string` | Full name of the student |
| `class` | `string` | Grade and Section (e.g., "Grade 5A") |
| `rfid` | `string` | Scanning card ID |
| `route` | `string` | Name of the assigned bus route |
| `parent` | `string` | Primary contact name |
| `phone` | `string` | Emergency contact number |
| `status` | `active \| inactive` | Enrollment status |
| `location fields` | `string?` | Optional state, mandal, district, country |

### Bus Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Bus number or asset ID |
| `busNumber` | `string` | Display name (e.g., "Bus 101") |
| `driver` | `string` | Name of assigned driver |
| `status` | `enum` | `on-route`, `delayed`, `idle`, `maintenance`, `completed` |
| `passengers` | `number` | Current boarding count |
| `capacity` | `number` | Max seats (Default: 40) |
| `location` | `obj` | `{ lat: number, lng: number }` |
| `speed` | `number` | Real-time velocity in km/h |
| `isHarshDriving` | `boolean` | Flag for sudden braking/acceleration |
| `plate` | `string` | Vehicle registration number (e.g. TS 09 UA 1234) |
| `engineNumber` | `string` | Unique engine identifier |
| `documents` | `object` | URLs to RC and Insurance photo assets |
| `isSOS` | `boolean` | Emergency panic button state |

### Route Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier |
| `name` | `string` | Strict alphabetical name (e.g., RouteA) |
| `morningTime` | `string` | Scheduled start time for morning |
| `eveningTime` | `string` | Scheduled start time for evening |
| `stops` | `string[]` | Ordered list of stop names |

### Driver Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier |
| `name` | `string` | Full name |
| `bloodGroup` | `string` | Medical blood group (e.g., O+) |
| `license` | `string` | Driving license number |

---

## 5. Operational Logic & Simulations

### Real-time Movement Simulation
Located in `src/context/DataContext.tsx`, the system uses a 3-second heartbeat:
- **Coordinate Jitter**: Latitude and Longitude are updated by `±0.001` to simulate GPS drifting.
- **Speed Logic**: Speed is randomized between `0-80 km/h` for active buses.
- **Harsh Driving**: 5% statistical chance (`Math.random() > 0.95`).
- **State Persistence**: Uses `localStorage` to save user changes; uses a `DATA_VERSION` constant to manage schema updates.

### Role-Based Access Control (RBAC)
- Routing is protected via a `ProtectedRoute` component in `App.tsx`.
- **Roles**:
    - `/admin/*`: Administrator access.
    - `/parent/*`: Parent access.
    - `/driver/*`: Driver access.

---

## 6. UI Design System

### Design Tokens
- **Primary Color**: HSL-based blue for trust and safety.
- **Aesthetics**: Glassmorphism (`backdrop-blur`, `bg-white/90`), clear typography (Inter).
- **Map UI**: Custom SVG markers with heading arrows; `animate-pulse` for live status.

---

## 7. Feature Breakdown

### Admin Dashboard
- **Live Fleet Tracking**: Global map view of all buses.
- **Management**: Student CRUD, **Automated Route Generation** (Strict alphabetical naming), and **Document Verification**.
- **Unified Workflow**: Seamless "Add Route" flow that creates/assigns buses automatically.
- **Analytics**: Attendance logs with interactive **Morning/Evening filter toggles** (Corrected PM timing for evening returns).

### Parent Portal
- **Child's Bus Live Tracking**: Focused view of assigned bus.
- **Geo-Alerts**: Proximity notifications (1km).
- **Notifications**: Combined **Push + SMS** alerts for boarding/alighting events.
- **Contact**: Quick-dial **Call Support** for transport desk.

### Driver Dashboard
- **Navigation**: Route visualization.
- **Stop List**: Status indicators (Passed, Next).
- **Incident Reporting**: Shift logs.

---

## 8. Deployment & Infrastructure

### Version Control & Hosting
- **Repo**: `https://github.com/sathvikaresonira/bus-erp.git` (Main branch).
- **Hosting**: Netlify (Automatic deploys via `netlify.toml`).
- **Build Command**: `npm run build` (Output: `dist`).
- **SPA Support**: `_redirects` file handles client-side routing.

---

## 9. Development Guidelines
- **Aesthetics First**: Maintain premium, glassmorphic design.
- **Type Safety**: Strictly define interfaces in `/types`. Avoid `any`.
- **Simulated Real-time**: Integrate new features with the `DataContext` simulation loop.
- **Build Performance**: If `npm start` fails due to memory, use: `$env:NODE_OPTIONS='--max-old-space-size=4096'; npm start`.
