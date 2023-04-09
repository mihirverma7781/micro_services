const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
const APP_PORT = 4000;
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).json({
    posts: posts,
    message: "retrived post successfully",
  });
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id: id,
    title: title,
  };

  res.status(201).json({
    message: "post created successfully",
    post: posts[id],
  });
});

app.listen(APP_PORT, () => {
  console.log("App listening to port => ", APP_PORT);
});
