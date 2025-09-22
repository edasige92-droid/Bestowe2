// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Needed because __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Default route → overlay.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "overlay.html"));
});

// Example extra overlay routes (if needed for OBS scenes)
app.get("/overlay1", (req, res) => {
  res.sendFile(path.join(__dirname, "overlay1.html"));
});

app.get("/overlay2", (req, res) => {
  res.sendFile(path.join(__dirname, "overlay2.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
