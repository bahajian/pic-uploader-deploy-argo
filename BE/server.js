const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to the "pic" folder
const picFolder = path.join(__dirname, "pic");
if (!fs.existsSync(picFolder)) fs.mkdirSync(picFolder);

// Serve static files
app.use("/pic", express.static(picFolder));
app.use(express.static(path.join(__dirname, "public")));

// Function to sanitize file names
const sanitizeFileName = (name) => {
  return name
    .normalize("NFC") // Normalize to ensure consistent encoding
    .replace(/[\u00A0\u202F]/g, " ") // Replace non-breaking spaces with regular spaces
    .replace(/[^\w.\- ()]/g, "") // Remove invalid characters except for safe ones
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: picFolder,
  filename: (req, file, cb) => {
    const sanitizedFileName = sanitizeFileName(file.originalname);
    console.log(`Original file name: ${file.originalname}`);
    console.log(`Sanitized file name: ${sanitizedFileName}`);
    cb(null, sanitizedFileName); // Save the sanitized file name
  },
});
const upload = multer({ storage });

// Middleware for parsing JSON
app.use(express.json());


// Endpoint: List files
app.get("/", (req, res) => {
  res.send('Welcome to my Node.js application!');
});


// Endpoint: List files
app.get("/files", (req, res) => {
  fs.readdir(picFolder, (err, files) => {
    if (err) {
      console.error("Error reading pic folder:", err);
      return res.status(500).send({ error: "Unable to retrieve files." });
    }
    res.json({ files });
  });
});

// Endpoint: Upload file
app.post("/upload", upload.array("file", 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ error: "No files uploaded." });
  }

  const uploadedFiles = req.files.map((file) => sanitizeFileName(file.originalname));

  console.log("Uploaded files:", uploadedFiles);

  res.send({
    message: "Files uploaded successfully.",
    files: uploadedFiles,
  });
});

// Endpoint: Delete file
app.delete("/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(picFolder, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send({ error: "Unable to delete file." });
    }
    res.send({ message: `File "${filename}" deleted successfully.` });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
