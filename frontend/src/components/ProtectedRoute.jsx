import { Navigate } from "react-router-dom";
import { hasAccess } from "../utils/roleAccess";

export default function ProtectedRoute({ currentUser, path, children }) {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!hasAccess(currentUser.role, path)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}