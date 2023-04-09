const express = require("express");
const cors = require("cors");

const app = express();
const APP_PORT = 4002;

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).json({
    message: "Retrived successfully",
    posts: posts,
  });
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
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

  res.json("Processed the event");
});

app.listen(APP_PORT, () =>
  console.log(`Query app listening on port ${APP_PORT}!`)
);
