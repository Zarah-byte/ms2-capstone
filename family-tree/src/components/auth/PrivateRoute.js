import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { requireAuth } from "../../lib/auth";

const loadingStyles = {
  alignItems: "center",
  color: "#6d5745",
  display: "flex",
  justifyContent: "center",
  minHeight: "50vh",
};

function PrivateRoute() {
  const { user, loading } = useAuth();
  const access = requireAuth({ user, loading });

  if (access.status === "loading") {
    return <div style={loadingStyles}>Opening the archive...</div>;
  }

  if (access.status === "redirect") {
    return <Navigate to={access.to} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
