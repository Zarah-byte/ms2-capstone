import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section
      style={{
        display: "grid",
        gap: "1.5rem",
        padding: "2rem 0 3rem",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(80, 54, 35, 0.95), rgba(122, 84, 53, 0.9)), url('https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=1200&q=80') center/cover",
          borderRadius: "28px",
          boxShadow: "0 24px 70px rgba(47, 36, 28, 0.14)",
          color: "#f8f2e8",
          overflow: "hidden",
          padding: "3rem",
        }}
      >
        <p style={{ letterSpacing: "0.18em", margin: 0, textTransform: "uppercase" }}>
          Private Family Archive
        </p>
        <h1 style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", lineHeight: 0.95, marginBottom: "1rem" }}>
          Gather the voices, faces, and branches that made your family.
        </h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "42rem" }}>
          Preserve stories, map relationships, and keep each memory in a quiet place meant only for
          the people who belong to it.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "1.5rem" }}>
          <Link
            to="/login"
            style={{
              background: "#f3dfbf",
              borderRadius: "999px",
              color: "#2f241c",
              fontWeight: 700,
              padding: "0.9rem 1.4rem",
              textDecoration: "none",
            }}
          >
            Open the Archive
          </Link>
          <Link
            to="/archive"
            style={{
              border: "1px solid rgba(248, 242, 232, 0.45)",
              borderRadius: "999px",
              color: "#f8f2e8",
              padding: "0.9rem 1.4rem",
              textDecoration: "none",
            }}
          >
            Explore the Rooms
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {[
          ["Portrait Room", "Keep family members together with names, notes, places, and photographs."],
          ["Story Shelves", "Write down legends, recollections, recipes, letters, and small remembered moments."],
          ["Tree Room", "See how generations connect without the cold feel of a business tool."],
        ].map(([title, copy]) => (
          <article
            key={title}
            style={{
              background: "rgba(255, 251, 244, 0.9)",
              border: "1px solid rgba(79, 56, 36, 0.1)",
              borderRadius: "22px",
              padding: "1.35rem",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{title}</h2>
            <p style={{ color: "#6d5745", marginBottom: 0 }}>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Home;
