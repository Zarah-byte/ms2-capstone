import React from "react";
import AddPersonForm from "../components/AddPersonForm";
import TreeNode from "../components/TreeNode";

const sampleBranch = [
  { id: "1", fullName: "Lina Alvarez", birthYear: 1931 },
  { id: "2", fullName: "Mateo Alvarez", birthYear: 1958 },
  { id: "3", fullName: "Ines Alvarez", birthYear: 1988 },
];

function ArchiveTree() {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem 0 3rem" }}>
      <div>
        <p style={{ letterSpacing: "0.12em", marginBottom: "0.35rem", textTransform: "uppercase" }}>
          Tree Room
        </p>
        <h1 style={{ marginTop: 0 }}>Watch the branches gather.</h1>
        <p style={{ color: "#6d5745", maxWidth: "42rem" }}>
          This route can grow into the interactive lineage view. The language and layout are now aligned
          with a family archive instead of a generic product dashboard.
        </p>
      </div>

      <div
        style={{
          background: "rgba(255, 251, 244, 0.92)",
          border: "1px solid rgba(79, 56, 36, 0.1)",
          borderRadius: "24px",
          padding: "1.5rem",
        }}
      >
        <AddPersonForm />
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            marginTop: "1rem",
          }}
        >
          {sampleBranch.map((person) => (
            <TreeNode key={person.id} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchiveTree;
