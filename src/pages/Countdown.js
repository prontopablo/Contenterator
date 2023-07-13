import React, { useState } from 'react';

const Countdown = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [solution, setSolution] = useState('');

  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  const handleGenerateLetter = (type) => {
    if (letters.length >= 9) {
      return; // Maximum number of letters reached, exit the function
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

  const handleSolve = () => {
    // Implement your logic to find the solution here
    // Assign the solution to the 'solution' state variable
  };

  return (
    <div>
      <h1>Countdown</h1>
      <p>Letters: {letters.join(' ')}</p>
      <p>Selected Letters: {selectedLetters.join(' ')}</p>
      <p>Solution: {solution}</p>
      <button onClick={() => handleGenerateLetter('vowel')} disabled={letters.length >= 9}>
        Add Vowel
      </button>
      <button onClick={() => handleGenerateLetter('consonant')} disabled={letters.length >= 9}>
        Add Consonant
      </button>
      <button onClick={handleClearSelection}>Clear Selection</button>
      <button onClick={handleSolve}>Solve</button>
      <div>
        {/* Render the letters as buttons */}
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
