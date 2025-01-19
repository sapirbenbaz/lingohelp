import { useState } from 'react';
import LanguageDropdown from './components/LanguageDropdown';
import WordForm from './components/WordForm';
import WordsTable from './components/WordsTable';
import { deleteWord, getTodaysWordsOfLanguage, submitWord, updateWord } from './services/api';
import { Word } from '../../shared/interfaces/Word';
import Loader from './components/Loader';

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    setLoading(true); 
    try {
      const todayWords = await getTodaysWordsOfLanguage(language);
      setWords(todayWords);
    } catch (error) {
      console.error('Failed to fetch words:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleWordSubmit = async (word: string, context: string) => {
    if (words.some((wordInList) => wordInList.word.toLowerCase() === word.toLowerCase() && wordInList.context.toLowerCase() === context.toLowerCase())) {
      alert('Word already exists');
      return;
    }

    setLoading(true); 
    try {
      const newWord = await submitWord({word: word, context: context, languageId: selectedLanguage})
      setWords((prev) => [...prev, newWord]);
    } catch (error) {
      console.error('Failed to add word:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleWordModify = async (updatedWord: Word) => {
    setLoading(true); 
    try {
      const savedWord = await updateWord(updatedWord);
      setWords((prevWords) =>
        prevWords.map((word) =>
          word.id === savedWord.id ? savedWord : word
        )
      );
    } catch (error) {
      console.error('Failed to update word:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleWordDelete = async (wordId: string) => {
    setLoading(true); 
    try {
      await deleteWord(wordId);
      setWords((prevWords) => prevWords.filter((word) => word.id !== wordId));
    } catch (error) {
      console.error('Failed to delete word:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <h1>Language Learning</h1>
      {loading && <Loader />}
      <LanguageDropdown onSelect={handleLanguageSelect} />
      {selectedLanguage && (
        <>
          <WordForm onSubmit={handleWordSubmit} />
          <WordsTable
            words={words}
            onDelete={handleWordDelete}
            onModify={handleWordModify}
          />
        </>
      )}
    </div>
  );
};

export default App;