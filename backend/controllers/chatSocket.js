const Chat = require("../models/chat");
const User = require("../models/user");

const socketHandler = (io) => {
  const connectedAdmins = new Map(); // adminId -> socketId
  const pendingRequests = new Map(); // userId -> socketId
  const activeChats = new Map(); // room -> {userId, adminId}

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Admin joins adminRoom to receive notifications
    socket.on("joinAdminRoom", () => {
      socket.join("adminRoom");
      console.log(`Admin joined adminRoom`);
    });

    // Register admin
    socket.on("registerAdmin", (adminId) => {
      connectedAdmins.set(adminId, socket.id);
      socket.join("adminRoom");
      console.log(`Admin ${adminId} registered and joined adminRoom`);
    });

    // User requests chat
    socket.on("userRequestChat", async ({ userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          console.error(`User ${userId} not found`);
          return;
        }
        
        pendingRequests.set(userId, socket.id);
        io.to("adminRoom").emit("adminReceiveRequest", { 
          userId,
          firstName: user.firstName,
          lastName: user.lastName
        });
        console.log(`Request from ${user.firstName} ${user.lastName} forwarded to adminRoom`);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    });

    // Admin accepts chat
    socket.on("adminAcceptChat", async ({ adminId, userId }) => {
      if (!adminId || !userId) {
        console.error("❌ adminAcceptChat: Missing adminId or userId");
        return;
      }

      const userSocketId = pendingRequests.get(userId);
      if (!userSocketId) {
        console.error(`❌ No pending request found for user ${userId}`);
        return;
      }

      try {
        const user = await User.findById(userId);
        if (!user) {
          console.error(`User ${userId} not found`);
          return;
        }

        const room = `chat-${userId}-${adminId}`;
        activeChats.set(room, { userId, adminId });

        // Join both sockets to the same room
        socket.join(room);
        io.to(userSocketId).socketsJoin(room);

        // Remove from pending requests
        pendingRequests.delete(userId);

        // Notify both parties
        io.to(userSocketId).emit("userChatAccepted", { room, adminId });
        socket.emit("chatAccepted", { 
          room, 
          userId,
          firstName: user.firstName,
          lastName: user.lastName
        });

        console.log(`✅ Chat room ${room} created with ${user.firstName} ${user.lastName}`);
      } catch (err) {
        console.error("Error in adminAcceptChat:", err);
      }
    });

    // End conversation
// In the endConversation handler
socket.on("endConversation", async ({ room, userId, adminId }) => {
  try {
    if (!room) {
      console.error("❌ endConversation: Missing room");
      return;
    }

    const chatData = activeChats.get(room);
    if (!chatData) {
      console.error(`❌ No active chat found for room ${room}`);
      return;
    }

    // Get user details for system message
    const user = await User.findById(chatData.userId);
    const systemMessage = {
      sender: "system",
      message: adminId ? 
        "You have ended the chat with the user" : 
        `${user.firstName} ${user.lastName} has left the chat`,
      room,
      timestamp: new Date(),
      isSystem: true
    };

    // Save system message
    const newChat = new Chat(systemMessage);
    await newChat.save();

    // Send system message to room
    io.to(room).emit("receiveMessage", systemMessage);
    io.to(room).emit("userLeft", systemMessage); // Make sure this is emitted

    // Mark conversation as closed
    await Chat.updateMany(
      { room },
      { $set: { status: "closed", closedAt: new Date() } }
    );

    // Clean up
    activeChats.delete(room);
    pendingRequests.delete(chatData.userId);

    console.log(`🚪 Conversation in room ${room} ended`);
  } catch (err) {
    console.error("Error ending conversation:", err);
  }
});

// In the disconnect handler
socket.on("disconnect", async () => {
  console.log(`❎ Disconnected: ${socket.id}`);
  
  // Check if this was a user socket
  for (const [userId, userSocketId] of pendingRequests.entries()) {
    if (socket.id === userSocketId) {
      pendingRequests.delete(userId);
      break;
    }
  }

  // Check active chats
  for (const [room, chatData] of activeChats.entries()) {
    if (socket.id === pendingRequests.get(chatData.userId) || 
        socket.id === connectedAdmins.get(chatData.adminId)) {
      
      const user = await User.findById(chatData.userId);
      const systemMessage = {
        sender: "system",
        message: user ? 
          `${user.firstName} ${user.lastName} has disconnected` : 
          "User has disconnected",
        room,
        timestamp: new Date(),
        isSystem: true
      };

      await new Chat(systemMessage).save();
      io.to(room).emit("receiveMessage", systemMessage);
      io.to(room).emit("userLeft", systemMessage);
      
      activeChats.delete(room);
      break;
    }
  }
});

    // Handle joining/leaving rooms
    socket.on("joinRoom", ({ room }) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("leaveRoom", ({ room }) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    // Handle messages
    socket.on("sendMessage", async ({ sender, receiver, message, room }) => {
      try {
        if (!sender || !receiver || !message || !room) {
          throw new Error("Missing required message fields");
        }

        const newChat = new Chat({
          sender,
          receiver,
          message,
          room,
          timestamp: new Date(),
          status: "active"
        });
        await newChat.save();

        io.to(room).emit("receiveMessage", {
          _id: newChat._id,
          sender,
          message,
          timestamp: newChat.timestamp,
          room,
        });

        if (sender !== "admin") {
          io.to("adminRoom").emit("newMessageNotification", {
            from: sender,
            message,
            timestamp: newChat.timestamp,
            room,
          });
        }
      } catch (err) {
        console.error("❌ Message save failed:", err.message);
      }
    });
  });
};

module.exports = socketHandler;