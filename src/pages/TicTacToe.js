import React, { useState, useEffect, useCallback } from 'react';
import '../styles/TicTacToe.css';
import { getGPTResponse } from '../api/GPTAPI.js';
import gptLogo from '../assets/gptIcon.png';

const TicTacToe = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [gptResponse, setGPTResponse] = useState('');
  const [isGPTThinking, setIsGPTThinking] = useState(false);

  const checkWinner = useCallback(() => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes(null)) {
      return 'draw';
    }

    return null;
  }, [board]);

  const boardToGridText = useCallback(() => {
    let gridText = '';
    for (let i = 0; i < 9; i++) {
      if (i !== 0 && i % 3 === 0) {
        gridText += '\n-----------\n';
      }
      gridText += board[i] ? ` ${board[i]} ` : ` ${i + 1} `;
      if (i % 3 !== 2) gridText += '|';
    }
    return gridText;
  }, [board]);

  const makeGPTMove = useCallback(async () => {
    if (!gameOver && player === 'O') {
      const GPTInput = boardToGridText();
      const GPTResponse = await getGPTResponse(GPTInput, "tic-tac-toe");
      setGPTResponse(GPTResponse);
      const GPTMove = parseInt(GPTResponse.match(/\d+/), 10);

      if (!isNaN(GPTMove) && !board[GPTMove]) {
        const newBoard = [...board];
        newBoard[GPTMove] = player;
        setBoard(newBoard);
        setPlayer('X');
        setIsGPTThinking(false);
      } else {
        setIsGPTThinking(false);
      }
    }
  }, [board, gameOver, player, boardToGridText]);

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setGameOver(true);
      setGameResult(winner);
    } else {
      setGameOver(false);
      setGameResult(null);
      if (player === 'O' && !isGPTThinking) {
        setIsGPTThinking(true);
        makeGPTMove();
      }
    }
  }, [board, player, isGPTThinking, checkWinner, makeGPTMove]);

  const handleClick = async (index) => {
    if (!board[index] && !gameOver && player === 'X') {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setPlayer('O');
      setGPTResponse('');
    }
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setPlayer('X');
    setGameOver(false);
    setGameResult(null);
  };

  const renderCell = (index) => {
    return (
      <div className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </div>
    );
  };

  return (
    <div className="tic-tac-toe">
      <div className="board">
        {board.map((value, index) => renderCell(index))}
      </div>
      <div className="gpt-section">
        <img src={gptLogo} alt="GPT Logo" className="gpt-logo" />
          <div className="gpt-response">
            <p>{gptResponse}</p>
          </div>
      </div>
      {gameResult && (
        <div className="winner">
          {gameResult === 'draw' ? <p>It's a draw!</p> : <p>Winner: {gameResult}</p>}
          <button onClick={resetBoard}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
