import { sql } from '@vercel/postgres';

export const MAX_MESSAGE_LEN = 512;
export const MAX_USERNAME_LEN = 32;


export async function setup() {
    await `CREATE TABLE IF NOT EXISTS chat (
        username VARCHAR(${MAX_USERNAME_LEN}),
        message VARCHAR(${MAX_MESSAGE_LEN}),
        timestamp TIMESTAMP,
        ipHash VARCHAR(64)
    )`
}