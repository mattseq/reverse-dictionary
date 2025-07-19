function getBestDefinition(data) {
  if (!Array.isArray(data)) return "No definition found.";

  // Try noun, then verb, then any meaning
  const priorityPOS = ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection"];

  for (const pos of priorityPOS) {
    for (const entry of data) {
      if (!entry.meanings) continue;
      for (const meaning of entry.meanings) {
        if (meaning.partOfSpeech === pos && meaning.definitions && meaning.definitions.length > 0) {
          return meaning.definitions[0].definition;
        }
      }
    }
  }

  // Fallback: return first available definition
  for (const entry of data) {
    if (!entry.meanings) continue;
    for (const meaning of entry.meanings) {
      if (meaning.definitions && meaning.definitions.length > 0) {
        return meaning.definitions[0].definition;
      }
    }
  }

  return "No definition found.";
}

export const getDefinition = async (word) => {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();

      const def = getBestDefinition(data);
      
      console.log(`Definition for ${word}:`, data); // Debugging line
      return def;
    } catch (err) {
        return "No definition found.";
        console.error(err);
    }
};