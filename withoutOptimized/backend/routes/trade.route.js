// routes/trade.route.js
const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade.controller');
const authMiddleware = require('../middleware/auth');

// POST /trade/order - Place a buy/sell order
router.post('/order', authMiddleware, tradeController.placeOrder);

// GET /trade/orders - Get all orders for the logged-in user
router.get('/orders', authMiddleware, tradeController.getUserOrders);

// GET /trade/history - Get trading history for the logged-in user
router.get('/history', authMiddleware, tradeController.getUserHistory);

// GET /trade/open-buys - Get all open buy orders
router.get('/open-buys', authMiddleware, tradeController.getOpenBuyOrders);

// GET /trade/open-sells - Get all open sell orders
router.get('/open-sells', authMiddleware, tradeController.getOpenSellOrders);

module.exports = router;




