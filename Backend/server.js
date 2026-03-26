import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config/index.js";
import logger from "./config/logger.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import healthRoutes from "./routes/health.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// ==== Security & parsing ====

app.use(helmet());
app.use(cors({
  origin:      config.frontend.url,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

//==== Logging ====

if (config.nodeEnv !== "test") {
  app.use(morgan("dev", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));
}

// ==== Routes ====

app.use("/api/auth",   authRoutes);
app.use("/api/chats",  chatRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (_req, res) => res.json({ service: "CineAI Backend", status: "running" }));

// ==== Error handling ====

app.use(notFound);
app.use(errorHandler);

// ==== Start ====

app.listen(config.port, () => {
  logger.info(`   Backend running on http://localhost:${config.port}`);
  logger.info(`   LLM service  → ${config.llmService.url}`);
  logger.info(`   Frontend     → ${config.frontend.url}`);
  logger.info(`   Environment  → ${config.nodeEnv}`);
});

export default app;
