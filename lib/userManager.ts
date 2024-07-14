import { sql } from '@vercel/postgres';

import configMgr = require("./configManager");
import dbMgr = require("./dbManager");
import utils = require("./utils");

export enum PermissionLevel {
    BANNED,
    REGULAR,
    VIP,
    MODERATOR,
    ADMIN,
    ROOT
}

export async function getUserById(id: number) {
    await dbMgr.setupUsers();
    return (await sql`SELECT * FROM users WHERE id=${id}`).rows[0];
}

export async function getUserByName(username: string) {
    await dbMgr.setupUsers();
    return (await sql`SELECT * FROM users WHERE username=${username}`).rows[0];
}

export async function getUserByIdPublic(id: number) {
    await dbMgr.setupUsers();
    return (await sql`SELECT (id, username, displayName, permissionLevel, createdAt) FROM users WHERE id=${id}`).rows[0];
}

export async function getUserByNamePublic(username: string) {
    await dbMgr.setupUsers();
    return (await sql`SELECT (id, username, displayName, permissionLevel, createdAt) FROM users WHERE username=${username}`).rows[0];
}

export async function setPermissionLevel(userId: number, permissionLevel: PermissionLevel) {
    console.log(`> Setting permission level of ${userId} to ${permissionLevel}`);
    await sql`UPDATE users SET permissionLevel=${permissionLevel} WHERE id=${userId}`;
}