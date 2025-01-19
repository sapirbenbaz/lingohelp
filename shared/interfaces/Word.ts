import { Language } from "./Language";

export interface Word {
  id: string;
  word: string;
  createdTime?: string;
  context: string;
  languageId: Language["languageId"];
  language: Language["language"];
}
