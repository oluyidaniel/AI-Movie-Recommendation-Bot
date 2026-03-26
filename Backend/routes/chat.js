import { Router } from "express";
import { z }      from "zod";

import { requireAuth }                                    from "../middleware/auth.js";
import { validate }                                       from "../middleware/validate.js";
import { chatLimiter }                                    from "../middleware/rateLimit.js";
import { getUserChats, getChatMessages,
         appendMessage, getOrCreateChat,
         deleteChat }                                     from "../services/chatService.js";
import { callLLM, clearLLMMemory }                        from "../services/llmService.js";
import logger                                             from "../config/logger.js";

const router = Router();

// All chat routes require auth
router.use(requireAuth);

const MessageSchema = z.object({
  role:    z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const SendSchema = z.object({
  chatId:   z.string().uuid().optional(),
  message:  z.string().min(1).max(8000),
  useRag:   z.boolean().default(true),
});

// ── GET /chats — list all chats for user ─────────────────────────────────────

router.get("/", (req, res, next) => {
  try {
    const chats = getUserChats(req.user.id);
    res.json({ chats });
  } catch (err) {
    next(err);
  }
});

// ── GET /chats/:id/messages — full message history ───────────────────────────

router.get("/:id/messages", (req, res, next) => {
  try {
    const messages = getChatMessages(req.params.id, req.user.id);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// ── POST /chats/send — send a message and get AI reply ───────────────────────

router.post("/send", chatLimiter, validate(SendSchema), async (req, res, next) => {
  const { chatId, message, useRag } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get or create the chat
    const chat = getOrCreateChat(userId, chatId);

    // 2. Save user message to SQLite
    appendMessage(chat.id, "user", message);

    // 3. Fetch full history to send to LLM
    const history = getChatMessages(chat.id, userId).map(({ role, content }) => ({
      role,
      content,
    }));

    // 4. Call Python LLM service (Llama 3 + RAG)
    const { reply, model, ragUsed, sources } = await callLLM({
      sessionId: `${userId}:${chat.id}`,
      messages:  history,
      useRag,
    });

    // 5. Save assistant reply to SQLite
    appendMessage(chat.id, "assistant", reply);

    logger.info(
      `[chat] user=${req.user.username} chat=${chat.id} model=${model} rag=${ragUsed}`
    );

    res.json({
      chatId:   chat.id,
      reply,
      model,
      ragUsed,
      sources,
    });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /chats/:id — delete a chat ────────────────────────────────────────

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = deleteChat(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: "Chat not found." });
    }

    // Also clear LLM memory for this session
    await clearLLMMemory(`${req.user.id}:${req.params.id}`);
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
