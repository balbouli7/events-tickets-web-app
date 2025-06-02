import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../context.js/socketContext";
import ChatBox from "../chatComponents/chatBox";
import { AuthContext } from "../../context.js/authContext";

const AdminChatRoom = () => {
  const { roomId } = useParams(); // Extract roomId from URL
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!socket || !roomId) return;

    // Join the room when component mounts
    socket.emit("joinRoom", { room: roomId });

    return () => {
      // Leave the room when component unmounts
      socket.emit("leaveRoom", { room: roomId });
    };
  }, [socket, roomId]);

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <ChatBox room={roomId} /> {/* Reuse your ChatBox component */}
    </div>
  );
};

export default AdminChatRoom;