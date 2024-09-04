// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST /register - Register a new user
router.post('/register', userController.registerUser);

// POST /login - Authenticate user (optional)
router.post('/login', userController.loginUser);

// GET /user/:id - Get user details (optional)
router.get('/user/:id', userController.getUser);

module.exports = router;
