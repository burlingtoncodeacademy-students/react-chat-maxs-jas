const express = require("express");
const Message = require('./Message.js')
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

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
