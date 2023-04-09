const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const APP_PORT = 4002;

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "postCreated") {
    const { id, title } = data;
    posts[id] = {
      id: id,
      title: title,
      comments: [],
    };
  }

  if (type === "commentCreated") {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({
      id: id,
      content: content,
      status: status,
    });
  }

  if (type === "commentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.status(200).json({
    message: "Retrived successfully",
    posts: posts,
  });
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.json("Processed the event");
});

app.listen(APP_PORT, async () => {
  console.log(`Query app listening on port ${APP_PORT}!`);
  const res = await axios.get("http://localhost:4005/events");

  res.data.forEach((event) => {
    console.log(`Processing event: `, event.type);
    handleEvent(event.type, event.data);
  });
});
