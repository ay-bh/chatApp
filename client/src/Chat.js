import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";



function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  

//   var typing = false;
// var timeout = undefined;

// function timeoutFunction(){
//   typing = false;
//   socket.emit("noLongerTypingMessage");
// }
// let typingUser = document.getElementById('typingUser');
function onTyping(){
  // if(typing === false) {
  //   typing = true
  //   socket.emit("typing",username);
  //   timeout = setTimeout(timeoutFunction, 5000);
  // } else {
  //   clearTimeout(timeout);
  //   timeout = setTimeout(timeoutFunction, 5000);
  // }
  let typingUser = document.getElementById('typingUser');
  socket.emit('typing',username)
  socket.on("typing", (name)=>{
    typingUser.innerHTML = `<b>${name} is typing...</b>`
  setTimeout(()=>{
    typingUser.innerHTML = "";
  },2000)
  })
  
 
}


  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      
    }
    
  };


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
        </ScrollToBottom>
        
      </div>
      
      <div className="chat-footer">

        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
            onTyping();
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <div id="typingUser"></div>
    </div>
  
  );
}

export default Chat;
