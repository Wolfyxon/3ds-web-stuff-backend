import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

const dbMgr = require("../../lib/dbManager");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbMgr.setup();

    const sqlRes = await sql`SELECT username, message, timestamp FROM chat ORDER BY timestamp ASC`;

    res.json(sqlRes.rows);
}