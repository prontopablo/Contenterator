import React, { useState, useEffect, useCallback } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import './Countdown.css';

const Countdown = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [solution, setSolution] = useState('');
  const [timer, setTimer] = useState(30);
  const [wordList, setWordList] = useState([]);
  const [score, setScore] = useState(0);

  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  const loadWordList = useCallback(() => {
    fetch('/words.txt')
      .then((response) => response.text())
      .then((text) => {
        const words = text.split(/\r?\n/);
        setWordList(words);
        console.log(words); // Console log the wordList array
      })
      .catch((error) => {
        console.error('Error reading the word list:', error);
      });
  }, []);

  useEffect(() => {
    loadWordList();
  }, [loadWordList]);

  const handleCheck = useCallback(() => {
    const selectedWord = selectedLetters.join('').toLowerCase();
    const isValidWord = wordList.some((word, index) => {
      if (word.toLowerCase() === selectedWord) {
        setScore(selectedWord.length);
        setSolution(`Word is valid, ${index + 1}/${wordList.length} alphabetically`);
        return true;
      }
      return false;
    });

    if (!isValidWord) {
      setSolution(`No valid word found, ${selectedWord} is not a word.`);
    }
  }, [selectedLetters, wordList]);

  useEffect(() => {
    if (letters.length === 9) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(interval);
        handleCheck();
      }

      return () => clearInterval(interval);
    }
  }, [letters, timer, handleCheck]);

  const handleGenerateLetter = (type) => {
    if (letters.length >= 9) {
      return;
    }

    const availableLetters = type === 'vowel' ? vowels : consonants;
    const newLetter = availableLetters.charAt(Math.floor(Math.random() * availableLetters.length));
    setLetters([...letters, newLetter]);
  };

  const handleSelectLetter = (letter) => {
    const letterIndex = letters.findIndex((l) => l === letter);
    if (letterIndex !== -1) {
      const updatedLetters = [...letters];
      updatedLetters.splice(letterIndex, 1);
      setSelectedLetters([...selectedLetters, letter]);
      setLetters(updatedLetters);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedLetters([]);
    setLetters([]);
  };

  return (
    <div className="container">
      <h1>Countdown</h1>
      <div className="clock-container">
        <Clock className="clock" value={new Date(0, 0, 0, 0, 0, timer)} size={200} renderNumbers={false} />
        <div className="timer">{timer}</div>
      </div>
      <div className="letters-section">
        {letters.map((letter, index) => (
          <p key={index}>{letter}</p>
        ))}
      </div>
      <div className="score-section">
        <p>{selectedLetters.join(' ')}</p> 
        <button onClick={handleCheck}>Check</button>
        <p>{solution}</p>
        <p>Score: {score}</p>
      </div>
      <button onClick={() => handleGenerateLetter('vowel')} disabled={letters.length >= 9}>
        Add Vowel
      </button>
      <button onClick={() => handleGenerateLetter('consonant')} disabled={letters.length >= 9}>
        Add Consonant
      </button>
      <button onClick={handleClearSelection}>Clear Selection</button>
      
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
