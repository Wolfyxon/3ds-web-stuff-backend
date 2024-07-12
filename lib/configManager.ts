const fs = require("fs");


export const configTemplatePath = "configTemplate.json";
export const configPath =  "config.json";

export const configTemplate = JSON.parse(fs.readFileSync(configTemplatePath, 'utf8'));


type Config = keyof typeof configTemplate;


export function isDebug(): boolean {
    return process.env["DEBUG"] === "1";
}

export function hasConfig(): boolean {
    return fs.existsSync(configPath);
}
