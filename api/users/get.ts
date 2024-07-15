import type { VercelRequest, VercelResponse } from '@vercel/node'

import netUtils = require("../../lib/netUtils");
import userMgr = require("../../lib/userManager");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(await netUtils.badCheck(req, res)) return;

    const params = new URLSearchParams(new URL("https://localhost" + req.url).search);

    const id = params.get("id") || req.headers["id"];
    const name = params.get("username") || req.headers["username"];

    if(!id && !name) {
        return res.status(400).send("No 'username' or 'id' specified in the URL params or the request headers");
    }

    if(id && name) {
        return res.status(400).send("'username' and 'id' cannot be present together");
    }

    let user = null;

    if(id) {
        const numId = parseInt(id as string);
        
        if(numId === null || numId === undefined) {
            return res.status(400).send("Invalid user ID");
        }

        user = (await userMgr.getUserByIdPublic(numId));
    } 
    else if(name) {
        user = (await userMgr.getUserByNamePublic(name as string));
    }

    if(user) return res.json(user);
    
    return res.status(404).send("User not found");
}