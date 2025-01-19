import React, { useState } from 'react';

const WordForm = ({ onSubmit }: { onSubmit: (word: string, context: string) => void }) => {
  const [word, setWord] = useState('');
  const [context, setContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(word.trim(), context.trim());
    setWord('');
    setContext('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Word"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Context (optional)"
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default WordForm;