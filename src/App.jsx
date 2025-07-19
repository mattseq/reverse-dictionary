import { useState, useEffect } from 'react'
import ReactCodeInput from 'react-code-input'
import { motion, spring } from 'framer-motion'
import './App.css'
import { getDailyWord } from './wordOfTheDay.jsx'
import { getDefinition } from './definition.jsx'

function App() {
  const [definition, setDefinition] = useState('');
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const loadWordAndDefinition = async () => {
      try {
        const dailyWord = await getDailyWord();  // wait for the word string
        setWord(dailyWord);

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

  return (
    <div className='app-container'>
      <motion.h1
        initial={{ opacity: 1, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: spring, stiffness: 100, bounce: 0.4, duration: 1 }}
      >
        Reverse Dictionary
      </motion.h1>
      
      {(definition == "No definition found.") ? (
        <p style={{display: "flex", flexDirection: 'column', gap: '20px'}}>
          <strong>No puzzle today! Go touch grass.</strong>
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
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <p><strong>Definition:</strong> {definition}</p>
          <p>Guess the word by typing it below:</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5, ease: 'easeInOut' }}
          >
            {word && word.length > 0 && (
              <ReactCodeInput
                className='code-input'
                type="text"
                fields={word.length}
                onChange={(value) => {
                  setGuess(value);
                  if (value.length === word.length) {
                    const normalized = value.trim().toLowerCase();
                    if (normalized === word.toLowerCase()) {
                      setResult("Correct!");
                    } else {
                      setResult("Try again.");
                    }
                  }
                }}
              />
            )}
            
          </motion.div>
          <p className='result'>{result}</p>
        </motion.div>
      )}
    </div>
  );
}

export default App
