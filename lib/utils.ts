import crypto = require("crypto");

export function hash(str: string): string {
    return crypto.createHash("sha1").update(str).digest("hex");
}

export function parseJSONC(jsonc: string): Object {
    return JSON.parse(jsonc.replace(new RegExp("//.*", 'mg'), ""));
}