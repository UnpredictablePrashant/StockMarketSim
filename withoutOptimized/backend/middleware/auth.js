
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Token obtained: ',token)
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'yourSecretKey'); // Replace with your JWT secret
        console.log('Decoded: ',decoded)
        req.user = await User.findById(decoded.userId);
        console.log('User: ', req.user)
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
