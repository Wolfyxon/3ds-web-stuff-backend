import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

import netUtils = require("../../lib/netUtils");
import dbMgr = require("../../lib/dbManager");
import configMgr = require("../../lib/configManager");
import filter = require("../filter");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(await netUtils.badCheck(req, res)) return;

    const username = req.headers["username"] as string;
    const message = req.headers["message"] as string;

    if(!configMgr.get("chat.enableSending")) {
        return res.status(403).send("Chatting is currently disabled");
    }

    // --== Data validation ==--

    if(!username || !message) {
        return res.status(400).send("Please include the 'username' and 'message' headers");
    }

    if(message.length > (configMgr.get("chat.lengthLimits.message") as number)) {
        return res.status(400).send("Message too long");
    }

    if(username.length > (configMgr.get("chat.lengthLimits.username") as number)) {
        return res.status(400).send("Username too long");
    }

    if(filter.filterText(username).filtered) {
        return res.status(406).send("This username is not allowed");
    }

    // --== Inserting ==--

    const ip = configMgr.processIp(req.socket.remoteAddress);

    console.log(`<${username}: ${ip}> ${message}`);

    await dbMgr.setupChat();

    await sql`DELETE FROM chat WHERE ctid IN (
        SELECT ctid FROM chat ORDER BY timestamp LIMIT 1
    ) AND (SELECT COUNT(*) FROM chat) > ${configMgr.get("chat.maxMessages") as number}`;

    await sql`INSERT INTO chat (username, message, timestamp, ip) VALUES (
        ${username},
        ${message},
        now(),
        ${ip}
    )`;

    // TODO: filtering

    return res.status(200).send("sent");
    
}