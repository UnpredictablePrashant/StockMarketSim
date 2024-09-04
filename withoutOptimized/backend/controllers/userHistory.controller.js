// controllers/userHistoryController.js
const UserHistory = require('../models/userHistory.model');

// Get history of a specific user
exports.getUserHistory = async (req, res) => {
  try {
    const history = await UserHistory.find({ user: req.params.userId }).sort({ timestamp: -1 });
    if (!history.length) {
      return res.status(404).json({ message: 'No history found for this user' });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
