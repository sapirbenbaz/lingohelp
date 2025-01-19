import { Router, Request, Response } from "express";
import notionService from "../services/notion/notionService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const languages = await notionService.getLanguagesFromNotion();
  res.status(200).json(languages);
});

export default router;
