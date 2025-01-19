import React, { useState } from 'react';
import { Word } from '../../../shared/interfaces/Word';
import './WordsTable.css';

const WordsTable = ({
  words,
  onDelete,
  onModify,
}: {
  words: Word[];
  onDelete: (wordId: string) => void;
  onModify: (updatedWord: Word) => void; // Update word in parent state
}) => {
  const [editingWordId, setEditingWordId] = useState<string | null>(null); // Track which row is being edited
  const [editValues, setEditValues] = useState<{ word: string; context: string }>({
    word: '',
    context: '',
  });

  const handleEditClick = (word: Word) => {
    setEditingWordId(word.id); // Set the word being edited
    setEditValues({ word: word.word, context: word.context ? word.context : '' }); // Pre-fill the input fields with current values
  };
  const handleSaveClick = (word: Word) => {
    const updatedWord = { ...word, ...editValues }; 
    onModify(updatedWord); 
    setEditingWordId(null); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="table-container">
    <table className="words-table">
      <thead>
        <tr>
          <th>Word</th>
          <th>Context</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {words.map((word) => (
          <tr key={word.id}>
            <td>
              {editingWordId === word.id ? (
                <input
                  type="text"
                  name="word"
                  value={editValues.word}
                  onChange={handleInputChange}
                />
              ) : (
                word.word
              )}
            </td>
            <td>
              {editingWordId === word.id ? (
                <input
                  type="text"
                  name="context"
                  value={editValues.context}
                  onChange={handleInputChange}
                />
              ) : (
                word.context
              )}
            </td>
            <td className="actions-column">
              <div className="action-buttons">
                {editingWordId === word.id ? (
                  <button onClick={() => handleSaveClick(word)}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(word)}>Modify</button>
                )}
              <button onClick={() => onDelete(word.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default WordsTable;