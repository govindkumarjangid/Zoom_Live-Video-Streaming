# Zoom Clone - Live Video Streaming Platform

## Overview
A full-stack web application designed for real-time video meetings and streaming. Connect with users securely, create or join live video rooms, and keep track of your active meetings and history.

## Key Features
- ��� **User Authentication**: Secure login and registration flows.
- ��� **Live Video & Audio**: Real-time peer-to-peer communication using WebRTC or Socket.io.
- ��� **Video Meetings**: Instantly create or join interactive video meetings.
- ��� **Meeting History**: Track, view, and manage previously attended or hosted meetings.
- ���️ **Protected Navigation**: Route guarding and authentication state management.
- ✨ **Interactive UI**: A modern, responsive user interface with dynamic components (e.g., `BgGlowingEffect`).

## Tech Stack

### Frontend
- **Framework**: React.js (built with Vite)
- **State Management**: Context API (`AuthContext`, `HistoryContext`)
- **HTTP Client**: Axios (`axiosInstance.js`)
- **Routing**: React Router DOM (Route guards with `WithAuth.jsx`)

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Real-time Engine**: Socket.io (`connectSocket.js`, `socket.controller.js`)
- **Database**: MongoDB via Mongoose (`connectDB.js`)
- **Middleware**: Custom authentication guards (`protect.js`)

## Project Structure

```text
├── backend/
│   ├── index.js                  # Entry point for backend server
│   ├── package.json              # Backend dependencies
│   └── src/
│       ├── configs/              # DB & Socket configurations
│       ├── controllers/          # Business logic handlers (Socket, User)
│       ├── middleware/           # Route guards (protect.js)
│       ├── models/               # MongoDB models (Meeting, User)
│       ├── routes/               # API endpoint definitions
│       └── utils/                # Helper utilities (asyncHandler)
└── frontend/
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite build configuration
    ├── vercel.json               # Vercel deployment config
    ├── public/                   # Static assets (images)
    └── src/
        ├── App.jsx               # Root application component
        ├── components/           # Reusable UI components (Navbar, Hero, etc.)
        ├── context/              # Global state contexts
        ├── pages/                # Route components (Home, VideoMeet, History)
        └── utils/                # Helpers & Axios instance
```

## Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB connection string (Local or MongoDB Atlas)

### Setup Instructions

1. **Clone the repository** (if applicable) and navigate into the project directory:
   ```bash
   cd Zoom_Live-Video-Streaming
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file and add your environment variables (e.g., PORT, MONGO_URI, JWT_SECRET)
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file and add your Vite frontend variables (e.g., VITE_API_URL)
   npm run dev
   ```

4. **Access the application**:
   Open `http://localhost:5173` (or the respective port Vite chooses) in your browser.
