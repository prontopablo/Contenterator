import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import tttIcon from '../assets/tttIcon.png';
import chessIcon from '../assets/chessIcon.png';
import countdownIcon from '../assets/countdownIcon.png';

const Home = () => {
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
    </div>
  );
};

export default Home;
