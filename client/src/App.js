import { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";
import { format } from "timeago.js";
function App() {
  const scrollRef = useRef();
  const socket = io("http://localhost:3001");
  const [message, setMessage] = useState("");
  const [id, setId] = useState(uuid());
  const [isMessage, setIsMessage] = useState(false);

  const messageHandler = () => {
    socket.emit("send_message", { message, own: true, id, date: new Date() });
    setMessage("")
  };
  const [messageArray, setMessageArray] = useState([]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageArray((prev) => [...prev, data]);
      setIsMessage(true);
    });
  }, []);



  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div className="App">
      <div className="Message_title">
        <h1>Messages</h1>
        <hr />
      </div>
     {!isMessage &&  <h1 className="starting">Start a conversation..</h1>}
      <div className="msg_box">
        {messageArray?.map((message, index) => {
          return (
            <div
              ref={scrollRef}
              key={index}
              className={message.id === id ? "own" : "others"}
            >
              <p> {message.message}</p>
              <h6> {format(message.date)}</h6>
            </div>
          );
        })}
      </div>
      <div className="message__area">
        <div>
          {" "}
          <input
            placeholder="Write message.."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={messageHandler}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
