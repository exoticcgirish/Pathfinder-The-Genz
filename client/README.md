# Pathfinder Client (Frontend)

The frontend for **Pathfinder**, built with React 18, Vite, and Tailwind CSS.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run in development mode
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

## 📁 Folder Structure
- `src/views/` - Main pages (Dashboard, Courses, Roadmap, Progress, AI Chat, Profile, Admin)
- `src/components/` - Shared layouts and UI components
- `src/services/` - Axios API services for communicating with the Flask backend
- `src/routes/` - Route definitions, protected route wrappers, and role-based guards
- `src/context/` - AuthContext and user session management
