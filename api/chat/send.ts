import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';


const dbMgr = require("../../lib/dbManager");
const configMgr = require("../lib/configManager");
const crypto = require("crypto");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const username = req.headers["username"] as string;
    const message = req.headers["message"] as string;

    if(!configMgr.get("chat.enableSending")) {
        return res.status(403).send("Chatting is currently disabled");
    }

    if(!username || !message) {
        return res.status(400).send("Please include the 'username' and 'message' headers");
    }

    if(message.length > dbMgr.MAX_MESSAGE_LEN) {
        return res.status(400).send("Message too long");
    }

    if(username.length > dbMgr.MAX_USERNAME_LEN) {
        return res.status(400).send("Username too long");
    }

    // IP address is hashed for privacy
    const ipHash = crypto.createHash("sha1").update(req.socket.remoteAddress).digest("hex");

    console.log(`<${username}> ${message}`);

    await dbMgr.setupChat();

    await sql`INSERT INTO chat (username, message, timestamp, ipHash) VALUES (
        ${username},
        ${message},
        now(),
        ${ipHash}
    )`;

    // TODO: filtering

    return res.status(200).send("sent");
    
}