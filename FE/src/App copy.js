import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://pic.ibstorm.com"; // Backend URL

const App = () => {
  const [files, setFiles] = useState([]); // List of files from backend
  const [selectedFiles, setSelectedFiles] = useState([]); // Selected files for deletion
  const [previewFile, setPreviewFile] = useState(null); // File to preview
  const [uploadFiles, setUploadFiles] = useState([]); // Files selected for upload

  // Fetch file list on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/files`);
      setFiles(response.data.files); // Update state with file list
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file); // Set the selected file for preview
  };

  const handleClosePreview = () => {
    setPreviewFile(null); // Close the preview
  };

  const toggleSelectFile = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((item) => item !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected for deletion!");
      return;
    }

    try {
      for (const file of selectedFiles) {
        await axios.delete(`${BASE_URL}/delete/${file}`);
      }
      setFiles(files.filter((file) => !selectedFiles.includes(file)));
      setSelectedFiles([]);
      alert("Selected files deleted successfully!");
    } catch (error) {
      console.error("Error deleting files:", error);
      alert("Failed to delete selected files.");
    }
  };

  const handleFileSelect = (event) => {
    setUploadFiles(event.target.files); // Save selected files for upload
  };

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      alert("No files selected for upload!");
      return;
    }

    const formData = new FormData();
    Array.from(uploadFiles).forEach((file) => {
      formData.append("file", file);
    });

    try {
      await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files uploaded successfully!");
      window.location.reload(); // Reload the entire page
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Image Manager</h1>

      {/* Upload Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ marginBottom: "10px" }}
        />
        <button
          onClick={handleUpload}
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Upload Files
        </button>
      </div>

      {/* Delete Selected Button */}
      <button
        onClick={handleDeleteSelected}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Delete Selected
      </button>

      {/* Thumbnails */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "100px",
              height: "100px",
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "5px",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            {/* Image Thumbnail */}
            <img
              src={`${BASE_URL}/pic/${file}`} // URL to the image
              alt={file}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onClick={() => handlePreview(file)} // Show larger image on click
            />

            {/* Checkmark Icon for Selection */}
            <div
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                width: "20px",
                height: "20px",
                backgroundColor: selectedFiles.includes(file) ? "green" : "white",
                border: "2px solid black",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the preview
                toggleSelectFile(file); // Toggle file selection
              }}
            >
              {selectedFiles.includes(file) && (
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Larger-Size Preview Modal */}
      {previewFile && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: "1000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={handleClosePreview} // Close modal on background click
          >
            <div
              style={{
                position: "relative",
                textAlign: "center",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing modal on image click
            >
              <img
                src={`${BASE_URL}/pic/${previewFile}`} // URL to the larger-size image
                alt={previewFile}
                style={{
                  width: "500px", // 5x the thumbnail width
                  height: "500px", // 5x the thumbnail height
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div style={{ marginTop: "10px" }}>
                <a
                  href={`${BASE_URL}/pic/${previewFile}`} // Download link
                  download={previewFile} // Set the file name for download
                  style={{
                    textDecoration: "none",
                    padding: "10px 20px",
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download
                </a>
                <button
                  onClick={handleClosePreview} // Close the modal
                  style={{
                    marginLeft: "10px",
                    padding: "10px 20px",
                    backgroundColor: "gray",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
