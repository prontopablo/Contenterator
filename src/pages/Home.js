import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const games = [
    {
      name: 'Tic Tac Toe',
      image: '../../tttIcon.png', // Replace with the path to the Tic Tac Toe image
    },
    {
      name: 'Chess',
      image: '../../KerwanMap.jpg', // Replace with the path to the Chess image
    },
    {
      name: 'Strategy Game',
      image: '../../KerwanMap.jpg', // Replace with the path to the Strategy Game image
    },
  ];

  return (
    <div>
      <h1>Welcome to Gamerator</h1>
      <div className="game-list">
        {games.map((game, index) => (
          <Link to={`/${game.name.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
            <div className="game-card">
              <img src={game.image} alt={game.name} />
              <h3>{game.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
