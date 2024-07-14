import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs = require("fs");
import configMgr = require("./configManager");


export async function badCheck(req: VercelRequest, res: VercelResponse): Promise<boolean> {
    const ip = req.socket.remoteAddress;

    if(!configMgr.isIpBlocked(ip)) {
        res.status(403).send("You are blocked");
        return true;
    }

    if(configMgr.get("ip.blockTor") && isTor(ip)) {
        res.status(403).send("Tor network is blocked");
        return true;
    }

    return false;
}

export async function getTorIPs() {
    let text: string = "";
    const cachePath = "torIPs.txt";

    if(fs.existsSync(cachePath)) {
        text = fs.readFileSync(cachePath, "utf-8");
    } else {
        text = await (await fetch("https://check.torproject.org/torbulkexitlist")).text();
        fs.writeFileSync(cachePath, text);
    }

    return text.split("\n");
}

export async function isTor(ip: string) {
    return (await getTorIPs()).includes(ip);
}