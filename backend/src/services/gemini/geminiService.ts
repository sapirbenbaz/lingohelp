import { Word } from "../../../../shared/interfaces/Word";
import { config } from "../../config";

const { GoogleGenerativeAI } = require("@google/generative-ai");

export class GeminiService {
  private model: any;

  constructor() {
    const genAI = new GoogleGenerativeAI(config.geminiToken);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateStoryWithWords(
    language: string,
    words: Array<Word>
  ): Promise<string> {
    const formattedWords = words
      .map((wordObject: Word) => {
        if (wordObject.context) {
          return `${wordObject.word} (context: ${wordObject.context})`;
        }
        return `${wordObject.word}`;
      })
      .join(", ");

    const prompt = `
        I’m learning ${language} and want to improve my vocabulary in this language. To help me learn, I will provide a list of words I don’t know. Some words may have additional context, while others will be standalone. These words will be represented as an array, with each element containing either a word and its context or just the word itself.
        
        Your task:
        1. Write an engaging short story entirely in ${language} that incorporates all the words from the list naturally.
        2. Ensure the story helps me understand the meaning and practical usage of these words in context.
        3. Optionally, at the end of the story, provide a brief explanation of how each word was used and its meaning within the story (also in ${language}).
    
        Here is the list of words: ${formattedWords}
    `;

    const result = await this.model.generateContent(prompt);

    return result.response.text();
  }
}

const geminiService = new GeminiService();
export default geminiService;
