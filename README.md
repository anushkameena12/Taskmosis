# Taskmosis

Taskmosis is a productivity web app that helps users manage daily tasks and build habits with streak tracking, weekly planning, analytics, and a clean modern UI.

---

## Features

### Authentication
- Firebase Authentication
- Google Sign In
- Secure user-based data storage

### Tasks
- Add, delete, and complete tasks
- Weekly calendar navigation
- View tasks date-wise
- Task statistics
- Responsive task dashboard
- Beautiful loading screens

### Habits
- Add, edit, and delete habits
- Daily streak tracking
- Habit completion heatmap
- Track consistency over time

### Dashboard
- Analytics cards
- Task progress charts
- Habit streak charts
- Today's focus section
- User profile section

### UI/UX
- Responsive design
- Modern gradient theme
- Smooth animations and hover effects
- Mobile-friendly layout

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Router DOM
- React Calendar Heatmap
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

---

## Folder Structure

```bash
Taskmosis/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── firebase/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   └── vite.config.js
│
└── README.md
````
---
## Live Demo

https://taskmosis.vercel.app

----
## How It Works

- Users authenticate using Firebase Authentication.
- Tasks and habits are stored in MongoDB.
- Backend APIs are built using Express.js.
- Frontend communicates with backend using Axios.
- Habit streaks are updated daily.
- Dashboard analytics are generated dynamically.

---
## Challenges Faced

- Handling Firebase authentication state
- Fixing CORS issues during deployment
- Managing responsive charts with Recharts
- Syncing habit streak logic with dates
- Deploying frontend and backend separately
---
## Contributors

- Anushka Meena
