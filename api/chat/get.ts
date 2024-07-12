import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

import dbMgr = require("../../lib/dbManager");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbMgr.setupChat();

    const sqlRes = await sql`SELECT username, message, timestamp FROM chat ORDER BY timestamp DESC LIMIT 8`;

    res.json(sqlRes.rows);
}