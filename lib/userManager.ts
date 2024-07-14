import { sql } from '@vercel/postgres';

import configMgr = require("./configManager");
import dbMgr = require("./dbManager");
import utils = require("./utils");


export async function getUserById(id: number) {
    await dbMgr.setupUsers();
    return (await sql`SELECT * FROM users WHERE id=${id}`).rows[0];
}

export async function getUserByName(username: string) {
    await dbMgr.setupUsers();
    return (await sql`SELECT * FROM users WHERE id=${username}`).rows[0];
}
