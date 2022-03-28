const express = require("express");
const Message = require('./Message.js')
const cors = require("cors");
// ^import everything that we will use below

// assign express to variable
const app = express();
//assign server port to 8000
const port = process.env.PORT || 8000;

// enables cross origin requests
app.use(cors());

//allows us to understand json
app.use(express.json());

// get request route to get all message information from database and send to App
app.get("/get-all-messages", async (req, res) => {
  let allMessages = await Message.find();
  res.send(allMessages);
});

// post request route that takes stringified user input from App, applies it to Message schema, and saves it to the database. We then update that particular message that has been sent to include a nicely formatted date ensuring that all fields in the schema are filled to completion.
app.post("/add-message", async (req, res) => {
  let message = new Message(req.body);
  let currentDate = new Date().toLocaleString();
  message.save();
  await Message.updateOne(
    { _id: message._id },
    { $set: { when: currentDate } }
  );
});

// bind and listen to the connections on the specified host and port. (port 8000 ad defined above)
app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});
