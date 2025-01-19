import React, { useState, useEffect } from 'react';
import { Language } from '../../../shared/interfaces/Language'
import { getLanguages } from '../services/api';
import Loader from './Loader';

const LanguageDropdown = ({
  onSelect,
}: {
  onSelect: (languageId: string) => void;
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    getLanguages().then((responseData) => {
      setLanguages(responseData);
      setIsLoading(false);
    }).catch((error) => {
        console.error('Error fetching languages:', error);
        setIsLoading(false); 
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const languageId = e.target.value;
    setSelectedLanguageId(languageId);
    onSelect(languageId);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (languages.length === 0) {
    return <p>No languages available.</p>;
  }

  return (
    <select value={selectedLanguageId} onChange={handleChange}>
      <option value="" disabled>
        Select a language
      </option>
      {languages.map((lang) => (
        <option key={lang.languageId} value={lang.languageId}>
          {lang.language} ({lang.isoCode})
        </option>
      ))}
    </select>
  );
};

export default LanguageDropdown;