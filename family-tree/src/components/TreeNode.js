import React from "react";

function TreeNode({ person }) {
  return (
    <article
      style={{
        background: "linear-gradient(180deg, rgba(255, 252, 247, 0.96), rgba(245, 236, 221, 0.94))",
        border: "1px solid rgba(79, 56, 36, 0.1)",
        borderRadius: "20px",
        maxWidth: "260px",
        padding: "1rem",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{person.fullName || person.name}</h3>
      <p style={{ color: "#6d5745", marginBottom: 0 }}>Born: {person.birthYear || "Unknown"}</p>
    </article>
  );
}

export default TreeNode;
