import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { redirectIfLoggedIn } from "../../lib/auth";

const loadingStyles = {
  alignItems: "center",
  color: "#6d5745",
  display: "flex",
  justifyContent: "center",
  minHeight: "50vh",
};

function GuestRoute() {
  const { user, loading } = useAuth();
  const [redirectPath, setRedirectPath] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function resolveRedirect() {
      try {
        const result = await redirectIfLoggedIn({ user, loading });
        if (!isActive) {
          return;
        }

        setRedirectPath(result.status === "redirect" ? result.to : null);
      } catch (redirectError) {
        if (!isActive) {
          return;
        }

        setError(redirectError.message);
      }
    }

    resolveRedirect();

    return () => {
      isActive = false;
    };
  }, [loading, user]);

  if (loading || (user && !redirectPath && !error)) {
    return <div style={loadingStyles}>Preparing your archive entrance...</div>;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (error) {
    return <div style={loadingStyles}>{error}</div>;
  }

  return <Outlet />;
}

export default GuestRoute;
