const crypto = require("crypto");

export function hash(str: string) {
    return crypto.createHash("sha1").update(str).digest("hex");
}