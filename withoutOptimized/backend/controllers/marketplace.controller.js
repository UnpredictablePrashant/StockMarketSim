// controllers/marketplaceController.js
const Marketplace = require('../models/marketplace.model');
const Stock = require('../models/stock.model');
const UserHistory = require('../models/userHistory.model');
const stockController = require('./stock.controller');

// Place a buy or sell order
exports.placeOrder = async (req, res) => {
  const { stockId, quantity, price, type, userId } = req.body;

  try {
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Create a new order in the marketplace
    const order = new Marketplace({ stock: stockId, quantity, price, type, user: userId });
    await order.save();

    // Record the transaction in the user's history
    const history = new UserHistory({
      user: userId,
      stock: stockId,
      action: type === 'buy' ? 'Bought' : 'Sold',
      price,
      quantity
    });
    await history.save();

    // Update stock price based on the last transaction
    await stockController.updateStockPrice(stockId, price);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders, or filter by stock symbol
exports.getAllOrders = async (req, res) => {
    
    const { stock } = req.query;
    console.log('Getting the orders: ', stock)
    try {
      let orders;
  
      if (stock) {
        const stockDoc = await Stock.findOne({ symbol: stock });
        console.log('stockDoc: ',stockDoc)
        if (!stockDoc) {
          return res.status(404).json({ message: 'Stock not found' });
        }
        orders = await Marketplace.find({ stock: stockDoc._id }).populate('stock');
        console.log('if orders: ',orders)
      } else {
        orders = await Marketplace.find({}).populate('stock');
        console.log('else orders: ',orders)
      }
  
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// exports.getMarketplacesByStock = async (req, res) => {
//     const { stock } = req.query;
  
//     try {
//       let marketplaces;
  
//       if (stock) {
//         const stockDoc = await Stock.findOne({ symbol: stock });
//         if (!stockDoc) {
//           return res.status(404).json({ message: 'Stock not found' });
//         }
//         marketplaces = await Marketplace.find({ stock: stockDoc._id }).populate('stock');
//       } else {
//         marketplaces = await Marketplace.find({}).populate('stock');
//       }
  
//       res.json(marketplaces);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };