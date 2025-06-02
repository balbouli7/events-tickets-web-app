import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context.js/authContext";
import { SocketContext } from "../../context.js/socketContext";
import ChatBox from "./chatBox";

const UserChatRequest = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [status, setStatus] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);

  const requestChat = () => {
    if (socket && user && user.id) {
      socket.emit("userRequestChat", { userId: user.id });
      setStatus("Chat request sent! Waiting for admin...");
    } else {
      setStatus("Error: Unable to request chat");
    }
  };

  const endConversation = () => {
    if (!socket || !user || !activeRoom || !adminId) return;
    socket.emit("endConversation", { 
      room: activeRoom, 
      userId: user.id,
      adminId 
    });
    setActiveRoom(null);
    setStatus("You ended the conversation");
  };

  useEffect(() => {
    if (!socket) return;

    const handleChatAccepted = ({ room, adminId }) => {
      setStatus("Admin joined! Chat started.");
      setActiveRoom(room);
      setAdminId(adminId);
    };

    const handleConversationEnded = ({ room }) => {
      if (room === activeRoom) {
        setStatus("The admin has ended the conversation.");
        setActiveRoom(null);
        setAdminId(null);
      }
    };

    socket.on("userChatAccepted", handleChatAccepted);
    socket.on("conversationEnded", handleConversationEnded);

    return () => {
      socket.off("userChatAccepted", handleChatAccepted);
      socket.off("conversationEnded", handleConversationEnded);
    };
  }, [socket, activeRoom]);

  const toggleChat = () => setOpen((prev) => !prev);

  return (
    <>
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: open ? "#0056b3" : "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
          transition: "background-color 0.3s"
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        title={open ? "Close chat" : "Chat with admin"}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "450px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden"
          }}
        >
          <div style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ margin: 0 }}>Live Support</h3>
            <button 
              onClick={toggleChat}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            {!activeRoom ? (
              <div style={{ 
                padding: "20px", 
                display: "flex", 
                flexDirection: "column",
                height: "100%",
                justifyContent: "center"
              }}>
                <button
                  onClick={requestChat}
                  style={{
                    padding: "12px",
                    width: "100%",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginBottom: "10px"
                  }}
                >
                  Request Chat
                </button>
                <p style={{ 
                  textAlign: "center", 
                  color: "#666",
                  marginTop: "10px" 
                }}>
                  {status || "Click to start a chat with an admin"}
                </p>
              </div>
            ) : (
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                height: "100%"
              }}>
                <div style={{ 
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>Chatting with Admin</span>
                  <button 
                    onClick={endConversation}
                    style={{
                      padding: "4px 8px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    End Chat
                  </button>
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <ChatBox room={activeRoom} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserChatRequest;