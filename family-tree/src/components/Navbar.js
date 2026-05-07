import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/Logo.svg";
import useAuth from "../hooks/useAuth";
import { signOut } from "../lib/auth";

function Navbar() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const linkStyles = ({ isActive }) => ({
    color: isActive ? "#2f241c" : "#6d5745",
    fontSize: "0.98rem",
    fontWeight: isActive ? 700 : 500,
    letterSpacing: "0.02em",
    textDecoration: "none",
  });

  return (
    <header
      style={{
        backdropFilter: "blur(14px)",
        background: "rgba(246, 240, 229, 0.85)",
        borderBottom: "1px solid rgba(79, 56, 36, 0.12)",
        marginBottom: "2rem",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <nav
        style={{
          alignItems: "center",
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          margin: "0 auto",
          maxWidth: "1120px",
          padding: "1rem 1.5rem",
        }}
      >
        <Link
          to={user ? "/archive" : "/"}
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <Logo height="24" style={{ display: "block" }} aria-label="Logo" />
        </Link>

        <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <NavLink to="/" style={linkStyles}>
            Welcome
          </NavLink>

          {user ? (
            <>
              <NavLink to="/archive" style={linkStyles}>
                Archive
              </NavLink>
              <NavLink to="/archive/people" style={linkStyles}>
                People
              </NavLink>
              <NavLink to="/archive/stories" style={linkStyles}>
                Stories
              </NavLink>
              <NavLink to="/archive/tree" style={linkStyles}>
                Tree
              </NavLink>
              <NavLink to="/profile" style={linkStyles}>
                Profile
              </NavLink>
              <button
                onClick={handleSignOut}
                style={{
                  background: "#2f241c",
                  border: "none",
                  borderRadius: "999px",
                  color: "#f6f0e5",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  padding: "0.65rem 1rem",
                }}
                type="button"
              >
                Close Archive
              </button>
            </>
          ) : (
            <NavLink to="/login" style={linkStyles}>
              Enter
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
