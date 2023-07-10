import React, { useState, useEffect } from 'react';
import './TicTacToe.css';
import { getGPTResponse } from '../GPTAPI.js';

const TicTacToe = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [gptResponse, setGPTResponse] = useState('');  
  const [isGPTThinking, setIsGPTThinking] = useState(false); // New state variable

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
  }, [board, player, isGPTThinking]);

  const checkWinner = () => {
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
  };

  const handleClick = async (index) => {
    if (!board[index] && !gameOver && player === 'X') {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setPlayer('O');
      setGPTResponse(''); // Clear GPT's response when user makes a move
    }
  };

  const boardToGridText = () => {
    let gridText = '';
    for (let i = 0; i < 9; i++) {
      if (i !== 0 && i % 3 === 0) {
        gridText += '\n-----------\n';
      }
      gridText += board[i] ? ` ${board[i]} ` : ` ${i + 1} `;
      if (i % 3 !== 2) gridText += '|';
    }
    return gridText;
  };

  const makeGPTMove = async () => {
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
      <h1>X's and O's</h1>
      <div className="board">
        {board.map((value, index) => renderCell(index))}
      </div>
      {gptResponse && (
        <div className="gpt-response">
          <p>GPT Response: {gptResponse}</p>
        </div>
      )}
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
