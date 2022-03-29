const mongoose = require("mongoose");

// setting database connection
mongoose.connect("mongodb://localhost:27017/messages");
const db = mongoose.connection;
// database error handling
db.on("error", console.error.bind(console, "connection error"));

// create message schema
const messageSchema = new mongoose.Schema({
  user: String,
  messageBody: String,
  room: String,
  when: String,
});

// variable that can be called to access document in messages collection where the data will be forced to the messageSchema data types.
const Message = mongoose.model("messages", messageSchema);

// export Message
module.exports = Message