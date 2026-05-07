import React from "react";

function Profile() {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem 0 3rem" }}>
      <div
        style={{
          background: "rgba(255, 251, 244, 0.92)",
          border: "1px solid rgba(79, 56, 36, 0.1)",
          borderRadius: "24px",
          padding: "2rem",
        }}
      >
        <p style={{ letterSpacing: "0.12em", marginBottom: "0.35rem", textTransform: "uppercase" }}>
          Profile
        </p>
        <h1 style={{ marginTop: 0 }}>Your place in the archive.</h1>
        <p style={{ color: "#6d5745", maxWidth: "42rem" }}>
          Use this route for the owner’s profile, archive preferences, and onboarding state without
          drifting into dashboard language.
        </p>
      </div>
    </section>
  );
}

export default Profile;
