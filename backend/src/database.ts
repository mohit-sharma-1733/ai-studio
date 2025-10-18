import Database from 'better-sqlite3';
import path from 'path';

// Type definitions
export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Generation {
  id: number;
  user_id: number;
  prompt: string;
  style: string;
  image_url: string | null;
  created_at: string;
  status: string;
}

const dbFile = process.env.DATABASE_PATH ?? path.join(__dirname, '..', 'database.db');
const db = new Database(dbFile);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    style TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Prepare statements
export const insertUser = db.prepare(`
  INSERT INTO users (email, password_hash) VALUES (?, ?)
`);

export const getUserByEmail = db.prepare<[string], User>(`
  SELECT * FROM users WHERE email = ?
`);

export const insertGeneration = db.prepare(`
  INSERT INTO generations (user_id, prompt, style, image_url, status) VALUES (?, ?, ?, ?, ?)
`);

export const getGenerationsByUser = db.prepare<[number, number], Generation>(`
  SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?
`);

export const getGenerationById = db.prepare<[number], Generation>(`
  SELECT * FROM generations WHERE id = ?
`);

export default db;
