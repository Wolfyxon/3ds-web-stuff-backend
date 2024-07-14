import type { VercelRequest, VercelResponse } from '@vercel/node';
import configMgr = require("./configManager");
import utils = require("./utils");

export async function badCheck(req: VercelRequest, res: VercelResponse): Promise<boolean> {
    const ip = req.socket.remoteAddress;

    if(!configMgr.isIpBlocked(ip)) {
        res.status(403).send("You are blocked");
        return true;
    }

    if(configMgr.get("ip.blockTor") && utils.isTor(ip)) {
        res.status(403).send("Tor network is blocked");
        return true;
    }

    return false;
}