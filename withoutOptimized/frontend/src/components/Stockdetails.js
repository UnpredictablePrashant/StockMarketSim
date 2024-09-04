import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function StockDetails() {
  const { symbol } = useParams(); // Get the stock symbol from the URL
  const [stock, setStock] = useState(null);
  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?symbol=${symbol}`);
        setStock(response.data);
      } catch (error) {
        console.error('Error fetching stock details:', error);
      }
    };

    const fetchBuyOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/trade/open-buys?symbol=${symbol}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBuyOrders(response.data);
      } catch (error) {
        console.error('Error fetching buy orders:', error);
      }
    };

    const fetchSellOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/trade/open-sells?symbol=${symbol}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSellOrders(response.data);
      } catch (error) {
        console.error('Error fetching sell orders:', error);
      }
    };

    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/trade/history?symbol=${symbol}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrderHistory(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchStockDetails();
    fetchBuyOrders();
    fetchSellOrders();
    fetchOrderHistory();
  }, [symbol]);

  return (
    <div>
      {stock && (
        <>
          <h1>{stock.companyName} ({stock.symbol})</h1>
          <h2>Current Price: ${stock.currentPrice}</h2>

          <div>
            <h3>Buy Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {buyOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.quantity}</td>
                    <td>${order.price.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Sell Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sellOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.quantity}</td>
                    <td>${order.price.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Order History</h3>
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((history) => (
                  <tr key={history._id}>
                    <td>{history.action}</td>
                    <td>{history.quantity}</td>
                    <td>${history.price.toFixed(2)}</td>
                    <td>{new Date(history.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default StockDetails;
