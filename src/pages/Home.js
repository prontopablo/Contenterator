import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import tttIcon from '../assets/tttIcon.png';
import chessIcon from '../assets/chessIcon.png';
import countdownIcon from '../assets/countdownIcon.png';

const Home = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gptApiKey') || ''); // Load API key from local storage
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const games = [
    {
      name: 'Tic Tac Toe',
      image: tttIcon,
    },
    {
      name: 'Chess',
      image: chessIcon,
    },
    {
      name: 'Countdown',
      image: countdownIcon,
    },
  ];

  const handleApiKeyUpdate = () => {
    // Save the API key to local storage
    localStorage.setItem('gptApiKey', apiKey);
    setIsApiKeyModalOpen(false); // Close the modal
  };

  return (
    <div>
      <div className="game-list">
        {games.map((game, index) => (
          <Link to={`/${game.name.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
            <div className="game-card">
              <img src={game.image} alt={game.name} />
            </div>
          </Link>
        ))}
      </div>
      <button onClick={() => setIsApiKeyModalOpen(true)}>Set API Key</button>
      {isApiKeyModalOpen && (
        <div className="api-key-modal">
          <div className="api-key-content">
            <h2>Enter Your GPT API Key</h2>
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button onClick={handleApiKeyUpdate}>Save</button>
            <button onClick={() => setIsApiKeyModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
