// controllers/chatSocket.js
const Chat = require('../models/chat'); // Make sure this exists

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`📦 Joined room: ${room}`);
    });

    socket.on('sendMessage', async ({ sender, receiver, message, room }) => {
      try {
        const newChat = new Chat({ sender, receiver, message });
        await newChat.save();

        io.to(room).emit('receiveMessage', {
          sender,
          message,
          timestamp: newChat.timestamp
        });
      } catch (err) {
        console.error('❌ Chat save failed:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❎ Disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
