// This file handles uploading profile photos to a Supabase storage bucket.
import React from "react";

function PhotoUpload({ personId }) {
  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Placeholder for Supabase storage upload logic tied to a person record.
    console.log("Upload file for person:", personId, file.name);
  };

  return (
    <div>
      <label htmlFor="photoUpload">Upload photo</label>
      <input id="photoUpload" type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
}

export default PhotoUpload;
