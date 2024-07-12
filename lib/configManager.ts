const fs = require("fs");
const utils = require("../lib/utils");

export const configTemplatePath = "configTemplate.json";
export const configPath =  "config.json";

export const configTemplate = JSON.parse(fs.readFileSync(configTemplatePath, 'utf8'));


export type Config = keyof typeof configTemplate;

export function isDebug(): boolean {
    return process.env["DEBUG"] === "1";
}

export function hasConfig(): boolean {
    return fs.existsSync(configPath);
}

export function getConfig(): Config | null {
    if(!hasConfig()) return;
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

export function pathAtObject(obj: Object, path: string, separator: string = ".") {
    const split = path.split(separator);
    let current = obj;

    split.forEach(sub => {
        current = current[sub];
        if(current === undefined) return null;
    });

    return current;
}

export function get(path: string, separator: string = ".") {
    if(hasConfig()) {
        const fromConfig = pathAtObject(getConfig(), path, separator);
        if(fromConfig !== undefined && fromConfig !== null) return fromConfig;
    }
    
    const fromTemplate = pathAtObject(configTemplate, path, separator);
    if(fromTemplate === null || fromTemplate === undefined) throw `Unknown property at path '${path}'`;

    return fromTemplate;
}

export function processIp(ip: string): string {
    if(get("ip.encrypt")) {
        return utils.hash(ip);
    }

    return ip;
}

export function isIpBlocked(ip: string): boolean {
    const blocked = get("ip.blocked") as string[];
    const blockedHashes = get("ip.blockedHashes") as string[];

    return blocked.includes(ip) || blockedHashes.includes(utils.hash(ip));
}