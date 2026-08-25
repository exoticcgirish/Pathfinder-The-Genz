import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../views/auth/Login";
import Register from "../views/auth/Register";
import Dashboard from "../views/dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add these later */}
        {/* <Route path="/courses" element={<Courses />} /> */}
        {/* <Route path="/roadmap" element={<Roadmap />} /> */}
        {/* <Route path="/progress" element={<Progress />} /> */}
        {/* <Route path="/chat" element={<Chat />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;