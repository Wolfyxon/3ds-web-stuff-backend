import crypto = require("crypto");
import fs = require("fs");

export function hash(str: string): string {
    return crypto.createHash("sha1").update(str).digest("hex");
}

export function isHashed(str: string): boolean {
    const pattern = /^[a-fA-F0-9]{40}$/;
    return pattern.test(str);
}

export function parseJSONC(jsonc: string) {
    return JSON.parse(jsonc.replace(new RegExp("//.*", 'mg'), ""));
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