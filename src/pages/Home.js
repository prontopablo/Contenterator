import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import tttIcon from './tttIcon.png';
//import chessIcon from './chessIcon.jpg';
//import Countdown from './countdownIcon.jpg';

const Home = () => {
  const games = [
    {
      name: 'Tic Tac Toe',
      image: tttIcon,
    },
    {
      name: 'Chess',
      image: tttIcon,
    },
    {
      name: 'Countdown',
      image: tttIcon,
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
