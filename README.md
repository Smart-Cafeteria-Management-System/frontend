# 🎨 Smart Cafeteria - React Frontend

[![React Version](https://img.shields.io/badge/react-18.2+-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/build-Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![CSS](https://img.shields.io/badge/styling-Vanilla_CSS-264de4?style=flat&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A premium, responsive web interface for the Smart Cafeteria Management System. Designed for ease of use by students, staff, and administrators — with full **Dark Mode** support.

---

## 🔥 Key Portals & Features

### 👨‍🎓 Student Portal
- **Booking Dashboard**: View meal slots, pre-book meals, and track booking history.
- **Queue Status**: Real-time view of your queue position and dynamic wait-time display.
- **Menu Browser**: Browse the full cafeteria menu with nutritional information.
- **Rewards & Incentives**: Earn points for timely attendance, view your impact log, and redeem free add-ons.

### 👨‍🍳 Staff Portal
- **Staff Dashboard**: Overview of daily operations and pending tasks.
- **Queue Manager**: Call tokens sequentially and mark them as served (Enforced FIFO).
- **Demand Forecast**: View ML-predicted student volumes to adjust food preparation.

### 👑 Admin Portal
- **Analytics Command Center**: Monitor system health, attendance trends, and waste metrics.
- **Menu Management**: Full CRUD operations for menu items with nutritional data.
- **Slot Configuration**: Create and manage daily meal slots.
- **User Management**: View and manage all user accounts.
- **Incentive Configuration**: Set up and manage the gamified points system.
- **Audit Logs**: Track all security-sensitive actions with timestamps and IP addresses.

### 🌙 Dark Mode
- **One-click toggle** (🌙/☀️) available on every page — including the login screen.
- Smooth transition animations between light and dark themes.
- Preference **persists** across sessions via localStorage.

---

## 🔐 Security Features
- **Two-Factor Authentication (TOTP)**: Mandatory 2FA setup on first login using Google Authenticator / Authy.
- **Role-Based Access Control (RBAC)**: Protected routes that enforce admin, staff, and student permissions.
- **Ethics & Rules Page**: Transparent display of system fairness policies.

---

## 🛠 Tech Stack
- **Frontend Framework**: React.js 18
- **Build Tool**: Vite (Lightning fast HMR)
- **Styling**: Vanilla CSS with CSS Custom Properties (theming via `:root` variables)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`)
- **Routing**: React Router v6 (Protected routes with role checks)
- **Networking**: Axios (API communication)

---

## 🚀 Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

The app will start at `http://localhost:5173`. Make sure the **Go Backend** is running on port 5000 for the API to work.

---

## 📂 Directory Structure
```
frontend/
├── src/
│   ├── assets/              # Media assets
│   ├── components/
│   │   └── common/
│   │       └── Layout.jsx   # Shared layout with header, nav, and theme toggle
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state & API methods
│   │   └── ThemeContext.jsx # Dark/light theme state & persistence
│   ├── pages/               # 19 page components
│   │   ├── Login.jsx        # Login with TOTP 2FA flow
│   │   ├── Signup.jsx       # Student registration
│   │   ├── AdminDashboard.jsx
│   │   ├── StaffDashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── Booking.jsx
│   │   ├── QueueStatus.jsx
│   │   ├── Menu.jsx
│   │   ├── StaffForecast.jsx
│   │   ├── Analytics.jsx
│   │   ├── Slots.jsx
│   │   ├── Incentives.jsx
│   │   ├── IncentiveConfig.jsx
│   │   ├── AddonClaim.jsx
│   │   ├── Addons.jsx
│   │   ├── AuditLogs.jsx
│   │   ├── Users.jsx
│   │   ├── Ethics.jsx
│   │   └── TotpSetup.jsx
│   ├── services/
│   │   └── api.js           # Axios instance & API methods
│   ├── styles/
│   │   └── global.css       # Global styles, CSS variables, dark mode overrides
│   ├── App.jsx              # Root component with routing
│   └── main.jsx             # Entry point
└── vite.config.js
```

---

## 📝 Demo Credentials
| Role     | Email                        | Password  |
|----------|------------------------------|-----------|
| Admin    | admin@cafeteria.com          | admin123  |
| Student  | john.keller@university.edu   | john123   |
| Staff    | staff@cafeteria.com          | staff123  |
