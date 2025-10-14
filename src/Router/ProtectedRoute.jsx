import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useUser } from "../Pages/Auth/UserContext";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, requiredPermission}) => {
  const { user } = useUser();
  const permission = `${user?.permission || null}`.trim();
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem("auth_token");
  
  useEffect(() => {
    try {
      if (!token) throw new Error("No token found");
      const { exp } = jwtDecode(token);

      if (Date.now() >= exp * 1000) {
        throw new Error("Session expired");
      }

      setTokenValid(true);

      if (requiredPermission && permission != 'null') {
        if (permission === requiredPermission) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } 
  
    } catch (err) {
      localStorage.removeItem("auth_token");
      toast.error(err.message || "Invalid session. Please log in again.");
    } 
    finally {
      setIsLoading(false);
    }
  }, [token, user, requiredPermission]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  if (!tokenValid) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  if (hasPermission != null) {
    if (!hasPermission) {
      toast.error("You do not have permission to access this page.");
      return <Navigate to="/no-access" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;