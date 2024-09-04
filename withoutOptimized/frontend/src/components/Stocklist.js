import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../App.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import usePageLoadLatency from './hooks/usePageLoadLatency';


const socket = io('http://localhost:5000');

function Stocklist() {
    usePageLoadLatency();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('stockUpdate', (updatedStocks) => {
      setStocks(updatedStocks);
      setLoading(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to the stock updates.');
      setLoading(false);
    });

    return () => socket.off('stockUpdate');
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <h1 className="title">Current Stock Prices</h1>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id}>
            <td><Link to={`/stocks/${stock.symbol}`}>{stock.companyName}</Link></td>
              <td>{stock.symbol}</td>
              <td>${stock.currentPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stocklist;
