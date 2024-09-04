// routes/marketplaceRoutes.js
const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplace.controller');

// POST /orders - Place a buy/sell order
router.post('/', marketplaceController.placeOrder);

// GET /orders - Get all orders
router.get('/', marketplaceController.getAllOrders);


module.exports = router;
