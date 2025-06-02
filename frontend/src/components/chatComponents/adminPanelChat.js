import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context.js/socketContext";
import { AuthContext } from "../../context.js/authContext";
import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "./chatBox";

const AdminChatPanel = () => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [open, setOpen] = useState(false);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      setActiveRoom(roomId);
      const userId = roomId.split('-')[1];
      setOpen(true);
      // Fetch user details if needed
    }
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    // Load initial pending requests if needed
    const loadInitialRequests = async () => {
      // You might want to fetch initial pending requests from your API
    };

    loadInitialRequests();

    const handleRequest = ({ userId, firstName, lastName }) => {
      setPendingRequests(prev => [...prev, { userId, firstName, lastName }]);
      setNewRequestCount(prev => prev + 1);
      
      if (document.hidden && Notification.permission === "granted") {
        new Notification("New Chat Request", {
          body: `${firstName} ${lastName} is requesting a chat`,
          icon: "/logo.png"
        });
      }
    };

    const handleChatAccepted = ({ room, userId, firstName, lastName }) => {
      setActiveRoom(room);
      setCurrentChatUser({ userId, firstName, lastName });
      setChatEnded(false);
      setLeaveMessage("");
      setOpen(true);
      setPendingRequests(prev => prev.filter(req => req.userId !== userId));
    };

    const handleUserLeft = (message) => {
      if (message.room === activeRoom) {
        setChatEnded(true);
        setLeaveMessage(message.message || "User has left the chat");
        
        // Add system message to chat
        socket.emit("sendMessage", {
          sender: "system",
          receiver: user.id,
          message: message.message || "User has left the chat",
          room: activeRoom,
          isSystem: true,
          timestamp: new Date().toISOString()
        });
      }
    };

    const handleSystemMessage = (message) => {
      if (message.room === activeRoom && message.isSystem) {
        setChatEnded(true);
        setLeaveMessage(message.message);
      }
    };

    socket.on("adminReceiveRequest", handleRequest);
    socket.on("chatAccepted", handleChatAccepted);
    socket.on("userLeft", handleUserLeft);
    socket.on("receiveMessage", handleSystemMessage);

    // Request notification permission if not already granted
    if (Notification.permission !== "granted") {
      Notification.requestPermission().catch(err => {
        console.error("Notification permission error:", err);
      });
    }

    return () => {
      socket.off("adminReceiveRequest", handleRequest);
      socket.off("chatAccepted", handleChatAccepted);
      socket.off("userLeft", handleUserLeft);
      socket.off("receiveMessage", handleSystemMessage);
    };
  }, [socket, navigate, activeRoom, roomId, user?.id]);

  const acceptChat = (userId) => {
    if (!socket || !user?.id) return;
    socket.emit("adminAcceptChat", { 
      adminId: user.id, 
      userId 
    });
    setNewRequestCount(0);
    setPendingRequests(prev => prev.filter(req => req.userId !== userId));
  };

  const confirmEndConversation = () => {
    setShowEndConfirmation(true);
  };

  const handleCancelEnd = () => {
    setShowEndConfirmation(false);
  };

  const endConversation = () => {
    if (!socket || !user?.id || !activeRoom || !currentChatUser?.userId) return;
    
    socket.emit("endConversation", { 
      room: activeRoom, 
      userId: currentChatUser.userId,
      adminId: user.id,
      message: "Admin has ended the chat"
    });
    
    setShowEndConfirmation(false);
    setChatEnded(true);
    setLeaveMessage("You have ended the chat");
  };

  const handleBackToChat = () => {
    setChatEnded(false);
    setOpen(false);
    setActiveRoom(null);
    setCurrentChatUser(null);
  };

  const toggleChat = () => {
    setOpen(prev => !prev);
    if (open === false && newRequestCount > 0) {
      setNewRequestCount(0);
    }
  };

  return (
    <>
      {/* Floating chat icon with notification badge */}
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
          transition: "background-color 0.3s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        title={open ? "Close chat" : "Chat requests"}
      >
        💬
        {newRequestCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {newRequestCount}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
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
            <h3 style={{ margin: 0 }}>Admin Chat</h3>
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
            {chatEnded ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                  {leaveMessage || 
                    (currentChatUser ? 
                      `${currentChatUser.firstName} has left the chat` : 
                      "The chat has ended")}
                </p>
                <button
                  onClick={handleBackToChat}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close Chat
                </button>
              </div>
            ) : activeRoom ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #ddd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    {currentChatUser ? 
                      `Chat with ${currentChatUser.firstName} ${currentChatUser.lastName}` : 
                      "Chat with User"}
                  </span>
                  <button 
                    onClick={confirmEndConversation}
                    style={{
                      padding: '4px 8px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    End Chat
                  </button>
                </div>
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <ChatBox room={activeRoom} />
                </div>

                {showEndConfirmation && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <p style={{ marginBottom: '10px' }}>Are you sure you want to end this chat?</p>
                    <div>
                      <button
                        onClick={endConversation}
                        style={{
                          padding: '6px 12px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        End Chat
                      </button>
                      <button
                        onClick={handleCancelEnd}
                        style={{
                          padding: '6px 12px',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '10px', height: '100%' }}>
                <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>
                  Pending Chat Requests
                </h4>
                {pendingRequests.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>
                    No pending requests
                  </p>
                ) : (
                  <div style={{ 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    paddingRight: '5px'
                  }}>
                    {pendingRequests.map((request, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        borderBottom: '1px solid #eee',
                        marginBottom: '5px'
                      }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {request.firstName} {request.lastName}
                          </span>
                        </div>
                        <button 
                          onClick={() => acceptChat(request.userId)}
                          style={{
                            padding: '6px 12px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Accept
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminChatPanel;