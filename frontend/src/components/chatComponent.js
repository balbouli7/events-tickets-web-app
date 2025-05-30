import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // replace with your backend URL

const Chat = () => {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    // Connect socket once component mounts
    socketRef.current = io(SOCKET_SERVER_URL);

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (room.trim() && sender.trim() && receiver.trim()) {
      socketRef.current.emit('join', room);
      setJoined(true);
    } else {
      alert('Please enter room, sender and receiver names');
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit('sendMessage', {
        sender,
        receiver,
        message,
        room
      });
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      {!joined ? (
        <div>
          <h3>Join Chat Room</h3>
          <input
            placeholder="Your name (sender)"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
          <input
            placeholder="Receiver name"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <input
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h3>Room: {room}</h3>
          <div
            style={{
              border: '1px solid #ccc',
              height: '300px',
              overflowY: 'scroll',
              padding: 10,
              marginBottom: 10,
            }}
          >
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <b>{msg.sender}:</b> {msg.message}
                <br />
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
          <input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            style={{ width: '80%', marginRight: 10 }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
