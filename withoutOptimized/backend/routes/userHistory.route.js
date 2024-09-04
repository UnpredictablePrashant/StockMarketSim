// routes/userHistoryRoutes.js
const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/userHistory.controller');

// GET /history/:userId - Get user history
router.get('/history/:userId', userHistoryController.getUserHistory);

module.exports = router;
