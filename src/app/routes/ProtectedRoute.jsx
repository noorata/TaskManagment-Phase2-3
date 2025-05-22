import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
}
