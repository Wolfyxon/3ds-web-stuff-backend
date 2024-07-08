import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
const crypto = require("crypto");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const username = req.headers["username"];
    const message = req.headers["message"];

    if(!username || !message) {
        return res.status(400).send("Please include the 'username' and 'message' headers");
    }

    // IP address is hashed for privacy
    const ipHash = crypto.createHash("sha1").update(req.socket.remoteAddress).digest("hex");

    console.log(`<${username}> ${message}`);
    
    // TODO: PostgreSQL integration, length validation, filtering
}