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

type PublicUser = {
    id: number,
    username: string,
    displayname: string | null,
    permissionlevel: PermissionLevel
    createdat: string
}

type User = PublicUser & {
    passwordhash: string
}

export async function getUserById(id: number): Promise<User | undefined> {
    await dbMgr.setupUsers();
    return (await sql`SELECT * FROM users WHERE id=${id}`).rows[0] as User;
}

export async function getUserByName(username: string): Promise<User | undefined> {
    await dbMgr.setupUsers();
    return (await sql`SELECT * FROM users WHERE username=${username}`).rows[0] as User;
}

export async function getUserByIdPublic(id: number): Promise<PublicUser | undefined> {
    await dbMgr.setupUsers();
    return (await sql`SELECT id, username, displayName, permissionLevel, createdAt FROM users WHERE id=${id}`).rows[0] as PublicUser;
}

export async function getUserByNamePublic(username: string): Promise<PublicUser | undefined> {
    await dbMgr.setupUsers();
    return (await sql`SELECT id, username, displayName, permissionLevel, createdAt FROM users WHERE username=${username}`).rows[0] as PublicUser;
}

export async function setPermissionLevel(userId: number, permissionLevel: PermissionLevel) {
    console.log(`> Setting permission level of ${userId} to ${permissionLevel}`);
    await sql`UPDATE users SET permissionLevel=${permissionLevel} WHERE id=${userId}`;
}

export async function createUser(username: string, passwordHash: string, displayName: string | null | undefined, permissionLevel: PermissionLevel = PermissionLevel.REGULAR) {
    if(!utils.isHashed(passwordHash)) throw "Not a valid SHA256 hash";
    await dbMgr.setupUsers();
    await sql`INSERT INTO users (username, displayName, passwordHash, permissionLevel, createdAt) VALUES (
        ${username},
        ${displayName},
        ${passwordHash},
        ${permissionLevel},
        now()
    )`;
}