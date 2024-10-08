import crypto = require("crypto");

export function hash(str: string): string {
    return crypto.createHash("sha256").update(str).digest("hex");
}

export function isHashed(str: string): boolean {
    const pattern = /^[a-fA-F0-9]{64}$/;
    return pattern.test(str);
}

export function parseJSONC(jsonc: string) {
    return JSON.parse(jsonc.replace(new RegExp("//.*", 'mg'), ""));
}