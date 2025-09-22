const express = require("express");
const fetch = require("node-fetch");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PAGE_ACCESS_TOKEN = "YOUR_PAGE_ACCESS_TOKEN"; // must have pages_read_engagement + pages_read_user_content
const VIDEO_ID = "657216063676510"; // replace with your video ID

app.use(express.static("public")); // overlay.html in /public

// Function to fetch comments
async function fetchComments() {
  try {
    const url = `https://graph.facebook.com/v21.0/${VIDEO_ID}/comments?fields=from,message,created_time&access_token=${PAGE_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Facebook API error:", data.error);
      return;
    }

    if (data.data && data.data.length > 0) {
      data.data.forEach(comment => {
        io.emit("newComment", comment);
      });
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

// Poll every 10 seconds
setInterval(fetchComments, 10000);

io.on("connection", (socket) => {
  console.log("Overlay connected");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
