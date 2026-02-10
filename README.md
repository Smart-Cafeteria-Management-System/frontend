# 🎨 Smart Cafeteria - React Frontend

[![React Version](https://img.shields.io/badge/react-18.2+-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/build-Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Design](https://img.shields.io/badge/design-TailwindCSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

A premium, responsive web interface for the Smart Cafeteria Management System. Designed for ease of use by students, staff, and administrators.

---

## 🔥 Key Portals & Features
### 👨‍🎓 Student Portal
- **Booking Dashboard**: View meal slots and pre-book meals.
- **My Token**: Real-time view of your queue position and "Wait-Time Progress Bar".
- **Sustainability Hub**: Earn points for timely attendance and view your impact log.

### 👨‍🍳 Staff Portal
- **Queue Manager**: Call tokens sequentially and mark them as served (Enforced FIFO).
- **Daily Forecast**: View predicted student volumes to adjust food preparation.

### 👑 Admin Portal
- **Analytics Command Center**: Monitor system health, revenue trends, and peak-hour heatmaps.
- **Waste Management**: View AI-generated sustainability reports and waste metrics.

---

## 🛠 Tech Stack
- **Frontend Framework**: React.js 18
- **Build Tool**: Vite (Lightning fast HMR)
- **Styling**: Tailwind CSS & Lucide Icons
- **State & Networking**: Axios (API communication) & React Router
- **Visualization**: Chart.js / Recharts (Operational trends)

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
│   ├── assets/       # Styles & Media
│   ├── components/   # Reusable UI elements (Buttons, Cards, Nav)
│   ├── pages/        # Main route views (Dashboard, Booking, Analytics)
│   └── services/     # API service layer (Axios instance)
├── tailwind.config.js
└── vite.config.js
```
