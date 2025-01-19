import { Router, Request, Response } from "express";
import notionService from "../services/notion/notionService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const language = req.query.language as string | undefined;
  const date = req.query.date as string | undefined;
  const words = await notionService.getWordsFromNotion(language, date);
  res.status(200).json(words);
});

router.post("/", async (req: Request, res: Response) => {
  const word = await notionService.addWordToNotion(
    req.body.languageId,
    req.body.word,
    req.body.context
  );

  res.status(201).json(word);
});

router.patch("/:id", async (req: Request, res: Response) => {
  const word = await notionService.updateWordOnNotion(req.params.id, req.body);
  res.status(200).json(word);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await notionService.deleteWordFromNotion(req.params.id);
  res.status(204).send();
});

export default router;
