import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from "fs";
import path from "path";
import { config } from "../config/index.js";
import logger from "../config/logger.js";

// Ensure DB directory exists
const dbDir = path.dirname(config.db.path);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// open database
const db = await open({
  filename: config.db.path, // use config instead of hardcoding
  driver: sqlite3.Database
});

// Performance settings (FIXED)
await db.exec("PRAGMA journal_mode = WAL;");
await db.exec("PRAGMA foreign_keys = ON;");

// ==== Schema ====

// await
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    username   TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS chats (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT NOT NULL DEFAULT 'New Conversation',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id    TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role       TEXT NOT NULL CHECK(role IN ('user','assistant')),
    content    TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_chats_user 
    ON chats(user_id, updated_at DESC);

  CREATE INDEX IF NOT EXISTS idx_messages_chat 
    ON messages(chat_id, created_at ASC);
`);

logger.info(`SQLite ready: ${config.db.path}`);

export default db;