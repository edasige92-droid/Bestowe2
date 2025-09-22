import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your values
const VIDEO_ID = process.env.FB_VIDEO_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

app.use(express.static("public"));

app.get("/comments", async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v21.0/${VIDEO_ID}/comments?fields=from,message,created_time&access_token=${ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to fetch comments" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
