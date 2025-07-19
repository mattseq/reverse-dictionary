const WORD_LIST_URL = 'https://raw.githubusercontent.com/first20hours/google-10000-english/refs/heads/master/google-10000-english-usa-no-swears-medium.txt';

const fetchWordList = async () => {
    try {
      const res = await fetch(WORD_LIST_URL);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await res.text();
      
      const words = text
      .split('\n')
      .map(word => word.trim().toLowerCase())
      .filter(word =>
        word.length >= 4 && word.length <= 8 && /^[a-z]+$/.test(word)
      );

      return words;

    } catch (error) {
      console.error('Failed to fetch word list:', error);
      return [];
    }
};


// Deterministic index based on date
function getTodayIndex(wordCount) {
  const today = new Date();
  // Use UTC date to avoid time zone differences
  const utcYear = today.getUTCFullYear();
  const utcMonth = today.getUTCMonth(); // 0-indexed
  const utcDate = today.getUTCDate();

  // Create a number that's consistent per UTC day
  const dateSeed = new Date(Date.UTC(utcYear, utcMonth, utcDate)).getTime();

  // Hash it into an index
  return dateSeed % wordCount;
}

export const getDailyWord = async () => {
    const wordList = await fetchWordList();
    const index = getTodayIndex(wordList.length);
    console.log(`Today's word: ${wordList[index]}`); // Debugging line
    return wordList[index];
};