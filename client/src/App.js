import React, { useState, useEffect } from "react";
import Picture from "./images/market.png";
import Picture2 from "./images/market2.jpg";
import ChatIcon from "./images/chat-icon.png";
import Ping from "./audio/ping.mp3";
import Error from "./audio/error.mp3"
import "./App.css";
// ^import everything that we will use below
function App() {
  //Creating states to hold messageData (essentially the information displayed in the chat box, the currentRoom (header for what room you are in), and user input (will contain username, the message they want to post, and the room they are in))
  const [messageData, setMessageData] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("Main");
  const [input, setInput] = useState(
    { user: "" },
    { messageBody: "" },
    { room: "" }
  );
    // handleChange event runs on every keystroke to update and change the React state as the user types their inputs. In this case, it will fire when the user is typing their name or their message.
  function handleChange(event) {
    let newInput = {
      ...input,
      [event.target.name]: event.target.value,
      room: currentRoom,
    };
    setInput(newInput);
  }
    // handleSubmit event, when the user hits enter
  async function handleSubmit(event) {
    // the default behavior is prevented
    event.preventDefault();
    // the input is split into every individual character
    let checkInputArray = input.messageBody.split("");
    // if statement that check if there are less than 500 characters
    if (checkInputArray.length <= 500) {
      // if there are less then clear the input
      let clearInput = { ...input, messageBody: "" };
      setInput(clearInput);
      // and play an 'affirmative' sound
      let pingAudio = new Audio(Ping);
      pingAudio.play();
      // and post the message to the server after transforming the contents to strings
      await fetch("http://localhost:8000/add-message", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(input),
      });
    } else {
      // if there are more play an error sound
      let errorAudio = new Audio(Error);
      errorAudio.play()
      // and send an alert letting the user know they went over the limit
      alert("Woah woah woah, take it easy mate! 500 characters or less!");
    }
  }
  // function to fetch all data
  async function getData() {
    // access get route on server which will find all messages and send them to the client
    let allMessages = await fetch("http://localhost:8000/get-all-messages");
    // parses incoming data as json
    allMessages = await allMessages.json();
    // set the messageData state to display all messages in reverse order (reverse order to make scrolling work as intended)
    setMessageData(allMessages.reverse());
  }
  // useEffect to call our getData function once every second. This updates the messageData that is displayed every second.
  useEffect(() => {
    const fetchNewData = () => {
      getData();
      setTimeout(fetchNewData, 1000);
    };
    setTimeout(fetchNewData, 0);
  }, []);


  //creates array of images
  let images = [Picture, Picture2];
  // creating state for currentImage
  const [currentImage, setCurrentImage] = useState(0);
  // useEffect that will continously cycle through our images array and set a new image.
  useEffect(() => {
    const intervalId = setInterval(() => {
      // if the state matches the length of the images array less one, then set the image state value to 0 which will represent the first image of the array
      if (currentImage === images.length - 1) {
        setCurrentImage(0);
        // otherwise add one to the image state value
      } else {
        setCurrentImage(currentImage + 1);
      }
      // do the above every 10 seconds to make the images rotate
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentImage, images.length]);
  // contains the layout of all the content we are trying to display
  return (
    <main>
      <header id="header">
        <h1>React Chat</h1>
        <img src={ChatIcon} alt="some chat bubbles" />
      </header>
      <div id="body-container">
        <div id="left-screen">
          <div id="rooms">
            <h3>Available Rooms</h3>
              <ul id="room-selection">
                {/* this will allow us to create a box around the room we are in on the list when we select it, also when selected we change the currentRoom state */}
                <li className={`wrapper searchDiv ${currentRoom === "Main" ? "selected" : ""}`} onClick={() => setCurrentRoom("Main")}>Main</li>
                <li className={`wrapper searchDiv ${currentRoom === "Pets" ? "selected" : ""}`} onClick={() => setCurrentRoom("Pets")}>Pets</li>
                <li className={`wrapper searchDiv ${currentRoom === "Food" ? "selected" : ""}`} onClick={() => setCurrentRoom("Food")}>Food</li>
              </ul>
          </div>
          <div id="market-space">
            {/* access our images and Image state */}
            <img src={images[currentImage]} alt="marketers" />
          </div>
        </div>

        <div id="right-screen">
          <div id="current-room">
            {/* access our currentRoom state */}
            <h3>{currentRoom}</h3>
          </div>

          <div id="chat-box-and-buttons">
        
              <div id="chat-box">
                {/* access our messageData state and use the map method to create a new array that contains only the data for the selected room.*/}
                {messageData.map((message) => {
                  // if the room where the messages were written is the same as the room the user is currently in display those messages
                  if (message.room === currentRoom) {
                    return (
                      <>
                        <div className="message-input">
                          {/* the order of how the message schema information will be displayed */}
                          <h2>
                            <span>{message.user}</span> says:
                          </h2>
                          <p>{message.messageBody}</p>
                          <h3>Time: {message.when}</h3>
                        </div>
                      </>
                    );
                  } else {
                    // otherwise return null
                    return null;
                  }
                })}
              </div>
  
            {/* form to handle user input */}
            <div id="input-forms">
              {/* when the user submits form data it calls the handleSubmit function */}
              <form onSubmit={handleSubmit}>
                <label>
                  <input
                    id="username-input"
                    type="text"
                    name="user"
                    value={input.user}
                    placeholder="User Name"
                    // whenever a value in this field is changed call our handleChange function
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <textarea
                    id="message-input"
                    name="messageBody"
                    value={input.messageBody}
                    placeholder="Message: (500 characters or less)"
                    // whenever a value in this field is changed call our handleChange function
                    onChange={handleChange}
                  ></textarea>
                </label>
                <button id="submit-button" type="submit" value="Enter">
                  Enter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
