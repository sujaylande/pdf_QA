
import React, { useState } from "react";
import axios from "axios";

const DocumentUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a file to upload.");
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadComplete(response.data.document); // Trigger callback with new document details
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`bg-green-500 text-white px-4 py-2 rounded ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default DocumentUpload;
