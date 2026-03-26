import { v4 as uuid } from "uuid";
import db from "../db/database.js";

const stmts = {
  // Chats
  getChatsByUser: db.prepare(
    "SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC"
  ),
  getChatById: db.prepare(
    "SELECT * FROM chats WHERE id = ? AND user_id = ?"
  ),
  insertChat: db.prepare(
    "INSERT INTO chats (id, user_id, title) VALUES (?, ?, ?)"
  ),
  updateChatTitle: db.prepare(
    "UPDATE chats SET title = ?, updated_at = unixepoch() WHERE id = ?"
  ),
  touchChat: db.prepare(
    "UPDATE chats SET updated_at = unixepoch() WHERE id = ?"
  ),
  deleteChat: db.prepare(
    "DELETE FROM chats WHERE id = ? AND user_id = ?"
  ),

  // Messages
  getMessagesByChat: db.prepare(
    "SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC"
  ),
  insertMessage: db.prepare(
    "INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)"
  ),
  getFirstUserMessage: db.prepare(
    "SELECT content FROM messages WHERE chat_id = ? AND role = 'user' ORDER BY created_at ASC LIMIT 1"
  ),
};

// ── Chats ────────────────────────────────────────────────────────────────────

export function getUserChats(userId) {
  const chats = stmts.getChatsByUser.all(userId);
  return chats.map((c) => ({
    ...c,
    // Attach last message preview
    preview: getLastPreview(c.id),
  }));
}

export function createChat(userId, title = "New Conversation") {
  const id = uuid();
  stmts.insertChat.run(id, userId, title);
  return { id, user_id: userId, title, created_at: Math.floor(Date.now() / 1000), updated_at: Math.floor(Date.now() / 1000) };
}

export function deleteChat(chatId, userId) {
  const info = stmts.deleteChat.run(chatId, userId);
  return info.changes > 0;
}

function getLastPreview(chatId) {
  const msgs = stmts.getMessagesByChat.all(chatId);
  if (!msgs.length) return "";
  return msgs[msgs.length - 1].content.slice(0, 80);
}

// ── Messages ─────────────────────────────────────────────────────────────────

export function getChatMessages(chatId, userId) {
  // Verify ownership
  const chat = stmts.getChatById.get(chatId, userId);
  if (!chat) throw Object.assign(new Error("Chat not found."), { status: 404 });
  return stmts.getMessagesByChat.all(chatId);
}

export function appendMessage(chatId, role, content) {
  stmts.insertMessage.run(chatId, role, content);
  stmts.touchChat.run(chatId);

  // Auto-derive title from first user message
  const firstUser = stmts.getFirstUserMessage.get(chatId);
  if (firstUser) {
    const title = firstUser.content.slice(0, 45).trim();
    stmts.updateChatTitle.run(title, chatId);
  }
}

export function getOrCreateChat(userId, chatId) {
  if (chatId) {
    const existing = stmts.getChatById.get(chatId, userId);
    if (existing) return existing;
  }
  return createChat(userId);
}
