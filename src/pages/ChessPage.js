import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { getGPTResponse } from '../GPTAPI';
import gptLogo from './gptIcon.png';

const ChessComponent = () => {
  const initialBoard = new Chess().fen();
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('w');
  const [gptResponse, setGptResponse] = useState('');

  const handleUserMove = async (sourceSquare, targetSquare) => {
    const game = new Chess(board);

    if (game.gameOver || currentPlayer !== 'w') return;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return;

    setBoard(game.fen());
    setCurrentPlayer('b');

    let validGPTMove = false;
    let retryCount = 0;
    let GPTMove;

    while (!validGPTMove && retryCount < 10) {
      const response = await getGPTResponse(game.fen(), 'chess');
      setGptResponse(response);
      GPTMove = response.trim();

      if (GPTMove) {
        try {
          game.move(GPTMove, { sloppy: true });
          validGPTMove = true;
        } catch (error) {
          console.error('Invalid move:', error.message);
        }
      }

      retryCount++;
    }

    if (validGPTMove) {
      setBoard(game.fen());
      setCurrentPlayer('w');
    } else {
      setGptResponse('GPT failed to make a valid move after 10 retries');
    }
  };

  return (
    <div>
      <Chessboard
        position={board}
        onDrop={({ sourceSquare, targetSquare }) => handleUserMove(sourceSquare, targetSquare)}
        dropOffBoard="trash"
        transitionDuration={300}
      />
      <div className="gpt-section">
        <img src={gptLogo} alt="GPT Logo" className="gpt-logo" />
        <div className="gpt-response">
          {gptResponse && <p>{gptResponse}</p>}
        </div>
      </div>
    </div>
    
  );
};

export default ChessComponent;
