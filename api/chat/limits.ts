import type { VercelRequest, VercelResponse } from '@vercel/node'

import configMgr = require("../../lib/configManager");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.json(configMgr.get("chat.lengthLimits"));
}