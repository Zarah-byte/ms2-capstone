// This file shows a single person's profile details and placeholder history info.
import React from "react";
import { useParams } from "react-router-dom";
import PhotoUpload from "../components/PhotoUpload";

function Person() {
  const { id } = useParams();

  return (
    <section>
      <h1>Person Profile</h1>
      <p>Viewing person ID: {id}</p>
      <p>Personal history details will go here.</p>
      <PhotoUpload personId={id} />
    </section>
  );
}

export default Person;
