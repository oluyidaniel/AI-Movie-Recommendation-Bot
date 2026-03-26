const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────────────────────────

export const token = {
  get:    () => localStorage.getItem("cineai_token"),
  set:    (t)     => localStorage.setItem("cineai_token", t),
  clear:  ()      => localStorage.removeItem("cineai_token"),
};

// ── Base fetch wrapper ────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const t = token.get();
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({ error: res.statusText }));

  if (!res.ok) {
    throw Object.assign(new Error(data.error || "Request failed"), { status: res.status });
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  register: (username, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ username, password }) }),

  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  me: () => request("/auth/me"),
};

// ── Chats ─────────────────────────────────────────────────────────────────────

export const chats = {
  list: () =>
    request("/chats"),

  messages: (chatId) =>
    request(`/chats/${chatId}/messages`),

  send: (chatId, message, useRag = true) =>
    request("/chats/send", {
      method: "POST",
      body: JSON.stringify({ chatId, message, useRag }),
    }),

  delete: (chatId) =>
    request(`/chats/${chatId}`, { method: "DELETE" }),
};

// ── Health ─────────────────────────────────────────────────────────────────────

export const health = {
  check: () => request("/health"),
};
