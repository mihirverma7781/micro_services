const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

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

app.post("/post/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content: content,
  });

  commentsByPostId[req.params.id] = comments;

  //event fired
  await axios.post("http://localhost:4005/events", {
    type: "commentCreated",
    data: {
      id: commentId,
      content: content,
      postId: req.params.id,
    },
  });

  res.status(201).json({
    message: "commented successfully",
    comments,
  });
});

app.post("/events", (req, res) => {
  console.log("RECIEVED EVENT => ", req.body.type);
  res.json({});
});

app.listen(APP_PORT, () => {
  console.log(`Comments app listening on port ${APP_PORT}!`);
});
