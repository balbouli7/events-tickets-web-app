import React, { useContext, useState, useEffect, useRef } from "react";
import { SocketContext } from "../../context.js/socketContext";
import { AuthContext } from "../../context.js/authContext";

const ChatBox = ({ room }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages?room=${room}`);
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();

    // Receiving messages
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    // Handle user leaving
    const handleUserLeft = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setChatEnded(true);
      setTyping(false); // Disable typing indicator if active
    };

    // Listen for typing event
    const handleTyping = ({ isTyping }) => {
      setTyping(isTyping);
    };

    socket.on("receiveMessage", handleMessage);
    socket.on("userLeft", handleUserLeft);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("userLeft", handleUserLeft);
      socket.off("typing", handleTyping);
    };
  }, [socket, room]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    if (chatEnded) return;
    setText(e.target.value);
    socket.emit("typing", { room, isTyping: e.target.value.length > 0 });
  };

  const sendMessage = () => {
    if (!text.trim() || chatEnded) return;

    socket.emit("sendMessage", {
      sender: user.id,
      receiver: "admin",
      message: text,
      room,
      timestamp: new Date().toISOString(),
    });
    setText("");
    socket.emit("typing", { room, isTyping: false });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((m, i) => {
          const isUser = m.sender === user.id;
          const isSystem = m.isSystem;
          
          return (
            <div
              key={i}
              style={{
                ...styles.messageWrapper,
                justifyContent: isSystem ? "center" : isUser ? "flex-end" : "flex-start",
              }}
            >
              {!isUser && !isSystem && (
                <div style={styles.avatar}>{getInitials("Admin")}</div>
              )}
              <div
                style={{
                  ...styles.message,
                  backgroundColor: isSystem ? "#f8f9fa" : isUser ? "#007bff" : "#e5e5ea",
                  color: isSystem ? "#666" : isUser ? "white" : "black",
                  borderTopLeftRadius: isUser ? 12 : 0,
                  borderTopRightRadius: isUser ? 0 : 12,
                  fontStyle: isSystem ? "italic" : "normal",
                  border: isSystem ? "1px dashed #ccc" : "none",
                }}
              >
                <p style={{ margin: 0, padding: 6, wordBreak: "break-word" }}>
                  {m.message}
                </p>
                {!isSystem && (
                  <span style={styles.timestamp}>
                    {m.timestamp ? formatTime(m.timestamp) : ""}
                  </span>
                )}
              </div>
              {isUser && !isSystem && (
                <div style={styles.avatar}>{getInitials(user.username)}</div>
              )}
            </div>
          );
        })}
        {typing && !chatEnded && (
          <div style={{ marginLeft: 10, fontStyle: "italic", color: "#666" }}>
            Admin is typing...
          </div>
        )}
        {chatEnded && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666',
            padding: '10px',
            fontStyle: 'italic'
          }}>
            This chat has ended
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!chatEnded && (
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Type your message..."
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={chatEnded}
          />
          <button 
            onClick={sendMessage} 
            style={{
              ...styles.sendButton,
              opacity: chatEnded ? 0.5 : 1,
              cursor: chatEnded ? 'not-allowed' : 'pointer'
            }}
            disabled={chatEnded}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    border: "1px solid #ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  messagesContainer: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "8px",
  },
  messageWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },
  message: {
    maxWidth: "70%",
    padding: "8px 12px",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    position: "relative",
  },
  timestamp: {
    fontSize: 10,
    color: "rgba(0,0,0,0.4)",
    position: "absolute",
    bottom: 2,
    right: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "#666",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 14,
    userSelect: "none",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 20,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 20,
    padding: "10px 20px",
    fontWeight: "bold",
    fontSize: 16,
    transition: "background-color 0.2s ease",
  },
};

export default ChatBox;