const express = require("express");

const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/messages");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
  user: String,
  messageBody: String,
  room: String,
  when: String,
});

const Message = mongoose.model("messages", messageSchema);

app.get("/get-all-messages", async (req, res) => {
  let allMessages = await Message.find();
  res.send(allMessages);
});

app.post("/add-message", async (req, res) => {
  let message = new Message(req.body);
  let currentDate = new Date().toLocaleString();
  message.save();
  await Message.updateOne(
    { _id: message._id },
    { $set: { when: currentDate } }
  );
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});
