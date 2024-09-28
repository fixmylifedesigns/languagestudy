import React, { useState, useEffect } from "react";
import phrases from "../data/englishPhrases.json";

const PracticePhraseSelector = ({ onPhraseSelected }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  useEffect(() => {
    if (selectedPhrase) {
      onPhraseSelected(selectedPhrase);
    }
  }, [selectedPhrase, onPhraseSelected]);

  const handlePhraseChange = (e) => {
    const phraseId = parseInt(e.target.value);
    const phrase = phrases.phrases.find((p) => p.id === phraseId);
    setSelectedPhrase(phrase);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="phraseSelect"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Practice Phrase
      </label>
      <select
        id="phraseSelect"
        onChange={handlePhraseChange}
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a phrase to practice</option>
        {phrases.phrases.map((phrase) => (
          <option key={phrase.id} value={phrase.id}>
            {phrase.phrase}
          </option>
        ))}
      </select>
      {selectedPhrase && (
        <p className="mt-2 text-sm text-gray-400">
          Translation: {selectedPhrase.translation}
        </p>
      )}
    </div>
  );
};

export default PracticePhraseSelector;
