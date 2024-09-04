// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

// GET /stocks - Get all stocks
router.get('/', stockController.getAllStocks);

// GET /stocks/:symbol - Get stock by symbol
router.get('/:symbol', stockController.getStockBySymbol);
router.post('/', stockController.addStock);
router.put('/:id', stockController.updateStock);

module.exports = router;

