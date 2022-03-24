const express = require("express");

const port = process.env.PORT || 8000;
const app = express();
const cors = require("cors");

const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/messages");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

const messageSchema = new mongoose.Schema({
  when: Date,
  user: String,
  room: String,
  messageBody: String,
});

const Message = mongoose.model("messages", messageSchema);


app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.get("/get-all-messages", async (req, res) => {
  let allMessages = await Message.find({});
  res.send(allMessages);
});

function addMessage(){
  let message = new Message({user: "Max", messageBody: "What's up"});
  message.save();
}

addMessage();

async function read(){
  let allMessages = await Message.find({});
  console.log(allMessages)
}

read()

app.post("/add-message", async (req, res) => {
  let message = new Message(req.body);
  message.save();
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});
