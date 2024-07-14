import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '@vercel/postgres';

import netUtils = require("../../lib/netUtils");
import configMgr = require("../../lib/configManager");
import dbMgr = require("../../lib/dbManager");
import userMgr = require("../../lib/userManager");
import utils = require("../../lib/utils");
import filter = require("../filter");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(netUtils.badCheck(req, res)) return;

    if(!configMgr.get("users.enableRegistering")) {
        return res.status(403).send("Account creation is currently disabled");
    }

    const username = req.headers["username"] as string;
    const displayName = req.headers["displayName"] as string;
    const rawPassword = req.headers["password"] as string;
    let passwordHash = req.headers["passwordHash"] as string;

    // --== Data validation ==--

    if(!username) {
        return res.status(400).send("Please include 'username' in headers'");
    }

    if(!rawPassword && !passwordHash) {
        return res.status(400).send("Please include 'password' or 'passwordHash' in headers");
    }

    if(rawPassword && passwordHash) {
        return res.status(400).send("'password' and 'passwordHash' cannot be present together.");
    }


    if(rawPassword) {
        if(!configMgr.get("users.allowRawPasswordHeader")) {
            return res.status(400).send("'password' is not allowed. Please hash the password as a sha1 string then use 'passwordHash'");
        }

        passwordHash = utils.hash(rawPassword); 

    } else if(passwordHash) {
        if(!utils.isHashed(passwordHash)) {
            return res.status(400).send("'passwordHash' is not a valid sha1 hash");
        }
    }

    // --== Post checks ==--
    
    await dbMgr.setupUsers();

    if(await userMgr.getUserByName(username)) {
        return res.status(403).send("This username is already taken");
    }

    if(filter.filterText(username).filtered) {
        return res.status(406).send("This username is not allowed");
    }

    // --== Creation ==--

    console.log(`New user: ${username}`);

    await sql`INSERT INTO users (username, displayName, passwordHash, createdAt) VALUES (
        ${username},
        ${displayName},
        ${passwordHash},
        now()
    )`;

    return res.status(200).send("Yipee");
}