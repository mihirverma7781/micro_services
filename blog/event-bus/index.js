const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
const APP_PORT = 4005;
app.use(express.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const event = req.body;
  await axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err);
  });
  await axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err);
  });
  await axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err);
  });

  res.status(200).json({
    message: "event fired",
  });
});

app.listen(APP_PORT, () => {
  console.log("Events listening to port => ", APP_PORT);
});
