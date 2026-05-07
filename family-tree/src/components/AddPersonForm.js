import React, { useState } from "react";

function AddPersonForm() {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="personName" style={{ color: "#6d5745", display: "block", marginBottom: "0.5rem" }}>
        Add a family member
      </label>
      <input
        id="personName"
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        style={{
          background: "#fffaf1",
          border: "1px solid rgba(79, 56, 36, 0.14)",
          borderRadius: "14px",
          padding: "0.9rem 1rem",
        }}
      />
      <button
        type="submit"
        style={{
          background: "#2f241c",
          border: "none",
          borderRadius: "999px",
          color: "#f8f2e8",
          cursor: "pointer",
          marginLeft: "0.5rem",
          padding: "0.9rem 1.15rem",
        }}
      >
        Add to Archive
      </button>
    </form>
  );
}

export default AddPersonForm;
