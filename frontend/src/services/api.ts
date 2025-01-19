import axios from "axios";
import { Word } from "../../../shared/interfaces/Word";
import { Language } from "../../../shared/interfaces/Language";

export const getLanguages = async (): Promise<Language[]> => {
  try {
    const response = await axios.get<Language[]>(
      `${import.meta.env.VITE_API_BASE_URL}/language`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
};

export const getTodaysWordsOfLanguage = async (
  language: string
): Promise<Word[]> => {
  try {
    const formattedDate = new Date().toISOString().split("T")[0];
    const response = await axios.get<Word[]>(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/word?language=${language}&date=${formattedDate}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitWord = async (data: {
  word: string;
  context: string;
  languageId: string;
}): Promise<Word> => {
  try {
    const response = await axios.post<Word>(
      `${import.meta.env.VITE_API_BASE_URL}/word`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWord = async (wordToUpdate: Word): Promise<Word> => {
  try {
    const wordId = wordToUpdate.id;
    const updatedWord = await axios.patch<Word>(
      `${import.meta.env.VITE_API_BASE_URL}/word/${wordId}`,
      wordToUpdate
    );

    return updatedWord.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWord = async (wordId: string): Promise<void> => {
  try {
    await axios.delete<Word>(
      `${import.meta.env.VITE_API_BASE_URL}/word/${wordId}`
    );
  } catch (error) {
    throw error;
  }
};
