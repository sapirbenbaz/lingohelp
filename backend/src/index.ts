import express from "express";
import cors from "cors";
import wordRoutes from "./routes/wordRoutes";
import languageRoutes from "./routes/languageRoutes";
import { startScheduler } from "./services/scheduler/scheduler";
import { config } from "./config";

const app = express();
app.use(
  cors({
    origin: config.frontendUrl,
  })
);
app.use(express.json());
app.use("/word", wordRoutes);
app.use("/language", languageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startScheduler();
