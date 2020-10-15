import { config, Config } from "../../config";
import * as pg from "pg";

class PgHelper {
    constructor(private config: Config) { }
    async connect<T>(cb: (client: pg.Client) => Promise<T>) {
        let client: pg.Client | undefined = undefined;
        try {
            client = new pg.Client(this.config.db);
            client.connect();
            return await cb(client);
        }
        finally {
            if (client) client.end();
        }
    }
}
export const pgHelper = new PgHelper(config);
