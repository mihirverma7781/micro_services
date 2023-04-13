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
    status: "pending",
  });

  commentsByPostId[req.params.id] = comments;

  //event fired
  await axios.post("http://event-bus-srv:4005/events", {
    type: "commentCreated",
    data: {
      id: commentId,
      content: content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).json({
    message: "commented successfully",
    comments,
  });
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  const { postId, status, id, content } = data;

  if (type === "commentModerated") {
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    await axios.post("http://event-bus-srv:4005/events", {
      type: "commentUpdated",
      data: {
        id: id,
        postId: postId,
        content: content,
        status: status,
      },
    });
  }

  res.json({});
});

app.listen(APP_PORT, () => {
  console.log(`Comments app listening on port ${APP_PORT}!`);
});
