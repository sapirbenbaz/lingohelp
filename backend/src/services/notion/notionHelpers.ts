import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Word } from "../../../../shared/interfaces/Word";
import { Language } from "../../../../shared/interfaces/Language";
import { APIErrorCode, APIResponseError } from "@notionhq/client";
import notionService from "./notionService";

export function getTitlePlainText(property: Record<string, any>): string {
  if (property.type === "title" && property.title.length > 0) {
    return property.title[0].plain_text;
  }
  throw new Error(`Invalid or missing title for ${property}`);
}

export function getRichTextPlainText(property: Record<string, any>): string {
  if (property.type === "rich_text" && property.rich_text.length > 0) {
    return property.rich_text[0].plain_text;
  }
  return "";
}

export function getCreatedTime(property: any): string {
  if (property.type === "created_time") {
    return property.created_time;
  }
  return "";
}

export function getRelation(property: any): string {
  if (property.type === "relation" && property.relation.length > 0) {
    return property.relation[0].id;
  }
  return "";
}

export async function formatWordData(
  wordData: PageObjectResponse
): Promise<Word> {
  const wordProperty = wordData.properties["Word"];
  const createdProperty = wordData.properties["Created time"];
  const contextProperty = wordData.properties["Context"];
  const languageProperty = wordData.properties["Language"];
  const languageId = getRelation(languageProperty);
  const language = await notionService.getLanguageData(languageId);

  return {
    id: wordData.id,
    languageId: languageId,
    language: language.language,
    word: getTitlePlainText(wordProperty),
    createdTime: getCreatedTime(createdProperty),
    context: getRichTextPlainText(contextProperty),
  };
}

export function formatLanguageData(languageData: PageObjectResponse): Language {
  const languageProperty = languageData.properties["Language"];
  const isoCodeProperty = languageData.properties["ISO Code"];

  return {
    languageId: languageData.id,
    language: getTitlePlainText(languageProperty),
    isoCode: getRichTextPlainText(isoCodeProperty),
  };
}

export function handleNotionError(error: unknown, pageId?: string): never {
  if (error instanceof APIResponseError) {
    switch (error.code) {
      case APIErrorCode.ValidationError:
        throw new Error(
          pageId
            ? `Word ID ${pageId} is not a valid UUID`
            : `Failed to validate data`
        );
      case APIErrorCode.ObjectNotFound:
        throw new Error(
          pageId
            ? `Word ID ${pageId} not found in the database`
            : `Failed to find object`
        );
      default:
        throw new Error(`Notion API error: ${error.message}`);
    }
  }
  throw new Error("An unexpected error occurred.");
}
