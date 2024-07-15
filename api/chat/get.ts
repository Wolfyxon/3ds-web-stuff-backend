import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

import dbMgr = require("../../lib/dbManager");
import netUtils = require("../../lib/netUtils");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(await netUtils.badCheck(req, res)) return;

    await dbMgr.setupChat();

    const sqlRes = await sql`SELECT username, message, timestamp FROM chat ORDER BY timestamp DESC LIMIT 8`;

    res.json(sqlRes.rows);
}