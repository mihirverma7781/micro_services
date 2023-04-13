const express = require("express");
const axios = require("axios");
const app = express();
const APP_PORT = 4003;

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "commentCreated") {
    let content = data.content;
    const status = content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://event-bus-srv:4005/events", {
      type: "commentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status: status,
        content: content,
      },
    });
  }

  res.json("Comment Moderated");
});

app.listen(APP_PORT, () =>
  console.log(`Moderation app listening on port ${APP_PORT}!`)
);
