import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
const crypto = require("crypto");

const MAX_MESSAGE_LEN = 512;
const MAX_USERNAME_LEN = 32;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const username = req.headers["username"];
    const message = req.headers["message"];

    if(!username || !message) {
        return res.status(400).send("Please include the 'username' and 'message' headers");
    }

    if(message.length > MAX_MESSAGE_LEN) {
        return res.status(400).send("Message too long");
    }

    if(username.length > MAX_USERNAME_LEN) {
        return res.status(400).send("Username too long");
    }

    // IP address is hashed for privacy
    const ipHash = crypto.createHash("sha1").update(req.socket.remoteAddress).digest("hex");

    console.log(`<${username}> ${message}`);
    
    // TODO: PostgreSQL integration, filtering
}