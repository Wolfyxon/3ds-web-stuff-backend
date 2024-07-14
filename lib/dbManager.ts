import { sql, db } from '@vercel/postgres';

export const MAX_CHAT_MESSAGE_LEN = 512;
export const MAX_CHAT_USERNAME_LEN = 32;

export const tables = ["chat"];

// NOTE: sql`` doesn't support ${} in such queries

export async function setupChat() {
    await db.query(`CREATE TABLE IF NOT EXISTS chat (
        username VARCHAR(${MAX_CHAT_USERNAME_LEN}),
        message VARCHAR(${MAX_CHAT_MESSAGE_LEN}),
        timestamp TIMESTAMP,
        ip VARCHAR(64)
    )`);
}