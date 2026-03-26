import { config } from "../config/index.js";
import logger from "../config/logger.js";

const LLM_URL = config.llmService.url;

/**
 * Send a chat request to the Python LLM service.
 * Returns the assistant reply string.
 */
export async function callLLM({ sessionId, messages, useRag = true }) {
  const url = `${LLM_URL}/chat`;

  const body = {
    session_id: sessionId,
    messages:   messages.map(({ role, content }) => ({ role, content })),
    use_rag:    useRag,
  };

  logger.debug(`[llmService] POST ${url} session=${sessionId} msgs=${messages.length}`);

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
    signal:  AbortSignal.timeout(120_000),   // 2-min timeout for local inference
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`LLM service error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    reply:    data.reply,
    model:    data.model,
    ragUsed:  data.rag_used,
    sources:  data.sources ?? [],
  };
}

/**
 * Wipe the Redis memory for a session in the LLM service.
 */
export async function clearLLMMemory(sessionId) {
  const url = `${LLM_URL}/chat/${sessionId}/memory`;
  await fetch(url, { method: "DELETE" }).catch((e) =>
    logger.warn(`clearLLMMemory failed: ${e.message}`)
  );
}

/**
 * Health check — returns true if the LLM service is reachable.
 */
export async function llmHealthCheck() {
  try {
    const res = await fetch(`${LLM_URL}/health`, {
      signal: AbortSignal.timeout(5_000),
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
