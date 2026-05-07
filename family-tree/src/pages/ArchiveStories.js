import React from "react";

const sampleStories = [
  {
    title: "The Winter Kitchen",
    excerpt: "A remembered recipe and the long table where every cousin learned to knead dough.",
  },
  {
    title: "Train to the Coast",
    excerpt: "A migration story marked by a paper suitcase, two siblings, and one borrowed photograph.",
  },
];

function ArchiveStories() {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "1rem 0 3rem" }}>
      <div>
        <p style={{ letterSpacing: "0.12em", marginBottom: "0.35rem", textTransform: "uppercase" }}>
          Story Shelves
        </p>
        <h1 style={{ marginTop: 0 }}>Letters, legends, and remembered fragments.</h1>
        <p style={{ color: "#6d5745", maxWidth: "42rem" }}>
          This section is routed and protected for private stories tied to your family archive.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {sampleStories.map((story) => (
          <article
            key={story.title}
            style={{
              background: "rgba(255, 251, 244, 0.92)",
              border: "1px solid rgba(79, 56, 36, 0.1)",
              borderRadius: "22px",
              padding: "1.4rem",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{story.title}</h2>
            <p style={{ color: "#6d5745", marginBottom: 0 }}>{story.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ArchiveStories;
