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
    console.log('Word to be checked:', selectedWord); // Console log the word being checked
  
    let validWords = [];
    let maxLength = 0;
  
    for (let i = 0; i < selectedLetters.length; i++) {
      const permutationIndices = getPermutationIndices(selectedLetters.length, i + 1);
      for (let indices of permutationIndices) {
        const word = indices.map((index) => selectedLetters[index]).join('').toLowerCase();
        if (wordList.includes(word)) {
          if (word.length > maxLength) {
            validWords = [word];
            maxLength = word.length;
          } else if (word.length === maxLength) {
            validWords.push(word);
          }
        }
      }
    }
  
    if (validWords.length > 0) {
      setScore(maxLength);
      const validWordCount = validWords.length;
      const validWordIndex = wordList.findIndex((word) => word.toLowerCase() === validWords[0]);
      setSolution(`Word is valid, ${validWordIndex + 1}/${wordList.length} alphabetically (${validWordCount} valid word${validWordCount > 1 ? 's' : ''} found)`);
    } else {
      setSolution(`No valid word found. "${selectedWord}" is not a word.`);
    }
  }, [selectedLetters, wordList]);
  
  // Helper function to generate permutation indices
  function getPermutationIndices(n, k) {
    const indices = Array.from({ length: k }, (_, i) => i);
    const result = [indices.slice()];
  
    while (true) {
      let i = k - 1;
      while (i >= 0 && indices[i] === n - k + i) {
        i--;
      }
      if (i < 0) {
        break;
      }
      indices[i]++;
      for (let j = i + 1; j < k; j++) {
        indices[j] = indices[j - 1] + 1;
      }
      result.push(indices.slice());
    }
  
    return result;
  }  
  
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

  const handleClearSelection = () => {
    setSelectedLetters([]);
    setLetters([]);
  };

  const handleDragStart = (event, letter) => {
    event.dataTransfer.setData('text/plain', letter);
  };

  const handleDrop = (event) => {
    const letter = event.dataTransfer.getData('text/plain');
    const letterIndex = letters.findIndex((l) => l === letter);
    if (letterIndex !== -1) {
      const updatedLetters = [...letters];
      updatedLetters.splice(letterIndex, 1);
      const dropIndex = event.target.getAttribute('data-index');
      updatedLetters.splice(dropIndex, 0, letter);
      setLetters(updatedLetters);
      setSelectedLetters(updatedLetters);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container">
      <div className="clock-container">
        <Clock className="clock" value={new Date(0, 0, 0, 0, 0, 30 - timer)} size={300} renderNumbers={false} />
        <div className="timer">{timer}</div>
      </div>
      <div
        className="letters-section"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {letters.map((letter, index) => (
          <p
            key={index}
            draggable
            onDragStart={(event) => handleDragStart(event, letter)}
            data-index={index}
          >
            {letter}
          </p>
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
    </div>
  );
};

export default Countdown;
