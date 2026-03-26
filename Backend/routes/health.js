import { Router } from "express";
import { llmHealthCheck } from "../services/llmService.js";

const router = Router();

router.get("/", async (_req, res) => {
  const llm = await llmHealthCheck();
  res.json({
    status: llm.ok ? "ok" : "degraded",
    services: {
      backend: "ok",
      llm,
    },
  });
});

export default router;
