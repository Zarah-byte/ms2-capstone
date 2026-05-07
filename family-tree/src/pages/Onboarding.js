import React from "react";
import { Link } from "react-router-dom";

function Onboarding() {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem 0 3rem" }}>
      <div
        style={{
          background: "rgba(255, 251, 244, 0.94)",
          border: "1px solid rgba(79, 56, 36, 0.1)",
          borderRadius: "24px",
          padding: "2rem",
        }}
      >
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>First Gathering</p>
        <h1 style={{ marginTop: 0 }}>Set the tone of your archive.</h1>
        <p style={{ color: "#6d5745", maxWidth: "42rem" }}>
          This page can guide a new family through naming the archive, adding the first branch, and
          choosing what to preserve first. For now, the route is ready and protected.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
        <Link
          to="/archive"
          style={{
            background: "#2f241c",
            borderRadius: "999px",
            color: "#f8f2e8",
            padding: "0.85rem 1.25rem",
            textDecoration: "none",
          }}
        >
          Continue to Archive
        </Link>
        <Link
          to="/profile"
          style={{
            border: "1px solid rgba(79, 56, 36, 0.2)",
            borderRadius: "999px",
            color: "#2f241c",
            padding: "0.85rem 1.25rem",
            textDecoration: "none",
          }}
        >
          Visit Profile
        </Link>
      </div>
    </section>
  );
}

export default Onboarding;
