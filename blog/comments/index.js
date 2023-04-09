const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
const APP_PORT = 4001;
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/post/:id/comments", (req, res) => {
  res.status(200).json({
    message: "retrived successfully",
    comments: commentsByPostId[req.params.id] || [],
  });
});

app.post("/post/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content: content,
  });

  commentsByPostId[req.params.id] = comments;
  console.log(commentsByPostId);
  res.status(201).json({
    message: "commented successfully",
    comments,
  });
});

app.listen(APP_PORT, () => {
  console.log("App listening to port => ", APP_PORT);
});
