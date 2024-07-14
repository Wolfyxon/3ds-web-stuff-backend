import { sql, db } from '@vercel/postgres';
import configMgr = require("../lib/configManager");

export const tables = ["chat"];

// NOTE: sql`` doesn't support ${} in such queries

export async function setupChat() {
    await db.query(`CREATE TABLE IF NOT EXISTS chat (
        username VARCHAR(${configMgr.get("chat.lengthLimits.username") as number}),
        message VARCHAR(${configMgr.get("chat.lengthLimits.message") as number}),
        timestamp TIMESTAMP,
        ip VARCHAR(64)
    )`);
}

export async function deleteAllTables() {
    console.log("> Deleting all tables!");

    tables.forEach(async (table) => {
        await db.query(`DROP TABLE IF EXISTS ${table}`);
    });
}