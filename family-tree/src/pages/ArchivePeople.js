import React from "react";

const samplePeople = [
  { id: "1", fullName: "Lina Alvarez", years: "1931-2011", location: "Santa Fe" },
  { id: "2", fullName: "Mateo Alvarez", years: "1958-", location: "San Antonio" },
  { id: "3", fullName: "Ines Alvarez", years: "1988-", location: "Brooklyn" },
];

function ArchivePeople() {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem 0 3rem" }}>
      <div>
        <p style={{ letterSpacing: "0.12em", marginBottom: "0.35rem", textTransform: "uppercase" }}>
          Portrait Room
        </p>
        <h1 style={{ marginTop: 0 }}>The people held in this archive.</h1>
        <p style={{ color: "#6d5745", maxWidth: "42rem" }}>
          This route is ready for your Supabase-backed people list. For now, it frames the section as a
          family collection instead of an admin table.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {samplePeople.map((person) => (
          <article
            key={person.id}
            style={{
              background: "rgba(255, 251, 244, 0.92)",
              border: "1px solid rgba(79, 56, 36, 0.1)",
              borderRadius: "22px",
              padding: "1.35rem",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{person.fullName}</h2>
            <p style={{ color: "#6d5745", margin: "0.35rem 0" }}>{person.years}</p>
            <p style={{ color: "#6d5745", marginBottom: 0 }}>{person.location}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ArchivePeople;
