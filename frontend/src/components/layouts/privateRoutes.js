import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context.js/authContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user, isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn === null) return null; // Loading state, can be handled differently

  if (!isLoggedIn || user?.role !== "admin") {
    // Redirect non-admin users to the login page or another page
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
