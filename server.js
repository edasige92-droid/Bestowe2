const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fetch = require("node-fetch");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// === Replace with your values (better: move to env variables) ===
const PAGE_ACCESS_TOKEN = "EAAJoQm5bKFIBPpZBLNhVXZCXkVc4913wt1ly0A8P5bdwOJZCWemsPvrgewZAZC5Xm5NWNz3jQWnjXWY7bH4O5hmrjfNMoyQvF5ZAKuki7tZAWnUYxqmo8054gfZCFL5fZCuIRKTRfmxZC8XUO06Tay6BXHyXifG7UZAm8JG5YhyEgm2lqncOH7HYY8hDQHpWpgtfdZBSN7vsbPTX8z6c1sk7RE1osby6tA0DSlMFm3p5qjZC53ZCl0ZCUK47MIcxZC1lFejo";
const VIDEO_ID = "657216063676510";

// Serve overlay.html so OBS can load it
app.use(express.static(__dirname + "/public"));

// Poll comments from Facebook API
async function fetchComments() {
  try {
    const url = `https://graph.facebook.com/v21.0/${VIDEO_ID}/comments?fields=from,message,created_time&access_token=${PAGE_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("Facebook API error:", data.error);
      return;
    }

    if (data.data && data.data.length > 0) {
      io.emit("comments", data.data);
      console.log("Sent comments to overlay:", data.data.length);
    } else {
      console.log("No new comments...");
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

// Fetch comments every 10s
setInterval(fetchComments, 10000);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
