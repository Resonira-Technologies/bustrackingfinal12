# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Implementation Details

### Parent Notification App Features

#### 1. Dashboard/Home Screen
- **Current Status**: Implemented a `StatusCard` with distinct visual states (At Home, On Bus, At School) using rich gradients and shadows (e.g., "Safe at home" in emerald green).
- **Live Map View**: Added a "Live Map Preview" card on the dashboard showing a visual representation of the bus route, complete with pulsing "Live" indicators and a "View Full Map" action.
- **Next Expected Event**: The `ETACard` features a countdown timer (e.g., "Bus Arriving in 8 min") with a dynamic progress bar and animated background.

#### 2. Notification History
- **Timeline**: The `Notifications` page displays a clean timeline of boarding/alighting events.
- **Iconography**: Distinct icons and color schemes for "To School" (Sky Blue + Bus/School icons) and "Return Home" (Violet + Bus/Home icons).
- **GPS Details**: Events show precise timestamps and GPS coordinates as requested.

#### 3. Visual Style
- **Theme**: Adhered to the "Safe & Trustworthy" palette using soft blues (`sky-500`), reassuring greens (`emerald-500`), and school-bus yellows (`amber-400`).
- **Aesthetics**: Utilized modern glassmorphism effects (blurs), smooth gradients, and micro-animations (pulsing dots, fade-ins) to ensure a premium feel.

#### 4. Critical States
- **Alerts**: Implemented an content-aware `AlertBanner` that pulses red/amber for critical incidents (delays, accidents) to immediately grab attention.

#### 5. Navigation Structure
- **Home**: Dashboard with status and live preview.
- **Track**: Full-screen live tracking.
- **Alerts**: History of all notifications.
- **Profile**: Student details and RFID status.

### Admin Fleet Management Features

#### 1. Vehicle Documentation & Verification
- **Digital Vault**: Secure storage and display of vehicle registration (RC) and Insurance documents.
- **Lightbox Preview**: High-resolution, backdrop-blurred photo previews for quick document verification of any bus in the fleet.
- **Smart Card Sample**: Realistic Smart Card style RC mockups for the Indian transport context.

#### 2. Advanced Attendance & Scan Logs
- **Targeted Filters**: Interactive "Morning Boarded" and "Evening Returns" visual toggle buttons for rapid section-based log review.
- **Live Status Dialog**: Refactored the "Where is my Train" style route dialog, now fully responsive and optimized for mobile screens.
