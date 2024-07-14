import { sql, db } from '@vercel/postgres';
import configMgr = require("../lib/configManager");

export const tables = ["chat", "users"];

// NOTE: sql`` doesn't support ${} in such queries

export async function setupChat() {
    await db.query(`CREATE TABLE IF NOT EXISTS chat (
        username VARCHAR(${configMgr.get("chat.lengthLimits.username") as number}),
        message VARCHAR(${configMgr.get("chat.lengthLimits.message") as number}),
        timestamp TIMESTAMP,
        ip VARCHAR(64)
    )`);
}

export async function setupUsers() {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(${configMgr.get("users.lengthLimits.username") as number}) NOT NULL,
        displayName VARCHAR(${configMgr.get("users.lengthLimits.displayName") as number}),
        passwordHash VARCHAR(64) NOT NULL,
        permissionLevel NUMBER,
        createdAt TIMESTAMP NOT NULL,
    )`);
}

export async function deleteAllTables() {
    console.log("> Deleting all tables!");

    tables.forEach(async (table) => {
        await db.query(`DROP TABLE IF EXISTS ${table}`);
    });
}