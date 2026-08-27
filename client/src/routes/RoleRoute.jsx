import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = role || user?.role;

  if (!allowedRoles.includes(userRole)) {
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (userRole === "content_manager") {
      return <Navigate to="/content-manager" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
};

export default RoleRoute;