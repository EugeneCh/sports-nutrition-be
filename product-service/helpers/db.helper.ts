import { Client, ClientConfig } from 'pg';

export function createDbClient(): Client {
    const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
    const dbOptions: ClientConfig = {
        host: PG_HOST,
        port: Number(PG_PORT),
        database: PG_DATABASE,
        user: PG_USERNAME,
        password: PG_PASSWORD,
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeoutMillis: 5000
    };
    return new Client(dbOptions);
}



