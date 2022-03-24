import React, { useState, useEffect } from "react";

import "./App.css";

function App() {
  
  const [messageData, setMessageData] = useState([]);

  const [input, setInput] = useState({ user: "" }, { messageBody: "" });

  function handleChange(event) {
    let newInput = { ...input, [event.target.name]: event.target.value };
    setInput(newInput);
  }

  async function handleSubmit() {
    await fetch("http://localhost:8000/add-message", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async function getData() {
    let allMessages = await fetch("http://localhost:8000/get-all-messages");
    allMessages = await allMessages.json();
    setMessageData(allMessages);
  }
  useEffect(() => {
    getData();
  }, []);

  return (

    <body>

      <header id="header">
        <h1>Yooooo</h1>
        <hr></hr>
        <hr></hr>
      </header>


      <main id="bodycontainer">
        

      <div id="leftscreen">
          <div id="rooms">

            <h3>Available Rooms</h3>
            
            <div id="roomselection">jkh</div>
            <div id = "adspace">ADS</div>
          </div>
        </div>
    


        <div id="rightscreen">
          <div id="currentroom">
          <h3>Current Room</h3>
          </div>
          </div>



          <div id="chatbox">
          {messageData.map((message) => {
              return (
                <>
                  <h1>----------</h1>
                  <h2>Username: {message.user}</h2>
                  <p>Message: {message.body}</p>
                  <h1>----------</h1>
                </>
              );
            })}
          </div>

          <div id="input-forms">
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="user"
                value={input.user}
                onChange={handleChange}
              />
            </label>

            <label>
              Message:
              <input
                type="text"
                name="messageBody"
                value={input.messageBody}
                onChange={handleChange}
              />
            </label>

            <button type="submit" value="Submit">
              Submit
            </button>

            <button type="submit" value="Submit">
              Refresh
            </button>

          </form>
          </div>

          </main>
      <footer></footer>

    </body>

  );
}

export default App;
