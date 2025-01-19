import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { formatLanguageData, formatWordData } from "./notionHelpers";
import { Client } from "@notionhq/client";
import { Word } from "../../../../shared/interfaces/Word";
import { Language } from "../../../../shared/interfaces/Language";
import { handleErrors } from "../../decorators/handleErrors";
import { config } from "../../config";

export class NotionService {
  private client: Client;
  private languagesDbId: string;
  private wordsDbId: string;
  private languageMap: Map<string, Language>;

  constructor() {
    this.client = new Client({ auth: config.notionToken });
    this.wordsDbId = config.wordsDbId;
    this.languagesDbId = config.languagesDbId;
    this.languageMap = new Map<string, Language>();
  }

  @handleErrors
  async getLanguagesFromNotion(): Promise<Array<Language>> {
    if (this.languageMap.size > 0) {
      return Array.from(this.languageMap.values());
    }

    const queryResponse = await this.client.databases.query({
      database_id: this.languagesDbId,
      sorts: [{ property: "Language", direction: "ascending" }],
    });

    const res = queryResponse.results.map((languageData) => {
      const formattedLanguage = formatLanguageData(
        languageData as PageObjectResponse
      );
      this.languageMap.set(formattedLanguage.languageId, formattedLanguage);
      return formattedLanguage;
    });

    return res;
  }

  async getLanguageData(languageId: string): Promise<Language> {
    await this.getLanguagesFromNotion();
    return this.languageMap.get(languageId)!;
  }

  @handleErrors
  async getWordsFromNotion(
    languageId?: string,
    date?: string
  ): Promise<Array<Word>> {
    const filters = [];

    if (date) {
      filters.push({
        property: "Created time",
        date: {
          equals: date,
        },
      });
    }

    if (languageId) {
      filters.push({
        property: "Language",
        relation: {
          contains: languageId,
        },
      });
    }

    const queryResponse = await this.client.databases.query({
      database_id: this.wordsDbId,
      filter: filters.length > 1 ? { and: filters } : filters[0],
    });

    return Promise.all(
      queryResponse.results.map((wordData) =>
        formatWordData(wordData as PageObjectResponse)
      )
    );
  }

  @handleErrors
  async addWordToNotion(
    languageId: string,
    word: string,
    context: string = ""
  ): Promise<Word> {
    const wordData = await this.client.pages.create({
      parent: { database_id: this.wordsDbId },
      properties: {
        Word: {
          title: [
            {
              text: {
                content: word,
              },
            },
          ],
        },
        Language: {
          relation: [{ id: languageId }],
        },
        Context: {
          rich_text: [
            {
              text: { content: context },
            },
          ],
        },
      },
    });
    return formatWordData(wordData as PageObjectResponse);
  }

  @handleErrors
  async deleteWordFromNotion(pageId: string): Promise<Word> {
    await this.client.pages.retrieve({ page_id: pageId });
    const wordData = await this.client.pages.update({
      page_id: pageId,
      in_trash: true,
    });
    return formatWordData(wordData as PageObjectResponse);
  }

  @handleErrors
  async updateWordOnNotion(pageId: string, word: Word): Promise<Word> {
    await this.client.pages.retrieve({ page_id: pageId });

    const wordData = await this.client.pages.update({
      page_id: pageId,
      properties: {
        Word: {
          title: [
            {
              text: { content: word.word },
            },
          ],
        },
        Context: {
          rich_text: [
            {
              text: { content: word.context },
            },
          ],
        },
      },
    });

    return formatWordData(wordData as PageObjectResponse);
  }
}

const notionService = new NotionService();
export default notionService;
