import { useState, useEffect } from 'react'
import ReactCodeInput from 'react-code-input'
import { color, motion, spring } from 'framer-motion'
import confetti from 'canvas-confetti';
import './App.css'
import { getDailyWord } from './wordOfTheDay.jsx'
import { getDefinition } from './definition.jsx'

function App() {

  const [definition, setDefinition] = useState('');
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [resultClass, setResultClass] = useState('');

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadWordAndDefinition = async () => {
      try {
        const dailyWord = await getDailyWord();  // wait for the word string
        setWord(dailyWord);
        setStartTime(Date.now())

        const def = await getDefinition(dailyWord);
        setDefinition(def);
        console.log(`Loaded word: ${dailyWord}, Definition: ${def}`); // Debugging line
      } catch (err) {
        setDefinition("Couldn't load definition.");
        console.error(err);
      }
    };

    loadWordAndDefinition();
  }, []);

  function guessedCorrect() {
    const end = Date.now();
    setEndTime(end);
    const seconds = (end-startTime) / 1000;
    setTimeTaken(seconds);

    setResult(`Correct! You solved it in ${seconds} seconds.`);
    setResultClass('correct');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // streak
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    const lastPlayed = localStorage.getItem('lastPlayed');
    const storedStreak = parseInt(localStorage.getItem('streak')) || 0;

    let newStreak = 1; // default if no streak yet

    if (lastPlayed === yesterday) {
      newStreak = storedStreak + 1; // continue streak
    } else if (lastPlayed === today) {
      newStreak = storedStreak; // already played today
    } else {
      newStreak = 1; // reset streak
    }

    localStorage.setItem('lastPlayed', today);
    localStorage.setItem('streak', newStreak.toString());
    setStreak(newStreak);
  }

  function guessedWrong() {
    setResult("Try again.");
      setResultClass('wrong');
      setTimeout(() => setResultClass(''), 400)
  }

  return (
    <div className='app-container'>

      <motion.h1
        initial={{ opacity: 1, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: spring, stiffness: 100, bounce: 0.4, duration: 1 }}
      >
        Reverse Dictionary
      </motion.h1>

      <motion.div
        className='extras'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ transition: 0.5, delay: 1 }}
      >
        <p className="date-label" >Puzzle for {new Date().toLocaleDateString()}</p>
        <p>Current streak: {streak} day{streak === 1 ? '' : 's'}</p>
      </motion.div>
      
      {(definition == "No definition found.") ? (
        <p style={{display: "flex", flexDirection: 'column', gap: '20px'}}>
          <strong>No puzzle today! Go touch grass!</strong>
          <motion.img 
            className="grass-gif" 
            src="https://tenor.com/view/grass-gif-12587352171248068863.gif"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1, delay: 1}}
          />
        </p>
        
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1, x: -100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          style={{
            textAlign: "center"
          }}
        >
          <p><strong>Definition:</strong> {definition}</p>
          <p>Guess the word by typing it below:</p>
          <motion.div
            animate={resultClass === 'wrong' ? {x: [-10, 10, -8, 8, -5, 5, 0]} : {}}
            transition={{ duration: 0.4 }}
          >
            {word && word.length > 0 && (
              <ReactCodeInput
                className='code-input'
                type="text"
                fields={word.length}
                autoFocus
                onChange={(value) => {
                  setGuess(value);
                  if (value.length === word.length) {
                    const normalized = value.trim().toLowerCase();
                    if (normalized === word.toLowerCase()) {
                      guessedCorrect();
                    } else {
                      guessedWrong();
                    }
                  }
                }}
              />
            )}
            
          </motion.div>
          <p className='result'>{result}</p>
          {timeTaken !== null && (
            <motion.button
              onClick={() => {
                const scoreText = `I solved the Reverse Dictionary puzzle in ${timeTaken} seconds! Can you beat me?`;
                navigator.clipboard.writeText(scoreText);
                alert('Score copied to clipboard!');
              }}
              className="copy-score-button"

              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: spring, stiffness: 300, bounce: 0.5, duration: 0.5}}
            >
              Copy Your Score
            </motion.button>
          )}

        </motion.div>
      )}
    </div>
  );
}

export default App
