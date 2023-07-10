import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { getGPTResponse } from '../GPTAPI';

const ChessComponent = () => {
  const initialBoard = new Chess().fen();
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('w'); // 'w' for white, 'b' for black

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

    // Get GPT's move
    const GPTResponse = await getGPTResponse(game.fen(), 'chess');
    const GPTMove = GPTResponse.trim(); // Remove leading/trailing whitespace

    if (GPTMove) {
      const GPTMoveSAN = game.move(GPTMove, { sloppy: true });
      setBoard(game.fen());
      setCurrentPlayer('w');
    }
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setCurrentPlayer('w');
  };

  return (
    <div>
      <Chessboard
        position={board}
        onDrop={({ sourceSquare, targetSquare }) => handleUserMove(sourceSquare, targetSquare)}
        dropOffBoard="trash"
        transitionDuration={300}
      />
    </div>
  );
};

export default ChessComponent;
