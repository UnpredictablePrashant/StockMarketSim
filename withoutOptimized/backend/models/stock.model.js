// models/Stock.js
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [
    {
      price: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Stock', StockSchema);
