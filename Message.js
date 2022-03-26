const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/messages");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

const messageSchema = new mongoose.Schema({
  user: String,
  messageBody: String,
  room: String,
  when: String,
});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message