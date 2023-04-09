const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
const APP_PORT = 4000;
app.use(express.json());
app.use(cors());

const posts = {};

// GET_POST
app.get("/posts", (req, res) => {
  res.status(200).json({
    posts: posts,
    message: "retrived post successfully",
  });
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id: id,
    title: title,
  };

  await axios.post("http://localhost:4005/events", {
    type: "postCreated",
    data: {
      id: id,
      title: title,
    },
  });

  res.status(201).json({
    message: "post created successfully",
    post: posts[id],
  });
});

app.post("/events", (req, res) => {
  console.log("RECIEVED EVENT => ", req.body.type);
  res.json({});
});

app.listen(APP_PORT, () => {
  console.log(`Post app listening on port ${APP_PORT}!`);
});
