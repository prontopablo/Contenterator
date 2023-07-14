import React, { useState, useEffect, useCallback } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import './Countdown.css';

const Countdown = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [solution, setSolution] = useState('');
  const [timer, setTimer] = useState(30);

  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  const handleSolve = useCallback(() => {
    // Read the words.txt file
    fetch('../words.txt')
      .then(response => response.text())
      .then(wordList => {
        // Split the word list into an array of words
        const validWords = wordList.split('\n');
  
        // Check if the selected letters form a valid word
        const selectedWord = selectedLetters.join('').toLowerCase();
        const isValidWord = validWords.includes(selectedWord);
  
        if (isValidWord) {
          setSolution(selectedWord);
        } else {
          setSolution('No valid word found');
        }
      })
      .catch(error => {
        console.error('Error reading the word list:', error);
      });
  }, [selectedLetters]);

  useEffect(() => {
    if (letters.length === 9) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(interval);
        handleSolve();
      }

      return () => clearInterval(interval);
    }
  }, [letters, timer, handleSolve]);

  const handleGenerateLetter = (type) => {
    if (letters.length >= 9) {
      return;
    }

    const availableLetters = type === 'vowel' ? vowels : consonants;
    const newLetter = availableLetters.charAt(Math.floor(Math.random() * availableLetters.length));
    setLetters([...letters, newLetter]);
  };

  const handleSelectLetter = (letter) => {
    setSelectedLetters([...selectedLetters, letter]);
  };

  const handleClearSelection = () => {
    setSelectedLetters([]);
  };

  return (
    <div className="container">
      <h1>Countdown</h1>
      <div className="clock-container">
        <Clock
          className="clock"
          value={new Date(0, 0, 0, 0, 0, timer)} // Set the clock value based on the timer
          size={150}
          renderNumbers={true}
        />
        <div className="timer">{timer}</div> {/* Added timer display */}
      </div>
      <div className="letters-section">
        <p>{letters.join(' ')}</p>
        <p>Selected Letters: {selectedLetters.join(' ')}</p>
        <p>Solution: {solution}</p>
      </div>
      <button onClick={() => handleGenerateLetter('vowel')} disabled={letters.length >= 9}>
        Add Vowel
      </button>
      <button onClick={() => handleGenerateLetter('consonant')} disabled={letters.length >= 9}>
        Add Consonant
      </button>
      <button onClick={handleClearSelection}>Clear Selection</button>
      <button onClick={handleSolve}>Solve</button>
      <div>
        {letters.map((letter, index) => (
          <button key={index} onClick={() => handleSelectLetter(letter)}>
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
