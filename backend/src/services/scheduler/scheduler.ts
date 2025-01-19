import schedule from "node-schedule";
import { Word } from "../../../../shared/interfaces/Word";
import notionService from "../notion/notionService";
import geminiService from "../gemini/geminiService";
import mailerService from "../mailer/mailerService";

function groupWordsByLanguage(words: Array<Word>): Record<string, Word[]> {
  return words.reduce<Record<string, Word[]>>((result, word) => {
    (result[word.language] = result[word.language] || []).push(word);
    return result;
  }, {});
}

async function generateStoriesForLanguages() {
  const formattedDate = new Date().toISOString().split("T")[0];

  const words = await notionService.getWordsFromNotion(
    undefined,
    formattedDate
  );
  const groupedLanguages = groupWordsByLanguage(words);

  await Promise.all(
    Object.entries(groupedLanguages).map(async ([language, words]) => {
      if (words.length > 0) {
        const story = await geminiService.generateStoryWithWords(
          language,
          words
        );
        await mailerService.sendEmail(words, language, story);
      }
    })
  );
}

export function startScheduler() {
  console.log("Starting scheduler");
  schedule.scheduleJob("0 0 * * *", generateStoriesForLanguages);
}
