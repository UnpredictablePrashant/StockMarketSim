const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const stockRoutes = require('./routes/stock.route');
const userRoutes = require('./routes/user.route');
const marketplaceRoutes = require('./routes/marketplace.route');
const userHistoryRoutes = require('./routes/userHistory.route');
const tradeRoutes = require('./routes/trade.route');
const Stock = require('./models/stock.model');
const authMiddleware = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stock-simulation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Periodically emit stock updates
setInterval(async () => {
  try {
    const stocks = await Stock.find({});
    // console.log('Stocks value: ', stocks)
    io.emit('stockUpdate', stocks);
  } catch (error) {
    console.error('Error fetching stocks for WebSocket update:', error.message);
  }
}, 1000);

// Use Routes with specific prefixes
app.use('/api/stocks', stockRoutes); // Stock-related routes
app.use('/api/marketplaces', marketplaceRoutes); // Marketplace-related routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/history', userHistoryRoutes); // User history-related routes
app.use('/api/trade', tradeRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
