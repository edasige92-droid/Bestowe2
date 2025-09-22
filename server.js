import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// NEW: Facebook comments route
app.get("/comments", async (req, res) => {
  try {
    const videoId = process.env.FB_VIDEO_ID;
    const token = process.env.FB_ACCESS_TOKEN;

    const fbRes = await fetch(
      `https://graph.facebook.com/v21.0/${videoId}/comments?fields=from,message,created_time&access_token=${token}`
    );

    const data = await fbRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
