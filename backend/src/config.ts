import * as dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  "NOTION_TOKEN",
  "NOTION_LANGUAGES_DATABASE_ID",
  "NOTION_WORDS_DATABASE_ID",
  "GEMINI_TOKEN",
  "GOOGLE_SMTP_EMAIL",
  "GOOGLE_SMTP_PASSWORD",
  "FRONTEND_URL"
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

export const config = {
  notionToken: process.env.NOTION_TOKEN,
  languagesDbId: process.env.NOTION_LANGUAGES_DATABASE_ID!,
  wordsDbId: process.env.NOTION_WORDS_DATABASE_ID!,
  geminiToken: process.env.GEMINI_TOKEN,
  smtpEmail: process.env.GOOGLE_SMTP_EMAIL,
  smtpPassword: process.env.GOOGLE_SMTP_PASSWORD,
  frontendUrl: process.env.FRONTEND_URL
};
