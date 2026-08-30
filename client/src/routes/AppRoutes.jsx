import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../views/auth/Login";
import Register from "../views/auth/Register";

import Dashboard from "../views/dashboard/Dashboard";
import AdminDashboard from "../views/dashboard/AdminDashboard";
import ContentManagerDashboard from "../views/dashboard/ContentManagerDashboard";

import Courses from "../views/courses/Courses";
import CourseDetails from "../views/courses/CourseDetails";
import AddCourse from "../views/courses/AddCourse";

import Roadmap from "../views/roadmap/Roadmap";
import Progress from "../views/progress/Progress";
import Chat from "../views/chat/Chat";
import Profile from "../views/profile/Profile";
import Settings from "../views/settings/Settings";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import LearnerLayout from "../components/layout/LearnerLayout";


const AppRoutes = () => {
  return (
    <Routes>

      {/* DEFAULT */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <RoleRoute
            allowedRoles={["admin"]}
          >
            <AdminDashboard />
          </RoleRoute>
        }
      />

      {/* CONTENT MANAGER */}
      <Route
        path="/content-manager"
        element={
          <RoleRoute
            allowedRoles={[
              "content_manager",
              "admin",
            ]}
          >
            <ContentManagerDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/content-manager/courses/add"
        element={
          <RoleRoute
            allowedRoles={[
              "content_manager",
              "admin",
            ]}
          >
            <AddCourse />
          </RoleRoute>
        }
      />

      {/* AUTHENTICATED LEARNER AREA */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LearnerLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/courses"
            element={<Courses />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="/roadmap"
            element={<Roadmap />}
          />

          <Route
            path="/progress"
            element={<Progress />}
          />

          <Route
            path="/chat"
            element={<Chat />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>
      </Route>

      {/* INVALID URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;
