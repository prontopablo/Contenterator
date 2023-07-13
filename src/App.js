import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import TicTacToe from './pages/TicTacToe';
import Chess from './pages/ChessPage';
import Countdown from './pages/Countdown';
import './App.css';

const App = () => {
  return ( 
    <Router>
      <div className="app">
        <header className="header">
          <Link to="/" className="home-button">
            <h1 className="header-title">Gamerator</h1>
          </Link>
        </header>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/chess" element={<Chess />} />
            <Route path="/Countdown" element={<Countdown />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
