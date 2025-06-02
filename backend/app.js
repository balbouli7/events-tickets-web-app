const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require("body-parser");
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const socketHandler = require('./controllers/chatSocket'); // 👈 Import socket handler

const app = express();
const server = http.createServer(app); // 👈 Create server for socket.io

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
socketHandler(io); // 👈 Use your WebSocket logic

// Middleware
connectDB();
app.use(cors({
  origin: "http://localhost:3000", // or your frontend URL
  credentials: true,
}));app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', chatRoutes);
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});
