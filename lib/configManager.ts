const fs = require("fs");


export const configTemplatePath = "configTemplate.json";
export const configPath =  "config.json";

export const configTemplate = JSON.parse(fs.readFileSync(configTemplatePath, 'utf8'));


export type Config = keyof typeof configTemplate;

export function pathAtObject(obj: Object, path: string, separator: string = ".") {
    const split = path.split(separator);
    let current = obj;

    split.forEach(sub => {
        current = current[sub];
        if(current === undefined) return null;
    });

    return current;
}

export function isDebug(): boolean {
    return process.env["DEBUG"] === "1";
}

export function hasConfig(): boolean {
    return fs.existsSync(configPath);
}
