const Marketplace = require('../models/marketplace.model');
const Stock = require('../models/stock.model');
const UserHistory = require('../models/userHistory.model');

// Place a buy or sell order
exports.placeOrder = async (req, res) => {
    const { stockId, quantity, price, type } = req.body;
    console.log('Data Received: ', req.body)
    const userId = req.user.id;

    try {
        // Fetch the stock from the database
        const stock = await Stock.findById(stockId);
        console.log('Stock: ', stock)
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        // Create a new order in the marketplace
        const order = new Marketplace({
            stock: stock._id,
            quantity: quantity,
            price: price,
            type: type,
            user: userId,
            status: 'notfilled' // Initially, the order is not filled
        });
        console.log('Order: ', order)
        await order.save();

        const transactions = await matchAndFulfillOrders(order, stock);
        console.log('transactions: ', transactions)

        if (transactions.length > 0) {
            const lastTransaction = transactions[transactions.length - 1];
            stock.currentPrice = lastTransaction.price;
            stock.priceHistory.push({ price: lastTransaction.price, date: new Date() }); 
            console.log('Current stock price: ', stock.currentPrice)
            await stock.save();
        }

        res.status(201).json({ message: `${type} order placed successfully`, order, transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to match and fulfill orders
const matchAndFulfillOrders = async (order, stock) => {
    const oppositeType = order.type === 'buy' ? 'sell' : 'buy';
    let remainingQuantity = order.quantity;
    let transactions = [];
    console.log('remQty: ', remainingQuantity)

    // Find matching orders
    const matchingOrders = await Marketplace.find({
        stock: stock._id,
        type: oppositeType,
        price: oppositeType === 'sell' ? { $lte: order.price } : { $gte: order.price },
        status: { $in: ['notfilled', 'partial'] } // Only match with not filled or partially filled orders
    }).sort({ price: oppositeType === 'sell' ? 1 : -1 }); // Sort to get the best price match first

    for (let match of matchingOrders) {
        if (remainingQuantity <= 0) break;

        const quantityToTrade = Math.min(remainingQuantity, match.quantity - match.quantitySold);

        // Update the matched order
        match.quantitySold += quantityToTrade;
        if (match.quantitySold === match.quantity) {
            match.status = 'completed';
        } else {
            match.status = 'partial';
        }
        await match.save();

        // Update the original order
        remainingQuantity -= quantityToTrade;
        order.quantitySold += quantityToTrade;
        console.log('remainingQuantity: ', remainingQuantity)
        console.log('quantitySold: ', order.quantitySold)
        if (remainingQuantity === 0) {
            order.status = 'completed';
        } else if (order.quantitySold > 0) {
            order.status = 'partial';
        }
        await order.save();

        // Record transaction in both users' histories
        await UserHistory.create([{
            user: order.user,
            stock: stock._id,
            action: order.type === 'buy' ? 'Bought' : 'Sold',
            price: match.price,
            quantity: quantityToTrade
        }, {
            user: match.user,
            stock: stock._id,
            action: match.type === 'buy' ? 'Bought' : 'Sold',
            price: match.price,
            quantity: quantityToTrade
        }]);

        transactions.push({
            buyer: order.type === 'buy' ? order.user : match.user,
            seller: order.type === 'sell' ? order.user : match.user,
            stock: stock._id,
            price: match.price,
            quantity: quantityToTrade,
        });
    }

    // Update the status of the original order after trying to match it
    if (remainingQuantity > 0 && order.quantitySold > 0) {
        order.status = 'partial';
    } else if (remainingQuantity === 0) {
        order.status = 'completed';
    }
    await order.save();

    return transactions;
};

// Get all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Marketplace.find({ user: userId }).populate('stock');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trading history for the logged-in user
exports.getUserHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const history = await UserHistory.find({ user: userId }).populate('stock');
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all open buy orders
exports.getOpenBuyOrders = async (req, res) => {
    try {
        const openBuyOrders = await Marketplace.find({ type: 'buy', fulfilled: false }).populate('stock');
        res.json(openBuyOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all open sell orders
exports.getOpenSellOrders = async (req, res) => {
    try {
        const openSellOrders = await Marketplace.find({ type: 'sell', fulfilled: false }).populate('stock');
        res.json(openSellOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
