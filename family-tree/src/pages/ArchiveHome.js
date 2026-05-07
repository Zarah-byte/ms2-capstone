import React from "react";
import { Link } from "react-router-dom";

const roomCard = {
  background: "rgba(255, 251, 244, 0.92)",
  border: "1px solid rgba(79, 56, 36, 0.1)",
  borderRadius: "22px",
  padding: "1.35rem",
};

function ArchiveHome() {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem 0 3rem" }}>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(89, 60, 36, 0.98), rgba(145, 109, 74, 0.88))",
          borderRadius: "28px",
          color: "#f8f2e8",
          padding: "2.5rem",
        }}
      >
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>Family Archive</p>
        <h1 style={{ fontSize: "clamp(2.3rem, 6vw, 4rem)", marginTop: 0 }}>A quiet house for living memory.</h1>
        <p style={{ maxWidth: "42rem" }}>
          Move between the people, the stories, and the tree as if you were walking from room to room
          in a private family house.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {[
          ["/archive/people", "Portrait Room", "Browse relatives, add notes, and keep each life together."],
          ["/archive/stories", "Story Shelves", "Collect recollections, letters, and family folklore."],
          ["/archive/tree", "Tree Room", "See how branches meet across generations."],
        ].map(([to, title, copy]) => (
          <Link key={to} to={to} style={{ ...roomCard, color: "#2f241c", textDecoration: "none" }}>
            <h2 style={{ marginTop: 0 }}>{title}</h2>
            <p style={{ color: "#6d5745", marginBottom: 0 }}>{copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ArchiveHome;
