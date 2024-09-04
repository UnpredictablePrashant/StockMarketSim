// models/UserHistory.js
const mongoose = require('mongoose');

const UserHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  action: { type: String, required: true },
  price: { type: Number, required: true }, 
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserHistory', UserHistorySchema);
