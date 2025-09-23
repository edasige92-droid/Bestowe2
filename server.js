const express = require("express");
const fetch = require("node-fetch");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PAGE_ACCESS_TOKEN = "EAAJoQm5bKFIBPpZBLNhVXZCXkVc4913wt1ly0A8P5bdwOJZCWemsPvrgewZAZC5Xm5NWNz3jQWnjXWY7bH4O5hmrjfNMoyQvF5ZAKuki7tZAWnUYxqmo8054gfZCFL5fZCuIRKTRfmxZC8XUO06Tay6BXHyXifG7UZAm8JG5YhyEgm2lqncOH7HYY8hDQHpWpgtfdZBSN7vsbPTX8z6c1sk7RE1osby6tA0DSlMFm3p5qjZC53ZCl0ZCUK47MIcxZC1lFejo"; // must have pages_read_engagement + pages_read_user_content
const VIDEO_ID = "657216063676510"; // replace with your video ID

app.use(express.static("public")); // overlay.html in /public

// Function to fetch comments
async function fetchComments() {
  try {
    const url = `https://graph.facebook.com/v21.0/$657216063676510/comments?fields=from,message,created_time&access_token=$EAAJoQm5bKFIBPpZBLNhVXZCXkVc4913wt1ly0A8P5bdwOJZCWemsPvrgewZAZC5Xm5NWNz3jQWnjXWY7bH4O5hmrjfNMoyQvF5ZAKuki7tZAWnUYxqmo8054gfZCFL5fZCuIRKTRfmxZC8XUO06Tay6BXHyXifG7UZAm8JG5YhyEgm2lqncOH7HYY8hDQHpWpgtfdZBSN7vsbPTX8z6c1sk7RE1osby6tA0DSlMFm3p5qjZC53ZCl0ZCUK47MIcxZC1lFejo`;
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
