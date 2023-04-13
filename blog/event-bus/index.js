const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
const APP_PORT = 4005;
app.use(express.json());
app.use(cors());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  await axios
    .post("http://post-clustureip-srv:4000/events", event)
    .catch((err) => {
      console.log(err);
    });
  await axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log(err);
  });
  await axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log(err);
  });
  await axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log(err);
  });
  res.status(200).json({
    message: "event fired",
  });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(APP_PORT, () => {
  console.log("Events listening to port => ", APP_PORT);
});
