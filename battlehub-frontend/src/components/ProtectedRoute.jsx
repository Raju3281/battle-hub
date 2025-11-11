import { Navigate } from "react-router-dom";
import { Auth } from "../utils/auth";

export default function ProtectedRoute({ children, allowed }) {
  const user = Auth.getUser();

  // If user not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If this route is for admin only
  if (allowed === "admin" && user.userId !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If this route is for user only but user is admin
  if (allowed === "user" && user.userId === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // All good → render route
  return children;
}
