import { Navigate } from "react-router-dom";

// allows access only if has token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
