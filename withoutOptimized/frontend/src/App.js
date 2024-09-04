import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Stocklist from './components/Stocklist';
import StockDetails from './components/Stockdetails';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Stocklist />} />
        <Route path="/stocks/:symbol" element={<StockDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
