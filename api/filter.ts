import type { VercelRequest, VercelResponse } from '@vercel/node';

// --== Main logic ==-- //

const bannedWords: string[] = [ // lord, forgive me for writing those
    // - English -
    "fuck",
    "fuk",
    "fook",
    "foock",
    "fack",
    "fak",

    "bitch",
    "bich",
    
    "whore",
    "whor",
    
    "ass",

    "pussy",
    
    "dick",
    "dik",
    "dic",
    "diq",

    "kys",

    // - Polish -
    "kurw",
    "kurv",
    "koorw",
    "koorv",

    // Note: don't block 'jeb' so people can talk about the Minecraft developer 'Jeb'
    "zjeb",
    "jeba",
    "jebi",

    // Note: don't block 'pierd' because it means 'fart' and is not a swear. Only more advanced variations are swears
    "pierdo",
    "pierda",

    "chuj",
    "huj",

    "pizd",
    "piźd",
    
    "gówn",
    "gown",
    "guwn",
    "goown",
    "gówie",
    "gowie",
    "guwie",
    "goowie",

    "rucha",
    "ruha",
    "rooha",
    "roocha",
    "rócha",
    "róha",
    "roha",
    "rocha"
    
];

const banChar = "*";

type FilterResult = {
    text: string
    filtered: boolean
    detectedWords: string[]
}

export function filterText(text: string): FilterResult {
    const res: FilterResult = {
        text: "",
        filtered: false,
        detectedWords: []
    }

    const split = text.split(" ");

    split.forEach((word) => {
        let resultWord = word;
        let wordFiltered = false;

        bannedWords.forEach((bannedWord) => {
            if(word.toLowerCase().includes(bannedWord)) {
                if(!wordFiltered) {
                    resultWord = new Array(word.length).join(banChar);
                    wordFiltered = true;
                }

                res.filtered = true;
                if(!res.detectedWords.includes(bannedWord)) {
                    res.detectedWords.push(bannedWord);
                }
            }
        });

        res.text += resultWord + " ";
    });

    return res;
}

// --== Request handler ==-- //

export default function handler(req: VercelRequest, res: VercelResponse) {
    const text: string | undefined = req.headers["text"] as string;

    if(!text) {
        return res.status(400).send(
            "Please specify the text to filter in the 'text' header"
        );
    }

    return res.json(filterText(text));
}