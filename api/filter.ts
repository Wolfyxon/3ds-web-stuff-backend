import type { VercelRequest, VercelResponse } from '@vercel/node';

// Main logic
const bannedWords: string[] = [
    "fuck",
    "bitch",
    "whore",
    "ass",
    "pussy",
    "dick"
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

// Request handler

export default function handler(req: VercelRequest, res: VercelResponse) {
    const text: string | undefined = req.headers["text"] as string;

    if(!text) {
        return res.status(400).send(
            "Please specify the text to filter in the 'text' header"
        );
    }

    return res.json(filterText(text));
}