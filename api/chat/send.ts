import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

import netUtils = require("../../lib/netUtils");
import dbMgr = require("../../lib/dbManager");
import configMgr = require("../../lib/configManager");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(netUtils.badCheck(req, res)) return;

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

    // --== Inserting ==--

    const ip = configMgr.processIp(req.socket.remoteAddress);

    console.log(`<${username}: ${ip}> ${message}`);

    await dbMgr.setupChat();

    await sql`INSERT INTO chat (username, message, timestamp, ip) VALUES (
        ${username},
        ${message},
        now(),
        ${ip}
    )`;

    // TODO: filtering

    return res.status(200).send("sent");
    
}