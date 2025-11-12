import { Navigate } from "react-router-dom";
import { Auth } from "../utils/auth";

export default function ProtectedRoute({ children, allowed }) {
  const user = Auth.getUser();
  console.log("ProtectedRoute - current user:", user);
  // 🧩 If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🧩 If route is admin-only, but user is not admin
  if (allowed === "admin" && user !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 🧩 If route is user-only, but user is admin
  if (allowed === "user" && user === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // ✅ All good — render children
  return children;
}
