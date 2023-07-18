import React, { useState, useEffect, useCallback } from 'react';
import Clock from 'react-clock';
import { getGPTResponse } from '../api/GPTAPI.js';
import 'react-clock/dist/Clock.css';
import '../styles/Countdown.css';
import gptLogo from '../assets/gptIcon.png';
import ClockCountdownSound from '../assets/ClockCountdown.mp3';



const Countdown = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [timer, setTimer] = useState(30);
  const [wordList, setWordList] = useState([]);
  const [score, setScore] = useState(0);
  const [roughWork, setRoughWork] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [isTimerPlaying, setIsTimerPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);


  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  const loadWordList = useCallback(() => {
    fetch('/words.txt')
      .then((response) => response.text())
      .then((text) => {
        const words = text.split(/\r?\n/);
        setWordList(words);
        console.log(words);
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
    console.log('Word to be checked:', selectedWord);

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
    } 
  }, [selectedLetters, wordList]);

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
      } else if (!isTimerPlaying) {
        setIsTimerPlaying(true);
        const audio = new Audio(ClockCountdownSound);
        audio.play();
      }
  
      return () => clearInterval(interval);
    }
  }, [letters, timer, handleCheck, isTimerPlaying]);

  const handleGenerateLetter = (type) => {
    if (letters.length >= 9 || (type === 'vowel' && countOccurrences(letters, vowels) >= 5) || (type === 'consonant' && countOccurrences(letters, consonants) >= 6)) {
      return;
    }
  
    const availableLetters = type === 'vowel' ? vowels : consonants;
    const newLetter = availableLetters.charAt(Math.floor(Math.random() * availableLetters.length));
    setLetters([...letters, newLetter]);
  };
  
  const countOccurrences = (arr, letters) => {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (letters.includes(arr[i])) {
        count++;
      }
    }
    return count;
  };

  const handleDragStart = (event, letter, index) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ letter, index }));
  };

  const handleDrop = (event, dropIndex) => {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const draggedLetter = data.letter;
    const draggedIndex = data.index;

    const updatedLetters = [...letters];
    updatedLetters.splice(draggedIndex, 1);
    updatedLetters.splice(dropIndex, 0, draggedLetter);
    setLetters(updatedLetters);
    setSelectedLetters(updatedLetters);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRoughWorkChange = (event) => {
    setRoughWork(event.target.value);
  };

  useEffect(() => {
    if (letters.length === 9 && timer === 0) {
      const fetchData = async () => {
        const response = await getGPTResponse(letters.join(''), 'countdown');
        console.log('GPT response:', response);
        setGptResponse(response);
      };

      fetchData();
    }
  }, [letters, timer]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="container">
      <div className="clock-container">
        <Clock
          className="clock"
          value={new Date(0, 0, 0, 0, 0, 30 - timer)}
          size={300}
          renderNumbers={false}
          secondHandLength={90}
          renderMinuteHand={false}
          renderMinuteMarks={false}
        />
      </div>
      <div className="letters-select">
        <button onClick={() => handleGenerateLetter('vowel')} disabled={letters.length >= 9 || countOccurrences(letters, vowels) >= 5}>
          Vowel
        </button>
        <button onClick={() => handleGenerateLetter('consonant')} disabled={letters.length >= 9 || countOccurrences(letters, consonants) >= 6}>
          Consonant
        </button>
      </div>
      <div className="letters-section" onDrop={handleDrop} onDragOver={handleDragOver}>
        {letters.map((letter, index) => (
          <p
            key={index}
            draggable
            onDragStart={(event) => handleDragStart(event, letter, index)}
            data-index={index}
          >
            {letter}
          </p>
        ))}
      </div>
      <div className="score-section">
        <button onClick={handleCheck}>Check</button>
        <p>Score: {score}</p>
      </div>      
      <div className="gpt-section">
        <img src={gptLogo} alt="GPT Logo" className="gpt-logo" />
        <div className="gpt-response">
          {gptResponse && <p>{gptResponse}</p>}
        </div>
      </div>
      <div className="info-button" onClick={toggleInfo}>
        ?
      </div>
      {showInfo && (
        <div className="info-popout">
          <p>
            Select vowels/consonants until you have 9 letters, then the clock will start.
            Drag and drop the letters to rearrange them. The letters are read from left to right to find the longest word you made.
            Try to beat GPT's word before the clock runs out!
          </p>
        </div>
      )}
        <textarea
        className="rough-work-textbox"
        placeholder="Rough work goes here..."
        value={roughWork}
        onChange={handleRoughWorkChange}
      />
    </div>
  );
};

export default Countdown;
