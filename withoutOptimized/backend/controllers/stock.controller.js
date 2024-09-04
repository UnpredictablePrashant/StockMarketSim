// controllers/stockController.js
const Stock = require('../models/stock.model');

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    console.log('Fetching stocks...')
    const stocks = await Stock.find({});
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific stock by symbol
exports.getStockBySymbol = async (req, res) => {
  const { symbol } = req.params;

  try {
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { newPrice } = req.body;
  
    try {
      const stock = await Stock.findById(id);
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
  
      stock.currentPrice = newPrice;
      stock.priceHistory.push({ price: newPrice });
      await stock.save();
  
      res.json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


exports.addStock = async (req, res) => {
    const { symbol, companyName, currentPrice } = req.body;
  
    try {
      // Check if stock already exists
      let stock = await Stock.findOne({ symbol });
      if (stock) {
        return res.status(400).json({ message: 'Stock already exists' });
      }
  
      // Create a new stock
      stock = new Stock({
        symbol,
        companyName,
        currentPrice,
        priceHistory: [{ price: currentPrice }]
      });
  
      await stock.save();
  
      res.status(201).json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };