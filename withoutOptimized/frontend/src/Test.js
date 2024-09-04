import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to your backend server

function App() {
  const [stocks, setStocks] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch marketplace data for a selected stock
  useEffect(() => {
    if (selectedStock) {
      const fetchMarketplace = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/marketplaces?stock=${selectedStock}`);
          setMarketplaces(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching marketplace data:', error);
          setError('Failed to load marketplace data.');
          setLoading(false);
        }
      };

      fetchMarketplace();
    }
  }, [selectedStock]);

  // Fetch user history once on mount
  // useEffect(() => {
  //   const fetchUserHistory = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get('http://localhost:5000/api/history/66d77c3fe476041752bf6d49'); // Replace userId with actual user ID
  //       setUserHistory(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching user history:', error);
  //       setError('Failed to load user history.');
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserHistory();
  // }, []);

  // Listen for stock updates via WebSocket
  useEffect(() => {
    socket.on('stockUpdate', (updatedStocks) => {
      setStocks(updatedStocks);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to the stock updates.');
    });

    return () => socket.off('stockUpdate');
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Stock Market Simulation</h1>
      <div>
        <h2>Current Stock Prices</h2>
        <ul>
          {stocks.map((stock) => (
            <li key={stock._id} onClick={() => setSelectedStock(stock.symbol)}>
              {stock.companyName} ({stock.symbol}): ${stock.currentPrice.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {selectedStock && (
        <div>
          <h2>Marketplace for {selectedStock}</h2>
          <ul>
            {marketplaces.map((marketplace) => (
              <li key={marketplace._id}>
                {marketplace.type.toUpperCase()} - Quantity: {marketplace.quantity}, Price: ${marketplace.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* <div>
        <h2>User History</h2>
        <ul>
          {userHistory.map((history) => (
            <li key={history._id}>
              {history.action} {history.quantity} shares of {history.stock.symbol} at ${history.price.toFixed(2)} on {new Date(history.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default App;
