const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true }, // Buy or Sell order
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['completed', 'notfilled', 'partial'], default: 'notfilled' }, // New status field
  quantitySold: { type: Number, default: 0 }, // New field to track quantity sold for partial orders
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
